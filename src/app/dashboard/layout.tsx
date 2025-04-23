import { Metadata } from 'next'

import { Nav } from './_components/nav'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <section className="relative flex h-svh w-screen overflow-hidden">
      <Nav />
      <main className="bg-root flex-1 overflow-auto p-8">{children}</main>
    </section>
  )
}
