import { toMerged } from 'es-toolkit'
import { Root } from 'mdast'
import { LineElement } from 'rehype-pretty-code'
import { visit } from 'unist-util-visit'

export const DATA_EXPAND_LINE = 'data-expand-line'
export const DATA_BLOCK = 'data-block'

export const rehypeCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: LineElement, _, parent: LineElement) => {
      if (node.tagName == 'code' && parent.tagName == 'pre') {
        const expand = node.data?.meta?.match(/expand(?:{(\d+)})?/)
        node.properties = toMerged(node.properties || {}, {
          [DATA_BLOCK]: 'true', // 标记为代码块
          [DATA_EXPAND_LINE]: expand?.[1] ?? (expand?.[0] ? 0 : 18) // 展开行数
        })
      }
    })
  }
}
