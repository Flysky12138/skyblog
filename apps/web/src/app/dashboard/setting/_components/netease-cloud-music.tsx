'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@repo/ui/components/button'
import { ButtonGroup } from '@repo/ui/components/button-group'
import { Field, FieldError, FieldGroup, FieldLabel } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Controller, useForm } from 'react-hook-form'
import { useAsyncFn } from 'react-use'
import useSWR from 'swr'
import z from 'zod'

import { CACHE_TAG, VERCEL_EDGE_CONFIG_KEY } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { toastPromise } from '@/lib/toast'

const formSchema = z.object({
  value: z.string().transform((val, ctx) => {
    if (val === '') return z.NEVER

    const data = Object.fromEntries(
      val.split(';').map(item => {
        const [k, ...rest] = item.split('=')
        return [k.trim(), rest.join('=').trim()]
      })
    )

    const schema = z.object({
      __csrf: z.string().regex(/^[a-f0-9]{32}$/),
      MUSIC_U: z.string().regex(/^[A-Z0-9]{738}$/)
    })

    const result = schema.safeParse(data)

    if (!result.success) {
      schema.keyof().options.forEach(key => {
        if (!(key in data)) {
          ctx.addIssue({ code: 'custom', message: `缺少必要字段 ${key}` })
        }
      })
      result.error.issues.forEach(({ message }) => {
        ctx.addIssue({ code: 'custom', message })
      })
      return z.NEVER
    }

    return Object.entries(result.data)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
  })
})

export function NeteaseCloudMusic() {
  const form = useForm({
    defaultValues: { value: '' },
    resolver: zodResolver(formSchema)
  })

  const { isLoading } = useSWR(
    '0198eb7d-3b40-742f-92ae-219524cbafa9',
    () => rpc['edge-config'].get({ query: { key: VERCEL_EDGE_CONFIG_KEY.NETEASE_CLOUD_MUSIC_COOKIE } }).then(unwrap),
    {
      fallbackData: {
        value: ''
      },
      onSuccess: data => {
        form.setValue('value', data.value)
        form.clearErrors()
      }
    }
  )

  const [{ loading }, onSubmit] = useAsyncFn(async ({ value }: z.infer<typeof formSchema>) => {
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
    <form
      aria-disabled={disabled}
      onSubmit={event => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="value"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>网易云音乐</FieldLabel>
              <ButtonGroup>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="text-ellipsis"
                  id={field.name}
                  placeholder="网易云音乐 Cookie"
                />
                <Button type="submit" variant="outline">
                  修改
                </Button>
              </ButtonGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  )
}
