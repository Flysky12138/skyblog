import { Live2D } from '@/components/canvas/live2d'
import { DisplayByAuth } from '@/components/display/display-by-auth'
import { DisplayByBreakPoint } from '@/components/display/display-by-breakpoint'
import { About } from '@/components/layout/about'
import { Container } from '@/components/layout/container'
import { Header } from '@/components/layout/header'
import { Logo } from '@/components/layout/logo'
import { ScrollToTop } from '@/components/scroll-to-top'
import { ToggleLive2D } from '@/components/toggle/toggle-live2d'
import { ToggleTheme } from '@/components/toggle/toggle-theme'
import { Button } from '@/components/ui/button'
import { ATTRIBUTE } from '@/lib/constants'
import { Live2DBreakpoint, Live2DEnable, Live2DProvider } from '@/providers/live2d'
import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// const Ribbon = dynamic(() => import('@/components/canvas/ribbon'), { ssr: false })
// const Fish = dynamic(() => import('@/components/canvas/fish'), { ssr: false })

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Live2DProvider>
      <Header>
        <Container className="flex h-full items-center gap-4">
          <Link href="/">
            <Logo />
          </Link>
          <span aria-hidden="true" className="grow"></span>
          <DisplayByAuth role="ADMIN">
            <Button asChild size="icon" variant="outline">
              <Link href="/dashboard">
                <LayoutDashboard />
              </Link>
            </Button>
            <hr className="bg-divide h-4 w-0.5 rounded-full" />
          </DisplayByAuth>
          <div className="empty:hidden" id={ATTRIBUTE.ID.ISSUES_MOBILE}></div>
          <Live2DBreakpoint>
            <ToggleLive2D />
          </Live2DBreakpoint>
          <ToggleTheme />
        </Container>
      </Header>
      <main className="border-divide bg-root z-main relative mt-(--height-header) mb-(--height-footer) min-h-[calc(100dvh-var(--height-header))] border-b">
        <Container className="py-9">{children}</Container>
        {/* <Ribbon /> */}
      </main>
      <nav className="z-nav fixed inset-x-0 bottom-[calc(var(--height-footer)+--spacing(12))]">
        <Container className="flex h-0 flex-col items-end justify-end gap-3" variant="nav">
          <div id={ATTRIBUTE.ID.ISSUES_PC}></div>
          <DisplayByBreakPoint down="sm">
            <ScrollToTop />
          </DisplayByBreakPoint>
        </Container>
      </nav>
      <footer className="z-footer h-footer fixed inset-x-0 bottom-0 flex items-center justify-center">
        <About />
        {/* <Breakpoint up="md">
          <Fish />
        </Breakpoint> */}
      </footer>
      <aside>
        <Live2DBreakpoint>
          <Live2DEnable>
            <Live2D />
          </Live2DEnable>
        </Live2DBreakpoint>
      </aside>
    </Live2DProvider>
  )
}
