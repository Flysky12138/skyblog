/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// @ts-nocheck

import { createPrettierOptions, MonacoEditorProps } from '@repo/monaco-editor'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import typescriptPlugins from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'

import dts from './cron.d.ts?raw'

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
  monaco.languages.typescript.typescriptDefaults.addExtraLib(`declare global { ${dts} } `, 'file:///cron.d.ts')

  // 配置
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    module: monaco.languages.typescript.ModuleKind.ESNext,
    target: monaco.languages.typescript.ScriptTarget.ESNext
  })

  // 关闭语法错误提示
  // A 'return' statement can only be used within a function body.(1108)
  monaco.editor.onDidCreateModel(model => {
    monaco.editor.onDidChangeMarkers(([uri]) => {
      const markers = monaco.editor.getModelMarkers({ resource: uri }).filter(marker => !['1108', '2304'].includes(marker.code))
      monaco.editor.setModelMarkers(model, language, markers)
    })
  })
}
