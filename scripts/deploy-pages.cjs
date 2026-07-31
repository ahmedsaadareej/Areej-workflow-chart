/*
 * Deploy `dist/` to Cloudflare Pages via the Direct Upload flow used by Wrangler.
 * Pure Node built-ins — no npm packages required.
 *
 * Flow:
 *   1. GET  /accounts/:acct/pages/projects/:proj/upload-token  → short-lived JWT
 *   2. POST /pages/assets/upload      (JWT auth) → upload file bodies (keyed by hash)
 *   3. POST /pages/assets/upsert-hashes (JWT auth) → register uploaded hashes
 *   4. POST /accounts/:acct/pages/projects/:proj/deployments (API-token auth, multipart) → create deployment
 *
 * Env required: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
 * Optional: CF_PROJECT_NAME (default: areej-workflow), CF_BRANCH (default: main)
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const TOKEN = process.env.CLOUDFLARE_API_TOKEN
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID
const PROJECT = process.env.CF_PROJECT_NAME || 'areej-workflow'
const BRANCH = process.env.CF_BRANCH || 'main'
const API = 'https://api.cloudflare.com/client/v4'

if (!TOKEN || !ACCOUNT) {
  console.error('Missing CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID')
  process.exit(1)
}

const DIST = path.resolve(__dirname, '..', 'dist')

const MIME = {
  html: 'text/html', htm: 'text/html', css: 'text/css', js: 'application/javascript',
  mjs: 'application/javascript', json: 'application/json', map: 'application/json',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  svg: 'image/svg+xml', webp: 'image/webp', ico: 'image/x-icon',
  txt: 'text/plain', xml: 'application/xml', webmanifest: 'application/manifest+json',
  woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', mp4: 'video/mp4', pdf: 'application/pdf',
}

function collectFiles(dir, base) {
  let out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out = out.concat(collectFiles(p, base))
    else out.push(path.relative(base, p).split(path.sep).join('/'))
  }
  return out
}

async function call(url, { token, method = 'GET', body, json = true, extraHeaders = {} } = {}) {
  const headers = { Authorization: `Bearer ${token}`, ...extraHeaders }
  if (json && body) headers['Content-Type'] = 'application/json'
  const res = await fetch(url, { method, headers, body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`CF API ${res.status} ${url}: ${JSON.stringify(data).slice(0, 300)}`)
  return data
}

async function main() {
  const files = collectFiles(DIST, DIST)
  if (files.length === 0) throw new Error('dist/ is empty — run the build first')
  console.log(`Found ${files.length} files in dist/`)

  // 1) upload token
  const { result } = await call(`${API}/accounts/${ACCOUNT}/pages/projects/${PROJECT}/upload-token`, { token: TOKEN })
  const jwt = result.jwt
  console.log('Got upload token')

  // 2) build hashes (wrangler scheme: sha256 of base64(content) + extension) + upload
  const manifest = {}
  const items = []
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(DIST, rel))
    const b64 = buf.toString('base64')
    const ext = path.extname(rel).slice(1).toLowerCase()
    const hash = crypto.createHash('sha256').update(b64 + ext).digest('hex')
    manifest['/' + rel] = hash
    items.push({
      key: hash,
      value: b64,
      metadata: { contentType: MIME[ext] || 'application/octet-stream' },
      base64: true,
    })
  }

  const up = await call(`${API}/pages/assets/upload`, {
    token: jwt, method: 'POST', body: JSON.stringify(items),
  })
  const bad = up.result?.unsuccessful_keys || []
  if (bad.length) throw new Error(`Upload failed for keys: ${bad.join(', ')}`)
  console.log(`Uploaded ${up.result?.successful_key_count ?? items.length} assets`)

  // 3) register hashes
  await call(`${API}/pages/assets/upsert-hashes`, {
    token: jwt, method: 'POST', body: JSON.stringify({ hashes: items.map((i) => i.key) }),
  })
  console.log('Hashes registered')

  // 4) create deployment (multipart/form-data; manifest as an inline field with JSON content-type)
  const boundary = '----cfdeploy' + crypto.randomBytes(12).toString('hex')
  const manifestJson = JSON.stringify(manifest)
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="manifest"\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `${manifestJson}\r\n` +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="branch"\r\n\r\n` +
        `${BRANCH}\r\n` +
        `--${boundary}--\r\n`
    ),
  ])
  const deploy = await call(`${API}/accounts/${ACCOUNT}/pages/projects/${PROJECT}/deployments`, {
    token: TOKEN, method: 'POST', body, json: false,
    extraHeaders: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
  })
  if (!deploy.success) throw new Error('Deployment failed: ' + JSON.stringify(deploy.errors))
  console.log('Deployment URL:', deploy.result.url)
  console.log(`Live at https://${PROJECT}.pages.dev and attached custom domains`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
