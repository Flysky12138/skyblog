import { Geo as GeoPrimitive } from '@vercel/functions'
import { userAgent } from 'next/server'

import { FileMetadataType } from '@/app/api/[[...elysia]]/dashboard/storage/files/model'

declare global {
  namespace PrismaJson {
    type Agent = ReturnType<typeof userAgent>
    type ClashVariables = Record<string, any>
    type FileMetadata = FileMetadataType
    type Geo = GeoPrimitive
  }
}
