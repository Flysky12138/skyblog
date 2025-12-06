'use client'

import useSWR from 'swr'

import { Card } from '@/components/static/card'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import { CustomRequest } from '@/lib/http/request'

export const CardGuestInfo = () => {
  const { data: ipinfo } = useSWR('0198eb97-946a-74df-9214-aebb698e4c11', () => CustomRequest('GET /api/ipinfo', {}))

  if (!ipinfo) {
    return null
  }

  return (
    <Card asChild className="p-card space-y-3 overflow-hidden! will-change-auto">
      <TransitionCollapse>
        <div>访客信息</div>
        <div className="text-muted-foreground flex flex-col gap-1">
          {Object.entries(ipinfo).map(([label, content]) => (
            <div key={label} className="flex gap-3 text-sm">
              <span className="shrink-0">{label}:</span>
              <span className="grow text-end break-all">{String(content)}</span>
            </div>
          ))}
        </div>
      </TransitionCollapse>
    </Card>
  )
}
