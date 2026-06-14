import { toMerged } from 'es-toolkit'
import { Options } from 'prettier'

/**
 * 创建 prettier 的配置项
 */
export function createPrettierOptions(options: Options): Options {
  return toMerged(
    {
      arrowParens: 'avoid',
      endOfLine: 'lf',
      printWidth: 150,
      semi: false,
      singleQuote: true,
      trailingComma: 'none',
      useTabs: false
    },
    options
  )
}
