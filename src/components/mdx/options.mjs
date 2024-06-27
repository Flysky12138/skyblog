import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
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

/** @type {import("next-mdx-remote/rsc").MDXRemoteProps['options']} */
export const options = {
  mdxOptions: {
    rehypePlugins: [[rehypeKatex, rehypeKatexOptions], rehypePrismPlus, rehypeSlug],
    remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]
  }
}
