'use client'

import React from 'react'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { VERCEL_EDGE_CONFIG } from '@/lib/constants'
import { Toast } from '@/lib/toast'
import { get, patch } from '@/server/edge-config'

export const NeteaseCloudMusic = () => {
  const id = React.useId()

  const {
    data: cookie,
    isLoading,
    mutate: setCookie
  } = useSWR('0198eb7d-3b40-742f-92ae-219524cbafa9', () => get<string>(VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE), {
    fallbackData: ''
  })

  const [{ loading }, handleUpdate] = useAsyncFn(async cookie => {
    await Toast(patch([{ key: VERCEL_EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE, operation: 'upsert', value: cookie }], ['NETEASE_CLOUD_MUSIC_COOKIE']), {
      success: '修改成功'
    })
  }, [])

  const disabled = isLoading || loading

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={id}>网易云音乐</FieldLabel>
        <ButtonGroup>
          <Input
            autoComplete="off"
            className="text-ellipsis"
            disabled={disabled}
            id={id}
            placeholder="网易云音乐 Cookie"
            value={cookie}
            onChange={event => {
              setCookie(event.target.value)
            }}
          />
          <Button
            disabled={disabled}
            variant="outline"
            onClick={() => {
              handleUpdate(cookie)
            }}
          >
            修改
          </Button>
        </ButtonGroup>
      </Field>
    </FieldGroup>
  )
}
