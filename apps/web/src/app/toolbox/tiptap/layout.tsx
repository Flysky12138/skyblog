import { getToolPageMetadata } from '@/app/(client)/toolbox/utils'
import { Style } from '@/components/style'

export const metadata = getToolPageMetadata('tool', 'tiptap')

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Style>{`
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar {
          display: none;
        }
      `}</Style>

      <div className="flex min-h-dvh">{children}</div>
    </>
  )
}
