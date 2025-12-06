'use client'

import useSWR from 'swr'
import { Updater } from 'use-immer'
import { uuidv7 } from 'uuidv7'

import { MultiSelect } from '@/components/form/multi-select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { cn } from '@/lib/utils'

import { POST_CATEGORY_SWR_KEY, POST_TAG_SWR_KEY } from '../../utils'
import { DefaultPostType } from '../utils'

interface PostEditModalProps extends React.PropsWithChildren {
  value: DefaultPostType
  onChange: Updater<DefaultPostType>
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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
                value={post.summary || ''}
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
                value={post.slug || ''}
                onChange={event => {
                  setPost(state => {
                    state.slug = event.target.value || null
                  })
                }}
              />
            </Field>
            <Field>
              <FieldLabel>分类</FieldLabel>
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
              <FieldLabel>标签</FieldLabel>
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
              <FieldLabel>封面</FieldLabel>
            </Field>
            <Field>
              <FieldLabel>区块显示</FieldLabel>
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
      className={cn('text-md hover:bg-input/30 font-title border-dashed data-[state=on]:border-solid', className)}
      role="radio"
      variant="outline"
      {...props}
    />
  )
}
