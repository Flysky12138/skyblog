import { findChildren } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { serializeAttrsToHTMLString } from '@tiptap/static-renderer/pm/html-string'

import { CodeBlockShikiAttributes } from '../../extensions/code-block-shiki'
import { highlightCode, SHIKI_DEFAULT_DARK_THEME, SHIKI_DEFAULT_LANGUAGE, SHIKI_DEFAULT_LIGHT_THEME } from '../shiki'

/**
 * 预高亮文档中所有 `codeBlock` 节点
 */
export async function renderCodeBlocks(pmNode: ProseMirrorNode) {
  const highlighted = new WeakMap<ProseMirrorNode, null | string>()
  const tasks: Promise<void>[] = []

  for (const { node } of findChildren(pmNode, child => child.type.name === 'codeBlock')) {
    const {
      darkTheme = SHIKI_DEFAULT_DARK_THEME,
      language = SHIKI_DEFAULT_LANGUAGE,
      lightTheme = SHIKI_DEFAULT_LIGHT_THEME,
      showLineNumbers = false
    } = node.attrs as Partial<CodeBlockShikiAttributes>

    const task = highlightCode(node.textContent, {
      lang: language,
      showLineNumbers,
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
