'use client'

import React from 'react'
import useSWR from 'swr'
import { Label } from 'ui/label'

import { Card } from '@/components/layout/card'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import { CustomRequest } from '@/lib/http/request'

export const CardGuestInfo = () => {
  const { data: ipinfo } = useSWR('8b23c2c2-1589-5bb2-82e6-7e1fd8943707', () => CustomRequest('GET api/ipinfo', {}))

  const id = React.useId()

  if (!ipinfo) return null

  return (
    <Card asChild className="p-card space-y-3 overflow-clip">
      <TransitionCollapse>
        <Label htmlFor={id}>访客信息</Label>
        <div className="flex flex-col gap-1" id={id}>
          {Object.entries(ipinfo).map(([label, content]) => (
            <div key={label} className="text-subtitle-foreground flex gap-3 text-sm">
              <span className="shrink-0">{label}:</span>
              <span className="grow text-end break-all">{String(content)}</span>
            </div>
          ))}
        </div>
      </TransitionCollapse>
    </Card>
  )
}
