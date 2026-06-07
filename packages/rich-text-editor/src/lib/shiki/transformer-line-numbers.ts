import { ShikiTransformer } from 'shiki'

/**
 * 为代码行添加行号
 *
 * - 为 pre 元素添加 `data-line-digits` 属性，记录总行数的数字位数
 * - 为每一行添加 `data-line` 属性，配合 CSS `::before` 显示行号
 */
export function transformerLineNumbers(): ShikiTransformer {
  let totalLines = 0

  return {
    name: 'line-numbers',

    line(node, line) {
      // node.properties['data-line'] = String(line)
    },

    pre(node) {
      node.properties['data-line-digits'] = String(totalLines).length
    },

    preprocess(code) {
      totalLines = code.split('\n').length
      return code
    }
  }
}
