import { Node } from '@tiptap/pm/model'

export interface MathClickPayload {
  node: Node
  pos: number
}

type MathClickHandler = (payload: MathClickPayload) => void

let handler: MathClickHandler | null = null

export function getMathClickHandler() {
  return handler
}

export function setMathClickHandler(fn: MathClickHandler | null) {
  handler = fn
}
