import Analytic from '@/components/Analytic'
import Live2D from '@/components/canvas/live2d'
import DisplayMatchAuth from '@/components/display/DisplayMatchAuth'
import DisplayMatchEnv from '@/components/display/DisplayMatchEnv'
import About from '@/components/layout/About'
import Breakpoint from '@/components/layout/Breakpoint'
import Container from '@/components/layout/Container'
import Header from '@/components/layout/Header'
import Logo from '@/components/layout/Logo'
import ScrollToTop from '@/components/scroll/ScrollToTop'
import ToggleLive2D from '@/components/toggle/ToggleLive2D'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import { ATTRIBUTE } from '@/lib/constants'
import { Live2DBreakpoint, Live2DEnable, Live2DProvider } from '@/provider/live2d'
import { Dashboard } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import Link from 'next/link'
import React from 'react'

// const Ribbon = dynamic(() => import('@/components/canvas/ribbon'), { ssr: false })
// const Fish = dynamic(() => import('@/components/canvas/fish'), { ssr: false })

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Live2DProvider>
      <Header>
        <Container className="flex h-full items-center gap-x-4" variant="header">
          <Logo />
          <span aria-hidden="true" className="grow"></span>
          <DisplayMatchAuth role="ADMIN">
            <Tooltip title="后台">
              <IconButton component={Link} href="/dashboard">
                <Dashboard />
              </IconButton>
            </Tooltip>
            <hr className="s-border-color-divider mx-1 h-4 rounded border" />
          </DisplayMatchAuth>
          <div className="empty:hidden" id={ATTRIBUTE.ID.ISSUES_MOBILE}></div>
          <Live2DBreakpoint>
            <ToggleLive2D />
          </Live2DBreakpoint>
          <ToggleTheme />
        </Container>
      </Header>
      <main className="s-border-color-divider relative z-main mb-[theme(height.footer)] mt-[theme(height.header)] min-h-[calc(100dvh-theme(height.header))] border-b">
        <Container className="py-9">{children}</Container>
        {/* <Ribbon /> */}
      </main>
      <nav className="mui-fixed fixed inset-x-0 bottom-[calc(theme(height.footer)+theme(spacing.12))] z-nav">
        <Container className="flex h-0 flex-col items-end justify-end gap-y-3" variant="header">
          <div id={ATTRIBUTE.ID.ISSUES_PC}></div>
          <Breakpoint up="md">
            <ScrollToTop />
          </Breakpoint>
        </Container>
      </nav>
      <footer className="mui-fixed fixed inset-x-0 bottom-0 z-footer flex h-footer items-center justify-center">
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
      <DisplayMatchEnv env="development" reverse={true}>
        <Analytic />
      </DisplayMatchEnv>
    </Live2DProvider>
  )
}
