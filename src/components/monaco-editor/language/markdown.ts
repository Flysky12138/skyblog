import { toMerged } from 'es-toolkit'
import { Options } from 'prettier'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import markdownPlugins from 'prettier/plugins/markdown'
import prettier from 'prettier/standalone'
import { grammars } from 'tm-grammars'
import { LanguagePropsType } from '../index'

export const markdownConfig: LanguagePropsType = {
  language: 'markdown',
  registerEvents: monaco => [
    // 格式化
    monaco.languages.registerDocumentFormattingEditProvider(markdownConfig.language, {
      provideDocumentFormattingEdits: async model => {
        const source = model.getValue().replace(/^[^\S\n]+(?=:+)/gm, '') // 移除 : 符号前面的空格
        const text = await prettier.format(
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
            { detail: '选项卡', key: 'tab', value: ['::::tabs', ':::tab{label="$1"}', '$2', ':::', ':::tab{label="$3"}', '$4', ':::', '::::'] },
            { detail: '分割线', key: 'hr', value: ['::hr[$1]'] },
            { detail: 'MDX 页面', key: 'mdx', value: ['::mdx{path=$0}'] },
            { detail: '瀑布流布局', key: 'masonry', value: ['::::masonry', '$1', '::::'] },
            { detail: '图片预览', key: 'images', value: [':::images', '$1', ':::'] },
            {
              detail: '手风琴',
              key: 'accordion-group',
              value: [':::::accordion-group', '::::accordion', ':::accordion-summary', '$1', ':::', ':::accordion-details', '$2', ':::', '::::', ':::::']
            },
            { detail: '手风琴', key: 'accordion', value: ['::::accordion', ':::accordion-summary', '$1', ':::', ':::accordion-details', '$2', ':::', '::::'] }
          ])
        }

        // 自定义组建属性提示
        const suggestProperty = (payload: Array<{ key: string } & XOR<{ value: string }, { values: string[] }>>) => ({
          suggestions: payload.map(({ key, value, values }) => {
            let insertText = key
            if (value != undefined) insertText += `="${value || '$0'}"`
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
            return suggestProperty([
              { key: 'activeIndex', value: '${0:0}' },
              { key: 'orientation', value: 'vertical' },
              { key: 'size', values: ['sm', 'md', 'lg'] }
            ])
          case 'tab':
            return suggestProperty([
              { key: 'label', value: '' },
              { key: 'indicatorInset', value: 'true' },
              { key: 'disableIndicator', value: 'true' },
              { key: 'color', values: ['primary', 'neutral', 'danger', 'success', 'warning'] },
              { key: 'indicatorPlacement', values: ['top', 'bottom', 'left', 'right'] }
            ])
          case 'hr':
            return suggestProperty([{ key: 'left', value: '${0:50}' }])
          case 'masonry':
            return suggestProperty([
              { key: 'minWidth', value: '${0:200}' },
              { key: 'spacing', value: '${0:2}' },
              { key: 'columns', value: '${0:4}' }
            ])
          case 'img':
            return suggestProperty([
              { key: 'src', value: '' },
              { key: 'alt', value: '' },
              { key: 'width', value: '${0:200}' },
              { key: 'height', value: '${0:200}' },
              { key: 'priority', value: 'true' }
            ])
          case 'accordion':
            return suggestProperty([
              { key: 'defaultExpanded', value: 'true' },
              { key: 'disabled', value: 'true' }
            ])
        }
      }
    })
  ]
}
