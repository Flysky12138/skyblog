import { mergeAttributes } from '@tiptap/core'
import ImageExtension from '@tiptap/extension-image'

import { ImageResizableNodeView } from './utils/core'

export type { ImageOptions } from '@tiptap/extension-image'

/**
 * 扩展 `@tiptap/extension-image`
 *
 * 支持：
 * - textAlign 居中
 * - 将 `width`/`height` 从 style 移到标签属性上
 *
 * 问题：启用 resize 后，ResizableNodeView 创建容器 `<div data-resize-container style="display: flex">`，
 * 但 HTMLAttributes（含 `text-align` style）被贴到了内部 `<img>` 上，对块级元素无效。
 *
 * 解决：
 * - renderHTML：当有 `text-align` 时，用 `margin-inline` 对齐
 * - addNodeView：把 textAlign 映射到容器的 `justify-content` 上
 */
export const Image = ImageExtension.extend({
  addNodeView() {
    if (!this.options.resize || !this.options.resize.enabled || typeof document === 'undefined') {
      return null
    }

    const { alwaysPreserveAspectRatio, directions, minHeight, minWidth } = this.options.resize

    return ({ editor, getPos, HTMLAttributes, node }) => {
      const el = document.createElement('img')

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value != null) {
          el.setAttribute(key, String(value))
        }
      })

      const nodeView = new ImageResizableNodeView({
        editor,
        element: el,
        getPos,
        node,
        options: {
          directions,
          preserveAspectRatio: alwaysPreserveAspectRatio === true,
          min: {
            height: minHeight,
            width: minWidth
          }
        },
        onCommit: (width, height) => {
          const pos = getPos()
          if (pos === undefined) return
          editor.chain().setNodeSelection(pos).updateAttributes(this.name, { height, width }).run()
        },
        onUpdate: updatedNode => {
          if (updatedNode.type !== node.type) {
            return false
          }

          // 同步 textAlign → 容器的 justify-content
          const textAlign = updatedNode.attrs.textAlign as React.CSSProperties['textAlign']
          if (textAlign && textAlign !== 'start') {
            nodeView.dom.style.justifyContent = textAlign
          } else {
            nodeView.dom.style.justifyContent = ''
          }

          return true
        }
      })

      // 初始应用 textAlign
      const textAlign = node.attrs.textAlign as React.CSSProperties['textAlign']
      if (textAlign && textAlign !== 'start') {
        nodeView.dom.style.justifyContent = textAlign
      }

      // 当图像加载完成后，显示节点视图以获取正确的尺寸。
      const dom = nodeView.dom
      dom.style.visibility = 'hidden'
      dom.style.pointerEvents = 'none'

      el.onload = () => {
        dom.style.visibility = ''
        dom.style.pointerEvents = ''
      }

      el.ondblclick = () => {
        const pos = getPos()
        if (pos === undefined) return
        editor.chain().setNodeSelection(pos).updateAttributes(this.name, { height: null, width: null }).run()
        el.removeAttribute('width')
        el.removeAttribute('height')
      }

      return nodeView
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    // textAlign 是 `@tiptap/extension-text-align` 注册的全局属性
    const textAlign = node.attrs.textAlign as React.CSSProperties['textAlign']

    const alignStyle = (() => {
      switch (textAlign) {
        case 'center':
          return 'margin-inline: auto'
        case 'end':
          return 'margin-inline-start: auto'
        case 'left':
          return 'margin-right: auto'
        case 'right':
          return 'margin-left: auto'
        default:
          return null
      }
    })()

    const { style, ...rest } = HTMLAttributes as { style?: string }

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-fancybox': '',
        decoding: 'async',
        loading: 'lazy',
        style: [style, alignStyle].filter(Boolean).join('; ') || undefined,
        ...rest
      })
    ]
  }
})
