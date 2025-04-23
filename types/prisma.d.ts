import { Geo as GeoPrimitive } from '@vercel/functions'
import { userAgent } from 'next/server'

declare global {
  namespace PrismaJson {
    type Agent = ReturnType<typeof userAgent>
    type ClashVariables = Record<string, any>
    type Geo = GeoPrimitive
  }
}
