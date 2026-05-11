import { UnicodeRange } from '@japont/unicode-range'
import { fontSplit, InputTemplate } from 'cn-font-split'
import { kebabCase } from 'es-toolkit'
import { readdirSync, readFileSync, rmSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { updatePackageExports } from './lib/utils'

const EXTS = ['otf', 'ttf', 'woff', 'woff2']

const BASE_URL = fileURLToPath(new URL('./fonts/', import.meta.url))
const DIR_OUTPUT = fileURLToPath(new URL('../dist/', import.meta.url))

// 导出文件
const exportsMap = new Map<string, string>()

for (const path of readdirSync(BASE_URL)) {
  if (!EXTS.includes(extname(path).slice(1))) continue

  const filename = kebabCase(basename(path).split('.')[0])
  const outDir = join(DIR_OUTPUT, filename)

  // 删除旧文件
  rmSync(outDir, { force: true, recursive: true })

  // https://www.npmjs.com/package/cn-font-split
  const config: InputTemplate = {
    input: new Uint8Array(readFileSync(join(BASE_URL, path)).buffer),
    outDir,
    reporter: false,
    targetType: 'woff2',
    testHTML: false
  }

  // emoji config merge
  if (filename.includes('emoji')) {
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
    } satisfies Partial<InputTemplate>)
  }

  try {
    await fontSplit(config)
  } catch (error) {
    console.error(error)
  }

  exportsMap.set(`./${filename}.css`, `./dist/${filename}/result.css`)
}

updatePackageExports({
  exportsMap: Object.fromEntries(exportsMap),
  packageJsonPath: '../package.json'
})
