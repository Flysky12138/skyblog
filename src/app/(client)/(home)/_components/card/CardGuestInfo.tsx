'use client'

import Card from '@/components/layout/Card'
import TransitionCollapse from '@/components/transition/TransitionCollapse'
import { CustomRequest } from '@/lib/server/request'
import { Public } from '@mui/icons-material'
import { Typography } from '@mui/joy'
import useSWR from 'swr'

export default function CardGuestInfo() {
  const { data: ipinfo } = useSWR('/api/ipinfo', () => CustomRequest('GET api/ipinfo', {}))

  if (!ipinfo) return null

  return (
    <Card className="space-y-3 overflow-clip p-6" component={TransitionCollapse}>
      <Typography startDecorator={<Public color="secondary" />}>访客信息</Typography>
      <div className="flex flex-col gap-y-1">
        {Object.entries(ipinfo).map(([label, content]) => (
          <div key={label} className="flex gap-x-3">
            <Typography className="shrink-0" level="body-sm">
              {label}:
            </Typography>
            <Typography className="grow break-all text-end" level="body-sm">
              {String(content)}
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  )
}
