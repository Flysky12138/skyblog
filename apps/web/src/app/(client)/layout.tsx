import { Container } from '@repo/ui/components-self/container'
import { DropdownMenuThemeRadio } from '@repo/ui/components-self/theme'
import { ButtonLink } from '@repo/ui/components/button'
import { ToolCaseIcon } from 'lucide-react'
import Link from 'next/link'

import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { About } from '@/components/static/about'
import { Header } from '@/components/static/header'
import { Logo } from '@/components/static/logo'
import { ScrollToTop } from '@/components/static/scroll-to-top'
import { ATTRIBUTE } from '@/lib/constants'

import { AuthButton } from './_components/auth-button'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header>
        <Container className="flex h-full items-center gap-4">
          <Link aria-label="to home page" className="focus-visible:ring-3" href="/">
            <Logo />
          </Link>
          <span aria-hidden="true" className="grow" />
          <DisplayByBreakPoint max="sm">
            <ScrollToTop showOnScrollYOverflow={500} variant="outline" />
          </DisplayByBreakPoint>
          <ButtonLink aria-label="toolbox" href="/toolbox" size="icon" variant="outline">
            <ToolCaseIcon />
          </ButtonLink>
          <hr className="h-4 w-0.5 rounded-full bg-divide" />
          <DropdownMenuThemeRadio />
          <AuthButton />
        </Container>
      </Header>
      <main className="min-h-main relative z-10 mt-(--height-header) mb-(--height-footer) border-b border-divide bg-root">
        <Container className="py-(--py) [--py:1.25rem] sm:[--py:1.75rem] md:[--py:2.25rem]">{children}</Container>
      </main>
      <aside className="fixed inset-x-0 bottom-[calc(var(--height-footer)+(--spacing(12)))] z-20">
        <Container className="flex h-0 flex-col items-end justify-end gap-3" variant="aside">
          <div id={ATTRIBUTE.ID.NAV_CONTAINER_DOWNLOAD} />
          <DisplayByBreakPoint min="sm">
            <ScrollToTop />
          </DisplayByBreakPoint>
        </Container>
      </aside>
      <footer className="h-footer fixed inset-x-0 bottom-0 flex items-center justify-center bg-white/70 dark:bg-root/80">
        <About />
      </footer>
    </>
  )
}
