import { Geo as GeoPrimitive } from '@vercel/functions'
import { userAgent } from 'next/server'

declare global {
  namespace PrismaJson {
    type Agent = null | ReturnType<typeof userAgent>
    type ClashVariables = null | Record<string, any>
    type Geo = GeoPrimitive | null
  }
}
