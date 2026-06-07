import { ShikiTransformer } from 'shiki'

const regexp = /#?\s*\[!code (highlight|\+\+|--)(:\d+)?\]/gi

/**
 * 保留标记文本
 *
 * 官方 notation transformer 会移除标记文本，如：`// [!code highlight]`\
 * 但在编辑器中，编辑层仍保留这些标记，导致渲染层与编辑层内容不一致，光标错位
 */
export function transformerPreserveNotationMarkers(): ShikiTransformer {
  return {
    name: 'shiki-transformer-preserve-notation-markers',

    // 将复制的标记文本还原
    postprocess(html) {
      return html.replace(/!!code/gi, '!code')
    },

    // 输入文本中标记文本重复一份，并且 !code 替换为 !!code，避免被移除
    preprocess(code) {
      return code.replace(regexp, match => `${match.replace('!code', '!!code')}${match}`)
    }
  }
}
