import { Style } from '@/components/utils/style'

export default function Layout({ children }: LayoutProps<'/dashboard/posts/[id]'>) {
  return (
    <>
      <Style>{`main { padding: 0 !important }`}</Style>
      {children}
    </>
  )
}
