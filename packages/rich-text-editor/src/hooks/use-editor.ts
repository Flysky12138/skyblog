import { useEditor as _useEditor } from '@tiptap/react'

import { renderJSONContentToHTMLString } from '../lib/render'

declare module '@tiptap/core' {
  interface Editor {
    /**
     * 异步版本的 getHTML，支持自定义扩展（语法高亮、Excalidraw、KaTeX 等）的完整渲染
     *
     * 插件 `renderHTML` 受限于同步代码的限制，部分渲染不能写在插件里
     */
    getHTMLAsync(): Promise<string>
  }
}

export function useEditor(...args: Parameters<typeof _useEditor>) {
  const editor = _useEditor(...args)

  if (!editor) return null

  editor.getHTMLAsync = async () => {
    const json = editor.getJSON()
    const extensions = editor.extensionManager.baseExtensions
    return renderJSONContentToHTMLString(json, { extensions })
  }

  return editor
}
