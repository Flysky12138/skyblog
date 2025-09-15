import { Metadata } from 'next'

export const metadata: Metadata = {
  description: '在线计算圆周率数值',
  openGraph: {
    description: '在线计算圆周率数值',
    title: 'Pi'
  },
  title: 'Pi',
  twitter: {
    description: '在线计算圆周率数值',
    title: 'Pi'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
