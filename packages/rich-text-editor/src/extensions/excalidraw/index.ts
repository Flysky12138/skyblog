import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { Attribute, mergeAttributes, Node } from '@tiptap/core'

import { ExcalidrawView } from '../../components/view/excalidraw-view'

export interface ExcalidrawAttributes {
  elements: ExcalidrawElement[]
  height?: number
  /**
   * 渲染后的 HTML 字符串
   */
  html?: null | string
  /**
   * `@tiptap/extension-text-align` 注册的全局属性
   */
  textAlign?: React.CSSProperties['textAlign']
  width?: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    excalidraw: {
      /**
       * 插入一个 Excalidraw 画板节点
       */
      insertExcalidraw: (attrs: ExcalidrawAttributes) => ReturnType
    }
  }
}

export const Excalidraw = Node.create({
  atom: true,
  draggable: true,
  group: 'block',
  name: 'excalidraw',

  addAttributes() {
    return {
      elements: {
        default: [],
        renderHTML: () => null,
        parseHTML: el => {
          const script = el.querySelector('script[type="application/json"]')
          if (!script) return []
          try {
            return JSON.parse(script.textContent ?? '[]') as ExcalidrawElement[]
          } catch {
            return []
          }
        }
      },
      height: {
        default: null,
        renderHTML: () => null,
        parseHTML: el => {
          const svg = el.querySelector('svg')
          const h = svg?.getAttribute('height')
          return h ? Number(h) : null
        }
      },
      html: {
        default: null,
        renderHTML: () => null
      },
      width: {
        default: null,
        renderHTML: () => null,
        parseHTML: el => {
          const svg = el.querySelector('svg')
          const w = svg?.getAttribute('width')
          return w ? Number(w) : null
        }
      }
    } satisfies Partial<Record<keyof ExcalidrawAttributes, Attribute>>
  },

  addCommands() {
    return {
      insertExcalidraw: attrs => {
        return ({ commands }) => {
          return commands.insertContent({ attrs, type: this.name })
        }
      }
    }
  },

  addNodeView() {
    return ExcalidrawView
  },

  parseHTML() {
    return [{ tag: 'div[data-type="excalidraw"]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { elements, textAlign } = node.attrs as ExcalidrawAttributes

    const attrs = mergeAttributes(HTMLAttributes, {
      'data-excalidraw-align': textAlign,
      'data-type': 'excalidraw'
    })

    if (Array.isArray(elements) && elements.length > 0) {
      return ['div', attrs, ['script', { type: 'application/json' }, JSON.stringify(elements)]]
    }

    return ['div', attrs]
  }
})
