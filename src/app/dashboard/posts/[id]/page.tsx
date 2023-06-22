'use client'

import { GET } from '@/app/api/dashboard/posts/[id]/route'
import FormInputMultiple from '@/components/form/FormInputMultiple'
import MonacoEditor from '@/components/monaco-editor'
import { markdownConfig } from '@/components/monaco-editor/language/markdown'
import { cn } from '@/lib/cn'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { AddPhotoAlternate, ArrowUpward, Close, OpenInNew, Save } from '@mui/icons-material'
import { Checkbox, FormControl, FormLabel, IconButton, Input, Textarea, Tooltip } from '@mui/joy'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useAsync, useWindowScroll, useWindowSize } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'
import { useImmer } from 'use-immer'
import UploadFiles from '../../github/_components/UploadFiles'
import ModalChips from './_components/ModalChips'

const defaultPost: NonNullable<GET['return']> = {
  authorId: 1,
  categories: [],
  content: null,
  createdAt: new Date(),
  description: null,
  id: '-1',
  links: 0,
  published: false,
  showTitleCard: true,
  sticky: 0,
  tags: [],
  title: '',
  updatedAt: new Date(),
  views: 0
}

export default function Page() {
  const router = useRouter()
  const session = useSession()

  const { height } = useWindowSize(0, 799)

  const { y } = useWindowScroll()
  const isAtTop = y < 250

  const { id } = useParams<{ id: string }>()
  const isCreate = id == 'new'

  const [post, setPost] = useImmer<typeof defaultPost>(defaultPost)
  const [oldCode, setOldCode] = React.useState<string>()

  useAsync(async () => {
    if (isCreate) return
    const data = await Toast(CustomRequest('GET api/dashboard/posts/[id]', { params: { id } }))
    if (!data) return
    setPost(data)
    setOldCode(data.content || '')
  }, [id, setPost])

  const { data: categories } = useSWR('/api/dashboard/posts/categories', () => CustomRequest('GET api/dashboard/posts/categories', {}))
  const { data: tags } = useSWR('/api/dashboard/posts/tags', () => CustomRequest('GET api/dashboard/posts/tags', {}))

  return (
    <section className="grid grid-cols-2 gap-x-6 gap-y-4">
      <FormControl required className="col-span-2">
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
        <FormInputMultiple
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
              state.categories.push({ name, id: Date.now() })
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
        <FormInputMultiple
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
              state.tags.push({ name, id: Date.now() })
            })
          }}
          onDelete={names => {
            setPost(state => {
              state.tags = state.tags.filter(({ name }) => !names.includes(name))
            })
          }}
        />
      </FormControl>
      <div className="col-span-2 my-1 flex gap-x-10">
        <FormControl className="w-32" orientation="horizontal">
          <FormLabel className="shrink-0">置顶</FormLabel>
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
        <FormControl orientation="horizontal">
          <FormLabel>显示标题卡片</FormLabel>
          <Checkbox
            checked={post.showTitleCard}
            className="items-center"
            color={post.showTitleCard ? 'success' : 'neutral'}
            uncheckedIcon={<Close />}
            variant="solid"
            onChange={event => {
              setPost(state => {
                state.showTitleCard = event.target.checked
              })
            }}
          />
        </FormControl>
      </div>
      <FormControl className="col-span-2">
        <FormLabel>内容</FormLabel>
        <MonacoEditor
          code={post.content || ''}
          height={height - 125}
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
                const data = await Toast(
                  isCreate
                    ? CustomRequest('POST api/dashboard/posts/[id]', {
                        body: {
                          authorId: session.data?.id || 1,
                          categories: post.categories.map(({ name }) => name),
                          content: post.content,
                          description: post.description,
                          showTitleCard: post.showTitleCard,
                          sticky: post.sticky,
                          tags: post.tags.map(({ name }) => name),
                          title: post.title
                        },
                        params: { id: 'new' }
                      })
                    : CustomRequest('PUT api/dashboard/posts/[id]', {
                        body: {
                          categories: post.categories.map(({ name }) => name),
                          content: post.content,
                          description: post.description,
                          showTitleCard: post.showTitleCard,
                          sticky: post.sticky,
                          tags: post.tags.map(({ name }) => name),
                          title: post.title
                        },
                        params: { id: post.id }
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
          <hr className="s-border-color-divider mx-2 h-4 rounded border" />
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
                document.documentElement.scrollTo({ top: isAtTop ? Number.MAX_SAFE_INTEGER : 0 })
              }}
            >
              <ArrowUpward
                className={cn({
                  'rotate-180': isAtTop
                })}
              />
            </IconButton>
          </Tooltip>
          <hr className="s-border-color-divider mx-2 h-4 rounded border" />
        </MonacoEditor>
      </FormControl>
    </section>
  )
}
