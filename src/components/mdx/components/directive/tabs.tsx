'use client'

import React from 'react'

import * as TabsPrimitive from '@/components/ui/tabs'
import { deepTraversalReactElement } from '@/lib/react'
import { cn } from '@/lib/utils'

interface TabsProps extends React.ComponentProps<(typeof TabsPrimitive)['Tabs']> {}

export const Tabs = ({ children, ...props }: TabsProps) => {
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
    <TabsPrimitive.Tabs asChild defaultValue="0" {...props}>
      <figure>
        <TabsPrimitive.TabsList>{tabsTrigger}</TabsPrimitive.TabsList>
        {tabsContent}
      </figure>
    </TabsPrimitive.Tabs>
  )
}
