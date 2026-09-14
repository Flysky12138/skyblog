'use cache'

import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_TAG } from '@/lib/constants'

import Page from './page'

export default async function Loading() {
  cacheLife('max')
  cacheTag(CACHE_TAG.POSTS)

  return <Page params={Promise.resolve({})} searchParams={Promise.resolve({})} />
}
