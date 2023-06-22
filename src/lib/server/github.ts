/**
 * vercel 有请求尺寸限制，所以直接从客户端上传到 github 仓库。当然 token 会暴露
 * @see https://vercel.com/docs/functions/serverless-functions/runtimes#size-limits
 */

import { ImageInfoPostRequestType } from '@/app/api/dashboard/image-info/route'
import { CustomFetch } from '@/lib/server/fetch'
import { toast } from 'sonner'
import { getImageFileInfo } from '../fileInfo'
import { formatFileSize } from '../parser/size'
import { file2base64 } from '../parser/transcode'

const githubRepoApiUrl = (path: string) => {
  return `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}/contents/${path}?t=${Date.now()}`
}

const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_GITHUB_ACCESS}`,
  'Content-Type': 'application/json'
}

// 直链
export const githubFileDirectUrl = (path: string) => `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/github/${encodeURIComponent(path).replace(/%2F/g, '/')}`

// 获取
export type GithubRepoGetResponseType = Array<GithubRepoFileType | GithubRepoFolderType> | GithubRepoFileType

export const getGithubRepos = async (path: string) => {
  try {
    const data = await CustomFetch<GithubRepoGetResponseType>(githubRepoApiUrl(path), { headers })

    if (Array.isArray(data)) {
      data.sort((a, b) => {
        if (a.type == 'file' && b.type == 'dir') return 1
        if (a.type == 'dir' && b.type == 'file') return -1
        return a.name.localeCompare(b.name)
      })
    }

    return data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

// 获取所有
export const getAllGithubRepos = async (path: string) => {
  try {
    path = decodeURIComponent(path)

    const ref = await CustomFetch<GithubRepoRefType>(
      `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}/git/ref/heads/main?t=${Date.now()}`,
      { headers }
    )

    const trees = await CustomFetch<GithubRepoTreeType>(
      `https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_ACCESS_OWNER_REPO}/git/trees/${ref.object.sha}?recursive=true&t=${Date.now()}`,
      { headers }
    )

    trees.tree = trees.tree.filter(t => t.path.startsWith((path + '/').replace(/^\/+/, '').replace(/\/+$/, '/')) && t.type == 'blob')

    return trees
  } catch (error) {
    return Promise.reject(error)
  }
}

// 上传/修改
export interface GithubRepoPutRequestType {
  branch?: string
  content: string
  message: string
  sha?: string
}

export const putGithubRepos = async (path: string, file: File, body: Partial<Omit<GithubRepoPutRequestType, 'content'>> = {}) => {
  try {
    const base64 = await file2base64(file)
    const [_, base64Content] = Array.from(base64.match(/;base64,(.*)$/)!)

    if (!body.message) body.message = `${formatFileSize(file.size)}; ${file.type}`

    const { content } = await CustomFetch<{ content: GithubRepoFileType }>(githubRepoApiUrl(path), {
      body: Object.assign({}, body, { content: base64Content }),
      headers,
      method: 'PUT'
    })

    try {
      const info = await getImageFileInfo(file)
      await CustomFetch('/api/dashboard/image-info', {
        body: { key: content.sha, value: info } satisfies ImageInfoPostRequestType,
        method: 'POST'
      })
      Object.assign(content, info)
    } catch (error) {
      toast.error('同步图片信息失败')
    }

    return content
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

// 删除
export interface GithubRepoDeleteRequestType {
  branch?: string
  message: string
  sha: string
}

export const deleteGithubRepos = async (path: string, body: GithubRepoDeleteRequestType) => {
  try {
    const data = await CustomFetch(githubRepoApiUrl(path), {
      body,
      headers,
      method: 'DELETE'
    })

    try {
      CustomFetch('/api/dashboard/image-info', { body: { key: body.sha }, method: 'DELETE' })
    } catch (error) {}

    return data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

// 删除所有
export const deleteAllGithubRepos = async (path: string, message: (file: GithubRepoTreeType['tree'][number]) => GithubRepoDeleteRequestType['message']) => {
  try {
    const files = await getAllGithubRepos(path)
    for (const file of files.tree) {
      if (file.type == 'tree') continue
      await deleteGithubRepos(file.path, { message: message(file), sha: file.sha })
    }
    return null
  } catch (error) {
    return Promise.reject(error)
  }
}
