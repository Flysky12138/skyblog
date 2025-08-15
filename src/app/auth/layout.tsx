import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="absolute inset-0 flex items-center justify-center">{children}</div>
}
