import '@repo/mdx/styles.css'
import { MDXClient, MDXClientMemoProps } from '@repo/mdx'
import { Card } from '@repo/ui/components/card'
import React from 'react'

import template from '../assets/template.mdx?raw'

export function MDXPlayground() {
  const handleAfterRender = React.useCallback<NonNullable<MDXClientMemoProps['onAfterRender']>>(isFirstRender => {
    const hash = decodeURIComponent(location.hash.slice(1))
    if (!hash) return
    document.getElementById(hash)?.scrollIntoView({
      behavior: 'instant',
      block: 'start'
    })
  }, [])

  return (
    <Card className="p-6">
      <MDXClient source={template} onAfterRender={handleAfterRender} />
    </Card>
  )
}
