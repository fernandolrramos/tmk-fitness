/**
 * Read an image File and return a centre-cropped, downscaled square JPEG data
 * URL, so a profile photo stays small enough to keep in localStorage.
 */
export function readAndResizeImage(file: File, max = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('decode failed'))
      img.onload = () => {
        // Source square (centre crop) → target square (capped at `max`).
        const srcSide = Math.min(img.width, img.height)
        const sx = (img.width - srcSide) / 2
        const sy = (img.height - srcSide) / 2
        const size = Math.min(max, srcSide)

        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('no canvas context'))
        ctx.drawImage(img, sx, sy, srcSide, srcSide, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
