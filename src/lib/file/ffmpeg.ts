import { FFmpeg as _FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { toast } from 'sonner'

interface UpdateAudioMetadataProps {
  audio: {
    content: Blob | File | string
    ext: string
  }
  cover: {
    content: Blob | File | string
    ext: string
  }
  metadata: {
    album: string
    artist: string
    title: string
  }
}

export class FFmpeg {
  #ffmpeg: _FFmpeg

  constructor() {
    this.#ffmpeg = new _FFmpeg()
  }

  async init() {
    if (!this.#ffmpeg.loaded) {
      let id: number | string = 0
      try {
        const timer = setTimeout(() => {
          id = toast.loading('Loading ffmpeg...')
        }, 800)
        await this.#ffmpeg.load({
          coreURL: process.env.NEXT_PUBLIC_CDN_FFMPEG + 'dist/umd/ffmpeg-core.js',
          wasmURL: process.env.NEXT_PUBLIC_CDN_FFMPEG + 'dist/umd/ffmpeg-core.wasm'
        })
        clearTimeout(timer)
      } catch (error) {
        console.error(error)
        throw new Error('FFmpeg 初始化失败')
      } finally {
        toast.dismiss(id)
      }
    }
  }

  /**
   * 修改音频信息
   */
  async updateAudioMetadata({ audio, cover, metadata }: UpdateAudioMetadataProps) {
    const audioFileName = `input.${audio.ext}`
    const coverFileName = `cover.${cover.ext}`
    const outputFileName = `output.${audio.ext}`

    await this.#ffmpeg.writeFile(audioFileName, await fetchFile(audio.content))
    await this.#ffmpeg.writeFile(coverFileName, await fetchFile(cover.content))

    switch (audio.ext.toLowerCase()) {
      case 'flac':
        await this.#ffmpeg.exec(
          [
            ['-i', audioFileName],
            ['-i', coverFileName],
            ['-map', '0'],
            ['-map', '1'],
            ['-c', 'copy'],
            ['-metadata', `title=${metadata.title}`],
            ['-metadata', `artist=${metadata.artist}`],
            ['-metadata', `album=${metadata.album}`],
            ['-metadata:s:v', 'comment=Cover (front)'],
            ['-disposition:v:0', 'attached_pic'],
            outputFileName
          ].flat()
        )
        break
      case 'mp3':
        await this.#ffmpeg.exec(
          [
            ['-i', audioFileName],
            ['-i', coverFileName],
            ['-map', '0:a'],
            ['-map', '1:v'],
            ['-c:a', 'copy'],
            ['-c:v', 'png'],
            ['-id3v2_version', '3'],
            ['-metadata', `title=${metadata.title}`],
            ['-metadata', `artist=${metadata.artist}`],
            ['-metadata', `album=${metadata.album}`],
            ['-metadata:s:v', `title=${metadata.title}`],
            ['-metadata:s:v', 'comment=Cover (front)'],
            outputFileName
          ].flat()
        )
        break
    }

    const data = await this.#ffmpeg.readFile(outputFileName)
    return data as Uint8Array<ArrayBuffer>
  }
}
