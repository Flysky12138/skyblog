import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { rehypeCode } from './rehype/rehype-code.mjs'

/** @type {import("rehype-katex").Options} */
const rehypeKatexOptions = {
  output: 'html',
  strict: false
}

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  keepBackground: false,
  theme: {
    dark: 'dark-plus',
    light: 'light-plus'
  }
}

/** @type {import("next-mdx-remote/dist/types").SerializeOptions} */
export const serializeOptions = {
  mdxOptions: {
    rehypePlugins: [[rehypeKatex, rehypeKatexOptions], [rehypePrettyCode, rehypePrettyCodeOptions], rehypeSlug, rehypeCode],
    remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]
  }
}
