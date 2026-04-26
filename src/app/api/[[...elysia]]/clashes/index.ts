import { Elysia } from 'elysia'

import { replaceVariables } from '@/app/dashboard/clashes/_components/utils'
import { getRealIp, getUserVisitInfo } from '@/lib/http/headers'
import { isDev } from '@/lib/utils'

import { idModel } from '../model'
import { Service } from './service'

export const clashes = new Elysia({ prefix: '/clashes' }).use(idModel).get(
  '/:id',
  async ({ params, redirect, request, status }) => {
    const ip = isDev() ? '0.0.0.0' : getRealIp(request)
    if (!ip) return status(401, '未知访问')

    if (!request.headers.get('user-agent')?.toLowerCase().includes('clash')) {
      return redirect(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/ban/clash`)
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
