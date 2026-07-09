import { Elysia } from 'elysia'

import { crons } from './crons'
import { edgeConfig } from './edge-config'
import { ipinfo } from './ipinfo'
import { neteaseCloudMusic } from './netease-cloud-music'
import { phrase } from './phrase'
import { posts } from './posts'
import { visits } from './visits'

export const client = new Elysia().use(crons).use(edgeConfig).use(ipinfo).use(neteaseCloudMusic).use(phrase).use(posts).use(visits)
