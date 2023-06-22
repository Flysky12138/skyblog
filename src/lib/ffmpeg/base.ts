import { FFmpeg } from '@ffmpeg/ffmpeg'

import { toastPromiseDelay } from '../toast'

export abstract class BaseFFmpeg extends FFmpeg {
  /**
   * 加载 FFmpeg
   */
  async init() {
    if (this.loaded) return

    await toastPromiseDelay(
      this.load({
        coreURL: process.env.NEXT_PUBLIC_CDN_FFMPEG + 'dist/umd/ffmpeg-core.js',
        wasmURL: process.env.NEXT_PUBLIC_CDN_FFMPEG + 'dist/umd/ffmpeg-core.wasm'
      }),
      {
        error: 'Failed to load ffmpeg',
        loading: 'Loading ffmpeg...',
        success: 'FFmpeg loaded successfully'
      }
    )
  }
}
