'use client'

import { Card } from '@repo/ui/components-self/card'
import { FileSelect } from '@repo/ui/components-self/file-select'
import { Button } from '@repo/ui/components/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@repo/ui/components/combobox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Textarea } from '@repo/ui/components/textarea'
import { Toggle } from '@repo/ui/components/toggle'
import { cn } from '@repo/ui/lib/utils'
import { noop, unionBy } from 'es-toolkit'
import { ImageUpIcon, XIcon } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'
import { Updater } from 'use-immer'
import { uuidv7 } from 'uuidv7'

import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { Storage } from '@/lib/http/storage'

import { POST_CATEGORY_SWR_KEY, POST_TAG_SWR_KEY } from '../../utils'
import { PostType } from '../utils'

type ComboboxValue = PostEditModalProps['value']['tags'][number]['tag']

interface PostEditModalProps {
  children: React.ReactElement
  readonly value: PostType
  onChange: Updater<PostType>
}

export function PostEditModal({ children, value: post, onChange: setPost }: PostEditModalProps) {
  const { data: categories, mutate: mutateCategories } = useSWR(POST_CATEGORY_SWR_KEY, () => rpc.dashboard.posts.categories.get().then(unwrap), {
    fallbackData: []
  })
  const { data: tags, mutate: mutateTags } = useSWR(POST_TAG_SWR_KEY, () => rpc.dashboard.posts.tags.get().then(unwrap), {
    fallbackData: []
  })

  const anchorCategorieRef = useComboboxAnchor()
  const anchorTagRef = useComboboxAnchor()

  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-5xl" fullScreen="sm">
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
              <Combobox
                autoHighlight
                multiple
                items={categories}
                value={post.categories.map(({ category }) => category)}
                onValueChange={payload => {
                  if (!payload) return
                  setPost(state => {
                    state.categories = payload.map(category => ({ category }))
                  })
                }}
              >
                <ComboboxChips ref={anchorCategorieRef}>
                  <ComboboxValue>
                    {(values: ComboboxValue[]) => values.map(value => <ComboboxChip key={value.id}>{value.name}</ComboboxChip>)}
                  </ComboboxValue>
                  <ComboboxChipsInput
                    onKeyDown={event => {
                      if (event.key !== 'Enter') return
                      const category: (typeof categories)[number] = {
                        createdAt: new Date(),
                        id: uuidv7(),
                        name: event.currentTarget.value,
                        updatedAt: new Date()
                      }
                      void mutateCategories(draft => unionBy(draft ?? [], [category], item => item.name), false)
                      setPost(state => {
                        state.categories.push({ category })
                      })
                    }}
                  />
                </ComboboxChips>
                <ComboboxContent anchor={anchorCategorieRef} side="top">
                  <ComboboxEmpty>无选项</ComboboxEmpty>
                  <ComboboxList>
                    {(item: ComboboxValue) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldTitle>标签</FieldTitle>
              <Combobox
                autoHighlight
                multiple
                items={tags}
                value={post.tags.map(({ tag }) => tag)}
                onValueChange={payload => {
                  if (!payload) return
                  setPost(state => {
                    state.tags = payload.map(tag => ({ tag }))
                  })
                }}
              >
                <ComboboxChips ref={anchorTagRef}>
                  <ComboboxValue>
                    {(values: ComboboxValue[]) => values.map(value => <ComboboxChip key={value.id}>{value.name}</ComboboxChip>)}
                  </ComboboxValue>
                  <ComboboxChipsInput
                    onKeyDown={event => {
                      if (event.key !== 'Enter') return
                      const tag: (typeof tags)[number] = {
                        createdAt: new Date(),
                        id: uuidv7(),
                        name: event.currentTarget.value,
                        updatedAt: new Date()
                      }
                      void mutateTags(draft => unionBy(draft!, [tag], item => item.name), false)
                      setPost(state => {
                        state.tags.push({ tag })
                      })
                    }}
                  />
                </ComboboxChips>
                <ComboboxContent anchor={anchorTagRef} side="top">
                  <ComboboxEmpty>无选项</ComboboxEmpty>
                  <ComboboxList>
                    {(item: ComboboxValue) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldTitle>封面</FieldTitle>
              <Card className="overflow-hidden rounded-md bg-transparent ring-0">
                {post.coverFileId ? (
                  <>
                    <img
                      height={post.coverFile?.metadata?.height}
                      src={Storage.getPublicUrl(post.coverFileId)}
                      width={post.coverFile?.metadata?.width}
                    />
                    <Button
                      className="absolute top-2 right-2"
                      size="icon-sm"
                      onClick={() => {
                        setPost(state => {
                          state.coverFileId = null
                          state.coverFile = null
                        })
                      }}
                    >
                      <XIcon />
                    </Button>
                  </>
                ) : (
                  <FileSelect logo={ImageUpIcon} onChange={noop} />
                )}
              </Card>
            </Field>
            <Field>
              <FieldTitle>区块显示</FieldTitle>
              <div className="grid grid-cols-10 gap-3" role="radiogroup">
                <RadioArea
                  className="col-span-full h-10"
                  pressed={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.HEADER) === POST_CARD_VISIBILITY_MASK.HEADER}
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
                  pressed={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.TOC) === POST_CARD_VISIBILITY_MASK.TOC}
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
                  pressed={(post.visibilityMask & POST_CARD_VISIBILITY_MASK.COMMENT) === POST_CARD_VISIBILITY_MASK.COMMENT}
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
      className={cn('text-md border-dashed font-heading hover:bg-input/10 aria-pressed:border-solid', className)}
      role="radio"
      variant="outline"
      {...props}
    />
  )
}
