'use client'

import * as TabsPrimitive from '@/components/ui/tabs'
import { deepTraversalReactElement } from '@/lib/react'
import { cn } from '@/lib/utils'
import React from 'react'

interface TabsProps extends React.ComponentProps<(typeof TabsPrimitive)['Tabs']> {}

export const Tabs = ({ children, ...props }: TabsProps) => {
  const tabsTrigger: React.ReactNode[] = []
  const tabsContent: React.ReactNode[] = []

  deepTraversalReactElement<React.PropsWithChildren<{ className?: string }>>(children, node => {
    const { className, ..._props } = node.props
    switch (node.type) {
      case 'tabscontent':
        tabsContent.push(
          <TabsPrimitive.TabsContent
            key={tabsContent.length}
            className={cn('bg-sheet rounded-lg p-2 md:p-4', className)}
            value={String(tabsContent.length)}
            {..._props}
          />
        )
        break
      case 'tabtrigger':
        tabsTrigger.push(
          <TabsPrimitive.TabsTrigger
            key={tabsTrigger.length}
            className={cn('px-4 font-semibold md:px-8', className)}
            value={String(tabsTrigger.length)}
            {..._props}
          />
        )
        break
    }
  })

  return (
    <TabsPrimitive.Tabs asChild defaultValue="0" {...props}>
      <figure className="my-4">
        <TabsPrimitive.TabsList>{tabsTrigger}</TabsPrimitive.TabsList>
        {tabsContent}
      </figure>
    </TabsPrimitive.Tabs>
  )
}
