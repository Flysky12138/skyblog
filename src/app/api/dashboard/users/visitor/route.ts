import prisma from '@/lib/prisma'
import { CustomResponse } from '@/lib/server/response'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

export type GET = MethodRequestType<{
  return: Prisma.PromiseReturnType<typeof dbGet>
  search: {
    page: number
    take: number
  }
}>

const dbGet = async (page: number, take: number) => {
  const skip = (page - 1) * take

  const [data, total] = await prisma.$transaction([
    prisma.visitorInfo.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.visitorInfo.count()
  ])

  return {
    data,
    pagination: { skip, take, total }
  }
}

export const GET = async (request: NextRequest) => {
  try {
    const page = Number.parseInt(request.nextUrl.searchParams.get('page') || '1')
    const take = Number.parseInt(request.nextUrl.searchParams.get('take') || '50')

    const res = await dbGet(page, take)
    return CustomResponse.encrypt(res)
  } catch (error) {
    return CustomResponse.error(error)
  }
}
