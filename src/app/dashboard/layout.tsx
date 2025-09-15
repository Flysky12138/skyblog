import { Metadata } from 'next'

import { Header } from './_components/header'
import { Nav, NavProvider } from './_components/nav'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: {
    default: 'Dashboard',
    template: '%s | Dashboard'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <NavProvider>
      <Nav />
      <div className="flex flex-1 flex-col overflow-auto">
        <Header className="md:hidden" />
        <main className="bg-root flex-1 p-4 md:p-8">{children}</main>
      </div>
    </NavProvider>
  )
}
