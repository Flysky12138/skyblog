import { ButtonLink } from '@repo/ui/components/button'
import { MailIcon } from 'lucide-react'

export function AuthEmailButton() {
  return (
    <ButtonLink href="/auth/email-otp" variant="secondary">
      <MailIcon />
      使用邮箱验证码登录
    </ButtonLink>
  )
}
