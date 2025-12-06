import { z } from 'zod'

export const AlbumResponseSchema = z.object({
  hasMore: z.boolean(),
  songCount: z.int(),
  songs: z
    .object({
      dt: z.int(),
      id: z.int(),
      name: z.string(),
      publishTime: z.number().int(),
      al: z.object({
        id: z.int(),
        name: z.string(),
        picUrl: z.url()
      }),
      ar: z
        .object({
          id: z.int(),
          name: z.string()
        })
        .array()
    })
    .array()
})
export type AlbumResponseType = z.infer<typeof AlbumResponseSchema>

export const LyricResponseSchema = z.object({
  lrc: z
    .object({
      lyric: z.string(),
      time: z.number()
    })
    .array()
    .nullable()
})
export type LyricResponseType = z.infer<typeof LyricResponseSchema>

export const PlaylistResponseSchema = AlbumResponseSchema
export type PlaylistResponseType = z.infer<typeof PlaylistResponseSchema>

export const SearchQuerySchema = z.object({
  keywords: z.string().nonempty(),
  limit: z.coerce.number().int().positive().default(100).optional(),
  page: z.coerce.number().int().nonnegative().default(0).optional(),
  /**
   * 1: 单曲\
   * 10: 专辑\
   * 100: 歌手\
   * 1000: 歌单\
   * 1002: 用户\
   * 1004: MV\
   * 1006: 歌词\
   * 1009: 电台\
   * 1014: 视频\
   * 1018: 综合
   */
  type: z.literal([1, 10, 100, 1000, 1002, 1004, 1006, 1009, 1014, 1018]).default(1).optional()
})
export const SearchResponseSchema = AlbumResponseSchema
export type SearchQueryType = z.infer<typeof SearchQuerySchema>
export type SearchResponseType = z.infer<typeof SearchResponseSchema>

export const SongUrlQuerySchema = z.object({
  /**
   * `standard` => 标准 \
   * `higher`   => 较高 \
   * `exhigh`   => 极高 \
   * `lossless` => 无损 \
   * `hires`    => Hi-Res \
   * `jyeffect` => 高清环绕声 \
   * `sky`      => 沉浸环绕声 \
   * `jymaster` => 超清母带
   */
  level: z.enum(['exhigh', 'higher', 'hires', 'jyeffect', 'jymaster', 'lossless', 'sky', 'standard']).default('lossless').optional()
})
export const SongUrlResponseSchema = SongUrlQuerySchema.pick({ level: true })
  .extend({
    encodeType: z.string(),
    id: z.int(),
    md5: z.string(),
    size: z.number(),
    time: z.number(),
    type: z.string(),
    url: z.url()
  })
  .array()
export type SongUrlQueryType = z.infer<typeof SongUrlQuerySchema>
export type SongUrlResponseType = z.infer<typeof SongUrlResponseSchema>
