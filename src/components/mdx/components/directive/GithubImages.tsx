import { ImageInfoPostRequestType } from '@/app/api/dashboard/image-info/route'
import { EXT, REDIS } from '@/lib/keys'
import { getAllGithubRepos, githubFileDirectUrl } from '@/lib/server/github'
import { kv } from '@vercel/kv'
import Img from '../Img'
import Images from './Images'
import Masonry, { MasonryPropsType } from './Masonry'

interface GithubImagesPropsType extends MasonryPropsType {
  groupDeep: string
  path: string
}

export default async function GithubImages({ path, groupDeep, ...props }: GithubImagesPropsType) {
  const files = await getAllGithubRepos(path)

  const fileGroupMap = new Map<string, Array<GithubRepoTreeType['tree'][number] & ImageInfoPostRequestType['value']>>()
  const imagesInfo: Partial<Record<string, ImageInfoPostRequestType['value']>> = await kv.json.get(REDIS.IMAGES)

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
            <Img key={file.sha} alt={file.path} height={file.height} src={githubFileDirectUrl(file.path)} width={file.width} />
          ))}
        </Images>
      ))}
    </Masonry>
  )
}
