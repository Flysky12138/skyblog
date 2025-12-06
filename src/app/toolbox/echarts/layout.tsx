import { getToolPageMetadata } from '@/app/(client)/toolbox/utils'

export const metadata = getToolPageMetadata('develop', 'echarts')

export default function Layout({ children }: LayoutProps<'/toolbox/echarts'>) {
  return children
}
