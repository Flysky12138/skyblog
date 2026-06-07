import OfficePaste from '@intevation/tiptap-extension-office-paste'
import { Extension, Extensions } from '@tiptap/core'
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

import { getMathClickHandler } from '../lib/math-dialog-bridge'
import { CodeBlockShiki, CodeBlockShikiOptions } from './code-block-shiki'
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

/**
 * 插件合集，带默认配置
 */
export const ExtensionKit = Extension.create<ExtensionKitOptions>({
  name: 'extension-kit',

  addExtensions() {
    const extensions: Extensions = []

    if (this.options.codeBlockShiki !== false) {
      extensions.push(CodeBlockShiki.configure(this.options.codeBlockShiki))
    }

    if (this.options.emoji !== false) {
      extensions.push(
        Emoji.configure(
          this.options.emoji ?? {
            enableEmoticons: true
          }
        )
      )
    }

    if (this.options.highlight !== false) {
      extensions.push(
        Highlight.configure(
          this.options.highlight ?? {
            multicolor: true
          }
        )
      )
    }

    if (this.options.image !== false) {
      extensions.push(
        Image.configure(
          this.options.image ?? {
            allowBase64: true,
            resize: {
              alwaysPreserveAspectRatio: true,
              directions: ['left', 'right'],
              enabled: true,
              minHeight: 50,
              minWidth: 50
            }
          }
        )
      )
    }

    if (this.options.imageUploadPlaceholder !== false) {
      extensions.push(ImageUploadPlaceholder.configure(this.options.imageUploadPlaceholder))
    }

    if (this.options.insertLine !== false) {
      extensions.push(InsertLine.configure(this.options.insertLine))
    }

    if (this.options.markdown !== false) {
      extensions.push(
        Markdown.configure(
          this.options.markdown ?? {
            indentation: {
              size: 2,
              style: 'tab'
            },
            markedOptions: {
              gfm: true
            }
          }
        )
      )
    }

    if (this.options.markdownPaste !== false) {
      extensions.push(MarkdownPaste)
    }

    if (this.options.math !== false) {
      const { blockOptions, inlineOptions, ...mathOptions } = this.options.math || {}
      extensions.push(
        Mathematics.configure({
          katexOptions: {
            throwOnError: false
          },
          ...mathOptions,
          blockOptions: {
            ...blockOptions,
            onClick(node, pos) {
              blockOptions?.onClick?.(node, pos)
              getMathClickHandler()?.({ node, pos })
            }
          },
          inlineOptions: {
            ...inlineOptions,
            onClick(node, pos) {
              inlineOptions?.onClick?.(node, pos)
              getMathClickHandler()?.({ node, pos })
            }
          }
        })
      )
    }

    if (this.options.officePaste !== false) {
      extensions.push(OfficePaste)
    }

    if (this.options.placeholder !== false) {
      extensions.push(
        Placeholder.configure(
          this.options.placeholder ?? {
            placeholder: 'Write something …'
          }
        )
      )
    }

    if (this.options.searchAndReplacePlugin !== false) {
      extensions.push(SearchAndReplace.configure(this.options.searchAndReplacePlugin))
    }

    if (this.options.starterKit !== false) {
      extensions.push(
        StarterKit.configure(
          this.options.starterKit ?? {
            codeBlock: this.options.codeBlockShiki === false,
            link: {
              enableClickSelection: true,
              openOnClick: false
            }
          }
        )
      )
    }

    if (this.options.subscript !== false) {
      extensions.push(Subscript.configure(this.options.subscript))
    }

    if (this.options.superscript !== false) {
      extensions.push(Superscript.configure(this.options.superscript))
    }

    if (this.options.tableKit !== false) {
      extensions.push(
        TableKit.configure(
          this.options.tableKit ?? {
            table: {
              cellMinWidth: 120,
              renderWrapper: true,
              resizable: true
            }
          }
        )
      )
    }

    if (this.options.tableStyle !== false) {
      extensions.push(TableStyle.configure(this.options.tableStyle))
    }

    if (this.options.taskItem !== false) {
      extensions.push(
        TaskItem.configure(
          this.options.taskItem ?? {
            nested: true
          }
        )
      )
    }

    if (this.options.taskList !== false) {
      extensions.push(TaskList.configure(this.options.taskList))
    }

    if (this.options.textAlign !== false) {
      extensions.push(
        TextAlign.configure(
          this.options.textAlign ?? {
            alignments: ['start', 'center', 'end', 'justify', 'left', 'right'],
            types: ['heading', 'paragraph', 'image']
          }
        )
      )
    }

    if (this.options.textStyleKit !== false) {
      extensions.push(TextStyleKit.configure(this.options.textStyleKit))
    }

    if (this.options.typography !== false) {
      extensions.push(Typography.configure(this.options.typography))
    }

    return extensions
  }
})
