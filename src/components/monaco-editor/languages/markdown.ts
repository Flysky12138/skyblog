import { isUndefined, toMerged } from 'es-toolkit'
import { Options } from 'prettier'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import markdownPlugins from 'prettier/plugins/markdown'
import { format } from 'prettier/standalone'
import { grammars } from 'tm-grammars'

import { LanguageConfig } from '../index'

export const markdownConfig: LanguageConfig = {
  language: 'markdown',
  registerEvents: monaco => [
    // 格式化
    monaco.languages.registerDocumentFormattingEditProvider(markdownConfig.language, {
      provideDocumentFormattingEdits: async model => {
        const options = toMerged<Options, Options>(require('/.prettierrc.mjs'), {
          jsxSingleQuote: true,
          parser: markdownConfig.language,
          plugins: [estreePlugins, babelPlugins, markdownPlugins],
          requirePragma: false
        })
        const text = await format(model.getValue(), options)
        return [{ range: model.getFullModelRange(), text }]
      }
    }),

    // 输入提示
    monaco.languages.registerCompletionItemProvider(markdownConfig.language, {
      provideCompletionItems: (model, position) => {
        const { endColumn, startColumn } = model.getWordUntilPosition(position)
        const range = { endColumn, endLineNumber: position.lineNumber, startColumn, startLineNumber: position.lineNumber }

        const textUntilPosition = model.getValueInRange({
          endColumn: position.column,
          endLineNumber: position.lineNumber,
          startColumn: 1,
          startLineNumber: position.lineNumber
        })

        // 行内元素和代码块的语言提示
        const isInlineCode = /{:/.test(textUntilPosition)
        const isBlockCode = /^\s?`{3}/.test(textUntilPosition)
        if (isInlineCode || isBlockCode) {
          return {
            suggestions: grammars.map(({ displayName, name }) => ({
              detail: displayName,
              insertText: name,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Enum,
              label: name,
              range
            }))
          }
        }

        // 自定义组建提示
        const suggestField = (payload: { detail: string; label: string; value: string[] }[]) => ({
          suggestions: payload.map(({ detail, label, value }) => ({
            detail,
            insertText: value.join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Field,
            label,
            range
          }))
        })
        if (/^\s*$/.test(textUntilPosition)) {
          return suggestField([
            {
              detail: '选项卡',
              label: 'tabs',
              value: ['::::tabs', '::tabtrigger[$1]', ':::tabscontent', '$2', ':::', '::', '::::']
            },
            { detail: '警告', label: 'alert', value: [':::alert{title="$1"}', '$2', ':::'] }
          ])
        }

        // 自定义组建属性提示
        const suggestProperty = (payload: (XOR<{ value?: string }, { values?: string[] }> & { key: string })[]) => ({
          suggestions: payload.map(({ key, value, values }) => {
            let insertText = key
            if (!isUndefined(value)) {
              insertText += `="${value || '$0'}"`
            } else if (values && values.length > 0) {
              insertText += `="\${1|${values.join(',')}|}"`
            }
            return {
              insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Property,
              label: key,
              range
            }
          })
        })
        switch (textUntilPosition.match(/:{1,}(\S+?)(?:\[.*\])?{/)?.[1] || '') {
          case 'img':
            return suggestProperty([
              { key: 'src', value: '' },
              { key: 'alt', value: '' },
              { key: 'width', value: '${0:200}' },
              { key: 'height', value: '${0:200}' },
              { key: 'priority', value: 'true' }
            ])
          case 'tabs':
            return suggestProperty([{ key: 'defaultValue', value: '${0:0}' }])
        }

        // shiki 转换器 命令提示
        if (/\/\/$/.test(textUntilPosition)) {
          return {
            suggestions: [
              { label: 'highlight', value: ' [!code highlight:${0:1}]' },
              { label: 'diff +', value: ' [!code ++]' },
              { label: 'diff -', value: ' [!code --]' }
            ].map(({ label, value }) => ({
              insertText: value,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Snippet,
              label,
              range
            }))
          }
        }
      }
    })
  ]
}
