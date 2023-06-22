import { REDIS } from '@/lib/constants'
import { kv } from '@vercel/kv'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

void (async () => {
  const images = await kv.json.get(REDIS.IMAGES)
  console.log(Object.keys(images).length)
})()
