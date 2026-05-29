import { getToolPageMetadata } from '../utils'

export const metadata = getToolPageMetadata('other', 'netease-cloud-music')

export default function Layout({
  children,
  modal
}: React.PropsWithChildren<{
  modal: React.ReactNode
}>) {
  return (
    <div className="mx-auto flex h-[calc(var(--height-main)-2*var(--py))] max-w-xl flex-col gap-4">
      {children}
      {modal}
    </div>
  )
}
