import { ImageInfoGetResponseType, ImageInfoPostRequest } from '@/app/api/dashboard/image-info/route'
import { ImageFileInfoType, getImageFileInfo } from '@/lib/fileInfo'
import { EXT } from '@/lib/keys'
import { CustomFetch } from '@/lib/server/fetch'
import { getAllGithubRepos, githubFileDirectUrl } from '@/lib/server/github'
import { CustomToast } from '@/lib/toast'
import { CloudSync } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import React from 'react'
import { useToggle } from 'react-use'
import { toast } from 'sonner'

const getImageInfo = async () => {
  return await CustomFetch<ImageInfoGetResponseType>('/api/dashboard/image-info')
}
const postImageInfo = async (sha: string, payload: ImageFileInfoType) => {
  return await CustomFetch<ImageInfoGetResponseType>('/api/dashboard/image-info', {
    body: { key: sha, value: payload } satisfies ImageInfoPostRequest,
    method: 'POST'
  })
}

interface SyncImageInfoProps {
  path: string
}

export default function SyncImageInfo({ path }: SyncImageInfoProps) {
  const [disabled, disabledToggle] = useToggle(false)

  const syncImagesInfo = React.useCallback(async () => {
    disabledToggle()
    let toastId: string | number = 0
    try {
      toastId = toast.loading('1、获取当前路径文件树', { duration: Infinity })
      const { tree } = await getAllGithubRepos(path)
      toast.loading('2、获取已同步图片信息', { id: toastId })
      const { data } = await getImageInfo()
      const imagesInfoMap = new Map(Object.entries(data))
      const needSyncImageInfo = tree.filter(t => EXT.IMAGE.some(ext => t.path.endsWith(ext)) && !imagesInfoMap.has(t.sha))
      if (needSyncImageInfo.length > 0) {
        toast.dismiss(toastId)
        for (let i = 0; i < needSyncImageInfo.length; i++) {
          const { path, sha } = needSyncImageInfo[i]
          try {
            const info = await getImageFileInfo(githubFileDirectUrl(path))
            await CustomToast(postImageInfo(sha, info), `同步成功 ${i + 1}/${needSyncImageInfo.length}`, path)
          } catch (error) {
            toast.error(`同步失败 ${i + 1}/${needSyncImageInfo.length}`, { description: path })
            console.error(error)
          }
        }
      } else {
        toast.info('不存在需要同步项', { duration: 3000, id: toastId })
      }
    } catch (error) {
      toast.dismiss(toastId)
      console.error(error)
    } finally {
      disabledToggle()
    }
  }, [disabledToggle, path])

  return (
    <Tooltip title="更新图片数据">
      <IconButton disabled={disabled} onClick={syncImagesInfo}>
        <CloudSync />
      </IconButton>
    </Tooltip>
  )
}
