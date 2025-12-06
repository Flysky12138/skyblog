import { ToolCase } from 'lucide-react'
import Link from 'next/link'

import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { About } from '@/components/static/about'
import { Container } from '@/components/static/container'
import { Header } from '@/components/static/header'
import { Logo } from '@/components/static/logo'
import { ScrollToTop } from '@/components/static/scroll-to-top'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ATTRIBUTE } from '@/lib/constants'
import { Live2DContent, Live2DProvider, Live2DToggleButton } from '@/providers/live2d'
import { ThemeToggleButton } from '@/providers/theme'

import { AuthButton } from './_components/auth-button'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <Live2DProvider>
      <Header>
        <Container className="flex h-full items-center gap-4">
          <Link aria-label="to home page" className="focus-visible:ring-3" href="/">
            <Logo />
          </Link>
          <span aria-hidden="true" className="grow" />
          <DisplayByBreakPoint max="sm">
            <ScrollToTop showOnScrollYOverflow={500} variant="outline" />
          </DisplayByBreakPoint>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild aria-label="toolbox" size="icon" variant="outline">
                <Link href="/toolbox">
                  <ToolCase />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>工具箱</TooltipContent>
          </Tooltip>
          <hr className="bg-divide h-4 w-0.5 rounded-full" />
          <Live2DToggleButton />
          <ThemeToggleButton />
          <AuthButton />
        </Container>
      </Header>
      <main
        className="border-divide bg-root min-h-main relative z-10 mt-(--height-header) mb-(--height-footer) border-b"
        data-vaul-drawer-wrapper="true"
      >
        <Container className="py-(--py) [--py:1.25rem] sm:[--py:1.75rem] md:[--py:2.25rem]">{children}</Container>
      </main>
      <aside className="fixed inset-x-0 bottom-[calc(var(--height-footer)+--spacing(12))] z-20">
        <Container className="flex h-0 flex-col items-end justify-end gap-3" id={ATTRIBUTE.ID.NAV_CONTAINER} variant="aside">
          <DisplayByBreakPoint min="sm">
            <ScrollToTop />
          </DisplayByBreakPoint>
        </Container>
      </aside>
      <footer className="dark:bg-root/80 h-footer fixed inset-x-0 bottom-0 flex items-center justify-center bg-white/70">
        <About />
      </footer>
      <aside>
        <Live2DContent />
      </aside>
    </Live2DProvider>
  )
}
