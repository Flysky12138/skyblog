import { toMerged } from 'es-toolkit'
import { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

export const DATA_EXPAND_LINE = 'data-expand-line'
export const DATA_IS_BLOCK = 'data-is-block'

export const rehypeCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node, _, parent) => {
      if (node.tagName == 'code' && (parent as Element | undefined)?.tagName == 'pre') {
        const expand = node.data?.meta?.match(/expand({(?<lines>\d+)})?/)
        node.properties = toMerged(node.properties || {}, {
          [DATA_EXPAND_LINE]: expand?.groups?.lines ?? (expand?.[0] ? 0 : 18), // 展开行数；不包含 expand 默认展开 18 行
          [DATA_IS_BLOCK]: '' // 标记为代码块
        })
      }
    })
  }
}
