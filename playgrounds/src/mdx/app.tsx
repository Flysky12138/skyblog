import '@repo/mdx/style.css'
import { MDXClient, MDXClientProps } from '@repo/mdx'
import { Card } from '@repo/ui/components-self/card'
import { DropdownMenuThemeRadio } from '@repo/ui/components-self/theme'

import template from './template.mdx?raw'

export function App() {
  const handleAfterRender: MDXClientProps['onAfterRender'] = () => {
    const hash = decodeURIComponent(location.hash.slice(1))
    if (!hash) return
    document.getElementById(hash)?.scrollIntoView({
      behavior: 'instant',
      block: 'start'
    })
  }

  return (
    <>
      <DropdownMenuThemeRadio className="fixed top-2 right-2" />
      <Card className="container mx-auto my-12 p-6">
        <MDXClient source={template} onAfterRender={handleAfterRender} />
      </Card>
    </>
  )
}
