import { SESSIONSTORAGE } from '@/lib/constants'
import { Options } from 'prettier'
import yamlPlugins from 'prettier/plugins/yaml'
import prettier from 'prettier/standalone'
import { LanguagePropsType } from './index'

const language = 'yaml'

export const yamlConfig: LanguagePropsType = {
  beforeMount: monaco => {
    const key = SESSIONSTORAGE.MONACO_BEFOREMOUNT(language)
    if (window.sessionStorage.getItem(key) == '1') return
    window.sessionStorage.setItem(key, '1')

    monaco.languages.registerDocumentFormattingEditProvider(language, {
      provideDocumentFormattingEdits: async model => {
        const text = await prettier.format(
          model.getValue(),
          Object.assign<Options, Options>(require('/.prettierrc.cjs'), {
            jsxSingleQuote: true,
            parser: language,
            plugins: [yamlPlugins]
          })
        )
        return [{ range: model.getFullModelRange(), text }]
      }
    })
  },
  language
}
