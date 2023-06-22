import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { VisitorInfo } from '@prisma/client'
import { ipAddress } from '@vercel/edge'
import { NextRequest } from 'next/server'

interface ClashGetRequestType extends Pick<VisitorInfo, 'agent' | 'ip'> {}

const dbGet = async (id: string, data: ClashGetRequestType) => {
  const clash = await prisma.clash.findUnique({
    include: {
      visitorInfos: true
    },
    where: { id }
  })

  if (!clash) return null

  // 添加订阅记录
  const subscribeLastAt = new Date().toISOString()
  await prisma.clash.update({
    data: {
      subscribeLastAt,
      subscribeTimes: { increment: 1 },
      visitorInfos: {
        create: {
          ...data,
          createdAt: subscribeLastAt
        }
      }
    },
    where: { id }
  })

  return clash
}

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('subscribe')
    if (!id) return CustomResponse.error('{subscribe} 值缺失', 422)

    const ip = process.env.NODE_ENV == 'development' ? '1.1.1.1' : ipAddress(request)
    if (!ip) return CustomResponse.error('未知访问', 400)

    const agent = request.headers.get('user-agent')
    if (!agent?.toLowerCase().includes('clash')) {
      return new Response(`<p align="center" style="margin-top:30dvh">禁止从非客户端获取资源</p>`, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        },
        status: 451
      })
    }

    const res = await dbGet(id, { agent, ip })
    if (!res) return CustomResponse.error('资源获取失败', 404)

    return new Response(res.content, {
      headers: {
        'Content-Disposition': `attachment; filename="${res.name}.yaml"`,
        'Content-Type': 'text/plain'
        // 'Profile-Update-Interval': '12' // 自动更新间隔，以小时为单位
      }
    })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
