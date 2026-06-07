import { MarkdownParseResult } from '@tiptap/core'
import { Attribute, Node, textblockTypeInputRule } from '@tiptap/core'
import { BundledLanguage, BundledTheme, SpecialLanguage } from 'shiki'

import { CodeBlockView } from '../../components/view/code-block-view'
import { defaultDarkTheme, defaultLanguage, defaultLightTheme } from '../../lib/highlighter'

export interface CodeBlockShikiAttributes {
  darkTheme: BundledTheme
  language: BundledLanguage | SpecialLanguage
  lightTheme: BundledTheme
}

export interface CodeBlockShikiOptions {
  /**
   * 默认语言
   */
  lang: string
  /**
   * 默认主题
   */
  themes: {
    dark: BundledTheme
    light: BundledTheme
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlockShiki: {
      /**
       * 设置一个代码块
       */
      setCodeBlock: (attributes?: { language?: string }) => ReturnType
      /**
       * 设置代码块暗色主题
       */
      setCodeBlockDarkTheme: (darkTheme: string) => ReturnType
      /**
       * 设置代码块语言
       */
      setCodeBlockLanguage: (language: string) => ReturnType
      /**
       * 设置代码块亮色主题
       */
      setCodeBlockLightTheme: (lightTheme: string) => ReturnType
      /**
       * 切换代码块
       */
      toggleCodeBlock: (attributes?: { language?: string }) => ReturnType
    }
  }
}

export const CodeBlockShiki = Node.create<CodeBlockShikiOptions>({
  code: true,
  content: 'text*',
  defining: true,
  group: 'block',
  markdownTokenName: 'code',
  marks: '',
  name: 'codeBlock',

  addAttributes() {
    return {
      darkTheme: {
        default: this.options.themes.dark,
        parseHTML: element => element.getAttribute('data-dark-theme'),
        renderHTML: attributes => ({
          'data-dark-theme': attributes.darkTheme as string
        })
      },
      language: {
        default: this.options.lang,
        parseHTML: element => {
          const codeEl = element.querySelector('code')
          if (codeEl?.getAttribute('class')) {
            const match = /language-(\w+)/.exec(codeEl.getAttribute('class')!)
            if (match) return match[1]
          }
          return element.getAttribute('data-language')
        },
        renderHTML: attributes => ({
          'data-language': attributes.language as string
        })
      },
      lightTheme: {
        default: this.options.themes.light,
        parseHTML: element => element.getAttribute('data-light-theme'),
        renderHTML: attributes => ({
          'data-light-theme': attributes.lightTheme as string
        })
      }
    } satisfies Record<keyof CodeBlockShikiAttributes, Attribute>
  },

  addCommands() {
    return {
      setCodeBlock: attributes => {
        return ({ commands }) => {
          return commands.setNode(this.name, attributes)
        }
      },
      setCodeBlockDarkTheme: (darkTheme: string) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, { darkTheme })
        }
      },
      setCodeBlockLanguage: (language: string) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, { language })
        }
      },
      setCodeBlockLightTheme: (lightTheme: string) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, { lightTheme })
        }
      },
      toggleCodeBlock: attributes => {
        return ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        }
      }
    }
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: /^```([\w+#-]*)?\s$/,
        type: this.type,
        getAttributes: match => ({
          language: match[1] || this.options.lang
        })
      })
    ]
  },

  addKeyboardShortcuts() {
    return {
      // 切换代码块
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
      // 换行时自动继承当前行缩进
      Enter: () => {
        if (!this.editor.isActive('codeBlock')) return false
        const { selection } = this.editor.state
        const { $from } = selection
        const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)
        const currentLine = textBefore.slice(textBefore.lastIndexOf('\n') + 1)
        const indentMatch = /^(\t| +)*/.exec(currentLine)
        const indent = indentMatch ? indentMatch[0] : ''
        return this.editor.commands.first(({ commands }) => [() => commands.insertContent(`\n${indent}`), () => commands.insertContent('\n')])
      },
      // 取消缩进（支持 Tab 和空格）
      'Shift-Tab': () => {
        if (this.editor.isActive('codeBlock')) {
          const { selection } = this.editor.state
          const { $from } = selection

          const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)
          const lineText = textBefore.slice(textBefore.lastIndexOf('\n') + 1)
          const { pos } = $from

          // 优先处理 Tab 缩进
          if (lineText.startsWith('\t')) {
            this.editor.commands.deleteRange({
              from: pos - lineText.length,
              to: pos - lineText.length + 1
            })
            return true
          }

          // 处理空格缩进（默认 2 空格 = 一个 Tab 宽度）
          const spaceMatch = /^( {1,2})/.exec(lineText)
          if (spaceMatch) {
            const spacesToRemove = spaceMatch[1].length
            this.editor.commands.deleteRange({
              from: pos - lineText.length,
              to: pos - lineText.length + spacesToRemove
            })
            return true
          }
        }
        return false
      },
      // 缩进支持
      Tab: () => {
        if (this.editor.isActive('codeBlock')) {
          return this.editor.commands.insertContent('\t')
        }
        return false
      }
    }
  },

  addNodeView() {
    return CodeBlockView
  },

  addOptions() {
    return {
      lang: defaultLanguage,
      themes: {
        dark: defaultDarkTheme,
        light: defaultLightTheme
      }
    }
  },

  parseHTML() {
    return [
      {
        preserveWhitespace: 'full',
        tag: 'pre',
        contentElement(node) {
          const lines = node.querySelectorAll<HTMLSpanElement>('code span.line')
          // 还原高亮处理过的代码块
          if (lines.length) {
            node.querySelector('code')!.textContent = Array.from(lines)
              .map(line => line.textContent.trimEnd())
              .join('\n')
          }
          return node
        },
        getAttrs: node => {
          if (!node.querySelector('code')) return false
          return null
        }
      }
    ]
  },

  parseMarkdown(token, { createNode, createTextNode }): MarkdownParseResult {
    const language = (token.lang as string | undefined) ?? defaultLanguage
    return createNode('codeBlock', { language }, token.text ? [createTextNode(token.text)] : [])
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', HTMLAttributes, ['code', {}, 0]]
  },

  renderMarkdown(node, { renderChildren }): string {
    const { language = '' } = node.attrs as Partial<CodeBlockShikiAttributes>

    const content = renderChildren(node.content ?? [])
    const code = content.replace(/\n$/, '')

    return `\`\`\`${language}\n${code}\n\`\`\``
  }
})
