import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

/** @type {import("next-mdx-remote/rsc").MDXRemoteProps['options']} */
export const options = {
  mdxOptions: {
    rehypePlugins: [
      rehypeKatex.bind(null, {
        output: 'html',
        strict: false
      }),
      rehypePrismPlus,
      rehypeSlug
    ],
    remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]
  }
}
