import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { Attribute, mergeAttributes, Node } from '@tiptap/core'
import { omit } from 'es-toolkit'

import { ExcalidrawView } from '../../components/view/excalidraw-view'

export interface ExcalidrawAttributes {
  elements: ExcalidrawElement[]
  height?: number
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
        parseHTML: el => {
          const svg = el.querySelector('svg')
          const h = svg?.getAttribute('height')
          return h ? Number(h) : null
        }
      },
      width: {
        default: null,
        parseHTML: el => {
          const svg = el.querySelector('svg')
          const w = svg?.getAttribute('width')
          return w ? Number(w) : null
        }
      }
    } satisfies Record<Exclude<keyof ExcalidrawAttributes, 'textAlign'>, Attribute>
  },

  addCommands() {
    return {
      insertExcalidraw: (attrs: ExcalidrawAttributes) => {
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

    const attrs = mergeAttributes(omit(HTMLAttributes, ['elements', 'height', 'width']), {
      'data-excalidraw-align': textAlign,
      'data-type': 'excalidraw'
    })

    if (Array.isArray(elements) && elements.length > 0) {
      return ['div', attrs, ['script', { type: 'application/json' }, JSON.stringify(elements)]]
    }

    return ['div', attrs]
  }
})
