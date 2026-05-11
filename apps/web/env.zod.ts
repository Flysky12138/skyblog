import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgresql://'),
  EDGE_ID: z.templateLiteral([z.string().length(4), '_', z.string()]),
  NEON_AUTH_BASE_URL: z.httpUrl().endsWith('neondb/auth'),
  NEON_AUTH_COOKIE_SECRET: z.base64().length(44),
  NEXT_PUBLIC_CDN_FFMPEG: z.httpUrl().endsWith('/'),
  NEXT_PUBLIC_CDN_MONACO_EDITOR: z.string().endsWith('min/vs'),
  NEXT_PUBLIC_DESCRIPTION: z.string(),
  NEXT_PUBLIC_GITHUB_NAME: z.string(),
  NEXT_PUBLIC_PAGE_POSTCARD_COUNT: z.coerce.number().min(3).max(20),
  NEXT_PUBLIC_R2_URL: z.httpUrl().refine(it => !it.endsWith('/')),
  NEXT_PUBLIC_TITLE: z.string(),
  NEXT_PUBLIC_WEBSITE_URL: z.url().refine(it => !it.endsWith('/')),
  R2_ACCESS_KEY_ID: z.string().length(32),
  R2_BUCKET_NAME: z.string(),
  R2_S3_API: z.httpUrl().endsWith('.r2.cloudflarestorage.com'),
  R2_SECRET_ACCESS_KEY: z.string().length(64),
  TOKEN_BROWSERLESS: z.uuidv4(),
  TOKEN_IPINFO: z.string().optional(),
  TOKEN_VERCEL: z.string().length(24),
  WECOM_WEBHOOK_URL: z.templateLiteral(['https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=', z.uuidv4()]).optional()
})

const { error, success } = envSchema.safeParse(process.env)

if (!success) {
  console.log('\x1b[31m%s\x1b[0m', JSON.stringify(error.issues, null, 2))
  process.exit(1)
}
