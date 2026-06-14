import { Heading, Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * 只保留标题，并移除标题中的链接
 */
export function remarkPickHeading() {
  return (tree: Root) => {
    const children: Heading[] = []

    visit(tree, ['heading', 'link'], (node, index, parent) => {
      if (node.type === 'heading') {
        children.push(node)
        return
      }

      if (node.type === 'link' && parent && index != null) {
        parent.children.splice(index, 1, ...node.children)
      }
    })

    return {
      children,
      type: 'root'
    }
  }
}
