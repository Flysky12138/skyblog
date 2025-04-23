'use client'

import * as TabsPrimitive from '@/components/ui/tabs'
import { deepTraversalReactElement } from '@/lib/react'
import { cn } from '@/lib/utils'
import React from 'react'

interface TabsProps extends React.ComponentProps<(typeof TabsPrimitive)['Tabs']> {}

export const Tabs = ({ children, ...props }: TabsProps) => {
  const tabsTrigger: React.ReactNode[] = []
  const tabsContent: React.ReactNode[] = []

  deepTraversalReactElement<
    React.PropsWithChildren<{
      className?: string
    }>
  >(children, node => {
    const { className, ..._props } = node.props
    switch (node.type) {
      case 'tabscontent':
        tabsContent.push(
          <TabsPrimitive.TabsContent
            key={tabsContent.length}
            className={cn('rounded-lg border p-2 *:first:mt-0 *:last:mb-0', className)}
            value={String(tabsContent.length)}
            {..._props}
          />
        )
        break
      case 'tabtrigger':
        tabsTrigger.push(
          <TabsPrimitive.TabsTrigger
            key={tabsTrigger.length}
            className={cn('px-8 font-semibold', className)}
            value={String(tabsTrigger.length)}
            {..._props}
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
