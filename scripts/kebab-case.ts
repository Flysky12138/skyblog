import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const BASE_PATH = url.fileURLToPath(new URL('../src', import.meta.url))

const dirs = fs.readdirSync(BASE_PATH, { recursive: true }) as string[]

for (const dir of dirs) {
  const filePath = path.join(BASE_PATH, dir)

  if (!fs.statSync(filePath).isFile()) continue
  if (!/[A-Z]/.test(path.basename(filePath))) continue

  const filename = path.basename(filePath)
  const filenameKeBabCase = filename.replace(/[A-Z]/g, '-$&').toLowerCase().replace(/^-/, '')

  const newFilePath = path.join(path.dirname(filePath), filenameKeBabCase)

  fs.renameSync(filePath, newFilePath)
  console.log('\x1b[31m%s\x1b[0m -> \x1b[32m%s\x1b[0m', dir, path.join(path.dirname(dir), filenameKeBabCase))
}
