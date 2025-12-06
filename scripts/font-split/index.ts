import { UnicodeRange } from '@japont/unicode-range'
import { fontSplit, FontSplitProps } from 'cn-font-split'
import { readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const EXTS = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = fileURLToPath(new URL('./', import.meta.url))
const DIR_OUTPUT = fileURLToPath(new URL('../../src/assets/font', import.meta.url))

for (const _path of readdirSync(BASE_URL, { recursive: true }) as string[]) {
  if (!EXTS.includes(path.extname(_path).slice(1))) continue

  const filename = path.basename(_path).split('.')[0]
  const outDir = path.join(DIR_OUTPUT, filename)

  rmSync(outDir, { force: true, recursive: true })

  /**
   * @see https://www.npmjs.com/package/cn-font-split
   */
  const config: FontSplitProps = {
    input: path.join(BASE_URL, _path),
    outDir,
    reporter: false,
    targetType: 'woff2',
    testHtml: false
  }

  // emoji
  if (filename.toLowerCase().includes('emoji')) {
    Object.assign(config, {
      autoSubset: false,
      fontFeature: false,
      languageAreas: false,
      subsetRemainChars: false,
      subsets: [
        'U+1F000-1F02F',
        'U+1F0A0-1F0FF',
        'U+1F100-1F1FF',
        'U+1F200-1F2FF',
        'U+1F300-1F5FF',
        'U+1F600-1F64F',
        'U+1F650-1F67F',
        'U+1F680-1F6FF',
        'U+1F700-1F77F',
        'U+1F780-1F7FF',
        'U+1F800-1F8FF',
        'U+1F900-1F9FF',
        'U+1FA00-1FA6F',
        'U+1FA70-1FAFF',
        'U+2600-26FF',
        'U+2700-27BF',
        'U+FE0F'
      ].map(item => UnicodeRange.parse([item]))
    } satisfies Partial<FontSplitProps>)
  }

  await fontSplit(config)
}
