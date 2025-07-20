import { z } from 'zod'

const Url = z.url({ protocol: /^https?$/ }).refine(it => !it.endsWith('/'))

const envSchema = z.object({
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: Url,
  EDGE_ID: z.templateLiteral([z.string().length(4), '_', z.string()]),
  NEXT_PUBLIC_DESCRIPTION: z.string(),
  NEXT_PUBLIC_ENCRYPT_API: z.stringbool({
    falsy: ['false'],
    truthy: ['true']
  }),
  NEXT_PUBLIC_GITHUB_NAME: z.string(),
  NEXT_PUBLIC_PAGE_POSTCARD_COUNT: z.coerce.number().min(3).max(20),
  NEXT_PUBLIC_R2_BUCKET_NAME: z.string(),
  NEXT_PUBLIC_R2_URL: Url,
  NEXT_PUBLIC_S3_ACCESS_ID: z.string().length(32),
  NEXT_PUBLIC_S3_ACCESS_KEY: z.string().length(64),
  NEXT_PUBLIC_S3_API: z.url().endsWith('.r2.cloudflarestorage.com'),
  NEXT_PUBLIC_TITLE: z.string(),
  NEXT_PUBLIC_WEBSITE_URL: Url,
  TOKEN_BROWSERLESS: z.uuidv4(),
  TOKEN_IPINFO: z.string().optional(),
  TOKEN_VERCEL: z.string().length(24)
})

const { error, success } = envSchema.safeParse(process.env)

if (!success) {
  console.log('\x1b[31m%s\x1b[0m', JSON.stringify(error, null, 2))
  process.exit(1)
}
