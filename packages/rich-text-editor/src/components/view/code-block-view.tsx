'use client'

import { useLatestRef } from '@repo/react-hooks'
import { Skeleton } from '@repo/ui/components/skeleton'
import { NodeViewContent, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import React from 'react'

import { CodeBlockShikiAttributes } from '../../extensions/code-block-shiki'
import { highlightCode } from '../../lib/shiki/highlighter'

export function CodeBlockViewInner({ editor, getPos, node }: NodeViewProps) {
  const [highlightedHtml, setHighlightedHtml] = React.useState('')

  const { darkTheme, language, lightTheme } = node.attrs as CodeBlockShikiAttributes
  const codeContent = node.textContent

  React.useEffect(() => {
    let ignore = false

    void (async () => {
      try {
        const html = await highlightCode(codeContent, {
          lang: language,
          preserveMarkers: true,
          themes: {
            dark: darkTheme,
            light: lightTheme
          }
        })
        if (!ignore) {
          setHighlightedHtml(html)
        }
      } catch {
        // 高亮失败时使用原始内容
        if (!ignore) {
          const escaped = codeContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
          setHighlightedHtml(`<pre><code>${escaped}</code></pre>`)
        }
      }
    })()

    return () => {
      ignore = true
    }
  }, [codeContent, darkTheme, language, lightTheme])

  const nodeSizeRef = useLatestRef(node.nodeSize)

  // Ctrl+A 时只选中当前代码块内的代码
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        const pos = getPos() ?? -1
        const { $from } = editor.state.selection
        const currentSize = nodeSizeRef.current

        // 检查当前选区是否在这个代码块内
        if ($from.pos >= pos && $from.pos <= pos + currentSize) {
          event.preventDefault()
          event.stopPropagation()

          // 选择当前代码块的完整内容
          editor.commands.setTextSelection({
            from: pos + 1,
            to: pos + currentSize - 1
          })
        }
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NodeViewWrapper className="relative">
      {highlightedHtml ? (
        <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} aria-hidden="true" className="pointer-events-none" contentEditable={false} />
      ) : (
        <Skeleton>
          <pre className="pointer-events-none" contentEditable={false}>
            <code>{codeContent}</code>
          </pre>
        </Skeleton>
      )}

      {/* 始终渲染可编辑层，否则会导致输入 ``` 后，光标位置错误 */}
      <div className="absolute inset-0">
        <NodeViewContent<'pre'> as="pre" className="bg-transparent text-transparent caret-foreground" spellCheck="false" />
      </div>
    </NodeViewWrapper>
  )
}

export const CodeBlockView = ReactNodeViewRenderer(CodeBlockViewInner, {
  contentDOMElementTag: 'code'
})
