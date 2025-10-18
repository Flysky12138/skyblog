import { Prisma } from '@prisma/client'
import { NextRequest, userAgent } from 'next/server'

import { getRealIp } from '@/lib/http/headers'
import { CustomResponse } from '@/lib/http/response'
import { replaceVariables } from '@/lib/parser/string'
import { prisma } from '@/lib/prisma'
import { isDev } from '@/lib/utils'

const dbGet = async (id: string, data: Prisma.VisitorLogCreateInput) => {
  const subscribeLastAt = new Date().toISOString()

  return prisma.clash.update({
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
      enabled: true,
      id
    }
  })
}

export const GET = async (request: NextRequest, { params }: RouteContext<'/api/clash/[id]'>) => {
  try {
    const { id } = await params
    if (!id) return await CustomResponse.error('{id} 值缺失', { status: 400 })

    const ip = isDev() ? '0.0.0.0' : getRealIp(request)
    if (!ip) return await CustomResponse.error('未知访问', { status: 401 })

    if (!request.headers.get('user-agent')?.toLowerCase().includes('clash')) {
      const html = (await import('./index.html?raw')).default
      return new Response(
        html.replace(/<%=\s*(\w+)\s*%>/g, (substring, key) => process.env[key] ?? substring),
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        }
      )
    }

    const agent = userAgent(request)
    const res = await dbGet(id, { agent, ip })
    const yaml = res.clashTemplateId ? replaceVariables(res.clashTemplates?.content, res.variables) : res.content

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
