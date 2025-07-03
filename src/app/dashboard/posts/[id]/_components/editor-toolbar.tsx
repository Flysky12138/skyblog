'use client'

import { AppWindow, Binary, CloudUpload, Eye, EyeClosed, GitCompare, ReceiptText, Save, WandSparkles } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from 'ui/alert-dialog'
import { Button } from 'ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui/tooltip'
import { Updater } from 'use-immer'

import { R2Upload } from '@/app/dashboard/r2/[[...slug]]/_components/r2-upload'
import { DisplayByConditional } from '@/components/display/display-by-conditional'

import { DefaultPostType } from '../page'
import { PostDetail } from './post-detail'
import { Transcoder } from './transcoder'

export interface EditorToolbarProps {
  disabled: {
    format: boolean
    save: boolean
  }
  isCreate: boolean
  post: DefaultPostType
  setPost: Updater<DefaultPostType>
  onCompare: () => void
  onCreate: () => void
  onFormat: () => void
  onPreview: () => void
  onUpdate: (type: 'normal' | 'secret') => void
}

const EditorToolbar = ({ disabled, isCreate, post, setPost, onCompare, onCreate, onFormat, onPreview, onUpdate }: EditorToolbarProps) => {
  return (
    <section className="border-divide bg-sidebar flex items-center gap-3 border-b px-3 py-2">
      <TooltipProvider>
        <Tooltip>
          <Transcoder>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline">
                <Binary />
              </Button>
            </TooltipTrigger>
          </Transcoder>
          <TooltipContent>转码</TooltipContent>
        </Tooltip>
        <span aria-hidden="true" className="grow" />
        <Separator />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" onClick={onCompare}>
              <GitCompare />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Diff 对比</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled={disabled.format} size="icon" variant="outline" onClick={onFormat}>
              <WandSparkles />
            </Button>
          </TooltipTrigger>
          <TooltipContent>格式化</TooltipContent>
        </Tooltip>
        <Separator />
        <Tooltip>
          <R2Upload path={`/posts/${post.id}/`}>
            <TooltipTrigger asChild>
              <Button disabled={isCreate} size="icon" variant="outline">
                <CloudUpload />
              </Button>
            </TooltipTrigger>
          </R2Upload>
          <TooltipContent>文件</TooltipContent>
        </Tooltip>
        <Separator />
        <Tooltip>
          <PostDetail value={post} onChange={setPost}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline">
                <ReceiptText />
              </Button>
            </TooltipTrigger>
          </PostDetail>
          <TooltipContent>信息</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setPost(state => {
                  state.published = !state.published
                })
              }}
            >
              {post.published ? <Eye /> : <EyeClosed />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{post.published ? '公开' : '隐藏'}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" onClick={onPreview}>
              <AppWindow />
            </Button>
          </TooltipTrigger>
          <TooltipContent>预览</TooltipContent>
        </Tooltip>
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button disabled={disabled.save} size="icon">
                  <Save />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{isCreate ? '创建' : '更新'}</TooltipContent>
          </Tooltip>
          <AlertDialogContent
            onCloseAutoFocus={event => {
              event.preventDefault()
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>更新方式</AlertDialogTitle>
              <AlertDialogDescription>不修改更新时间，可以悄悄更新文章</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <DisplayByConditional
                condition={isCreate}
                fallback={
                  <>
                    <AlertDialogAction
                      onClick={() => {
                        onUpdate('secret')
                      }}
                    >
                      悄悄更新
                    </AlertDialogAction>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => {
                        onUpdate('normal')
                      }}
                    >
                      更新
                    </AlertDialogAction>
                  </>
                }
              >
                <AlertDialogAction onClick={onCreate}>创建</AlertDialogAction>
              </DisplayByConditional>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </section>
  )
}
export { EditorToolbar }

const Separator = () => <hr className="bg-divide h-4 w-0.5 rounded-full" />
