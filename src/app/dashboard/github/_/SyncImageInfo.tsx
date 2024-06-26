import { EXT } from '@/lib/constants'
import { getImageFileInfo } from '@/lib/file/info'
import { getAllGithubRepos, githubFileDirectUrl } from '@/lib/server/github'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { CloudSync } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/joy'
import React from 'react'
import { toast } from 'sonner'

interface SyncImageInfoProps {
  path: string
}

export default function SyncImageInfo({ path }: SyncImageInfoProps) {
  const [disabled, setDisabled] = React.useState(false)

  return (
    <Tooltip title="更新图片数据">
      <IconButton
        disabled={disabled || !path}
        onClick={async () => {
          setDisabled(true)
          let toastId: string | number = 0
          try {
            toastId = toast.loading('1、获取当前路径文件树', { duration: Infinity })
            const { tree } = await getAllGithubRepos(path)
            toast.loading('2、获取已同步图片信息', { id: toastId })
            const { data } = await CustomRequest('GET api/dashboard/image-info', {})
            const imagesInfoMap = new Map(Object.entries(data))
            const needSyncImageInfo = tree.filter(t => EXT.IMAGE.some(ext => t.path.endsWith(ext)) && !imagesInfoMap.has(t.sha))
            if (needSyncImageInfo.length > 0) {
              toast.dismiss(toastId)
              for (let i = 0; i < needSyncImageInfo.length; i++) {
                const { path, sha } = needSyncImageInfo[i]
                try {
                  const blob = await fetch(githubFileDirectUrl(path)).then(res => res.blob())
                  const info = await getImageFileInfo(blob)
                  await Toast(
                    CustomRequest('POST api/dashboard/image-info', { body: { key: sha, value: info } }),
                    `同步成功 ${i + 1}/${needSyncImageInfo.length}`,
                    path
                  )
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
          }
          setDisabled(false)
        }}
      >
        <CloudSync />
      </IconButton>
    </Tooltip>
  )
}
