'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'

export const Live2D = () => {
  const {
    isLoading,
    data,
    mutate: setData
  } = useSWR('83724997-81e4-585a-babe-c007cc366f7f', () => CustomRequest('GET api/dashboard/live2d', {}), {
    fallbackData: {
      src: ''
    }
  })

  const [{ loading }, handleUpdate] = useAsyncFn(async src => {
    await Toast(CustomRequest('PUT api/dashboard/live2d', { body: { src } }), {
      success: '修改成功'
    })
  })

  return (
    <section className="flex flex-col gap-2">
      <Label>Live2D</Label>
      <div className="flex gap-2">
        <Input
          disabled={isLoading || loading}
          placeholder=".json or .zip"
          value={data?.src}
          onChange={event => {
            setData(
              produce(state => {
                state.src = event.target.value
              }),
              {
                revalidate: false
              }
            )
          }}
        />
        <Button
          className="w-40"
          disabled={isLoading || loading}
          onClick={() => {
            handleUpdate(data?.src)
          }}
        >
          修改
        </Button>
      </div>
    </section>
  )
}
