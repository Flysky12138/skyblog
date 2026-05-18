'use client'

import { Updater } from '@repo/react-hooks'
import { FileSelect } from '@repo/ui/components-self/file-select'
import { MultiSelect } from '@repo/ui/components-self/multi-select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Textarea } from '@repo/ui/components/textarea'
import { Toggle } from '@repo/ui/components/toggle'
import { cn } from '@repo/ui/lib/utils'
import { noop } from '@tanstack/react-table'
import { ImageIcon } from 'lucide-react'
import useSWR from 'swr'
import { uuidv7 } from 'uuidv7'

import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'

import { POST_CATEGORY_SWR_KEY, POST_TAG_SWR_KEY } from '../../utils'
import { PostType } from '../utils'

interface PostEditModalProps {
  children: React.ReactElement
  value: PostType
  onChange: Updater<PostType>
}

export function PostEditModal({ children, value: post, onChange: setPost }: PostEditModalProps) {
  const { data: categories } = useSWR(POST_CATEGORY_SWR_KEY, () => rpc.dashboard.posts.categories.get().then(unwrap), {
    fallbackData: []
  })
  const { data: tags } = useSWR(POST_TAG_SWR_KEY, () => rpc.dashboard.posts.tags.get().then(unwrap), {
    fallbackData: []
  })

  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>文章</DialogTitle>
          <DialogDescription>文章的描述信息</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldGroup>
            <Field>
              <FieldLabel aria-required="true" htmlFor="title">
                标题
              </FieldLabel>
              <Input
                autoComplete="off"
                id="title"
                value={post.title}
                onChange={event => {
                  setPost(state => {
                    state.title = event.target.value
                  })
                }}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="summary">描述</FieldLabel>
              <Textarea
                autoComplete="off"
                className="min-h-24"
                id="summary"
                value={post.summary ?? ''}
                onChange={event => {
                  setPost(state => {
                    state.summary = event.target.value || null
                  })
                }}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">路由</FieldLabel>
              <Input
                autoComplete="off"
                id="slug"
                value={post.slug ?? ''}
                onChange={event => {
                  setPost(state => {
                    state.slug = event.target.value || null
                  })
                }}
              />
            </Field>
            <Field>
              <FieldTitle>分类</FieldTitle>
              <MultiSelect
                multiple
                fieldNames={{ label: 'name', value: 'id' }}
                options={categories}
                value={post.categories.map(({ category }) => category)}
                onAddOption={name => ({ id: uuidv7(), name })}
                onValueChange={payload => {
                  setPost(state => {
                    state.categories = payload.map(category => ({ category }))
                  })
                }}
              />
            </Field>
            <Field>
              <FieldTitle>标签</FieldTitle>
              <MultiSelect
                multiple
                fieldNames={{ label: 'name', value: 'id' }}
                options={tags}
                value={post.tags.map(({ tag }) => tag)}
                onAddOption={name => ({ id: uuidv7(), name })}
                onValueChange={payload => {
                  setPost(state => {
                    state.tags = payload.map(tag => ({ tag }))
                  })
                }}
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldTitle>封面</FieldTitle>
              <FileSelect logo={ImageIcon} title="选择图片" onChange={noop} />
            </Field>
            <Field>
              <FieldTitle>区块显示</FieldTitle>
              <div className="grid grid-cols-10 gap-3">
                <RadioArea
                  className="col-span-full h-10"
                  pressed={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.HEADER) == POST_CARD_VISIBILITY_MASK.HEADER}
                  onPressedChange={() => {
                    setPost(state => {
                      state.visibilityMask ^= POST_CARD_VISIBILITY_MASK.HEADER
                    })
                  }}
                >
                  标题
                </RadioArea>
                <RadioArea pressed className="col-span-7 h-40">
                  正文
                </RadioArea>
                <RadioArea
                  className="col-span-3 h-40"
                  pressed={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.TOC) == POST_CARD_VISIBILITY_MASK.TOC}
                  onPressedChange={() => {
                    setPost(state => {
                      state.visibilityMask ^= POST_CARD_VISIBILITY_MASK.TOC
                    })
                  }}
                >
                  目录
                </RadioArea>
                <RadioArea
                  className="col-span-full h-14"
                  pressed={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.COMMENT) == POST_CARD_VISIBILITY_MASK.COMMENT}
                  onPressedChange={() => {
                    setPost(state => {
                      state.visibilityMask ^= POST_CARD_VISIBILITY_MASK.COMMENT
                    })
                  }}
                >
                  评论
                </RadioArea>
              </div>
            </Field>
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RadioArea({ className, ...props }: React.ComponentProps<typeof Toggle>) {
  return (
    <Toggle
      className={cn('text-md border-dashed font-heading hover:bg-input/30 aria-pressed:border-solid', className)}
      role="radio"
      variant="outline"
      {...props}
    />
  )
}
