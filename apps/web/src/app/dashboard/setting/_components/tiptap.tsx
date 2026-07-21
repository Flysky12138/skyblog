'use client'

import { Button } from '@repo/ui/components/button'
import { ButtonGroup } from '@repo/ui/components/button-group'
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import React from 'react'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'

import { VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

export function Tiptap() {
  const id = React.useId()

  const { data, isLoading, mutate } = useSWR(
    '019fa7ef-e7b6-70ec-9a64-dbbdeb024ea3',
    () => rpc['edge-config'].get({ query: { key: VERCEL_EDGE_CONFIG_KEY.POST_ID_FOR_TAPTIP } }).then(unwrap),
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
          .patch({ items: [{ key: VERCEL_EDGE_CONFIG_KEY.POST_ID_FOR_TAPTIP, operation: 'upsert', value }] })
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
        <FieldLabel htmlFor={id}>Tiptap</FieldLabel>
        <ButtonGroup>
          <Input
            autoComplete="off"
            className="text-ellipsis"
            disabled={disabled}
            id={id}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
