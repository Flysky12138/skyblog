import { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'ECharts 在线编辑预览，带类型提示',
  openGraph: {
    description: 'ECharts 在线编辑预览，带类型提示',
    title: 'ECharts'
  },
  title: 'ECharts',
  twitter: {
    description: 'ECharts 在线编辑预览，带类型提示',
    title: 'ECharts'
  }
}

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
