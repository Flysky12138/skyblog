import Analytic from '@/components/Analytic'
import Live2D from '@/components/canvas/live2d'
// import Ribbon from '@/components/canvas/ribbon'
import Breakpoint from '@/components/layout/Breakpoint'
import Container from '@/components/layout/Container'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/layout/Logo'
import ScrollChildrenClass from '@/components/scroll/ScrollChildrenClass'
import ScrollToTop from '@/components/scroll/ScrollToTop'
import ToggleLive2D from '@/components/toggle/ToggleLive2D'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import { Live2DBreakpoint, Live2DEnable, Live2DProvider } from '@/provider/live2d'
import React from 'react'

const Music = React.lazy(() => import('./_/Music'))
const Fish = React.lazy(() => import('@/components/canvas/fish'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Live2DProvider>
      <Analytic />
      <ScrollChildrenClass className="shadow-md" up={40}>
        <header className="mui-fixed fixed inset-x-0 top-0 z-header h-header transition-shadow">
          <Container className="flex h-full items-center gap-x-4" variant="header">
            <Logo />
            <span aria-hidden="true" className="grow"></span>
            <React.Suspense fallback={<span className="s-skeleton h-8 w-8 rounded-md"></span>}>
              <Music />
            </React.Suspense>
            <Live2DBreakpoint>
              <ToggleLive2D />
            </Live2DBreakpoint>
            <ToggleTheme />
          </Container>
        </header>
      </ScrollChildrenClass>
      <main className="s-divider relative z-main mb-[theme(height.footer)] mt-[theme(height.header)] min-h-[calc(100dvh-theme(height.header))] border-b">
        <Container className="py-9">{children}</Container>
        {/* <Ribbon /> */}
      </main>
      <nav className="mui-fixed fixed inset-x-0 bottom-[calc(theme(height.footer)+theme(spacing.12))] z-nav">
        <Container className="flex h-0 flex-col items-end justify-end gap-y-3" variant="header">
          <Breakpoint up="md">
            <ScrollToTop />
          </Breakpoint>
        </Container>
      </nav>
      <footer className="mui-fixed fixed inset-x-0 bottom-0 z-footer flex h-footer items-center justify-center">
        <Footer />
        <Breakpoint up="md">
          <React.Suspense>
            <Fish />
          </React.Suspense>
        </Breakpoint>
      </footer>
      <Live2DBreakpoint>
        <Live2DEnable>
          <Live2D />
        </Live2DEnable>
      </Live2DBreakpoint>
    </Live2DProvider>
  )
}
