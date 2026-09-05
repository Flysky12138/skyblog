import OfficePaste from '@intevation/tiptap-extension-office-paste'
import { Extension, Extensions, Mark, Node } from '@tiptap/core'
import { Emoji, EmojiOptions } from '@tiptap/extension-emoji'
import { Highlight, HighlightOptions } from '@tiptap/extension-highlight'
import { TaskItem, TaskItemOptions, TaskList, TaskListOptions } from '@tiptap/extension-list'
import { Mathematics, MathematicsOptions } from '@tiptap/extension-mathematics'
import { Subscript, SubscriptExtensionOptions } from '@tiptap/extension-subscript'
import { Superscript, SuperscriptExtensionOptions } from '@tiptap/extension-superscript'
import { TableKit, TableKitOptions } from '@tiptap/extension-table'
import { TextAlign, TextAlignOptions } from '@tiptap/extension-text-align'
import { TextStyleKit, TextStyleKitOptions } from '@tiptap/extension-text-style'
import { Typography, TypographyOptions } from '@tiptap/extension-typography'
import { Placeholder, PlaceholderOptions } from '@tiptap/extensions'
import { Markdown, MarkdownExtensionOptions } from '@tiptap/markdown'
import { StarterKit, StarterKitOptions } from '@tiptap/starter-kit'
import { cloneDeep, mapValues, mergeWith } from 'es-toolkit'

import { getMathClickHandler } from '../lib/dialog-bridge/math-dialog-bridge'
import { CodeBlockShiki, CodeBlockShikiOptions } from './code-block-shiki'
import { Excalidraw } from './excalidraw'
import { Image, ImageOptions } from './image'
import { ImageUploadPlaceholder, ImageUploadPlaceholderOptions } from './image-upload-placeholder'
import { InsertLine } from './insert-line'
import { MarkdownPaste } from './markdown-paste'
import { SearchAndReplace, SearchAndReplaceOptions } from './search-and-replace'
import { TableStyle, TableStyleOptions } from './table-style'

export interface ExtensionKitOptions {
  codeBlockShiki: false | Partial<CodeBlockShikiOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/nodes/emoji
   */
  emoji: false | Partial<EmojiOptions>
  excalidraw: false
  /**
   * @see https://tiptap.dev/docs/editor/extensions/marks/highlight
   */
  highlight: false | Partial<HighlightOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/nodes/image
   */
  image: false | Partial<ImageOptions>
  imageUploadPlaceholder: false | Partial<ImageUploadPlaceholderOptions>
  insertLine: false
  /**
   * @see https://tiptap.dev/docs/editor/markdown
   */
  markdown: false | Partial<MarkdownExtensionOptions>
  markdownPaste: false
  /**
   * @see https://tiptap.dev/docs/editor/extensions/nodes/mathematics
   */
  math: false | Partial<MathematicsOptions>
  officePaste: false
  /**
   * @see https://tiptap.dev/docs/editor/extensions/functionality/placeholder
   */
  placeholder: false | Partial<PlaceholderOptions>
  searchAndReplacePlugin: false | Partial<SearchAndReplaceOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/functionality/starterkit
   */
  starterKit: false | Partial<StarterKitOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/marks/subscript
   */
  subscript: false | Partial<SubscriptExtensionOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/marks/superscript
   */
  superscript: false | Partial<SuperscriptExtensionOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/functionality/table-kit
   */
  tableKit: false | Partial<TableKitOptions>
  tableStyle: false | Partial<TableStyleOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/nodes/task-item
   */
  taskItem: false | Partial<TaskItemOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/nodes/task-list
   */
  taskList: false | Partial<TaskListOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/functionality/textalign
   */
  textAlign: false | Partial<TextAlignOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/functionality/text-style-kit
   */
  textStyleKit: false | Partial<TextStyleKitOptions>
  /**
   * @see https://tiptap.dev/docs/editor/extensions/functionality/typography
   */
  typography: false | Partial<TypographyOptions>
}

type ExtensionKitConfig = {
  [K in keyof ExtensionKitOptions]: {
    option: ((customOptions: Partial<ExtensionKitOptions>) => Exclude<ExtensionKitOptions[K], false>) | ExtensionKitOptions[K]
    target: Extension | Mark | Node
  }
}

const extensionKitConfig: ExtensionKitConfig = {
  codeBlockShiki: {
    option: {},
    target: CodeBlockShiki
  },
  emoji: {
    target: Emoji,
    option: {
      enableEmoticons: true
    }
  },
  excalidraw: {
    option: false,
    target: Excalidraw
  },
  highlight: {
    target: Highlight,
    option: {
      multicolor: true
    }
  },
  image: {
    target: Image,
    option: {
      HTMLAttributes: {
        'data-fancybox': ''
      }
    }
  },
  imageUploadPlaceholder: {
    option: {},
    target: ImageUploadPlaceholder
  },
  insertLine: {
    option: false,
    target: InsertLine
  },
  markdown: {
    target: Markdown,
    option: {
      indentation: {
        size: 2,
        style: 'tab'
      },
      markedOptions: {
        gfm: true
      }
    }
  },
  markdownPaste: {
    option: false,
    target: MarkdownPaste
  },
  math: {
    target: Mathematics,
    option: {
      blockOptions: {
        onClick(node, pos) {
          getMathClickHandler()?.({ node, pos })
        }
      },
      inlineOptions: {
        onClick(node, pos) {
          getMathClickHandler()?.({ node, pos })
        }
      },
      katexOptions: {
        output: 'html',
        throwOnError: false
      }
    }
  },
  officePaste: {
    option: false,
    target: OfficePaste
  },
  placeholder: {
    target: Placeholder,
    option: {
      placeholder: 'Write something …'
    }
  },
  searchAndReplacePlugin: {
    option: {},
    target: SearchAndReplace
  },
  starterKit: {
    target: StarterKit,
    option: options => ({
      codeBlock: options.codeBlockShiki === false ? {} : false,
      link: {
        enableClickSelection: true,
        openOnClick: false
      }
    })
  },
  subscript: {
    option: {},
    target: Subscript
  },
  superscript: {
    option: {},
    target: Superscript
  },
  tableKit: {
    target: TableKit,
    option: {
      table: {
        cellMinWidth: 120,
        renderWrapper: true,
        resizable: true
      }
    }
  },
  tableStyle: {
    option: {},
    target: TableStyle
  },
  taskItem: {
    target: TaskItem,
    option: {
      nested: true
    }
  },
  taskList: {
    option: {},
    target: TaskList
  },
  textAlign: {
    target: TextAlign,
    option: {
      alignments: ['start', 'center', 'end', 'justify', 'left', 'right'],
      types: ['heading', 'paragraph', 'image', 'excalidraw']
    }
  },
  textStyleKit: {
    option: {},
    target: TextStyleKit
  },
  typography: {
    option: {},
    target: Typography
  }
}

/**
 * 与默认插件配置合并
 */
export function mergeExtensionKitOptionsWithDefault(customOptions: Partial<ExtensionKitOptions>) {
  return mapValues(extensionKitConfig, ({ option }, name) => {
    const defaultExtensionOption = (typeof option === 'function' ? option(customOptions) : cloneDeep(option)) || {}

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return mergeWith(defaultExtensionOption, customOptions[name] || {}, (defaultValue, sourceValue, key) => {
      // 这个插件的事件需要保留双方内容，不使用覆盖
      if (name === 'math' && typeof defaultValue === 'function' && key === 'onClick') {
        type OnClickType = NonNullable<NonNullable<MathematicsOptions['blockOptions']>['onClick']>
        return ((...args) => {
          Reflect.apply(defaultValue as OnClickType, undefined, args)
          Reflect.apply(sourceValue as OnClickType, undefined, args)
        }) as OnClickType
      }
    })
  })
}

/**
 * 插件合集，带默认配置
 */
export const ExtensionKit = Extension.create<ExtensionKitOptions>({
  name: 'extension-kit',

  addExtensions() {
    const extensions: Extensions = []

    const options = mergeExtensionKitOptionsWithDefault(this.options)

    for (const [name, option] of Object.entries(extensionKitConfig) as [keyof ExtensionKitConfig, ValueOf<ExtensionKitConfig>][]) {
      // 用户主动禁用这个插件
      if (this.options[name] === false) continue

      extensions.push(option.target.configure(options[name]))
    }

    return extensions
  }
})
