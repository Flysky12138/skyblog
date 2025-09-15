import { Metadata } from 'next'

export const metadata: Metadata = {
  description: '本项目使用到的依赖库',
  openGraph: {
    description: '本项目使用到的依赖库',
    title: '依赖'
  },
  title: '依赖',
  twitter: {
    description: '本项目使用到的依赖库',
    title: '依赖'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
