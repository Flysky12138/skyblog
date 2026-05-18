import createMDX from '@next/mdx'

import { mdxOptions } from './options'

/**
 * 在 Next.js 中使用 Markdown 和 MDX
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
export const withMDX = createMDX({
  options: mdxOptions
})
