'use client'

import { Live2DGetResponseType, Live2DPutRequestType } from '@/app/api/dashboard/live2d/route'
import Card from '@/components/layout/Card'
import { CustomFetch } from '@/lib/server/fetch'
import { Toast } from '@/lib/toast'
import { Button, Input } from '@mui/joy'
import React from 'react'
import { useAsync } from 'react-use'

const getLive2D = async () => {
  return await CustomFetch<Live2DGetResponseType>('/api/dashboard/live2d')
}
const putLive2D = async (payload: Live2DPutRequestType) => {
  return await CustomFetch<Live2DGetResponseType>('/api/dashboard/live2d', {
    body: payload,
    method: 'PUT'
  })
}

export default function Page() {
  const [src, setSrc] = React.useState('')
  const { loading } = useAsync(() => getLive2D().then(res => setSrc(res.src || '')))

  return (
    <Card className="grid grid-cols-1 gap-5 md:grid-cols-[auto_100px]" title="Live2D">
      <Input disabled={loading} placeholder=".json or .zip" value={src} onChange={event => setSrc(event.target.value)} />
      <Button disabled={loading} onClick={() => Toast(putLive2D({ src }), '修改成功')}>
        修改
      </Button>
    </Card>
  )
}
