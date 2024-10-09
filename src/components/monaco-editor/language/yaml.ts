import { toMerged } from 'es-toolkit'
import { Options } from 'prettier'
import yamlPlugins from 'prettier/plugins/yaml'
import prettier from 'prettier/standalone'
import { LanguagePropsType } from '../index'

const LANGUAGE = 'yaml'

export const yamlConfig: LanguagePropsType = {
  language: LANGUAGE,
  registerEvents: monaco => [
    monaco.languages.registerDocumentFormattingEditProvider(LANGUAGE, {
      provideDocumentFormattingEdits: async model => {
        const text = await prettier.format(
          model.getValue(),
          toMerged<Options, Options>(require('/.prettierrc.cjs'), {
            jsxSingleQuote: true,
            parser: LANGUAGE,
            plugins: [yamlPlugins]
          })
        )
        return [{ text, range: model.getFullModelRange() }]
      }
    })
  ]
}
