import { ShikiTransformer } from 'shiki'

const RE_MARKERS = /#?\s*\[!code (highlight|\+\+|--)(:\d+)?\]/i
const RE_CODE_WORD = /\s*\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]/

/**
 * 移除标记文本
 *
 * 官方 notation transformer 插件会移除标记文本（如：`// [!code highlight]`）。已通过 patch 源码后，移除了这种操作
 */
export function transformerRemoveNotationMarkers(): ShikiTransformer {
  return {
    name: 'shiki-transformer-remove-notation-markers',

    code(node) {
      const lines = node.children.filter(i => i.type === 'element')

      for (const line of lines) {
        const text = line.children
          .filter(i => i.type === 'element')
          .map(i => i.children[0])
          .filter(i => i?.type === 'text')
          .map(i => i.value)
          .join('')

        if (RE_MARKERS.test(text) || RE_CODE_WORD.test(text)) {
          const index = node.children.indexOf(line)
          node.children.splice(index, 1)
        }
      }
    }
  }
}
