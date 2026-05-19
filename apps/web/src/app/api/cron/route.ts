import { limitAsync } from 'es-toolkit'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

import { Service } from '../[[...elysia]]/dashboard/crons/service'

export const GET = async () => {
  try {
    const crons = await prisma.cron.findMany({
      select: {
        id: true
      },
      where: {
        isEnabled: true
      }
    })
    const limit = limitAsync(Service.run.bind(Service), 10)

    await Promise.allSettled(crons.map(cron => limit(cron.id)))

    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
