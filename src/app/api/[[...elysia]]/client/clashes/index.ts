import { Elysia } from 'elysia'

import { getRealIp, getUserVisitInfo } from '@/lib/http/headers'
import { replaceVariables } from '@/lib/parser/string'
import { isDev } from '@/lib/utils'

import { idModel } from '../../model'
import htmlRaw from './index.html?raw'
import { Service } from './service'

export const clashes = new Elysia({ prefix: '/clashes' }).use(idModel).get(
  '/:id',
  async ({ params, request, status }) => {
    const ip = isDev() ? '0.0.0.0' : getRealIp(request)
    if (!ip) return status(401, '未知访问')

    if (!request.headers.get('user-agent')?.toLowerCase().includes('clash')) {
      const html = htmlRaw.replace(/{s*(\w+)\s*}/g, (substring, key) => process.env[key] ?? substring)
      return new Response(html, {
        headers: {
          'content-type': 'text/html; charset=utf8'
        }
      })
    }

    const res = await Service.detail(params.id, getUserVisitInfo(request))
    const yaml = res.templateId ? replaceVariables(res.template?.content, res.variables) : res.content

    return new Response(yaml, {
      headers: {
        'content-disposition': `attachment; filename=${res.name}.yaml`,
        'content-type': 'text/plain; charset=utf8'
      }
    })
  },
  {
    params: 'uuidv7'
  }
)
