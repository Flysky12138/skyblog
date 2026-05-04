'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'es-toolkit'
import { LockIcon } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { Controller, useForm } from 'react-hook-form'
import { useAsyncFn } from 'react-use'
import { toast } from 'sonner'
import { z } from 'zod'

import { ButtonLink } from '@/components/ui-overwrite/button'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth/client'

import { AuthSocialButton } from '../_components/auth-social-button'
import { authSchema } from '../utils'

const formSchema = authSchema.pick({ email: true, otp: true, type: true })

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get('email') ?? ''
  const type = (searchParams.get('type') ?? 'sign-in') as z.infer<typeof formSchema>['type']

  const isSignIn = type == 'sign-in'

  const form = useForm({
    defaultValues: { email, otp: '', type },
    resolver: zodResolver(formSchema)
  })

  // 发送邮件验证码
  const [{ loading: loading1 }, onSendEmail] = useAsyncFn(async () => {
    try {
      const invalid = await form.trigger('email')
      if (!invalid) return
      const { error } = await authClient.emailOtp.sendVerificationOtp(pick(form.getValues(), ['email', 'type']))
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success('发送成功')
        form.resetField('otp')
        form.setFocus('otp')
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  // 验证邮箱/登录
  const [{ loading: loading2 }, onSubmit] = useAsyncFn(async (values: z.infer<typeof formSchema>) => {
    try {
      const fn = isSignIn ? authClient.signIn.emailOtp : authClient.emailOtp.verifyEmail
      const { data, error } = await fn(pick(values, ['email', 'otp']))
      if (error) {
        throw new Error(error.message)
      } else {
        toast.success(`验证成功，欢迎 ${data.user.name} 👏`)
        router.replace('/')
      }
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  const loading = loading1 || loading2

  return (
    <FieldSet disabled={loading} inert={loading}>
      <FieldLegend>邮箱验证码</FieldLegend>
      <FieldDescription>请输入您的邮箱地址以获取验证码</FieldDescription>

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
            name="otp"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>验证码</FieldLabel>
                <InputOTP maxLength={6} {...field} aria-invalid={fieldState.invalid} id={field.name}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="button" onClick={onSendEmail}>
                发送验证码
              </Button>
              <Button type="submit">{isSignIn ? '登录' : '验证邮箱'}</Button>
            </div>
            <ButtonLink href="/auth/sign-in" variant="secondary">
              <LockIcon data-icon="inline-start" />
              使用密码登录
            </ButtonLink>
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
            <Link className="text-foreground" href="/auth/sign-up">
              注册
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
