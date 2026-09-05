import { Elysia } from 'elysia'
import { z } from 'zod'

import { Service } from './service'

const app = new Elysia({ prefix: '/files' }).get(
  '/:id',
  async ({ params, redirect, status }) => {
    const url = await Service.url(params.id)

    if (!url) {
      return status(500, { message: '文件不存在' })
    }

    return redirect(url, 307)
  },
  {
    params: z.strictObject({
      id: z.uuidv7()
    })
  }
)

export const GET = app.fetch
export const OPTIONS = app.fetch
