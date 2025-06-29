import { toMerged } from 'es-toolkit'
import { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

export const DATA_IS_BLOCK = 'data-is-block'
export const DATA_EXPANDED = 'data-expanded'

export const rehypeCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node, _, parent) => {
      if (node.tagName == 'code' && (parent as Element | undefined)?.tagName == 'pre') {
        node.properties = toMerged(node.properties || {}, {
          [DATA_EXPANDED]: node.data?.meta?.includes('expand'), // 展开
          [DATA_IS_BLOCK]: '' // 标记为代码块
        })
      }
    })
  }
}
