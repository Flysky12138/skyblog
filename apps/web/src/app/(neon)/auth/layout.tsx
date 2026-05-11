import { Card } from '@repo/ui/components-self/card'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <main className="p-4">
      <Card className="mx-auto my-6 w-full max-w-sm p-card">{children}</Card>
    </main>
  )
}
