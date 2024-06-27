import Analytic from '@/components/Analytic'
import Live2D from '@/components/canvas/live2d'
// import Ribbon from '@/components/canvas/ribbon'
import About from '@/components/layout/About'
import Breakpoint from '@/components/layout/Breakpoint'
import Container from '@/components/layout/Container'
import Header from '@/components/layout/Header'
import Logo from '@/components/layout/Logo'
import ScrollToTop from '@/components/scroll/ScrollToTop'
import ToggleLive2D from '@/components/toggle/ToggleLive2D'
import ToggleTheme from '@/components/toggle/ToggleTheme'
import { SELECTOR } from '@/lib/constants'
import { Live2DBreakpoint, Live2DEnable, Live2DProvider } from '@/provider/live2d'
import { Dashboard } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

const Music = dynamic(() => import('./_/Music'), { ssr: false })
const Fish = dynamic(() => import('@/components/canvas/fish'), { ssr: false })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Live2DProvider>
      <Header>
        <Container className="flex h-full items-center gap-x-4" variant="header">
          <Logo />
          <span aria-hidden="true" className="grow"></span>
          {process.env.NODE_ENV == 'development' && (
            <>
              <Tooltip title="后台">
                <IconButton component={Link} href="/dashboard">
                  <Dashboard />
                </IconButton>
              </Tooltip>
              <hr className="s-border-color-divider mx-1 h-4 rounded border" />
            </>
          )}
          <div className="empty:hidden" id={SELECTOR.IDS.ISSUES_MOBILE}></div>
          <Music />
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
          <div id={SELECTOR.IDS.ISSUES_PC}></div>
          <Breakpoint up="md">
            <ScrollToTop />
          </Breakpoint>
        </Container>
      </nav>
      <footer className="mui-fixed fixed inset-x-0 bottom-0 z-footer flex h-footer items-center justify-center">
        <About />
        <Breakpoint up="md">
          <Fish />
        </Breakpoint>
      </footer>
      <aside>
        <Live2DBreakpoint>
          <Live2DEnable>
            <Live2D />
          </Live2DEnable>
        </Live2DBreakpoint>
      </aside>
      {process.env.NODE_ENV != 'development' && (
        <>
          <Analytic />
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </Live2DProvider>
  )
}
