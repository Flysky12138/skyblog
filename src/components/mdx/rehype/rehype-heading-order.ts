import { Root } from 'mdast'
import { visit } from 'unist-util-visit'

class Stack {
  private tags: Array<{
    h: number
    order: number[]
  }>

  constructor() {
    this.tags = []
  }

  add(tag: string) {
    const h = Number.parseInt(tag.match(/\d+/)?.[0] || '')
    if (Number.isNaN(h)) return ''

    let top = this.tags.at(-1)

    while ((top?.h || -1) > h) {
      top = this.tags.pop()
    }

    if (!top) {
      this.tags.push({ h, order: [1] })
      return '1'
    }

    const _order = top.order.slice()
    if (top.h == h) _order.push(_order.pop()! + 1)
    if (top.h < h) _order.push(1)
    this.tags.push({ h, order: _order })
    return _order.join('.')
  }
}

export const headingAttr = 'data-order'

/**
 * @description 给标题标签添加包含序号的属性
 */
export const rehypeHeadingOrder = () => {
  return (tree: Root) => {
    const stack = new Stack()
    visit(tree, (node: any) => {
      if (node.tagName?.startsWith('h')) {
        Reflect.set(node.properties, headingAttr, stack.add(node.tagName))
      }
    })
  }
}
