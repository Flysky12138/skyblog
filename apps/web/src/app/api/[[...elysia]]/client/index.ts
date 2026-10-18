import Elysia from 'elysia'
import { rateLimit } from 'elysia-rate-limit'

import { analytics } from './analytics'
import { edgeConfig } from './edge-config'
import { ipinfo } from './ipinfo'
import { neteaseCloudMusic } from './netease-cloud-music'
import { phrase } from './phrase'
import { posts } from './posts'

export const client = new Elysia()
  .use(
    rateLimit({
      duration: 60_000, // 1-minute window
      max: 30,
      scoping: 'scoped'
    })
  )
  .use(analytics)
  .use(edgeConfig)
  .use(ipinfo)
  .use(neteaseCloudMusic)
  .use(phrase)
  .use(posts)
