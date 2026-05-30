/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// @ts-nocheck

import { createPrettierOptions, MonacoEditorProps } from '@repo/monaco-editor'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import typescriptPlugins from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'

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

  // 引入自定义类型
  monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, 'file:///cron.d.ts')

  // 配置
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    module: monaco.languages.typescript.ModuleKind.ESNext,
    target: monaco.languages.typescript.ScriptTarget.ESNext
  })

  // 关闭语法错误提示
  const ignoreCodes = new Set(['1108', '2304'])
  monaco.editor.onDidChangeMarkers(uris => {
    for (const uri of uris) {
      const model = monaco.editor.getModel(uri)
      if (!model) continue
      const markers = monaco.editor.getModelMarkers({ resource: uri }).filter(marker => {
        const code = typeof marker.code === 'string' ? marker.code : String(marker.code?.value)
        return !ignoreCodes.has(code)
      })
      monaco.editor.setModelMarkers(model, 'typescript', markers)
    }
  })
}

const dts = `
interface Cron {
  /**
   * 企业微信
   */
  WeCom: {
    markdown(content: string): Promise<void>
    markdown_v2(content: string): Promise<void>
    text(
      content: string,
      options?: {
        mentioned_list?: ('@all' | (string & {}))[]
        mentioned_mobile_list?: ('@all' | (string & {}))[]
      }
    ): Promise<void>
  }

  /**
   * 当前时间 UTC+8
   */
  now: () => string
}
`
