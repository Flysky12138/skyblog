import { ImageResponse } from 'next/og'

import LogoIcon from './icon.svg'

export const alt = process.env.NEXT_PUBLIC_TITLE
export const size = { height: 180, width: 400 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: 'white',
        display: 'flex',
        fontSize: 48,
        gap: 20,
        height: '100%',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <LogoIcon hanging={60} width={60} />
      {process.env.NEXT_PUBLIC_TITLE}
    </div>,
    {
      ...size
    }
  )
}
