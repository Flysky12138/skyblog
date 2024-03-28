import Container from '@/components/layout/Container'
import Logo from '@/components/layout/Logo'
import ScrollChildrenClass from '@/components/scroll/ScrollChildrenClass'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import { Menu, MenuMobile } from './_/Nav'

export const metadata = {
  title: 'Dashboard'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="s-divider-color fixed inset-y-0 left-0 hidden border-r md:block md:w-52">
        <Menu />
      </nav>
      <ScrollChildrenClass className="shadow-md" selector="main" up={40}>
        <header className="sticky top-0 z-header h-header transition-shadow md:hidden">
          <Container className="flex h-full items-center gap-x-4" variant="header">
            <Logo />
            <span aria-hidden="true" className="flex-1"></span>
            <ToggleTheme />
            <MenuMobile />
          </Container>
        </header>
      </ScrollChildrenClass>
      <main className="relative h-[calc(100dvh-theme(height.header))] overflow-auto p-6 md:ml-52 md:h-screen md:p-8">{children}</main>
    </>
  )
}
