import Card from '@/components/layout/Card'
import { Tab as JoyTab, TabList as JoyTabList, TabPanel as JoyTabPanel, Tabs as JoyTabs, TabsProps } from '@mui/joy'
import React from 'react'

interface TabsPropsType extends TabsProps {
  activeIndex?: string
}

export default function Tabs({ children, activeIndex, ...props }: TabsPropsType) {
  const TabList: React.ReactNode[] = []
  const TabPanel: React.ReactNode[] = []

  React.Children.forEach(children, (item, index) => {
    if (!React.isValidElement(item)) return
    if (item.type == 'tab') {
      const { label, children: _children, ..._props } = item.props
      TabList.push(
        <JoyTab key={index} className="font-title" {..._props}>
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
    <Card className="overflow-hidden" component="figure">
      <JoyTabs
        className="bg-transparent"
        defaultValue={Number.parseInt(activeIndex || '0')}
        sx={{
          '--variant-plainHoverBg': '--joy-palette-neutral-plainActiveBg'
        }}
        {...props}
      >
        <JoyTabList tabFlex={1}>{TabList}</JoyTabList>
        {TabPanel}
      </JoyTabs>
    </Card>
  )
}
