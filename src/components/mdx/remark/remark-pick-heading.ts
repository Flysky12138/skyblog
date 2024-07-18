import { Root, RootContent } from 'mdast'
import { visit } from 'unist-util-visit'

/** 只保留标题 */
export const remarkPickHeading = () => {
  return (tree: Root) => {
    const children: RootContent[] = []
    visit(tree, 'heading', (node: any) => {
      children.push(node)
    })
    return {
      children,
      type: 'root'
    }
  }
}
