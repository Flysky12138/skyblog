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
  static async create({ categories, tags, ...body }: PostCreateBodyType) {
    const data = await prisma.post.create({
      include,
      data: {
        ...body,
        categories: {
          create: categories?.map(name => ({
            category: {
              connectOrCreate: {
                create: { name },
                where: { name }
              }
            }
          }))
        },
        tags: {
          create: tags?.map(name => ({
            tag: {
              connectOrCreate: {
                create: { name },
                where: { name }
              }
            }
          }))
        }
      }
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
          slug: true,
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
  static async update(id: string, { categories, tags, ...body }: PostUpdateBodyType) {
    const data = await prisma.$transaction(async ctx => {
      await ctx.postCategory.deleteMany({
        where: { postId: id }
      })

      await ctx.postTag.deleteMany({
        where: { postId: id }
      })

      return ctx.post.update({
        include,
        where: { id },
        data: {
          ...body,
          categories: {
            create: categories?.map(name => ({
              category: {
                connectOrCreate: {
                  create: { name },
                  where: { name }
                }
              }
            }))
          },
          tags: {
            create: tags?.map(name => ({
              tag: {
                connectOrCreate: {
                  create: { name },
                  where: { name }
                }
              }
            }))
          }
        }
      })
    })

    CacheClear.post(id)

    return data
  }
}
