import { toMerged } from 'es-toolkit'
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
        const source = model.getValue().replace(/^[^\S\n]+(?=:+)/gm, '') // 移除 : 符号前面的空格
        const text = await format(
          source,
          toMerged<Options, Options>(require('/.prettierrc.cjs'), {
            jsxSingleQuote: true,
            parser: markdownConfig.language,
            plugins: [estreePlugins, babelPlugins, markdownPlugins],
            requirePragma: false
          })
        )
        return [{ text, range: model.getFullModelRange() }]
      }
    }),

    // 输入提示
    monaco.languages.registerCompletionItemProvider(markdownConfig.language, {
      provideCompletionItems: (model, position) => {
        const { endColumn, startColumn } = model.getWordUntilPosition(position)
        const range = { endColumn, startColumn, endLineNumber: position.lineNumber, startLineNumber: position.lineNumber }

        const textUntilPosition = model.getValueInRange({
          endColumn: position.column,
          endLineNumber: position.lineNumber,
          startColumn: 1,
          startLineNumber: position.lineNumber
        })

        // 行内元素和代码块的语言提示
        const isInlineCode = /{:/.test(textUntilPosition)
        const isBlockCode = /^`{3}/.test(textUntilPosition)
        if (isInlineCode || isBlockCode) {
          return {
            suggestions: grammars.map(({ name, displayName }) => ({
              range,
              detail: displayName,
              insertText: name,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Enum,
              label: name
            }))
          }
        }

        // 自定义组建提示
        const suggestField = (payload: Array<{ detail: string; key: string; value: string[] }>) => ({
          suggestions: payload.map(({ key, value, detail }) => ({
            detail,
            range,
            insertText: value.join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Field,
            label: key
          }))
        })
        if (/^\s*$/.test(textUntilPosition)) {
          return suggestField([
            {
              detail: '选项卡',
              key: 'tabs',
              value: ['::::tabs', '::tabtrigger[$1]', ':::tabscontent', '$2', ':::', '::', '::::']
            },
            { detail: 'MDX 页面', key: 'mdx', value: ['::mdx{path=$0}'] },
            { detail: '警告', key: 'alert', value: [':::alert{title="$1"}', '$2', ':::'] }
          ])
        }

        // 自定义组建属性提示
        const suggestProperty = (payload: Array<{ key: string } & XOR<{ value?: string }, { values?: string[] }>>) => ({
          suggestions: payload.map(({ key, value, values }) => {
            let insertText = key
            if (typeof value != 'undefined') insertText += `="${value || '$0'}"`
            else if (values && values.length > 0) insertText += `="\${1|${values.join(',')}|}"`
            return {
              insertText,
              range,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Property,
              label: key
            }
          })
        })
        switch (textUntilPosition.match(/:{1,}(\S+?)(?:\[.*\])?{/)?.[1] || '') {
          case 'tabs':
            return suggestProperty([{ key: 'defaultValue', value: '${0:0}' }])
          case 'img':
            return suggestProperty([
              { key: 'src', value: '' },
              { key: 'alt', value: '' },
              { key: 'width', value: '${0:200}' },
              { key: 'height', value: '${0:200}' },
              { key: 'priority', value: 'true' }
            ])
        }

        // shiki 转换器 命令提示
        if (/\/\/$/.test(textUntilPosition)) {
          return {
            suggestions: [
              { label: 'highlight', value: ' [!code highlight:${0:1}]' },
              { label: 'diff +', value: ' [!code ++]' },
              { label: 'diff -', value: ' [!code --]' }
            ].map(({ label, value }) => ({
              label,
              range,
              insertText: value,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Snippet
            }))
          }
        }
      }
    })
  ]
}
