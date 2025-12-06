import { Mail } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface AuthEmailButtonProps {
  loading?: boolean
}

export function AuthEmailButton({ loading }: AuthEmailButtonProps) {
  return (
    <Button asChild type="button" variant="secondary">
      <Link aria-disabled={loading} href="/auth/email-otp">
        <Mail />
        使用邮箱验证码登录
      </Link>
    </Button>
  )
}
