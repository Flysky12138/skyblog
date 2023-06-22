import { Heading, Root } from 'mdast'
import { visit } from 'unist-util-visit'

/** 只保留标题 */
export const remarkPickHeading = () => {
  return (tree: Root) => {
    const children: Heading[] = []
    visit(tree, 'heading', node => {
      children.push(node)
    })
    return {
      children,
      type: 'root'
    }
  }
}
