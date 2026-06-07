// @ts-nocheck
import { ResizableNodeDimensions, ResizableNodeView, ResizableNodeViewDirection } from '@tiptap/core'

/**
 * 继承 ResizableNodeView，重写 applyInitialSize / handleResize，
 * 将 width/height 设为标签属性而非内联样式，避免 style 污染
 *
 * typescript 提示错误，请忽略
 */
export class ImageResizableNodeView extends ResizableNodeView {
  private activeHandle: null | ResizableNodeViewDirection = null
  private isShiftKeyPressed = false

  private applyConstraints(width: number, height: number, preserveAspectRatio: boolean): ResizableNodeDimensions

  private applyInitialSize(): void {
    const width = this.node.attrs.width as number | undefined
    const height = this.node.attrs.height as number | undefined

    if (width) {
      this.element.setAttribute('width', String(width))
      this.initialWidth = width
    } else {
      this.initialWidth = this.element.offsetWidth
    }

    if (height) {
      this.element.setAttribute('height', String(height))
      this.initialHeight = height
    } else {
      this.initialHeight = this.element.offsetHeight
    }

    if (this.initialWidth > 0 && this.initialHeight > 0) {
      this.aspectRatio = this.initialWidth / this.initialHeight
    }
  }

  private calculateNewDimensions(direction: ResizableNodeViewDirection, deltaX: number, deltaY: number): ResizableNodeDimensions

  private handleResize(deltaX: number, deltaY: number) {
    if (!this.activeHandle) return

    const shouldPreserveAspectRatio = this.preserveAspectRatio || this.isShiftKeyPressed
    const { height, width } = this.calculateNewDimensions(this.activeHandle, deltaX, deltaY)
    const constrained = this.applyConstraints(width, height, shouldPreserveAspectRatio)

    this.element.setAttribute('width', String(constrained.width))
    this.element.setAttribute('height', String(constrained.height))

    if (this.onResize) {
      this.onResize(constrained.width, constrained.height)
    }
  }
}
