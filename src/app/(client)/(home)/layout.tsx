import { Card } from '@/components/layout/card'
import React from 'react'

import { CardButtons } from './_components/card/card-buttons'
import { CardDeveloper } from './_components/card/card-developer'
import { CardGuestInfo } from './_components/card/card-guest-info'
import { CardReactUwU } from './_components/card/card-react-uwu'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <section className="flex flex-col gap-6 sm:flex-row">
      <div className="relative flex grow flex-col gap-6">
        <Card className="font-title p-5 text-center text-base">开发中</Card>
        {children}
      </div>
      <div className="flex shrink-0 flex-col gap-6 sm:w-56 md:w-64">
        <CardDeveloper />
        <CardReactUwU />
        <CardButtons />
        <div className="sticky top-[calc(var(--height-header)+--spacing(9))] empty:hidden">
          <CardGuestInfo />
        </div>
      </div>
    </section>
  )
}
