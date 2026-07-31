/*
 * Minimal pure-JS BLAKE3 hash (single-shot, one-shot input of arbitrary length).
 * Implements the BLAKE3 spec: https://github.com/BLAKE3-team/BLAKE3-specs
 * Used to compute Cloudflare Pages asset hashes identically to Wrangler:
 *   blake3( base64(fileContents) + fileExtension ) -> hex, first 32 chars.
 */
'use strict'

const OUT_LEN = 32
const BLOCK_LEN = 64
const CHUNK_LEN = 1024
const CHUNK_START = 1
const CHUNK_END = 2
const PARENT = 4
const ROOT = 8

const IV = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])

const MSG_PERMUTATION = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8]

function rotr(x, n) {
  return ((x >>> n) | (x << (32 - n))) >>> 0
}

function g(v, a, b, c, d, x, y) {
  v[a] = (v[a] + v[b] + x) >>> 0
  v[d] = rotr(v[d] ^ v[a], 16)
  v[c] = (v[c] + v[d]) >>> 0
  v[b] = rotr(v[b] ^ v[c], 12)
  v[a] = (v[a] + v[b] + y) >>> 0
  v[d] = rotr(v[d] ^ v[a], 8)
  v[c] = (v[c] + v[d]) >>> 0
  v[b] = rotr(v[b] ^ v[c], 7)
}

function compress(cv, blockWords, counter, blockLen, flags) {
  const v = new Uint32Array(16)
  v.set(cv.subarray(0, 8))
  v.set(IV.subarray(0, 4), 8)
  v[12] = counter >>> 0
  v[13] = Math.floor(counter / 4294967296) >>> 0
  v[14] = blockLen >>> 0
  v[15] = flags >>> 0

  let m = new Uint32Array(blockWords)
  for (let round = 0; round < 7; round++) {
    // columns
    g(v, 0, 4, 8, 12, m[0], m[1])
    g(v, 1, 5, 9, 13, m[2], m[3])
    g(v, 2, 6, 10, 14, m[4], m[5])
    g(v, 3, 7, 11, 15, m[6], m[7])
    // diagonals
    g(v, 0, 5, 10, 15, m[8], m[9])
    g(v, 1, 6, 11, 12, m[10], m[11])
    g(v, 2, 7, 8, 13, m[12], m[13])
    g(v, 3, 4, 9, 14, m[14], m[15])
    if (round < 6) {
      const p = new Uint32Array(16)
      for (let i = 0; i < 16; i++) p[i] = m[MSG_PERMUTATION[i]]
      m = p
    }
  }

  const out = new Uint32Array(16)
  for (let i = 0; i < 8; i++) out[i] = (v[i] ^ v[i + 8]) >>> 0
  for (let i = 0; i < 8; i++) out[i + 8] = (v[i + 8] ^ cv[i]) >>> 0
  return out
}

function wordsFromBytes(bytes, offset, len) {
  const words = new Uint32Array(16)
  for (let i = 0; i < len; i++) {
    words[i >>> 2] |= bytes[offset + i] << ((i & 3) * 8)
  }
  return words
}

function first8(u32) {
  return u32.subarray(0, 8)
}

class Output {
  constructor(inputCv, blockWords, counter, blockLen, flags) {
    this.inputCv = inputCv
    this.blockWords = blockWords
    this.counter = counter
    this.blockLen = blockLen
    this.flags = flags
  }
  chainingValue() {
    return first8(compress(this.inputCv, this.blockWords, this.counter, this.blockLen, this.flags))
  }
  rootBytes() {
    const words = compress(this.inputCv, this.blockWords, 0, this.blockLen, this.flags | ROOT)
    const bytes = Buffer.alloc(OUT_LEN)
    for (let i = 0; i < 8; i++) bytes.writeUInt32LE(words[i], i * 4)
    return bytes
  }
}

class ChunkState {
  constructor(cv, chunkCounter) {
    this.cv = cv
    this.chunkCounter = chunkCounter
    this.buf = Buffer.alloc(BLOCK_LEN)
    this.bufLen = 0
    this.blocksCompressed = 0
    this.flags = CHUNK_START
  }
  update(input) {
    let pos = 0
    while (pos < input.length) {
      if (this.bufLen === BLOCK_LEN) {
        const blockWords = wordsFromBytes(this.buf, 0, BLOCK_LEN)
        this.cv = first8(compress(this.cv, blockWords, this.chunkCounter, BLOCK_LEN, this.flags))
        this.blocksCompressed++
        this.flags = 0
        this.buf.fill(0)
        this.bufLen = 0
      }
      const want = BLOCK_LEN - this.bufLen
      const take = Math.min(want, input.length - pos)
      input.copy(this.buf, this.bufLen, pos, pos + take)
      this.bufLen += take
      pos += take
    }
  }
  output() {
    const blockWords = wordsFromBytes(this.buf, 0, this.bufLen)
    return new Output(this.cv, blockWords, this.chunkCounter, this.bufLen, this.flags | CHUNK_END)
  }
}

function parentOutput(leftCv, rightCv, key) {
  const blockWords = new Uint32Array(16)
  blockWords.set(leftCv, 0)
  blockWords.set(rightCv, 8)
  return new Output(key, blockWords, 0, BLOCK_LEN, PARENT)
}

function parentCv(leftCv, rightCv, key) {
  return parentOutput(leftCv, rightCv, key).chainingValue()
}

/**
 * One-shot BLAKE3 hash of a Buffer/string, returns lowercase hex (64 chars).
 */
function blake3(input) {
  const bytes = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8')
  const key = IV

  // Chunk-level processing
  const chunkStates = []
  const numChunks = Math.max(1, Math.ceil(bytes.length / CHUNK_LEN))
  for (let c = 0; c < numChunks; c++) {
    const state = new ChunkState(key, c)
    state.update(bytes.subarray(c * CHUNK_LEN, Math.min((c + 1) * CHUNK_LEN, bytes.length)))
    chunkStates.push(state)
  }

  // If exactly one chunk: its output is the root output.
  if (chunkStates.length === 1) {
    return chunkStates[0].output().rootBytes().toString('hex')
  }

  // Build the tree: merge cvs pairwise (left-subtree sizes are largest power of 2 < n)
  let cvs = chunkStates.map((s) => s.output().chainingValue())
  while (cvs.length > 2) {
    const next = []
    let i = 0
    while (i < cvs.length) {
      if (i + 1 < cvs.length) {
        next.push(parentCv(cvs[i], cvs[i + 1], key))
        i += 2
      } else {
        next.push(cvs[i])
        i += 1
      }
    }
    cvs = next
  }
  return parentOutput(cvs[0], cvs[1], key).rootBytes().toString('hex')
}

module.exports = { blake3 }
