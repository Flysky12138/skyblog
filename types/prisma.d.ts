import { Geo as GeoPrimitive } from '@vercel/functions'
import { userAgent } from 'next/server'

declare global {
  namespace PrismaJson {
    type ClashVariables = {
      [key: string]: any
    }
    type Geo = GeoPrimitive
    type Agent = ReturnType<typeof userAgent>
  }
}
