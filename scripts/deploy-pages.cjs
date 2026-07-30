/*
 * Deploy `dist/` to Cloudflare Pages via the official Direct Upload REST API.
 * Uses only Node built-ins (no npm packages) so it works in CI without wrangler.
 * Requires env: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
 * Project name can be overridden via CF_PROJECT_NAME (default: areej-workflow).
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const TOKEN = process.env.CLOUDFLARE_API_TOKEN
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID
const PROJECT = process.env.CF_PROJECT_NAME || 'areej-workflow'
const API = 'https://api.cloudflare.com/client/v4'

if (!TOKEN || !ACCOUNT) {
  console.error('Missing CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID')
  process.exit(1)
}

const DIST = path.resolve(__dirname, '..', 'dist')

function collectFiles(dir, base) {
  let out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out = out.concat(collectFiles(p, base))
    else out.push(path.relative(base, p).split(path.sep).join('/'))
  }
  return out
}

async function cf(pathname, options = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(options.headers || {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`CF API ${res.status} on ${pathname}: ${JSON.stringify(data).slice(0, 300)}`)
  return data
}

async function uploadOne(hash, buf) {
  const form = new FormData()
  form.append('file', new Blob([buf]), hash)
  const data = await cf(`/accounts/${ACCOUNT}/pages/assets/upload`, { method: 'POST', body: form })
  if (!data.success) throw new Error(`asset upload failed for ${hash}`)
}

async function main() {
  const files = collectFiles(DIST, DIST)
  console.log(`Found ${files.length} files in dist/`)
  if (files.length === 0) throw new Error('dist/ is empty — run the build first')

  const manifest = {}
  const payloads = {}
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(DIST, rel))
    const hash = crypto.createHash('sha256').update(buf.toString('base64')).digest('hex')
    manifest['/' + rel] = hash
    payloads[hash] = buf
  }

  const check = await cf(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}/check-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manifest),
  })
  const missing = (check.result && check.result.missing_hashes) || []
  console.log(`Missing assets to upload: ${missing.length}`)

  for (const hash of missing) {
    await uploadOne(hash, payloads[hash])
    console.log(`uploaded ${hash.slice(0, 12)}...`)
  }

  const upsert = await cf(`/accounts/${ACCOUNT}/pages/assets/upsert-hashes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manifest),
  })
  if (!upsert.success) throw new Error('upsert-hashes failed')

  const form = new FormData()
  form.append('manifest', new Blob([JSON.stringify(manifest)], { type: 'application/json' }))
  form.append('branch', 'main')
  const deploy = await cf(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}/deployments`, {
    method: 'POST',
    body: form,
  })
  if (!deploy.success) throw new Error('deployment failed: ' + JSON.stringify(deploy.errors))
  console.log('Deployment URL:', deploy.result.url)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
