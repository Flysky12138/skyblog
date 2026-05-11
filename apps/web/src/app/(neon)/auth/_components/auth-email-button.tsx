import { ButtonLink } from '@repo/ui/components/button'
import { MailIcon } from 'lucide-react'

export function AuthEmailButton() {
  return (
    <ButtonLink href="/auth/email-otp" variant="secondary">
      <MailIcon data-icon="inline-start" />
      使用邮箱验证码登录
    </ButtonLink>
  )
}
