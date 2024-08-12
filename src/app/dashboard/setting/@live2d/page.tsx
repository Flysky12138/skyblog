'use client'

import Card from '@/components/layout/Card'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Button, Input } from '@mui/joy'
import React from 'react'
import { useAsync } from 'react-use'

export default function Page() {
  const [src, setSrc] = React.useState('')
  const { loading } = useAsync(() => CustomRequest('GET api/dashboard/live2d', {}).then(res => setSrc(res.src || '')))

  return (
    <section>
      <p className="s-subtitle mb-2">Live2D</p>
      <Card className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[auto_100px]">
        <Input disabled={loading} placeholder=".json or .zip" value={src} onChange={event => setSrc(event.target.value)} />
        <Button disabled={loading} onClick={() => Toast(CustomRequest('PUT api/dashboard/live2d', { body: { src } }), '修改成功')}>
          修改
        </Button>
      </Card>
    </section>
  )
}
