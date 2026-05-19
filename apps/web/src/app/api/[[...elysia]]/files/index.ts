import { Elysia } from 'elysia'

import { idModel } from '../model'
import { Service } from './service'

export const files = new Elysia({ prefix: '/files' }).use(idModel).get(
  '/:id/url',
  async ({ params, redirect, status }) => {
    const url = await Service.url(params.id)

    if (!url) {
      return status(500, { message: '文件不存在' })
    }

    return redirect(url, 307)
  },
  {
    params: 'uuidv7'
  }
)
