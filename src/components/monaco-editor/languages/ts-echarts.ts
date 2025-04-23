import { toMerged } from 'es-toolkit'
import { Options } from 'prettier'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import typescriptPlugins from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'

import { LanguageConfig } from '../index'

export const tsEchartsConfig: LanguageConfig = {
  language: 'typescript',
  registerEvents: monaco => {
    /**
     * 加载 echarts 的类型
     * @see https://echarts.apache.org/examples/zh/editor.html?c=line-simple&lang=ts
     * 类型文件，上面👆页面的控制台请求中发现的
     * @file https://echarts.apache.org/zh/js/vendors/echarts/types/dist/echarts.d.ts
     */
    void (async () => {
      const dtyps = await fetch('/echarts.d.ts').then(res => res.text())
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `
          declare module 'echarts' { ${dtyps} };
          declare var option: import('echarts').EChartsOption;
          declare var echarts: typeof import('echarts');
        `,
        'monaco://types/echarts.d.ts'
      )
    })()

    return [
      // 格式化
      monaco.languages.registerDocumentFormattingEditProvider(tsEchartsConfig.language, {
        provideDocumentFormattingEdits: async model => {
          const options = toMerged<Options, Options>(require('/.prettierrc.cjs'), {
            parser: tsEchartsConfig.language,
            plugins: [estreePlugins, babelPlugins, typescriptPlugins]
          })
          const text = await format(model.getValue(), options)
          return [{ range: model.getFullModelRange(), text }]
        }
      })
    ]
  }
}
