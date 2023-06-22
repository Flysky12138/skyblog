import { Root } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * 移除多余的标签
 */
export const rehypeRemoveExtraTags = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      // 匹配 <p><img></p> 替换为 <img>
      if (parent && node.tagName == 'p' && node.children.length == 1 && node.children[0].type == 'element' && node.children[0].tagName == 'img') {
        parent.children.splice(index!, 1, node.children[0])
      }
    })
  }
}
