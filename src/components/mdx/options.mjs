// import { transformerCopyButton } from '@rehype-pretty/transformers'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

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
  },
  transformers: [
    // transformerCopyButton({
    //   visibility: 'always'
    // })
  ]
}

/** @type {import("next-mdx-remote/dist/types").SerializeOptions} */
export const serializeOptions = {
  mdxOptions: {
    rehypePlugins: [[rehypeKatex, rehypeKatexOptions], [rehypePrettyCode, rehypePrettyCodeOptions], rehypeSlug],
    remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]
  }
}
