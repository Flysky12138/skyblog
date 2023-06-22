import { ImageInfoPostRequest } from '@/app/api/dashboard/image-info/route'
import Image from '@/components/Image'
import { EXT, REDIS } from '@/lib/constants'
import { getAllGithubRepos, githubFileDirectUrl } from '@/lib/server/github'
import { kv } from '@vercel/kv'
import Images from './Images'
import Masonry, { MasonryProps } from './Masonry'

interface GithubImagesProps extends MasonryProps {
  groupDeep: string
  path: string
}

export default async function GithubImages({ path, groupDeep, ...props }: GithubImagesProps) {
  const files = await getAllGithubRepos(path)

  const fileGroupMap = new Map<string, Array<GithubRepoTree['tree'][number] & ImageInfoPostRequest['value']>>()
  const imagesInfo: Partial<Record<string, ImageInfoPostRequest['value']>> = await kv.json.get(REDIS.IMAGES)

  for (const file of files.tree) {
    if (!EXT.IMAGE.some(ext => file.path.endsWith(ext))) continue
    const endIndex = path.split('/').length + Number.parseInt(groupDeep)
    const key = file.path.split('/').slice(0, endIndex).join('/')
    const imageInfo = imagesInfo[file.sha]
    if (imageInfo) fileGroupMap.set(key, (fileGroupMap.get(key) || []).concat(Object.assign({}, file, imageInfo)))
  }

  return (
    <Masonry {...props}>
      {Array.from(fileGroupMap).map(([key, files]) => (
        <Images key={key} defaultAlt={key}>
          {files.map(file => (
            <Image key={file.sha} alt={file.path} height={file.height} src={githubFileDirectUrl(file.path)} width={file.width} />
          ))}
        </Images>
      ))}
    </Masonry>
  )
}
