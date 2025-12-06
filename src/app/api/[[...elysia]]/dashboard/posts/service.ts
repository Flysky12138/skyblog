import { Prisma } from '@/generated/prisma/client'
import { CacheClear } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

import { PaginationQueryType } from '../../model'
import { PostCreateBodyType, PostUpdateBodyType } from './model'

const include = {
  categories: {
    select: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true
        }
      }
    }
  }
} satisfies Prisma.PostInclude

export abstract class Service {
  /**
   * 创建文章
   */
  static async create(body: PostCreateBodyType) {
    const data = await prisma.post.create({
      data: {
        authorId: body.authorId,
        categories: {
          create: body.categories?.map(name => ({
            category: {
              connectOrCreate: {
                create: { name },
                where: { name }
              }
            }
          }))
        },
        content: body.content,
        pinOrder: body.pinOrder,
        summary: body.summary,
        tags: {
          create: body.tags?.map(name => ({
            tag: {
              connectOrCreate: {
                create: { name },
                where: { name }
              }
            }
          }))
        },
        title: body.title,
        visibilityMask: body.visibilityMask
      },
      include
    })

    CacheClear.post(data.id)
    CacheClear.posts()

    return data
  }

  /**
   * 删除文章
   */
  static async delete(id: string) {
    const data = await prisma.post.delete({
      where: { id }
    })

    CacheClear.post(id)
    CacheClear.posts()

    return data
  }

  /**
   * 获取文章详情
   */
  static async detail(id: string) {
    return prisma.post.findUnique({
      include,
      where: { id }
    })
  }

  /**
   * 获取文章列表
   */
  static async list({ limit = 10, page = 1 }: PaginationQueryType) {
    const [posts, pagination] = await prisma.post
      .paginate({
        orderBy: {
          updatedAt: 'desc'
        },
        select: {
          createdAt: true,
          id: true,
          isPublished: true,
          summary: true,
          title: true,
          updatedAt: true,
          viewCount: true,
          ...include
        }
      })
      .withPages({ limit, page })

    return {
      pagination,
      posts
    }
  }

  /**
   * 更新文章
   */
  static async update(id: string, body: PostUpdateBodyType) {
    const data = await prisma.$transaction(async ctx => {
      await ctx.postCategory.deleteMany({
        where: { postId: id }
      })

      await ctx.postTag.deleteMany({
        where: { postId: id }
      })

      return ctx.post.update({
        data: {
          categories: {
            create: body.categories?.map(name => ({
              category: {
                connectOrCreate: {
                  create: { name },
                  where: { name }
                }
              }
            }))
          },
          content: body.content,
          isPublished: body.isPublished,
          pinOrder: body.pinOrder,
          summary: body.summary,
          tags: {
            create: body.tags?.map(name => ({
              tag: {
                connectOrCreate: {
                  create: { name },
                  where: { name }
                }
              }
            }))
          },
          title: body.title,
          updatedAt: body.updatedAt,
          visibilityMask: body.visibilityMask
        },
        include,
        where: { id }
      })
    })

    CacheClear.post(id)

    return data
  }
}
