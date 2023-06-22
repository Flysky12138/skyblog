import { toMerged } from 'es-toolkit'
import { Options } from 'prettier'
import yamlPlugins from 'prettier/plugins/yaml'
import prettier from 'prettier/standalone'
import { LanguagePropsType } from '../index'

export const yamlConfig: LanguagePropsType = {
  language: 'yaml',
  registerEvents: monaco => [
    monaco.languages.registerDocumentFormattingEditProvider(yamlConfig.language, {
      provideDocumentFormattingEdits: async model => {
        const text = await prettier.format(
          model.getValue(),
          toMerged<Options, Options>(require('/.prettierrc.cjs'), {
            jsxSingleQuote: true,
            parser: yamlConfig.language,
            plugins: [yamlPlugins]
          })
        )
        return [{ text, range: model.getFullModelRange() }]
      }
    })
  ]
}
