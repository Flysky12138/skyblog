'use client'

import {
  PostDetailGetResponseType,
  PostDetailPostRequestType,
  PostDetailPostResponseType,
  PostDetailPutRequestType,
  PostDetailPutResponseType
} from '@/app/api/dashboard/posts/[id]/route'
import { CategoriesGetResponseType } from '@/app/api/dashboard/posts/categories/route'
import { TagsGetResponseType } from '@/app/api/dashboard/posts/tags/route'
import InputMultiple from '@/components/form/InputMultiple'
import MonacoEditor from '@/components/monaco-editor'
import { markdownConfig } from '@/components/monaco-editor/markdown'
import { cn } from '@/lib/cn'
import { CustomFetch } from '@/lib/server/fetch'
import { CustomToast } from '@/lib/toast'
import { AddPhotoAlternate, ArrowUpward, OpenInNew, Save } from '@mui/icons-material'
import { FormControl, FormLabel, IconButton, Input, Textarea, Tooltip } from '@mui/joy'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useAsync, useScroll } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'
import { useImmer } from 'use-immer'
import UploadFiles from '../../github/[[...path]]/_/UploadFiles'
import ModalChips from './_/ModalChips'

const getPostDetail = async (id: string) => {
  return await CustomFetch<PostDetailGetResponseType>(`/api/dashboard/posts/${id}`)
}
const getCategories = async () => {
  return await CustomFetch<CategoriesGetResponseType>('/api/dashboard/posts/categories')
}
const getTags = async () => {
  return await CustomFetch<TagsGetResponseType>('/api/dashboard/posts/tags')
}
const putPostDetail = async (id: string, payload: PostDetailPutRequestType) => {
  return await CustomFetch<PostDetailPutResponseType>(`/api/dashboard/posts/${id}`, {
    body: payload,
    method: 'PUT'
  })
}
const postPostDetail = async (payload: PostDetailPostRequestType) => {
  return await CustomFetch<PostDetailPostResponseType>('/api/dashboard/posts/new', {
    body: payload,
    method: 'POST'
  })
}

const defaultPost: NonNullable<PostDetailGetResponseType> = {
  authorId: 1,
  categories: [],
  content: null,
  createdAt: new Date(),
  description: null,
  id: '-1',
  links: 0,
  published: false,
  sticky: 0,
  tags: [],
  title: '',
  updatedAt: new Date(),
  views: 0
}

export default function Page() {
  const router = useRouter()
  const session = useSession()

  const height = React.useRef(799)
  React.useLayoutEffect(() => {
    height.current = window.innerHeight
  }, [])

  const mainRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    mainRef.current = document.querySelector('main')
  }, [])
  const { y } = useScroll(mainRef)
  const isAtTop = y < 250

  const { id } = useParams<{ id: string }>()
  const isCreate = id == 'new'

  const [post, setPost] = useImmer<typeof defaultPost>(defaultPost)
  const [oldCode, setOldCode] = React.useState<string>()

  useAsync(async () => {
    if (isCreate) return
    const data = await CustomToast(getPostDetail(id))
    if (!data) return
    setPost(data)
    setOldCode(data.content || '')
  }, [id, setPost])

  const { data: categories } = useSWR('/api/dashboard/posts/categories', getCategories)
  const { data: tags } = useSWR('/api/dashboard/posts/tags', getTags)

  return (
    <section className="grid grid-cols-2 gap-x-6 gap-y-4">
      <div className="col-span-2 flex gap-[inherit]">
        <FormControl required className="grow">
          <FormLabel>标题</FormLabel>
          <Input
            value={post.title}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.title = event.target.value
              })
            }}
          />
        </FormControl>
        <FormControl required className="w-32">
          <FormLabel>置顶</FormLabel>
          <Input
            type="number"
            value={post.sticky}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.sticky = Math.max(0, Number.parseInt(event.target.value || '0'))
              })
            }}
            onFocus={event => event.target.select()}
          />
        </FormControl>
      </div>
      <FormControl className="col-span-2">
        <FormLabel>描述</FormLabel>
        <Textarea
          className="min-h-[64px]"
          minRows={2}
          value={post.description || ''}
          variant="outlined"
          onChange={event => {
            setPost(state => {
              state.description = event.target.value || null
            })
          }}
        />
      </FormControl>
      <FormControl className="col-span-2 md:col-span-1">
        <FormLabel>分类</FormLabel>
        <InputMultiple
          endDecorator={
            <ModalChips
              select={post.categories}
              value={categories || []}
              onChange={payload => {
                setPost(state => {
                  state.categories = payload
                })
              }}
            />
          }
          getChipValue={({ name }) => name}
          value={post.categories}
          onAdd={name => {
            setPost(state => {
              state.categories.push({ id: Date.now(), name })
            })
          }}
          onDelete={names => {
            setPost(state => {
              state.categories = state.categories.filter(({ name }) => !names.includes(name))
            })
          }}
        />
      </FormControl>
      <FormControl className="col-span-2 md:col-span-1">
        <FormLabel>标签</FormLabel>
        <InputMultiple
          endDecorator={
            <ModalChips
              select={post.tags}
              value={tags || []}
              onChange={payload => {
                setPost(state => {
                  state.tags = payload
                })
              }}
            />
          }
          getChipValue={({ name }) => name}
          value={post.tags}
          onAdd={name => {
            setPost(state => {
              state.tags.push({ id: Date.now(), name })
            })
          }}
          onDelete={names => {
            setPost(state => {
              state.tags = state.tags.filter(({ name }) => !names.includes(name))
            })
          }}
        />
      </FormControl>
      <FormControl className="col-span-2">
        <FormLabel>内容</FormLabel>
        <MonacoEditor
          code={post.content || ''}
          height={height.current - 125}
          loading="Loading..."
          oldCode={oldCode}
          onChange={value => {
            setPost(state => {
              state.content = value || null
            })
          }}
          {...markdownConfig}
        >
          {!isCreate && post.id != '-1' && (
            <Tooltip title="查看">
              <IconButton component={Link} href={`/posts/${post.id}`} target="_blank">
                <OpenInNew />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={isCreate ? '创建' : '更新'}>
            <IconButton
              onClick={async () => {
                if (!post.title) {
                  toast.error('表单验证失败')
                  return
                }
                const data = await CustomToast(
                  isCreate
                    ? postPostDetail({
                        authorId: session.data?.id || 1,
                        categories: post.categories.map(({ name }) => name),
                        content: post.content,
                        description: post.description,
                        sticky: post.sticky,
                        tags: post.tags.map(({ name }) => name),
                        title: post.title
                      })
                    : putPostDetail(post.id, {
                        categories: post.categories.map(({ name }) => name),
                        content: post.content,
                        description: post.description,
                        sticky: post.sticky,
                        tags: post.tags.map(({ name }) => name),
                        title: post.title
                      }),
                  '保存成功'
                )
                setPost(data)
                if (isCreate) router.replace(`/dashboard/posts/${data.id}`)
                setOldCode(post.content || '')
              }}
            >
              <Save />
            </IconButton>
          </Tooltip>
          <hr className="s-divider mx-2 h-4 border" />
          {!isCreate && (
            <UploadFiles
              component={props => (
                <Tooltip title="上传图片">
                  <IconButton {...props}>
                    <AddPhotoAlternate />
                  </IconButton>
                </Tooltip>
              )}
              path={`/posts/${post.id}/`}
            />
          )}
          <Tooltip title={isAtTop ? '去底部' : '去顶部'}>
            <IconButton
              onClick={() => {
                document.querySelector('main')?.scrollTo({ top: isAtTop ? Number.MAX_SAFE_INTEGER : 0 })
              }}
            >
              <ArrowUpward
                className={cn({
                  'rotate-180': isAtTop
                })}
              />
            </IconButton>
          </Tooltip>
          <hr className="s-divider mx-2 h-4 border" />
        </MonacoEditor>
      </FormControl>
    </section>
  )
}
