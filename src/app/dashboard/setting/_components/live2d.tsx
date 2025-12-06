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
              setSrc(event.target.value, {
                revalidate: false
              })
            }}
          />
          <Button
            disabled={disabled}
            variant="outline"
            onClick={() => {
              handleUpdate(src)
            }}
          >
            修改
          </Button>
        </ButtonGroup>
      </Field>
    </FieldGroup>
  )
}
