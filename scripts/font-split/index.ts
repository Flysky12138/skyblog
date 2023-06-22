import { fontSplit } from 'cn-font-split'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const EXTS = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = url.fileURLToPath(new URL('./', import.meta.url))
const DIR_OUTPUT = url.fileURLToPath(new URL('../../src/assets/font', import.meta.url))

for (const _path of fs.readdirSync(BASE_URL, { recursive: true }) as string[]) {
  if (!EXTS.includes(path.extname(_path).slice(1))) continue

  const outDir = path.join(DIR_OUTPUT, path.basename(_path).split('.')[0])
  fs.rmSync(outDir, { force: true, recursive: true })

  fontSplit({
    outDir,
    input: path.join(BASE_URL, _path),
    reporter: false,
    targetType: 'woff2'
  })
}
