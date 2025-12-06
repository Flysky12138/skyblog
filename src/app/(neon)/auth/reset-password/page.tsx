'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAsyncFn } from 'react-use'
import { toast } from 'sonner'
import { z } from 'zod'

import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/client'

import { AuthSocialButton } from '../_components/auth-social-button'
import { authBaseSchema } from '../utils'

const formSchema = authBaseSchema.pick({ newPassword: true, token: true })

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token') ?? ''
  const error = searchParams.get('error') ?? ''

  const form = useForm({
    defaultValues: { newPassword: '', token },
    resolver: zodResolver(formSchema)
  })

  const [{ loading }, onSubmit] = useAsyncFn(async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await authClient.resetPassword(values)
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success('密码重置成功，请登录')
        router.replace('/auth/sign-in')
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  React.useEffect(() => {
    if (!error) return
    toast.error(error)
    router.replace('/auth/forgot-password')
  }, [error, router])

  return (
    <Card className="p-card w-full max-w-sm rounded-xl">
      <FieldSet disabled={loading}>
        <FieldLegend>重置密码</FieldLegend>
        <FieldDescription>请在下方输入您的新密码</FieldDescription>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>新密码</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="new-password" id={field.name} placeholder="新密码" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">保存新密码</Button>
            </Field>
          </FieldGroup>
        </form>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-0">或者</FieldSeparator>

        <FieldGroup>
          <Field>
            <AuthSocialButton />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <FieldDescription className="flex items-center justify-center gap-1.5">
              <ArrowLeft size={16} />
              <Link className="text-foreground" href="/auth/sign-in">
                返回
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
