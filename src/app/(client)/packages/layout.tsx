import { Metadata } from 'next'

export const metadata: Metadata = {
  description: '本项目使用到的依赖库',
  title: '依赖'
}

export default function Layout({ children }: LayoutProps<'/packages'>) {
  return children
}
