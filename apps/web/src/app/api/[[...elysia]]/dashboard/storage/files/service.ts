import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { after } from 'next/server'

import { prisma } from '@/lib/prisma'

import { s3 } from '../utils'
import { StorageFileCreateBodyType } from './model'

export abstract class Service {
  /**
   * 创建文件
   */
  static async create({ directory, file, s3Object }: StorageFileCreateBodyType) {
    return prisma.$transaction(async ctx => {
      let currentDirId = directory.id

      for (const name of directory.names ?? []) {
        const dir = await ctx.directory.upsert({
          select: { id: true },
          update: {},
          create: {
            name,
            parentId: currentDirId
          },
          where: {
            parentId_name: {
              name,
              parentId: currentDirId
            }
          }
        })

        currentDirId = dir.id
      }

      const s3 = await ctx.s3Object.upsert({
        create: s3Object,
        select: { id: true },
        update: {
          region: s3Object.region
        },
        where: {
          bucket_objectKey: {
            bucket: s3Object.bucket,
            objectKey: s3Object.objectKey
          }
        }
      })

      return ctx.file.upsert({
        update: {},
        create: {
          ...file,
          directoryId: currentDirId,
          s3ObjectId: s3.id
        },
        include: {
          s3Object: true
        },
        where: {
          directoryId_name_ext: {
            directoryId: currentDirId,
            ext: file.ext,
            name: file.name
          }
        }
      })
    })
  }

  /**
   * 删除文件
   */
  static async delete(id: string) {
    return prisma.$transaction(async ctx => {
      const file = await ctx.file.delete({
        include: { s3Object: true },
        where: { id }
      })

      try {
        await ctx.s3Object.delete({
          where: { id: file.s3ObjectId }
        })
        after(() => s3.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: file.s3Object.objectKey })))
      } catch {
        // 利用外键约束来兜底。说明还有其他 File 引用，忽略即可
      }

      return file
    })
  }
}
