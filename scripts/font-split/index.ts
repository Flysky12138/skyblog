import { UnicodeRange } from '@japont/unicode-range'
import { fontSplit, FontSplitProps } from 'cn-font-split'
import Fs from 'node:fs'
import Path from 'node:path'
import Url from 'node:url'

const EXTS = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = Url.fileURLToPath(new URL('./', import.meta.url))
const DIR_OUTPUT = Url.fileURLToPath(new URL('../../src/assets/font', import.meta.url))

for (const path of Fs.readdirSync(BASE_URL, { recursive: true }) as string[]) {
  if (!EXTS.includes(Path.extname(path).slice(1))) continue

  const filename = Path.basename(path).split('.')[0]
  const outDir = Path.join(DIR_OUTPUT, filename)

  Fs.rmSync(outDir, { force: true, recursive: true })

  const config: FontSplitProps = {
    input: Path.join(BASE_URL, path),
    outDir,
    reporter: false,
    targetType: 'woff2'
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
