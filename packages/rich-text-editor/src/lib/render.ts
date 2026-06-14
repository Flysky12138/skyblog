import { Extensions, findChildren, getSchemaByResolvedExtensions, JSONContent, resolveExtensions } from '@tiptap/core'
import { generateJSON } from '@tiptap/html'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { renderToHTMLString, serializeAttrsToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import { renderToString } from 'katex'

import { CodeBlockShikiAttributes } from '../extensions/code-block-shiki'
import { ExtensionKit } from '../extensions/index'
import { defaultDarkTheme, defaultLanguage, defaultLightTheme, highlightCode } from './highlighter'

/**
 * 将 HTML 字符串渲染为 HTML 字符串
 */
export async function renderHTMLStringToHTMLString(html: string, extensions: Extensions = [ExtensionKit]) {
  const resolvedExtensions = resolveExtensions(extensions)
  const json = generateJSON(html, resolvedExtensions)
  return renderJSONContentToHTMLString(json, { extensions: resolvedExtensions })
}

/**
 * 将 JSON 内容渲染为 HTML 字符串
 */
export async function renderJSONContentToHTMLString(
  content: JSONContent | ProseMirrorNode,
  options?: {
    extensions?: Extensions
  }
) {
  const { extensions = [ExtensionKit] } = options ?? {}

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

  const highlighted = await highlightCodeBlocks(pmNode)

  return renderToHTMLString({
    content: pmNode,
    extensions,
    options: {
      nodeMapping: {
        blockMath: ({ node }) => {
          return `<div class="tiptap-mathematics-render" data-type="block-math">${renderToString(node.attrs.latex as string)}</div>`
        },
        codeBlock: ({ node }) => {
          return highlighted.get(node) ?? `<pre><code>${node.attrs.content}</code></pre>`
        },
        inlineMath: ({ node }) => {
          return `<span class="tiptap-mathematics-render" data-type="inline-math">${renderToString(node.attrs.latex as string)}</span>`
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

/**
 * 将 Markdown 内容渲染为 HTML 字符串
 */
export async function renderMarkdownToHTMLString(markdown: string, extensions: Extensions = [ExtensionKit]) {
  const resolvedExtensions = resolveExtensions(extensions)
  const json = generateJSON(markdown, resolvedExtensions)
  return renderJSONContentToHTMLString(json, { extensions: resolvedExtensions })
}

/**
 * 预高亮文档中所有 `codeBlock` 节点
 */
async function highlightCodeBlocks(pmNode: ProseMirrorNode) {
  const highlighted = new WeakMap<ProseMirrorNode, null | string>()
  const tasks: Promise<void>[] = []

  for (const { node } of findChildren(pmNode, child => child.type.name === 'codeBlock')) {
    const {
      darkTheme = defaultDarkTheme,
      language = defaultLanguage,
      lightTheme = defaultLightTheme
    } = node.attrs as Partial<CodeBlockShikiAttributes>

    const task = highlightCode(node.textContent, {
      lang: language,
      themes: { dark: darkTheme, light: lightTheme }
    })
      .then(html =>
        html.replace(
          '<pre',
          `<pre ${serializeAttrsToHTMLString({
            'data-dark-theme': darkTheme,
            'data-language': language,
            'data-light-theme': lightTheme
          })}`
        )
      )
      .catch(() => null)

    tasks.push(
      task.then(html => {
        highlighted.set(node, html)
      })
    )
  }

  await Promise.all(tasks)

  return highlighted
}
