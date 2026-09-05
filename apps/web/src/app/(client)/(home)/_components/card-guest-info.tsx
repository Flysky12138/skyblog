'use client'

import { Card } from '@repo/components/card'
import { cn } from '@repo/ui/lib/utils'
import { motion } from 'motion/react'
import React from 'react'
import useSWR from 'swr'

import { rpc, unwrap } from '@/lib/http/rpc'

interface CardGuestInfoProps {
  className?: string
}

export function CardGuestInfo({ className }: CardGuestInfoProps) {
  const [hasAnimated, setHasAnimated] = React.useState(false)

  const { data: ipinfo } = useSWR('0198eb97-946a-74df-9214-aebb698e4c11', () => rpc.ipinfo.get().then(unwrap))

  if (!ipinfo) return null

  return (
    <Card
      className={cn('space-y-3 p-card', className)}
      render={
        hasAnimated ? undefined : (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            initial={{ height: 0, opacity: 0 }}
            onAnimationComplete={() => {
              setHasAnimated(true)
            }}
          />
        )
      }
    >
      <div>访客信息</div>
      <div className="space-y-1">
        {Object.entries(ipinfo).map(([label, content]) => (
          <div key={label} className="flex gap-3 text-sm">
            <span className="shrink-0 text-secondary-foreground">{label}:</span>
            <span className="grow text-end break-all text-muted-foreground">{String(content)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
