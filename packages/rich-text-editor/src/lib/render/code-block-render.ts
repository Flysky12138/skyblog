import { findChildren } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { serializeAttrsToHTMLString } from '@tiptap/static-renderer/pm/html-string'

import { CodeBlockShikiAttributes } from '../../extensions/code-block-shiki'
import { defaultDarkTheme, defaultLanguage, defaultLightTheme, highlightCode } from '../shiki/highlighter'

/**
 * 预高亮文档中所有 `codeBlock` 节点
 */
export async function renderCodeBlocks(pmNode: ProseMirrorNode) {
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
