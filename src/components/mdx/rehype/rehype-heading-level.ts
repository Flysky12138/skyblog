import { Root } from 'hast'
import { visit } from 'unist-util-visit'

class Stack {
  #tags: {
    h: number
    order: number[]
  }[]

  constructor() {
    this.#tags = []
  }

  /**
   * 传入标题标签名，返回序号
   * @example
   * add('h2') // 1
   * add('h3') // 1.1
   * add('h3') // 1.2
   */
  add(tag: string) {
    const h = Number.parseInt(tag.match(/\d+/)?.[0] || '')
    if (Number.isNaN(h)) return ''

    let top = this.#tags.at(-1)

    while ((top?.h || -1) > h) {
      top = this.#tags.pop()
    }

    if (!top) {
      this.#tags.push({ h, order: [1] })
      return '1'
    }

    const order = top.order.slice()
    if (top.h == h) order.push(order.pop()! + 1)
    if (top.h < h) order.push(1)
    this.#tags.push({ h, order })
    return order.join('.')
  }
}

/**
 * 标题标签层级关系属性名
 */
export const HEADING_ATTRIBUTE = 'data-level'

/**
 * 给标题标签添加包含层级关系的属性
 */
export const rehypeHeadingOrder = () => {
  return (tree: Root) => {
    const stack = new Stack()
    visit(tree, 'element', node => {
      if (node.tagName.startsWith('h')) {
        Reflect.set(node.properties, HEADING_ATTRIBUTE, stack.add(node.tagName))
      }
    })
  }
}
