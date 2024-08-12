import { fontSplit, InputTemplate } from '@konghayao/cn-font-split'
import _fs from 'node:fs'
import _path from 'node:path'
import _url from 'node:url'

const EXTS: NonNullable<InputTemplate['targetType']>[] = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = _url.fileURLToPath(new URL('./', import.meta.url))
const DIR_OUTPUT = _url.fileURLToPath(new URL('../../src/assets/font', import.meta.url))

for (const path of _fs.readdirSync(BASE_URL, { recursive: true }) as string[]) {
  if (!EXTS.includes(_path.extname(path).slice(1) as (typeof EXTS)[number])) continue
  const destFold = _path.join(DIR_OUTPUT, _path.basename(path).split('.')[0])
  _fs.rmSync(destFold, { force: true, recursive: true })
  fontSplit({
    destFold,
    FontPath: _path.join(BASE_URL, path),
    reporter: false,
    targetType: 'woff2',
    testHTML: false
  })
}
