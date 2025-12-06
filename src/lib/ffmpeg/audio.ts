import { fetchFile } from '@ffmpeg/util'

import { BaseFFmpeg } from './base'

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
    albumArtist: string
    artist: string
    title: string
    year?: number
  }
}

export class AudioFFmpeg extends BaseFFmpeg {
  /**
   * 修改音频信息
   */
  async updateAudioMetadata({ audio, cover, metadata }: UpdateAudioMetadataProps) {
    const audioFileName = `input.${audio.ext}`
    const coverFileName = `cover.${cover.ext}`
    const outputFileName = `output.${audio.ext}`

    await this.writeFile(audioFileName, await fetchFile(audio.content))
    await this.writeFile(coverFileName, await fetchFile(cover.content))

    switch (audio.ext.toLowerCase()) {
      case 'flac':
        await this.exec(
          [
            ['-i', audioFileName],
            ['-i', coverFileName],
            ['-map', '0'],
            ['-map', '1'],
            ['-c', 'copy'],
            ['-metadata', `title=${metadata.title}`],
            ['-metadata', `artist=${metadata.artist}`],
            ['-metadata', `album=${metadata.album}`],
            ['-metadata', `album_artist=${metadata.albumArtist}`],
            metadata.year ? ['-metadata', `date=${metadata.year}`] : [],
            ['-metadata:s:v', 'comment=Cover (front)'],
            ['-disposition:v:0', 'attached_pic'],
            outputFileName
          ].flat()
        )
        break
      case 'mp3':
        await this.exec(
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
            ['-metadata', `album_artist=${metadata.albumArtist}`],
            metadata.year ? ['-metadata', `date=${metadata.year}`] : [],
            ['-metadata:s:v', 'comment=Cover (front)'],
            outputFileName
          ].flat()
        )
        break
    }

    const data = await this.readFile(outputFileName)
    return data as Uint8Array<ArrayBuffer>
  }
}
