import { getToolPageMetadata } from '../utils'

export const metadata = getToolPageMetadata('tool', 'image-compression')

export default function Layout({ children }: LayoutProps<'/toolbox/image-compression'>) {
  return children
}
