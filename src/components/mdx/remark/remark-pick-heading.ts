import { Root, RootContent } from 'mdast'
import { visit } from 'unist-util-visit'

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
