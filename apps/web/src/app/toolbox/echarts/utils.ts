import { createPrettierOptions, MonacoEditorProps } from '@repo/monaco-editor'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import typescriptPlugins from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'

export const ECHARTS_TEMPLATE = `
option = {
  tooltip: {},
  angleAxis: [
    {
      type: 'category',
      polarIndex: 0,
      startAngle: 90,
      endAngle: 0,
      data: ['S1', 'S2', 'S3']
    },
    {
      type: 'category',
      polarIndex: 1,
      startAngle: -90,
      endAngle: -180,
      data: ['T1', 'T2', 'T3']
    }
  ],
  radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }],
  polar: [{}, {}],
  series: [
    {
      type: 'bar',
      polarIndex: 0,
      data: [1, 2, 3],
      coordinateSystem: 'polar'
    },
    {
      type: 'bar',
      polarIndex: 1,
      data: [1, 2, 3],
      coordinateSystem: 'polar'
    }
  ]
}
`

export const onInit: MonacoEditorProps['onInit'] = (monaco, language) => {
  // 格式化
  monaco.languages.registerDocumentFormattingEditProvider(language, {
    provideDocumentFormattingEdits: async model => {
      const options = createPrettierOptions({
        parser: language,
        plugins: [estreePlugins, babelPlugins, typescriptPlugins]
      })
      const text = await format(model.getValue(), options)
      return [{ range: model.getFullModelRange(), text }]
    }
  })

  /**
   * 加载 echarts 的类型
   *
   * @file packages/chart-preview/node_modules/echarts/types/dist/echarts.d.ts
   */
  void (async () => {
    const dts = await fetch('/echarts.d.ts').then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch echarts.d.ts')
      }
      return res.text()
    })

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
        declare module 'echarts' {
          ${dts}
        }

        declare const echarts: typeof import('echarts');

        declare let option: import('echarts').EChartsOption;
      `,
      'monaco://types/echarts.d.ts'
    )
  })()
}
