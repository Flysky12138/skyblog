import { getToolPageMetadata } from '@/app/(client)/toolbox/utils'

export const metadata = getToolPageMetadata('develop', 'echarts')

export default function Layout({ children }: React.PropsWithChildren) {
  return children
}
