import { Elysia } from 'elysia'
import z from 'zod'

// 分页验证
export const PaginationQuerySchema = z.strictObject({
  limit: z.coerce.number().int().positive().max(100).optional(),
  page: z.coerce.number().int().positive().optional()
})
export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>
export const paginationModel = new Elysia({ name: 'pagination' }).model({
  'pagination.query': PaginationQuerySchema
})
