import { Metadata } from 'next'

import { NotFoundComponent } from '@/components/not-found-component'

export const metadata: Metadata = {
  title: '404'
}

export default function NotFound() {
  return <NotFoundComponent />
}
