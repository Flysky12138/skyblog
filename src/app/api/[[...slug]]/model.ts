import { Elysia } from 'elysia'
import { z } from 'zod'

// 分页验证
export const PaginationQuerySchema = z.strictObject({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional()
})
export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>
export const paginationModel = new Elysia({ name: 'pagination' }).model({
  'pagination.query': PaginationQuerySchema
})

// ID 验证
export const uuidModel = new Elysia({ name: 'uuid' }).model({
  uuidv4: z.strictObject({
    id: z.uuidv4()
  }),
  uuidv7: z.strictObject({
    id: z.uuidv7()
  })
})
