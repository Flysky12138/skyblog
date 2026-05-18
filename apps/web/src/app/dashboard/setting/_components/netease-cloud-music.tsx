'use client'

import { useAsyncFn } from '@repo/react-hooks'
import { Button } from '@repo/ui/components/button'
import { ButtonGroup } from '@repo/ui/components/button-group'
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import React from 'react'
import useSWR from 'swr'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

export function NeteaseCloudMusic() {
  const id = React.useId()

  const { data, isLoading, mutate } = useSWR(
    '0198eb7d-3b40-742f-92ae-219524cbafa9',
    () => rpc['edge-config'].get.get({ query: { key: VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE } }).then(unwrap),
    {
      fallbackData: {
        value: ''
      }
    }
  )

  const [{ loading }, handleUpdate] = useAsyncFn(async (value: string) => {
    try {
      await toastPromise(
        rpc.dashboard['edge-config'].action
          .patch({
            cacheTags: [CACHE_TAG.EDGE_CONFIG.NETEASE_CLOUD_MUSIC_COOKIE],
            items: [{ key: VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE, operation: 'upsert', value }]
          })
          .then(unwrap),
        {
          success: '修改成功'
        }
      )
    } catch (error) {
      console.error(error)
    }
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
            value={data.value}
            onChange={event => {
              void mutate({ value: event.target.value }, false)
            }}
          />
          <Button
            disabled={disabled}
            variant="outline"
            onClick={() => {
              void handleUpdate(data.value ?? '')
            }}
          >
            修改
          </Button>
        </ButtonGroup>
      </Field>
    </FieldGroup>
  )
}
