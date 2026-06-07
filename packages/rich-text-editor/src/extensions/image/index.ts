import { Attribute, mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { omit } from 'es-toolkit'

import { ImageView } from '../../components/view/image-view'

export interface ImageAttributes {
  alt: null | string
  height: null | number
  src: null | string
  /**
   * `@tiptap/extension-text-align` 注册的全局属性
   */
  textAlign?: React.CSSProperties['textAlign']
  title: null | string
  width: null | number
  /**
   * 是否宽度 100%
   */
  widthFull: boolean
}

export interface ImageOptions {
  /**
   * 添加到图片元素的 HTML 属性
   *
   * @default {}
   */
  HTMLAttributes: Record<string, string>
}

export interface SetImageOptions {
  alt?: string
  height?: number
  src: string
  title?: string
  width?: number
  widthFull?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: SetImageOptions) => ReturnType
    }
  }
}

const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const Image = Node.create<ImageOptions>({
  draggable: true,
  group: 'block',
  name: 'image',

  addAttributes() {
    return {
      alt: {
        default: null,
        parseHTML: el => el.getAttribute('alt')
      },
      height: {
        default: null,
        parseHTML: el => {
          const v = el.getAttribute('height')
          return v ? Number(v) : null
        }
      },
      src: {
        default: null,
        parseHTML: el => el.getAttribute('src')
      },
      title: {
        default: null,
        parseHTML: el => el.getAttribute('title')
      },
      width: {
        default: null,
        parseHTML: el => {
          const v = el.getAttribute('width')
          return v ? Number(v) : null
        }
      },
      widthFull: {
        default: false,
        parseHTML: el => el.getAttribute('data-width-full') === 'true'
      }
    } satisfies Record<Exclude<keyof ImageAttributes, 'textAlign'>, Attribute>
  },

  addCommands() {
    return {
      setImage: options => {
        return ({ commands }) => {
          return commands.insertContent({ attrs: options, type: this.name })
        }
      }
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match
          return { alt, src, title }
        }
      })
    ]
  },

  addNodeView() {
    return ImageView
  },

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  parseMarkdown: (token: { href?: string; text?: string; title?: string }, helpers) => {
    return helpers.createNode('image', {
      alt: token.text ?? '',
      src: token.href ?? '',
      title: token.title ?? ''
    })
  },

  renderHTML({ HTMLAttributes, node }) {
    const { textAlign, widthFull } = node.attrs as ImageAttributes

    return [
      'img',
      mergeAttributes(omit(HTMLAttributes, ['widthFull']), this.options.HTMLAttributes, {
        'data-image-align': textAlign,
        'data-width-full': widthFull ? 'true' : undefined,
        decoding: 'async',
        loading: 'lazy'
      })
    ]
  },

  renderMarkdown: node => {
    const src = String(node.attrs?.src ?? '')
    const alt = String(node.attrs?.alt ?? '')
    const title = String(node.attrs?.title ?? '')

    return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`
  }
})
