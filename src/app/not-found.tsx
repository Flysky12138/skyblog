import { Metadata } from 'next'

import { NotFoundComponent } from '@/components/static/not-found-component'

export const metadata: Metadata = {
  openGraph: {
    title: '404'
  },
  title: '404',
  twitter: {
    title: '404'
  }
}

export default function NotFound() {
  return <NotFoundComponent />
}
