import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = async (request: NextRequest) => {
  return NextResponse.json(Object.fromEntries(request.headers.entries()))
}
