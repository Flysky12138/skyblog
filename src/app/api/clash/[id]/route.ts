import { replaceTextWithObjectValues } from '@/lib/parser/string'
import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { ipAddress } from '@vercel/functions'
import { NextRequest, NextResponse, userAgent } from 'next/server'
import { convertClashGetData } from '../../dashboard/clash/utils'
import { convertVisitorLogSaveData } from '../../dashboard/users/visitor/utils'

export const runtime = 'nodejs'

const dbGet = async (id: string, data: Prisma.VisitorLogCreateInput) => {
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
    where: {
      id,
      enabled: true
    }
  })

  return convertClashGetData(clash)
}

export const GET = async (request: NextRequest, { params }: DynamicRoute<{ id: string }>) => {
  try {
    if (!params.id) return CustomResponse.error('{id} 值缺失', 422)

    const ip = process.env.NODE_ENV == 'development' ? '0.0.0.0' : ipAddress(request)
    if (!ip) return CustomResponse.error('未知访问', 400)

    if (!request.headers.get('user-agent')?.toLowerCase().includes('clash')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const agent = userAgent(request)

    const res = await dbGet(
      params.id,
      convertVisitorLogSaveData({
        agent,
        ip
      })
    )

    const yaml = res.clashTemplateId ? replaceTextWithObjectValues(res.clashTemplates?.content, res.variables) : res.content

    return new Response(yaml, {
      headers: {
        'Content-Disposition': `attachment; filename=${res.name}.yaml`,
        'Content-Type': 'text/plain'
        // 'Profile-Update-Interval': '12' // 自动更新间隔，以小时为单位
      }
    })
  } catch (error) {
    return CustomResponse.error(error)
  }
}
