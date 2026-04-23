import { NextResponse } from 'next/server'

import { WeCom } from '@/lib/http/wecom'

export const GET = async () => {
  try {
    await WeCom.markdown_v2(`# Test`)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
