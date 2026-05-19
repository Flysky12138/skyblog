import { Treaty } from '@elysiajs/eden'
import { createPrettierOptions, grammars, MonacoEditorProps } from '@repo/monaco-editor'
import { isUndefined } from 'es-toolkit'
import babelPlugins from 'prettier/plugins/babel'
import estreePlugins from 'prettier/plugins/estree'
import markdownPlugins from 'prettier/plugins/markdown'
import { format } from 'prettier/standalone'

import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc } from '@/lib/http/rpc'

export type MessageEventDataPostPreviewMounted = MessageEventData<'post-preview-mounted'>
export type MessageEventDataPostUpdate = MessageEventData<'post-update', PostType>

export type PostType = Treaty.Data<ReturnType<typeof rpc.dashboard.posts>['get']>

/**
 * 文章预览 `BroadcastChannel` 频道 ID
 */
export const POST_PREVIEW_BROADCAST_CHANNEL_ID = '019b4b21-0bca-72dc-92da-b03b64c4299c'

/**
 * 初始文章数据
 */
export const createInitialPost: () => PostType = () => ({
  authorId: '',
  categories: [],
  commentCount: 0,
  content: null,
  cover: null,
  createdAt: new Date(),
  id: '-1',
  isPublished: false,
  pinOrder: 0,
  slug: null,
  summary: null,
  tags: [],
  title: '',
  updatedAt: new Date(),
  viewCount: 0,
  visibilityMask: POST_CARD_VISIBILITY_MASK.HEADER | POST_CARD_VISIBILITY_MASK.COMMENT | POST_CARD_VISIBILITY_MASK.TOC
})

export const onInit: MonacoEditorProps['onInit'] = (monaco, language) => {
  // 格式化
  monaco.languages.registerDocumentFormattingEditProvider(language, {
    provideDocumentFormattingEdits: async model => {
      const options = createPrettierOptions({
        jsxSingleQuote: true,
        parser: language,
        plugins: [estreePlugins, babelPlugins, markdownPlugins],
        requirePragma: false
      })
      const text = await format(model.getValue(), options)
      return [{ range: model.getFullModelRange(), text }]
    }
  })

  // 输入提示
  monaco.languages.registerCompletionItemProvider(language, {
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
      const isInlineCode = textUntilPosition.includes('{:')
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
      switch (/:{1,}(\S+?)(?:\[.*\])?{/.exec(textUntilPosition)?.[1] ?? '') {
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
      if (textUntilPosition.endsWith('//')) {
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
}
