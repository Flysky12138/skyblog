'use client'

import React from 'react'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { Toast } from '@/lib/toast'
import { get, patch } from '@/server/edge-config'

export const Live2D = () => {
  const id = React.useId()

  const {
    data: src,
    isLoading,
    mutate: setSrc
  } = useSWR('0198eb99-8641-71ad-be7d-5ef3f52eda9b', () => get<string>(VERCEL_EDGE_CONFIG.LIVE2D_SRC), {
    fallbackData: ''
  })

  const [{ loading }, handleUpdate] = useAsyncFn(async src => {
    await Toast(patch([{ key: VERCEL_EDGE_CONFIG.LIVE2D_SRC, operation: 'upsert', value: src }]), {
      success: '修改成功'
    })
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Live2D</Label>
      <div className="flex gap-2">
        <Input
          className="text-ellipsis"
          disabled={isLoading || loading}
          id={id}
          placeholder=".json or .zip"
          value={src}
          onChange={event => {
            setSrc(event.target.value, {
              revalidate: false
            })
          }}
        />
        <Button
          className="w-40"
          disabled={isLoading || loading}
          onClick={() => {
            handleUpdate(src)
          }}
        >
          修改
        </Button>
      </div>
    </div>
  )
}
