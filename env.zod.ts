import { z } from 'zod'

const Url = z.url({ protocol: /^https?$/ }).refine(it => !it.endsWith('/'))

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgresql://'),
  EDGE_ID: z.templateLiteral([z.string().length(4), '_', z.string()]),
  NEON_AUTH_BASE_URL: Url.endsWith('neondb/auth'),
  NEON_AUTH_COOKIE_SECRET: z.base64().length(44),
  NEXT_PUBLIC_CDN_FFMPEG: z.httpUrl().endsWith('/'),
  NEXT_PUBLIC_CDN_MONACO_EDITOR: z.string().endsWith('min/vs'),
  NEXT_PUBLIC_DESCRIPTION: z.string(),
  NEXT_PUBLIC_GITHUB_NAME: z.string(),
  NEXT_PUBLIC_PAGE_POSTCARD_COUNT: z.coerce.number().min(3).max(20),
  NEXT_PUBLIC_R2_URL: Url,
  NEXT_PUBLIC_TITLE: z.string(),
  NEXT_PUBLIC_WEBSITE_URL: Url,
  R2_ACCESS_KEY_ID: z.string().length(32),
  R2_BUCKET_NAME: z.string(),
  R2_S3_API: z.httpUrl().endsWith('.r2.cloudflarestorage.com'),
  R2_SECRET_ACCESS_KEY: z.string().length(64),
  TOKEN_BROWSERLESS: z.uuidv4(),
  TOKEN_IPINFO: z.string().optional(),
  TOKEN_VERCEL: z.string().length(24)
})

const { error, success } = envSchema.safeParse(process.env)

if (!success) {
  console.log('\x1b[31m%s\x1b[0m', JSON.stringify(error.issues, null, 2))
  process.exit(1)
}
