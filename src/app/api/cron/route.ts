import { NextResponse } from 'next/server'

import { Service } from '../[[...elysia]]/dashboard/crons/service'

export const GET = async () => {
  try {
    await Service.runAll()
    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
