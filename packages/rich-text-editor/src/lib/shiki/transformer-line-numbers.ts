import { ShikiTransformer } from 'shiki'

type Element = Parameters<NonNullable<ShikiTransformer['line']>>[0]

/**
 * 为代码行添加行号
 *
 * - 为 pre 元素添加 `data-line-digits` 属性，记录总行数的数字位数
 * - 为每一行添加 `data-line` 属性，配合 CSS `::before` 显示行号
 */
export function transformerLineNumbers(): ShikiTransformer {
  return {
    name: 'line-numbers',

    root(node) {
      const pre = node.children.find((node): node is Element => node.type === 'element' && node.tagName === 'pre')
      if (!pre) return

      const code = pre.children.find((node): node is Element => node.type === 'element' && node.tagName === 'code')
      if (!code) return

      const lines = code.children.filter((node): node is Element => node.type === 'element' && node.tagName === 'span')

      pre.properties['data-line-digits'] = String(lines.length).length

      for (const [index, line] of lines.entries()) {
        line.properties['data-line'] = String(index + 1)
      }
    }
  }
}
