import { toMerged } from 'es-toolkit'
import { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

export const DATA_IS_BLOCK = 'data-is-block'
export const DATA_IS_COLLAPSED = 'data-is-collapsed'

export const rehypeCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node, _, parent) => {
      if (node.tagName == 'code' && (parent as Element | undefined)?.tagName == 'pre') {
        node.properties = toMerged(node.properties || {}, {
          [DATA_IS_BLOCK]: true, // 标记为代码块
          [DATA_IS_COLLAPSED]: node.data?.meta?.includes('collapsed') // 标记为收缩状态
        })
      }
    })
  }
}
