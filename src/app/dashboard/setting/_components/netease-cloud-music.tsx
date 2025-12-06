'use client'

import React from 'react'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

export function NeteaseCloudMusic() {
  const id = React.useId()

  const {
    data: cookie,
    isLoading,
    mutate: setCookie
  } = useSWR(
    '0198eb7d-3b40-742f-92ae-219524cbafa9',
    () => rpc['edge-config'].get.get({ query: { key: VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE } }).then(unwrap) as Promise<string>,
    {
      fallbackData: ''
    }
  )

  const [{ loading }, handleUpdate] = useAsyncFn(async cookie => {
    await toastPromise(
      rpc.dashboard['edge-config'].action.patch({
        cacheTags: [CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE],
        items: [{ key: VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE, operation: 'upsert', value: cookie }]
      }),
      {
        success: '修改成功'
      }
    )
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
