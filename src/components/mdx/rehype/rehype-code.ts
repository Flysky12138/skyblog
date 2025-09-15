import { toMerged } from 'es-toolkit'
import { Root } from 'hast'
import { visit } from 'unist-util-visit'

export const DATA_IS_BLOCK = 'data-is-block'
export const DATA_IS_COLLAPSED = 'data-is-collapsed'

/**
 * 给 `code` 标签添加额外属性
 */
export const rehypeCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node, _, parent) => {
      if (node.tagName == 'code' && parent?.type == 'element' && parent.tagName == 'pre') {
        node.properties = toMerged(node.properties || {}, {
          [DATA_IS_BLOCK]: true, // 标记为代码块
          [DATA_IS_COLLAPSED]: node.data?.meta?.includes('collapsed') // 标记为收缩状态
        })
      }
    })
  }
}
