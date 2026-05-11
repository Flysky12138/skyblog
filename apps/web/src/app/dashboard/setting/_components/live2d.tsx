'use client'

import { useAsyncFn } from '@repo/react-hooks'
import { Button } from '@repo/ui/components/button'
import { ButtonGroup } from '@repo/ui/components/button-group'
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import React from 'react'
import useSWR from 'swr'

import { VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

export function Live2D() {
  const id = React.useId()

  const {
    data: src,
    isLoading,
    mutate
  } = useSWR(
    '0198eb99-8641-71ad-be7d-5ef3f52eda9b',
    () => rpc['edge-config'].get.get({ query: { key: VERCEL_EDGE_CONFIG_KEY.LIVE2D_SRC } }).then(unwrap) as Promise<string>,
    {
      fallbackData: ''
    }
  )

  const [{ loading }, handleUpdate] = useAsyncFn(async (value: string) => {
    try {
      await toastPromise(
        rpc.dashboard['edge-config'].action.patch({ items: [{ key: VERCEL_EDGE_CONFIG_KEY.LIVE2D_SRC, operation: 'upsert', value }] }),
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
        <FieldLabel htmlFor={id}>Live2D</FieldLabel>
        <ButtonGroup>
          <Input
            autoComplete="off"
            className="text-ellipsis"
            disabled={disabled}
            id={id}
            placeholder=".json or .zip"
            value={src}
            onChange={event => {
              void mutate(event.target.value, {
                revalidate: false
              })
            }}
          />
          <Button
            disabled={disabled}
            variant="outline"
            onClick={() => {
              void handleUpdate(src)
            }}
          >
            修改
          </Button>
        </ButtonGroup>
      </Field>
    </FieldGroup>
  )
}
