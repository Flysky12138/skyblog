'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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

const formSchema = authBaseSchema.pick({ email: true, password: true })

export default function Page() {
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(formSchema)
  })

  const [{ loading }, onSubmit] = useAsyncFn(async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await authClient.signIn.email(values)
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success(`登录成功，欢迎 ${data.user.name} 👏`)
        router.replace('/')
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  return (
    <Card className="p-card w-full max-w-sm rounded-xl">
      <FieldSet disabled={loading}>
        <FieldLegend>登录</FieldLegend>
        <FieldDescription>请在下方输入您的邮箱地址以登录您的帐户</FieldDescription>

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
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex justify-between">
                    <FieldLabel className="grow" htmlFor={field.name}>
                      密码
                    </FieldLabel>
                    <Link aria-disabled={loading} className="hover:text-link-foreground text-sm leading-snug" href="/auth/forgot-password">
                      忘记密码？
                    </Link>
                  </div>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                    id={field.name}
                    placeholder="密码"
                    type="password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">登录</Button>
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
            <FieldDescription className="text-center">
              没有账号？
              <Link aria-disabled={loading} className="text-foreground" href="/auth/sign-up">
                注册
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
