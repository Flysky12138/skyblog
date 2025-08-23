import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ECharts'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
