import { Extensions, getSchemaByResolvedExtensions, JSONContent, resolveExtensions } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import { renderToString } from 'katex'

import { renderCodeBlocks } from './code-block-render'
import { renderExcalidrawNodes } from './excalidraw-render'

/**
 * 将 JSON 内容渲染为 HTML 字符串
 */
export async function renderJSONContentToHTMLString(
  content: JSONContent | ProseMirrorNode,
  options: {
    extensions: Extensions
  }
) {
  const { extensions } = options

  // 统一转换为 ProseMirror Node
  const resolvedExtensions = resolveExtensions(extensions)
  const schema = getSchemaByResolvedExtensions(resolvedExtensions)
  let pmNode = content instanceof ProseMirrorNode ? content : ProseMirrorNode.fromJSON(schema, content)

  // 移除末尾的空白段落
  const paragraphType = schema.nodes.paragraph
  if (paragraphType && pmNode.lastChild?.type === paragraphType && pmNode.lastChild.content.size === 0) {
    const { content } = pmNode
    const lastChildSize = content.child(content.childCount - 1).nodeSize
    pmNode = pmNode.copy(content.cut(0, content.size - lastChildSize))
  }

  const highlighted = await renderCodeBlocks(pmNode)
  const excalidrawSvgs = await renderExcalidrawNodes(pmNode)

  return renderToHTMLString({
    content: pmNode,
    extensions,
    options: {
      nodeMapping: {
        blockMath: ({ node }) => {
          return `<div data-type="block-math">${renderToString(node.attrs.latex as string)}</div>`
        },
        codeBlock: ({ node }) => {
          return highlighted.get(node) ?? `<pre><code>${node.attrs.content}</code></pre>`
        },
        excalidraw: ({ node }) => {
          return excalidrawSvgs.get(node) ?? ''
        },
        inlineMath: ({ node }) => {
          return `<span data-type="inline-math">${renderToString(node.attrs.latex as string)}</span>`
        }
      },
      unhandledMark: () => {
        return ''
      },
      unhandledNode: () => {
        return ''
      }
    }
  })
}
