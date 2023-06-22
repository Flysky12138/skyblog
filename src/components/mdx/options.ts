// import rehypeKatex, { Options as RehypeKatexOptions } from 'rehype-katex'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import { EvaluateOptions } from 'next-mdx-remote-client/rsc'
import rehypeMathjax, { Options as RehypeMathjaxOptions } from 'rehype-mathjax'
import rehypePrettyCode, { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { PluggableList } from 'unified'

import { rehypeCode } from './rehype/rehype-code'
import { rehypeRemoveExtraTags } from './rehype/rehype-remove-extra-tags'

/**
 * Latex options
 */
// const rehypeKatexOptions: RehypeKatexOptions = {
//   output: 'html',
//   strict: false
// }
const rehypeMathjaxOptions: RehypeMathjaxOptions = {
  // https://docs.mathjax.org/en/latest/options/output/svg.html#the-configuration-block
  svg: {}
}

/**
 * Shiki options
 */
const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  keepBackground: false,
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  },
  transformers: [
    // 一个适用于 Shiki 的 VSCode 风格彩色括号转换器
    // https://shiki.tmrs.site/packages/colorized-brackets
    transformerColorizedBrackets(),

    // 为 Shiki 设计的常用转换器的集合
    // https://shiki.tmrs.site/packages/transformers#transformernotationdiff
    transformerNotationDiff(),
    // https://shiki.tmrs.site/packages/transformers#transformernotationhighlight
    transformerNotationHighlight()
  ]
}

/**
 * rehype plugins
 */
export const rehypePlugins: PluggableList = [
  // [rehypeKatex, rehypeKatexOptions],
  [rehypeMathjax, rehypeMathjaxOptions],
  [rehypePrettyCode, rehypePrettyCodeOptions],
  rehypeSlug,
  rehypeCode,
  rehypeRemoveExtraTags
]

/**
 * remark plugins
 */
export const remarkPlugins: PluggableList = [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]

/**
 * mdx options
 */
export const mdxOptions: EvaluateOptions['mdxOptions'] = {
  rehypePlugins,
  remarkPlugins
}
