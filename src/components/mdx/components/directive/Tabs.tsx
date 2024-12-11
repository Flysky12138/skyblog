'use client'

import { cn } from '@/lib/cn'
import { deepTraversalReactElement } from '@/lib/react'
import { Tab as JoyTab, TabList as JoyTabList, TabPanel as JoyTabPanel, Tabs as JoyTabs, TabsProps as JoyTabsProps } from '@mui/joy'
import React from 'react'

interface TabsProps extends JoyTabsProps {
  activeIndex?: string
}

export default function Tabs({ children, activeIndex, ...props }: TabsProps) {
  const TabList: React.ReactNode[] = []
  const TabPanel: React.ReactNode[] = []

  deepTraversalReactElement<
    Pick<JoyTabsProps, 'children' | 'className'> & {
      label?: string
    }
  >(children, (node, index) => {
    if (node.type == 'tab') {
      const { label, children: _children, className: _className, ..._props } = node.props
      TabList.push(
        <JoyTab key={index} indicatorInset className={cn('font-semibold aria-selected:text-blue-500', _className)} {..._props}>
          {label}
        </JoyTab>
      )
      TabPanel.push(
        <JoyTabPanel keepMounted className="first:[&>*]:mt-1 last:[&>*]:mb-1" value={index}>
          {_children}
        </JoyTabPanel>
      )
    }
  })

  return (
    <figure className="s-border-color-card overflow-hidden rounded-md border">
      <JoyTabs className="bg-transparent" defaultValue={Number.parseInt(activeIndex || '0')} {...props}>
        <JoyTabList>{TabList}</JoyTabList>
        {TabPanel}
      </JoyTabs>
    </figure>
  )
}
