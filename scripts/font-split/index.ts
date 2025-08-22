import { fontSplit } from 'cn-font-split'
import Fs from 'node:fs'
import Path from 'node:path'
import Url from 'node:url'

const EXTS = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = Url.fileURLToPath(new URL('./', import.meta.url))
const DIR_OUTPUT = Url.fileURLToPath(new URL('../../src/assets/font', import.meta.url))

for (const path of Fs.readdirSync(BASE_URL, { recursive: true }) as string[]) {
  if (!EXTS.includes(Path.extname(path).slice(1))) continue

  const outDir = Path.join(DIR_OUTPUT, Path.basename(path).split('.')[0])
  Fs.rmSync(outDir, { force: true, recursive: true })

  fontSplit({
    input: Path.join(BASE_URL, path),
    outDir,
    reporter: false,
    targetType: 'woff2'
  })
}
