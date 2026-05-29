import { z } from 'zod'

import { SongDetailResponseSchema } from './songs/model'

export const AlbumResponseSchema = z.object({
  hasMore: z.boolean(),
  songCount: z.int(),
  songs: SongDetailResponseSchema.array()
})
export type AlbumResponseType = z.infer<typeof AlbumResponseSchema>

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
