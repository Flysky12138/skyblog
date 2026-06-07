import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

/**
 * 自动检测并解析粘贴的 Markdown 文本
 *
 * @see https://tiptap.dev/docs/editor/markdown/examples#paste-markdown-detection
 */
export const MarkdownPaste = Extension.create({
  name: 'markdownPaste',

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData('text/plain')

            if (!text) {
              return false
            }

            if (editor.markdown && looksLikeMarkdown(text)) {
              const json = editor.markdown.parse(text)
              editor.commands.insertContent(json)

              return true
            }

            return false
          }
        }
      })
    ]
  }
})

// Simple heuristic: check for Markdown syntax
const looksLikeMarkdown = (text: string) => {
  return (
    /^#{1,6}\s/.test(text) || // Headings
    /\*\*[^*]+\*\*/.test(text) || // Bold
    /\[.+\]\(.+\)/.test(text) || // Links
    /^[-*+]\s/.test(text) // Lists
  )
}
