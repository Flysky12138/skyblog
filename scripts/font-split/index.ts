import { fontSplit, InputTemplate } from '@konghayao/cn-font-split'
import { readdirSync, rmSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const EXTS: NonNullable<InputTemplate['targetType']>[] = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = fileURLToPath(new URL('./', import.meta.url))
const DIR_OUTPUT = fileURLToPath(new URL('../../src/assets/font', import.meta.url))

for (const path of readdirSync(BASE_URL, { recursive: true }) as string[]) {
  if (!EXTS.includes(extname(path).slice(1) as (typeof EXTS)[number])) continue
  const destFold = join(DIR_OUTPUT, basename(path).split('.')[0])
  rmSync(destFold, { force: true, recursive: true })
  fontSplit({
    destFold,
    FontPath: join(BASE_URL, path),
    reporter: false,
    targetType: 'woff2',
    testHTML: false
  })
}
