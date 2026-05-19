import { BundledLanguage } from 'shiki/langs'

import { MDXClient, MDXClientProps } from './client'

export interface MDXCodeProps extends MDXClientProps {
  language: BundledLanguage
}

export function MDXCode({ language, source, ...props }: MDXCodeProps) {
  return <MDXClient source={[`\`\`\`${language}`, source, '```'].join('\n')} {...props} />
}
