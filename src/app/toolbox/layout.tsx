import { metadata } from '@/app/(client)/toolbox/layout'

export { metadata }

export default function Layout({ children }: React.PropsWithChildren) {
  return <main className="h-dvh w-full">{children}</main>
}
