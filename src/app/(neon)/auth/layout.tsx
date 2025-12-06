import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  }
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return <main className="container mx-auto flex flex-col items-center p-4 md:p-6">{children}</main>
}
