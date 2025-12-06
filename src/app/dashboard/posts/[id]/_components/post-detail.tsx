'use client'

import useSWR from 'swr'
import { Updater } from 'use-immer'
import { uuidv7 } from 'uuidv7'

import { MultiSelect } from '@/components/form/multi-select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { POST_CARD_DISPLAY } from '@/lib/constants'
import { CustomRequest } from '@/lib/http/request'
import { cn } from '@/lib/utils'

import { DefaultPostType } from '../page'

interface PostDetailProps {
  children: React.ReactNode
  value: DefaultPostType
  onChange: Updater<DefaultPostType>
}

export const PostDetail = ({ children, value: post, onChange: setPost }: PostDetailProps) => {
  const { data: categories } = useSWR('0198eb99-0ffa-71d0-ab0e-98524c61eea2', () => CustomRequest('GET /api/dashboard/posts/categories', {}), {
    fallbackData: []
  })
  const { data: tags } = useSWR('0198eb99-212a-70e6-8817-a2d3596a2008', () => CustomRequest('GET /api/dashboard/posts/tags', {}), {
    fallbackData: []
  })

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        onCloseAutoFocus={event => {
          event.preventDefault()
        }}
      >
        <SheetHeader>
          <SheetTitle>文章</SheetTitle>
          <SheetDescription>文章的描述信息</SheetDescription>
        </SheetHeader>
        <FieldGroup className="scrollbar-hidden overflow-y-auto p-4 pt-0">
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
            <FieldLabel htmlFor="description">描述</FieldLabel>
            <Textarea
              className="min-h-24"
              id="description"
              value={post.description || ''}
              onChange={event => {
                setPost(state => {
                  state.description = event.target.value || null
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
              value={post.categories}
              onAddOption={name => ({ id: uuidv7(), name })}
              onValueChange={payload => {
                setPost(state => {
                  state.categories = payload
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
              value={post.tags}
              onAddOption={name => ({ id: uuidv7(), name })}
              onValueChange={payload => {
                setPost(state => {
                  state.tags = payload
                })
              }}
            />
          </Field>
          <Field>
            <FieldLabel className="col-span-full">区块显示</FieldLabel>
            <div className="grid grid-cols-10 gap-3">
              <ShowAreaRadioButton
                className="col-span-full h-10"
                pressed={(post.display & POST_CARD_DISPLAY.HEADER) == POST_CARD_DISPLAY.HEADER}
                onPressedChange={() => {
                  setPost(state => {
                    state.display ^= POST_CARD_DISPLAY.HEADER
                  })
                }}
              >
                标题
              </ShowAreaRadioButton>
              <ShowAreaRadioButton pressed className="col-span-7 h-40">
                正文
              </ShowAreaRadioButton>
              <ShowAreaRadioButton
                className="col-span-3 h-40"
                pressed={(post.display & POST_CARD_DISPLAY.TOC) == POST_CARD_DISPLAY.TOC}
                onPressedChange={() => {
                  setPost(state => {
                    state.display ^= POST_CARD_DISPLAY.TOC
                  })
                }}
              >
                目录
              </ShowAreaRadioButton>
              <ShowAreaRadioButton
                className="col-span-full h-14"
                pressed={(post.display & POST_CARD_DISPLAY.ISSUES) == POST_CARD_DISPLAY.ISSUES}
                onPressedChange={() => {
                  setPost(state => {
                    state.display ^= POST_CARD_DISPLAY.ISSUES
                  })
                }}
              >
                评论
              </ShowAreaRadioButton>
            </div>
          </Field>
        </FieldGroup>
      </SheetContent>
    </Sheet>
  )
}

const ShowAreaRadioButton = ({ className, ...props }: React.ComponentProps<typeof Toggle>) => {
  return (
    <Toggle
      className={cn('text-md hover:bg-accent/40 font-title border-dashed data-[state=on]:border-solid', className)}
      role="radio"
      variant="outline"
      {...props}
    />
  )
}
