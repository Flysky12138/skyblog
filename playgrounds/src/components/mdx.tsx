import '@repo/mdx/styles.css'
import { MDXClient, MDXClientMemoProps } from '@repo/mdx'
import { Card } from '@repo/ui/components/card'
import React from 'react'

export function MDXPlayground() {
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    void (async () => {
      const module = await import('./test.mdx?raw')
      setValue(module.default)
    })()
  }, [])

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
      <MDXClient source={value} onAfterRender={handleAfterRender} />
    </Card>
  )
}
