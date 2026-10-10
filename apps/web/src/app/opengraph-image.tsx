import { ShadcnRegistry4 } from '@repo/ui/components/og/shadcn-registry-4'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'

export const alt = process.env.NEXT_PUBLIC_TITLE
export const size = {
  height: 630,
  width: 1200
}

export default async function OpengraphImage() {
  const base64 = await readFile(new URL('~/public/icons/icon-256x256.png', import.meta.url), 'base64')
  const src = `data:image/png;base64,${base64}`

  return new ImageResponse(
    <ShadcnRegistry4
      logo={src}
      name={process.env.NEXT_PUBLIC_TITLE}
      title={process.env.NEXT_PUBLIC_DESCRIPTION}
      url={process.env.NEXT_PUBLIC_WEBSITE_URL.replace(/https?:\/\//, '')}
    />,
    {
      ...size
    }
  )
}
