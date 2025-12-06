import { Elysia } from 'elysia'

import { getRealIp, getUserVisitInfo } from '@/lib/http/headers'
import { replaceVariables } from '@/lib/parser/string'
import { isDev } from '@/lib/utils'

import { uuidModel } from '../../model'
import { Service } from './service'

export const clashes = new Elysia({ prefix: '/clashes' }).use(uuidModel).get(
  '/:id',
  async ({ params, request, set, status }) => {
    const ip = isDev() ? '0.0.0.0' : getRealIp(request)
    if (!ip) return status(401, '未知访问')

    if (!request.headers.get('user-agent')?.toLowerCase().includes('clash')) {
      const html = (await import('./index.html?raw')).default
      set.headers['content-type'] = 'text/html; charset=utf8'
      return html.replace(/<%=\s*(\w+)\s*%>/g, (substring, key) => process.env[key] ?? substring)
    }

    const res = await Service.detail(params.id, getUserVisitInfo(request))
    const yaml = res.templateId ? replaceVariables(res.template?.content, res.variables) : res.content

    set.headers['content-disposition'] = `attachment; filename="${res.name}.yaml"`
    set.headers['content-type'] = 'text/plain'

    return yaml
  },
  {
    params: 'uuidv7',
    afterHandle: ({ responseValue, set }) => {
      // 上面 set.headers['content-type'] 有 BUG 无效
      if ((responseValue as string).startsWith('<')) {
        set.headers['Content-Type'] = 'text/html; charset=utf8'
      }
    }
  }
)
