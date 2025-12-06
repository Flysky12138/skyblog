import { getToolPageMetadata } from '../utils'

export const metadata = getToolPageMetadata('other', 'pi')

export default function Layout({ children }: LayoutProps<'/toolbox/pi'>) {
  return children
}
