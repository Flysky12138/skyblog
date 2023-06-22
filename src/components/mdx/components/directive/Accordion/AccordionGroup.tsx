'use client'

import Card from '@/components/layout/Card'
import { AccordionGroupProps, AccordionGroup as JoyAccordionGroup } from '@mui/joy'
import { accordionDetailsClasses } from '@mui/joy/AccordionDetails'
import { accordionSummaryClasses } from '@mui/joy/AccordionSummary'

export default function AccordionGroup({ children, ...props }: AccordionGroupProps) {
  return (
    <JoyAccordionGroup
      className="overflow-clip"
      component={Card}
      sx={{
        [`& .${accordionSummaryClasses.button}:hover`]: {
          bgcolor: 'transparent !important'
        },
        [`& .${accordionDetailsClasses.content}`]: {
          boxShadow: theme => `inset 0 1px ${theme.vars.palette.divider}`,
          [`&.${accordionDetailsClasses.expanded}`]: {
            paddingBlock: '0.75rem'
          }
        }
      }}
      transition="0.2s"
      {...props}
    >
      {children}
    </JoyAccordionGroup>
  )
}
