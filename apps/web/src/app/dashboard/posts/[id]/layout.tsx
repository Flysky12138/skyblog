import { Style } from '@/components/style'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Style>{`main { padding: 0 !important }`}</Style>
      {children}
    </>
  )
}
