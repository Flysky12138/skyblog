import { Extensions, getSchemaByResolvedExtensions, JSONContent, resolveExtensions } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import { groupBy, mapValues } from 'es-toolkit'
import { renderToString } from 'katex'

import { ExtensionKitOptions } from '../../extensions'
import { ExcalidrawAttributes } from '../../extensions/excalidraw'
import { renderCodeBlocks } from './code-block-render'

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

  // 高亮代码块
  const highlighted = await renderCodeBlocks(pmNode)

  // 所有插件的配置项
  const extensionsOptions = mapValues(
    groupBy(resolvedExtensions, item => item.name),
    item => item[0].options as false
  )

  return renderToHTMLString({
    content: pmNode,
    extensions,
    options: {
      nodeMapping: {
        codeBlock: ({ node }) => highlighted.get(node) ?? `<pre><code>${node.attrs.content}</code></pre>`,
        blockMath: ({ node }) => {
          const tex = node.attrs.latex as string
          const mathOptions = extensionsOptions.Mathematics as ExtensionKitOptions['math']
          if (!mathOptions) return ''
          return `<div data-type="block-math">${renderToString(tex, mathOptions.katexOptions)}</div>`
        },
        excalidraw: ({ node }) => {
          const { html, textAlign } = node.attrs as ExcalidrawAttributes
          return html ? `<div data-type="excalidraw" data-excalidraw-align="${textAlign}">${html}</div>` : ''
        },
        inlineMath: ({ node }) => {
          const tex = node.attrs.latex as string
          const mathOptions = extensionsOptions.Mathematics as ExtensionKitOptions['math']
          if (!mathOptions) return ''
          return `<span data-type="inline-math">${renderToString(tex, mathOptions.katexOptions)}</span>`
        }
      },
      unhandledMark: () => '',
      unhandledNode: () => ''
    }
  })
}
