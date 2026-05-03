import { MailIcon } from 'lucide-react'

import { ButtonLink } from '@/components/ui-overwrite/button'

interface AuthEmailButtonProps {
  loading?: boolean
}

export function AuthEmailButton({ loading }: AuthEmailButtonProps) {
  return (
    <ButtonLink aria-disabled={loading} href="/auth/email-otp" variant="secondary">
      <MailIcon data-icon="inline-start" />
      使用邮箱验证码登录
    </ButtonLink>
  )
}
