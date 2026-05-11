'use client'

import * as TabsPrimitive from '@repo/ui/components/tabs'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

import { deepTraversalReactElement } from '../../../lib/react'

interface TabsProps extends React.ComponentProps<(typeof TabsPrimitive)['Tabs']> {}

export function Tabs({ children, ...props }: TabsProps) {
  const tabsTrigger: React.ReactNode[] = []
  const tabsContent: React.ReactNode[] = []

  deepTraversalReactElement<React.PropsWithChildren<{ className?: string }>>(children, node => {
    const { className, ...nodeProps } = node.props
    switch (node.type) {
      case 'tabscontent':
        tabsContent.push(
          <TabsPrimitive.TabsContent
            key={tabsContent.length}
            className={cn('*:first:mt-0 *:last:mb-0', className)}
            value={String(tabsContent.length)}
            {...nodeProps}
          />
        )
        break
      case 'tabtrigger':
        tabsTrigger.push(
          <TabsPrimitive.TabsTrigger
            key={tabsTrigger.length}
            className={cn('px-4 font-semibold md:px-8', className)}
            value={String(tabsTrigger.length)}
            {...nodeProps}
          />
        )
        break
    }
  })

  return (
    <TabsPrimitive.Tabs defaultValue="0" render={<figure />} {...props}>
      <TabsPrimitive.TabsList>{tabsTrigger}</TabsPrimitive.TabsList>
      {tabsContent}
    </TabsPrimitive.Tabs>
  )
}
