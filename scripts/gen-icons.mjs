// Generate PWA icons from TMK Fitness's official runner mark.
// Pure Node (zlib only): decode the official PNG, composite it (padded) onto a
// solid background, and re-encode PNGs for the manifest.
import { deflateSync, inflateSync } from 'node:zlib'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, 'public/icons')
mkdirSync(outDir, { recursive: true })

// ---- PNG decode (8-bit RGBA, non-interlaced) ------------------------------
function decodePng(buf) {
  let p = 8 // skip signature
  let width = 0
  let height = 0
  let colorType = 6
  const idat = []
  while (p < buf.length) {
    const len = buf.readUInt32BE(p)
    const type = buf.toString('ascii', p + 4, p + 8)
    const data = buf.subarray(p + 8, p + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      colorType = data[9]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
    p += 12 + len
  }
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1
  const raw = inflateSync(Buffer.concat(idat))
  const bpp = channels
  const stride = width * bpp
  const out = Buffer.alloc(height * stride)
  const paeth = (a, b, c) => {
    const pp = a + b - c
    const pa = Math.abs(pp - a)
    const pb = Math.abs(pp - b)
    const pc = Math.abs(pp - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const rowStart = y * (stride + 1) + 1
    for (let i = 0; i < stride; i++) {
      const x = raw[rowStart + i]
      const a = i >= bpp ? out[y * stride + i - bpp] : 0
      const b = y > 0 ? out[(y - 1) * stride + i] : 0
      const c = i >= bpp && y > 0 ? out[(y - 1) * stride + i - bpp] : 0
      let val
      switch (filter) {
        case 1: val = x + a; break
        case 2: val = x + b; break
        case 3: val = x + ((a + b) >> 1); break
        case 4: val = x + paeth(a, b, c); break
        default: val = x
      }
      out[y * stride + i] = val & 0xff
    }
  }
  // normalise to RGBA
  if (channels === 4) return { width, height, data: out }
  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = out[i * channels]
    rgba[i * 4 + 1] = out[i * channels + 1]
    rgba[i * 4 + 2] = out[i * channels + 2]
    rgba[i * 4 + 3] = 255
  }
  return { width, height, data: rgba }
}

// ---- PNG encode (RGBA) ----------------------------------------------------
function crc32(buf) {
  let crc = ~0
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return ~crc >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const t = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}
function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const stride = size * 4
  const rawImg = Buffer.alloc(size * (stride + 1))
  for (let y = 0; y < size; y++) {
    rawImg[y * (stride + 1)] = 0
    rgba.copy(rawImg, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = deflateSync(rawImg, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---- crop a region of an image, trimmed to its opaque bounding box --------
function cropTrim(img, rx0, rx1) {
  let minX = rx1
  let maxX = rx0
  let minY = img.height
  let maxY = 0
  for (let y = 0; y < img.height; y++) {
    for (let x = rx0; x < rx1; x++) {
      const a = img.data[(y * img.width + x) * 4 + 3]
      if (a > 40) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const w = maxX - minX + 1
  const h = maxY - minY + 1
  const data = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = ((y + minY) * img.width + (x + minX)) * 4
      const di = (y * w + x) * 4
      data[di] = img.data[si]
      data[di + 1] = img.data[si + 1]
      data[di + 2] = img.data[si + 2]
      data[di + 3] = img.data[si + 3]
    }
  }
  return { width: w, height: h, data }
}

// draw a sub-image onto out at dest rect with bilinear sampling + alpha blend
function draw(out, size, src, dx, dy, dw, dh) {
  for (let y = Math.floor(dy); y < Math.ceil(dy + dh); y++) {
    for (let x = Math.floor(dx); x < Math.ceil(dx + dw); x++) {
      if (x < 0 || y < 0 || x >= size || y >= size) continue
      const sx = ((x - dx) / dw) * src.width
      const sy = ((y - dy) / dh) * src.height
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) continue
      const x0 = Math.floor(sx)
      const y0 = Math.floor(sy)
      const x1 = Math.min(x0 + 1, src.width - 1)
      const y1 = Math.min(y0 + 1, src.height - 1)
      const fx = sx - x0
      const fy = sy - y0
      const sample = (c) => {
        const p00 = src.data[(y0 * src.width + x0) * 4 + c]
        const p10 = src.data[(y0 * src.width + x1) * 4 + c]
        const p01 = src.data[(y1 * src.width + x0) * 4 + c]
        const p11 = src.data[(y1 * src.width + x1) * 4 + c]
        return (
          p00 * (1 - fx) * (1 - fy) +
          p10 * fx * (1 - fy) +
          p01 * (1 - fx) * fy +
          p11 * fx * fy
        )
      }
      const a = sample(3) / 255
      if (a <= 0.01) continue
      const di = (y * size + x) * 4
      for (let c = 0; c < 3; c++) {
        out[di + c] = Math.round(sample(c) * a + out[di + c] * (1 - a))
      }
      out[di + 3] = 255
    }
  }
}

// Compose the two runners (man left, woman right) on a solid bg.
function composeIcon(size, padFrac, bg, man, woman, gapFrac) {
  const out = Buffer.alloc(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    out[i * 4] = bg[0]
    out[i * 4 + 1] = bg[1]
    out[i * 4 + 2] = bg[2]
    out[i * 4 + 3] = 255
  }
  const pad = size * padFrac
  const gap = size * gapFrac
  const avail = size - pad * 2
  const halfW = (avail - gap) / 2
  const maxH = avail
  // scale each runner to fit its half, keep both at the same height
  const s = Math.min(
    halfW / man.width,
    maxH / man.height,
    halfW / woman.width,
    maxH / woman.height,
  )
  const mw = man.width * s
  const mh = man.height * s
  const ww = woman.width * s
  const wh = woman.height * s
  const cy = size / 2
  // man: right-aligned to the centre gap; woman: left-aligned to the centre gap
  draw(out, size, man, size / 2 - gap / 2 - mw, cy - mh / 2, mw, mh)
  draw(out, size, woman, size / 2 + gap / 2, cy - wh / 2, ww, wh)
  return out
}

const logo = decodePng(readFileSync(resolve(root, 'public/brand/logo.png')))
console.log('logo', logo.width + 'x' + logo.height)
const man = cropTrim(logo, 40, 900)
const woman = cropTrim(logo, 2840, 3600)
console.log('man', man.width + 'x' + man.height, 'woman', woman.width + 'x' + woman.height)

const WHITE = [255, 255, 255]
const targets = [
  ['icon-192.png', 192, 0.12, WHITE, 0.04],
  ['icon-512.png', 512, 0.12, WHITE, 0.04],
  ['maskable-192.png', 192, 0.2, WHITE, 0.04],
  ['maskable-512.png', 512, 0.2, WHITE, 0.04],
  ['apple-touch-icon.png', 180, 0.1, WHITE, 0.04],
]
for (const [name, size, pad, bg, gap] of targets) {
  const png = encodePng(size, composeIcon(size, pad, bg, man, woman, gap))
  writeFileSync(resolve(outDir, name), png)
  console.log('wrote', name, png.length, 'bytes')
}
