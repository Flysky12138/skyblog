import { toMerged } from 'es-toolkit'
import { configureMonacoYaml, JSONSchema } from 'monaco-yaml'
import { Options } from 'prettier'
import yamlPlugins from 'prettier/plugins/yaml'
import { format } from 'prettier/standalone'

import schema from '@/assets/schema/clash-meta-schema.json'

import { LanguageConfig } from '../index'

export const yamlClashConfig: LanguageConfig = {
  language: 'yaml',
  registerEvents: monaco => [
    // 格式化
    monaco.languages.registerDocumentFormattingEditProvider(yamlClashConfig.language, {
      provideDocumentFormattingEdits: async model => {
        const options = toMerged<Options, Options>(require('/.prettierrc.cjs'), {
          parser: yamlClashConfig.language,
          plugins: [yamlPlugins]
        })
        const text = await format(model.getValue(), options)
        return [{ range: model.getFullModelRange(), text }]
      }
    }),

    /**
     * 配置 clash-meta 订阅文件的 schema
     * @see https://github.com/dongchengjie/meta-json-schema?tab=readme-ov-file#-%E7%94%A8%E6%B3%95
     */
    configureMonacoYaml(monaco, {
      schemas: [
        {
          fileMatch: ['*'],
          schema: schema as unknown as JSONSchema,
          uri: 'monaco://schemas/clash-meta-schema.json'
        }
      ]
    })
  ]
}
