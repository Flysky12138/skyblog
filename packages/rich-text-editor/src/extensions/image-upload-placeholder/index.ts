import { Node } from '@tiptap/core'

import { ImageUploadPlaceholderView } from '../../components/view/image-upload-placeholder-view'
import { SetImageOptions } from '../image'

export interface ImageUploadPlaceholderOptions {
  /**
   * 上传图片的回调函数。默认将文件读取为 data URL
   */
  onUpload?: (file: File) => Promise<SetImageOptions> | SetImageOptions
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      /**
       * 插入图片上传占位节点
       */
      setImageUpload: () => ReturnType
    }
  }
}

/**
 * 图片上传占位节点
 *
 * 用于在编辑器中插入一个临时的图片上传 UI（拖拽/选择文件），
 * 选择文件后自动替换为真实的 `image` 节点。
 */
export const ImageUploadPlaceholder = Node.create<ImageUploadPlaceholderOptions>({
  atom: true,
  draggable: true,
  group: 'block',
  name: 'imageUploadPlaceholder',
  priority: 900,

  addCommands() {
    return {
      setImageUpload: () => {
        return ({ commands }) => {
          return commands.insertContent({ type: this.name })
        }
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-i': () => {
        return this.editor.commands.setImageUpload()
      }
    }
  },

  addNodeView() {
    return ImageUploadPlaceholderView({ onUpload: this.options.onUpload })
  },

  addOptions() {
    return {
      onUpload: undefined
    }
  }
})
