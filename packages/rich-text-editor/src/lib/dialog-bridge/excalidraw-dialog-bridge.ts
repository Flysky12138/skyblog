import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'

export interface ExcalidrawEditPayload {
  /**
   * 已有画板的 elements
   */
  elements: readonly ExcalidrawElement[]
  /**
   * 节点在文档中的位置
   */
  pos: number
}

type ExcalidrawEditHandler = (payload: ExcalidrawEditPayload) => void

let handler: ExcalidrawEditHandler | null = null

export function getExcalidrawEditHandler() {
  return handler
}

export function setExcalidrawEditHandler(fn: ExcalidrawEditHandler | null) {
  handler = fn
}
