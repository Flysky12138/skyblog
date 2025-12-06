import { metadata } from '@/app/(client)/toolbox/layout'

export { metadata }

export default function Layout({ children }: LayoutProps<'/toolbox'>) {
  return <main className="h-dvh w-full">{children}</main>
}
