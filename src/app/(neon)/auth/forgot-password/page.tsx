'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { Controller, useForm } from 'react-hook-form'
import { useAsyncFn } from 'react-use'
import { toast } from 'sonner'
import { z } from 'zod'

import { Card } from '@/components/static/card'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/client'

import { AuthEmailButton } from '../_components/auth-email-button'
import { AuthSocialButton } from '../_components/auth-social-button'
import { authBaseSchema } from '../utils'

const formSchema = authBaseSchema.pick({ email: true })

export default function Page() {
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema)
  })

  const [{ loading }, onSubmit] = useAsyncFn(async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await authClient.requestPasswordReset({
        ...values,
        redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/reset-password`
      })
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success(data.message)
        router.replace('/auth/sign-in')
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  return (
    <Card className="p-card w-full max-w-sm rounded-xl">
      <FieldSet disabled={loading}>
        <FieldLegend>忘记密码</FieldLegend>
        <FieldDescription>请输入您的邮箱地址以重置密码</FieldDescription>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>邮箱</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="email" id={field.name} placeholder="m@example.com" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">发送重置链接</Button>
              <AuthEmailButton loading={loading} />
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
