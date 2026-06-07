import { getToolPageMetadata } from '@/app/(client)/toolbox/utils'

export const metadata = getToolPageMetadata('tool', 'tiptap')

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="min-h-dvh">{children}</div>
}
