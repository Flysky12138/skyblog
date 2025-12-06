import { z } from 'zod'

export const authBaseSchema = z.object({
  email: z.email({ error: '请输入正确的邮箱地址 ' }),
  name: z.string().min(2, { error: '用户名长度不能小于 2 个字符' }).max(12, { error: '用户名长度不能大于 12 个字符' }),
  otp: z.string().regex(/^\d+$/, { error: 'OTP 必须为数字' }).length(6, { error: 'OTP 长度必须为 6 个字符' }),
  token: z.string().nonempty({ error: '请输入 Token' }),
  type: z.enum(['email-verification', 'sign-in', 'forget-password']),
  newPassword: z
    .string()
    .regex(/^[\w!@]+$/, { error: '密码只能包含 大小写字母、数字、!@' })
    .min(8, { error: '密码长度不能小于 8 个字符' })
    .max(32, { error: '密码长度不能大于 32 个字符' }),
  password: z
    .string()
    .regex(/^[\w!@]+$/, { error: '密码只能包含 大小写字母、数字、!@' })
    .min(8, { error: '密码长度不能小于 8 个字符' })
    .max(32, { error: '密码长度不能大于 32 个字符' })
})
