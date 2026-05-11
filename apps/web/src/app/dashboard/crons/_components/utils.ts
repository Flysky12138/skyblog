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

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `
/** 企业微信相关接口 */
declare abstract class WeCom {
  static markdown(content: string): Promise<void>
  static markdown_v2(content: string): Promise<void>
  static text(
    content: string,
    options?: {
      mentioned_list?: ('@all' | (string & {}))[]
      mentioned_mobile_list?: ('@all' | (string & {}))[]
    }
  ): Promise<void>
}

/** 当前时间 UTC+8 */
declare const now: () => string
      `,
    'monaco://types/cron.d.ts'
  )

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    module: monaco.languages.typescript.ModuleKind.ESNext,
    target: monaco.languages.typescript.ScriptTarget.ESNext
  })
}
