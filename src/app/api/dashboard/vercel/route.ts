import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  return NextResponse.json({
    env: process.env,
    headers: Object.fromEntries(request.headers.entries())
  })
}
