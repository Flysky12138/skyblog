import { replaceTextWithObjectValues } from '@/lib/parser/string'
import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { ipAddress } from '@vercel/functions'
import { NextRequest } from 'next/server'
import { parseVariable } from '../dashboard/clash/lib'

export const runtime = 'nodejs'

const dbGet = async (id: string, data: Prisma.VisitorInfoCreateInput) => {
  const subscribeLastAt = new Date().toISOString()
  const clash = await prisma.clash.update({
    data: {
      subscribeLastAt,
      visitorInfos: {
        create: {
          ...data,
          createdAt: subscribeLastAt
        }
      }
    },
    include: {
      clashTemplates: true,
      visitorInfos: true
    },
    where: { id }
  })

  return parseVariable(clash)
}

export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('subscribe')
    if (!id) return CustomResponse.error('{subscribe} 值缺失', 422)

    const ip = process.env.NODE_ENV == 'development' ? '0.0.0.0' : ipAddress(request)
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

    const yaml = res.clashTemplateId ? replaceTextWithObjectValues(res.clashTemplates?.content, res.variables) : res.content

    return new Response(yaml, {
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
