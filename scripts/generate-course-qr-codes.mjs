import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import QRCode from 'qrcode'

const BASE_URL = process.env.QR_BASE_URL || 'https://iwi.golf'
const OUTPUT_DIR = path.join(process.cwd(), 'qrcodes')

const COURSES = [
  'DeLaveaga Golf Course',
  'Los Lagos Golf Course',
  'Moffett Field Golf Club',
  'Seabright Country Club',
  'Seascape Golf Club',
  'Stanford University Golf Course',
]

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  for (const course of COURSES) {
    const url = `${BASE_URL}/order?course=${encodeURIComponent(course)}`
    const filePath = path.join(OUTPUT_DIR, `${slugify(course)}.png`)
    await QRCode.toFile(filePath, url, { width: 600, margin: 2 })
    console.log(`${course}\n  -> ${filePath}\n  -> ${url}\n`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
