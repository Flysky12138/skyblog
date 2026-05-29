import { z } from 'zod'

export const SongDetailResponseSchema = z.object({
  dt: z.int(),
  id: z.int(),
  name: z.string(),
  /**
   * 云盘文件信息
   */
  pc: z.looseObject({}).optional(),
  publishTime: z.number().int(),
  al: z.object({
    id: z.int(),
    name: z.string(),
    picUrl: z.httpUrl()
  }),
  ar: z
    .object({
      id: z.int(),
      name: z.string()
    })
    .array()
})
export type SongDetailResponseType = z.infer<typeof SongDetailResponseSchema>

export const LyricResponseSchema = z.object({
  lrcText: z.string().nullable(),
  lrc: z
    .object({
      lyric: z.string(),
      time: z.number()
    })
    .array()
    .nullable()
})
export type LyricResponseType = z.infer<typeof LyricResponseSchema>

export const UrlQuerySchema = z.object({
  /**
   * `standard` => 标准\
   * `higher`   => 较高\
   * `exhigh`   => 极高\
   * `lossless` => 无损\
   * `hires`    => Hi-Res\
   * `jyeffect` => 高清环绕声\
   * `sky`      => 沉浸环绕声\
   * `jymaster` => 超清母带
   */
  level: z.enum(['exhigh', 'higher', 'hires', 'jyeffect', 'jymaster', 'lossless', 'sky', 'standard']).default('lossless').optional()
})
export const UrlResponseSchema = UrlQuerySchema.pick({ level: true })
  .extend({
    encodeType: z.string(),
    id: z.int(),
    md5: z.string(),
    size: z.number(),
    time: z.number(),
    type: z.string(),
    url: z.httpUrl()
  })
  .array()
export type UrlQueryType = z.infer<typeof UrlQuerySchema>
export type UrlResponseType = z.infer<typeof UrlResponseSchema>
