'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
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
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { authClient } from '@/lib/auth/client'

import { AuthEmailButton } from '../_components/auth-email-button'
import { AuthSocialButton } from '../_components/auth-social-button'
import { authBaseSchema } from '../utils'

const formSchema = authBaseSchema.pick({ email: true, name: true, password: true })

export default function Page() {
  const [showPassword, setShowPassword] = React.useState(false)

  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '', name: '', password: '' },
    resolver: zodResolver(formSchema)
  })

  const [{ loading }, onSubmit] = useAsyncFn(async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await authClient.signUp.email(values)
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success('注册成功，还需验证邮箱')
        router.replace(`/auth/email-otp?email=${data.user.email}&type=email-verification`)
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  return (
    <Card className="p-card w-full max-w-sm rounded-xl">
      <FieldSet disabled={loading}>
        <FieldLegend>注册</FieldLegend>
        <FieldDescription>请输入您的信息以创建帐户</FieldDescription>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>用户名</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} autoComplete="name" id={field.name} placeholder="用户名" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
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
                  <FieldLabel htmlFor={field.name}>密码</FieldLabel>
                  <InputGroup className="overflow-hidden">
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      id={field.name}
                      placeholder="密码"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <InputGroupAddon align="inline-end" className="pl-1">
                      <InputGroupButton
                        className="rounded-full"
                        size="icon-xs"
                        onClick={() => {
                          setShowPassword(v => !v)
                        }}
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">创建一个帐户</Button>
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
              已有账号？
              <Link aria-disabled={loading} className="text-foreground" href="/auth/sign-in">
                登录
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
