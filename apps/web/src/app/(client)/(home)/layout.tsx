import { Card } from '@repo/ui/components-self/card'
import React from 'react'

import { CardButtons } from './_components/card-buttons'
import { CardDeveloper } from './_components/card-developer'
import { CardGuestInfo } from './_components/card-guest-info'
import { CardWolf } from './_components/card-wolf'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <h1 className="sr-only">{process.env.NEXT_PUBLIC_TITLE}</h1>
      <div className="flex flex-col gap-bp-4 gap-y-(--py) sm:flex-row">
        <div className="relative flex grow flex-col gap-bp-3">
          <Card className="p-5 text-center font-heading text-base tracking-widest">开发中</Card>
          {children}
        </div>
        <div className="flex shrink-0 flex-col gap-bp-3 sm:w-56 md:w-64">
          <CardDeveloper />
          <CardWolf />
          <React.Suspense>
            <CardButtons />
          </React.Suspense>
          <div className="sticky top-[calc(var(--height-header)+(--spacing(9)))] empty:hidden">
            <CardGuestInfo />
          </div>
        </div>
      </div>
    </>
  )
}
