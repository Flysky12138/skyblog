import { NextRequest, NextResponse } from 'next/server'
import puppeteer, { Browser } from 'puppeteer-core'

import { CustomResponse } from '@/lib/http/response'
import { prisma } from '@/lib/prisma'

export const GET = async (request: NextRequest, { params }: RouteContext<'/api/friends/[id]/cover'>) => {
  let browser: Browser | null = null
  try {
    const { id } = await params

    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const friend = await prisma.friend.findUnique({ where: { id } })
    if (!friend) return await CustomResponse.error('未找到资源', { status: 404 })

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.TOKEN_BROWSERLESS}`,
      defaultViewport: { height: 900, width: 1600 },
      slowMo: 100
    })
    const page = await browser.newPage()
    await page.goto(friend.url)
    const uint8Array = await page.screenshot({ type: 'webp' }).then(Buffer.from)

    return new NextResponse(uint8Array, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=43200, immutable',
        'Content-Length': String(uint8Array.byteLength),
        'Content-Type': 'image/webp'
      }
    })
  } catch (error) {
    return await CustomResponse.error(error)
  } finally {
    await browser?.close()
  }
}
