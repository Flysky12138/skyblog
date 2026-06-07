'use client'

import { FileSelect } from '@repo/ui/components-self/file-select'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { ImageUpIcon } from 'lucide-react'

import { SetImageOptions } from '../../extensions/image'
import { ImageUploadPlaceholderOptions } from '../../extensions/image-upload-placeholder'

interface ImageUploadViewProps extends ImageUploadPlaceholderOptions, NodeViewProps {}

export function ImageUploadPlaceholderView({ onUpload }: ImageUploadPlaceholderOptions) {
  return ReactNodeViewRenderer(props => <ImageUploadPlaceholderViewInner {...props} onUpload={onUpload} />)
}

function ImageUploadPlaceholderViewInner({ editor, getPos, node, onUpload }: ImageUploadViewProps) {
  const handleFile = async (file: File) => {
    const pos = getPos()
    if (typeof pos !== 'number') return

    let options: SetImageOptions

    if (onUpload) {
      options = await onUpload(file)
    } else {
      // 默认行为：读取为 data URL
      options = await new Promise<SetImageOptions>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          return resolve({
            alt: file.name,
            src: reader.result as string,
            title: file.name
          })
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    // 占位符 → 真实图片
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .insertContentAt(pos, { attrs: options, type: 'image' })
      .run()
  }

  return (
    <NodeViewWrapper contentEditable={false}>
      <FileSelect
        data-drag-handle
        accept="image/*"
        className="select-none"
        logo={ImageUpIcon}
        onChange={file => {
          void handleFile(file[0])
        }}
      />
    </NodeViewWrapper>
  )
}
