'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@repo/components/card'
import { FileSelect } from '@repo/components/file-select'
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
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@repo/ui/components/drawer'
import { Field, FieldError, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Input } from '@repo/ui/components/input'
import { Textarea } from '@repo/ui/components/textarea'
import { Toggle } from '@repo/ui/components/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useIsMobile } from '@repo/ui/hooks/use-mobile'
import { cn } from '@repo/ui/lib/utils'
import { noop, pick, unionBy } from 'es-toolkit'
import { BookOpenTextIcon, EyeClosedIcon, EyeIcon, ImageUpIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { Updater } from 'use-immer'
import { uuidv7 } from 'uuidv7'
import z from 'zod'

import { Show } from '@/components/show'
import { POST_CARD_VISIBILITY_MASK } from '@/lib/constants'
import { rpc, unwrap } from '@/lib/http/rpc'
import { Storage } from '@/lib/http/storage'
import { scrollToError } from '@/lib/zod'

import { POST_CATEGORY_SWR_KEY, POST_TAG_SWR_KEY } from '../../utils'
import { PostType } from '../utils'

export type PostSubmitEventType = 'create' | 'normal' | 'secret'

type ComboboxValue = PostMetaDrawerProps['value']['tags'][number]['tag']

const formSchema = z.object({
  title: z.string().min(1, '请填写标题').max(100, '标题过长')
})

interface PostMetaDrawerProps {
  isCreate: boolean
  readonly value: PostType
  onChange: Updater<PostType>
  onSubmit: (type: PostSubmitEventType) => Promise<void>
}

export function PostMetaDrawer({ isCreate, value: post, onChange: setPost, onSubmit }: PostMetaDrawerProps) {
  const isMobile = useIsMobile()

  const { data: categories, mutate: mutateCategories } = useSWR(POST_CATEGORY_SWR_KEY, () => rpc.dashboard.posts.categories.get().then(unwrap), {
    fallbackData: []
  })
  const { data: tags, mutate: mutateTags } = useSWR(POST_TAG_SWR_KEY, () => rpc.dashboard.posts.tags.get().then(unwrap), {
    fallbackData: []
  })

  const anchorCategorieRef = useComboboxAnchor()
  const anchorTagRef = useComboboxAnchor()

  // 表单错误提示
  const form = useForm({
    defaultValues: pick(post, formSchema.keyof().options),
    mode: 'onChange',
    resolver: zodResolver(formSchema)
  })
  React.useEffect(() => {
    form.setValues(pick(post, formSchema.keyof().options))
  }, [form, post])

  const actionsRef = React.useRef<NonNullable<React.ComponentProps<typeof Drawer>['actionsRef']>['current']>(null)
  const handleSubmit = async (type: PostSubmitEventType) => {
    const valid = await form.trigger()
    if (!valid) {
      scrollToError(form.control._formState.errors)
      return
    }

    actionsRef.current?.close()
    await onSubmit(type)
  }

  return (
    <Drawer
      actionsRef={actionsRef}
      swipeDirection={isMobile ? 'up' : 'right'}
      onOpenChangeComplete={newOpen => {
        if (newOpen) return
        form.clearErrors()
      }}
    >
      <Tooltip>
        <DrawerTrigger
          render={
            <TooltipTrigger render={<Button aria-label="信息" size="icon" variant="outline" />}>
              <BookOpenTextIcon />
            </TooltipTrigger>
          }
        />
        <TooltipContent>信息</TooltipContent>
      </Tooltip>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>文章</DrawerTitle>
          <DrawerDescription>文章的描述信息</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar grid scroll-fade-y gap-6 overflow-y-scroll p-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel aria-required="true" htmlFor={field.name}>
                    标题
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    id={field.name}
                    onChange={event => {
                      field.onChange(event)
                      setPost(state => {
                        state.title = event.target.value
                      })
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <FieldLabel htmlFor="summary">描述</FieldLabel>
              <Textarea
                autoComplete="off"
                className="min-h-[3lh] resize-none"
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
                      alt="post cover"
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
                <RadioArea pressed className="col-span-7 h-40 cursor-default">
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
        <DrawerFooter>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <Button
              aria-label={post.isPublished ? '公开' : '隐藏'}
              size="icon"
              variant="outline"
              onClick={() => {
                setPost(state => {
                  state.isPublished = !state.isPublished
                })
              }}
            >
              {post.isPublished ? <EyeIcon /> : <EyeClosedIcon />}
            </Button>
            <Show
              fallback={
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void handleSubmit('secret')
                    }}
                  >
                    悄悄更新
                  </Button>
                  <Button
                    onClick={() => {
                      void handleSubmit('normal')
                    }}
                  >
                    更新
                  </Button>
                </div>
              }
              when={isCreate}
            >
              <Button
                onClick={() => {
                  void handleSubmit('create')
                }}
              >
                创建
              </Button>
            </Show>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
