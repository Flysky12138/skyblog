import React from 'react'

import { Card } from '@/components/static/card'

import { CardButtons } from './_components/card-buttons'
import { CardDeveloper } from './_components/card-developer'
import { CardGuestInfo } from './_components/card-guest-info'
import { CardReactUwU } from './_components/card-react-uwu'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="gap-card-large flex flex-col sm:flex-row">
      <div className="gap-card relative flex grow flex-col">
        <Card className="font-title p-5 text-center text-base">开发中</Card>
        {children}
      </div>
      <div className="gap-card flex shrink-0 flex-col sm:w-56 md:w-64">
        <CardDeveloper />
        <CardReactUwU />
        <React.Suspense>
          <CardButtons />
        </React.Suspense>
        <div className="sticky top-[calc(var(--height-header)+--spacing(9))] empty:hidden">
          <CardGuestInfo />
        </div>
      </div>
    </div>
  )
}
