import { Metadata } from 'next'

export const metadata: Metadata = {
  description: '在线计算圆周率数值',
  title: 'Pi'
}

export default function Layout({ children }: LayoutProps<'/toolbox/pi'>) {
  return children
}
