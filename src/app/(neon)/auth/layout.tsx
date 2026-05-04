import { Metadata } from 'next'

import { Card } from '@/components/static/card'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <main className="p-4">
      <Card className="p-card mx-auto my-6 w-full max-w-sm">{children}</Card>
    </main>
  )
}
