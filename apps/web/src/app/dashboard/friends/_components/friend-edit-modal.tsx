'use client'

import { Treaty } from '@elysiajs/eden'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@repo/ui/components-self/card'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldError, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@repo/ui/components/input-group'
import { Spinner } from '@repo/ui/components/spinner'
import { Textarea } from '@repo/ui/components/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { pick } from 'es-toolkit'
import { ImageDownIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAsyncFn } from 'react-use'

import { FriendCreateBodySchema, FriendCreateBodyType } from '@/app/api/[[...elysia]]/dashboard/friends/model'
import { rpc, unwrap } from '@/lib/http/rpc'
import { Storage } from '@/lib/http/storage'
import { toastPromise } from '@/lib/toast'
import { randomString } from '@/lib/utils'

interface FriendEditModalProps {
  children: React.ReactElement
  value?: Treaty.Data<typeof rpc.dashboard.friends.get>[number]
  onSubmit: (payload: FriendCreateBodyType) => Promise<void>
}

export function FriendEditModal({ children, value, onSubmit }: FriendEditModalProps) {
  const [cover, setCover] = React.useState<Treaty.Data<typeof rpc.dashboard.friends.cover.post>>()
  const [oldCover, setOldCover] = React.useState<{ height?: number; url: string; width?: number }>()
  const [needUploadCover, setNeedUploadCover] = React.useState(false)

  const form = useForm({
    defaultValues: { description: null, name: '', screenshotFileId: null, siteUrl: '' },
    resolver: zodResolver(FriendCreateBodySchema)
  })

  const [siteUrl] = form.watch(['siteUrl'])
  const siteUrlInvalid = !FriendCreateBodySchema.shape.siteUrl.safeParse(siteUrl).success

  // 获取封面
  const [{ loading }, handleGetCover] = useAsyncFn(async (url: string) => {
    const data = await rpc.dashboard.friends.cover.post({ url }).then(unwrap)
    setCover(data)
    setNeedUploadCover(true)
  }, [])

  // 上传封面
  const handleUploadCover = async () => {
    if (!needUploadCover) return
    if (!cover) return

    const res = await fetch(cover.data)
    const blob = await res.blob()
    const file = new File([blob], `${randomString(16)}.${cover.ext}`, { type: blob.type })

    return toastPromise(
      Storage.uploadFile({
        file,
        directory: {
          names: ['system', 'friends']
        }
      }),
      {
        loading: '上传封面'
      }
    )
  }

  return (
    <Dialog
      onOpenChange={newOpen => {
        form.reset()
        if (!newOpen) return
        if (value) {
          form.setValues(pick(value, FriendCreateBodySchema.keyof().options))
          if (value.screenshotFile) {
            setOldCover({
              height: value.screenshotFile.metadata?.height,
              url: Storage.getPublicUrl(value.screenshotFile.id),
              width: value.screenshotFile.metadata?.width
            })
          }
        }
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>友链</DialogTitle>
          <DialogDescription>填写友链信息</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={event => {
            void form.handleSubmit(async payload => {
              const data = await handleUploadCover()
              if (data) {
                payload.screenshotFileId = data.id
              }
              await onSubmit(payload)
            })(event)
          }}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel aria-required htmlFor={field.name}>
                    名称
                  </FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="off" id={field.name} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="siteUrl"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel aria-required htmlFor={field.name}>
                    链接
                  </FieldLabel>
                  <InputGroup aria-disabled={loading}>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="text-ellipsis"
                      id={field.name}
                      type="url"
                    />
                    <InputGroupAddon align="inline-end">
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <InputGroupButton
                              aria-label="截图"
                              disabled={siteUrlInvalid}
                              size="icon-xs"
                              onClick={() => {
                                void handleGetCover(field.value)
                              }}
                            >
                              {loading ? <Spinner /> : <ImageDownIcon />}
                            </InputGroupButton>
                          }
                        />
                        <TooltipContent>截图</TooltipContent>
                      </Tooltip>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {(cover ?? oldCover) && (
              <Field>
                <FieldTitle>封面</FieldTitle>
                <Card className="relative overflow-hidden rounded-md">
                  {cover ? (
                    <img data-fancybox height={cover.height} src={cover.data} width={cover.width} />
                  ) : (
                    oldCover && <img data-fancybox height={oldCover.height} src={oldCover.url} width={oldCover.width} />
                  )}
                  {(cover ?? oldCover) && (
                    <Button
                      className="absolute top-2 right-2"
                      size="icon-sm"
                      onClick={() => {
                        setOldCover(undefined)
                        setCover(undefined)
                        setNeedUploadCover(false)
                        form.setValue('screenshotFileId', null)
                      }}
                    >
                      <XIcon />
                    </Button>
                  )}
                </Card>
              </Field>
            )}
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>描述</FieldLabel>
                  <Textarea
                    className="min-h-24"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id={field.name}
                    value={field.value ?? undefined}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button loading={form.formState.isSubmitting} type="submit">
                {value ? '保存' : '更新'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
