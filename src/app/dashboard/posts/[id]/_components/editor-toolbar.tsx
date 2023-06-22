'use client'

import { motion, useDragControls } from 'framer-motion'
import { AppWindow, Binary, CloudUpload, Eye, EyeClosed, GitCompare, Hand, ReceiptText, Save, WandSparkles } from 'lucide-react'
import { Updater } from 'use-immer'

import { R2Upload } from '@/app/dashboard/r2/[[...slug]]/_components/r2-upload'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
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
} from '@/components/ui-overwrite/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { DefaultPostType } from '../page'
import { PostDetail } from './post-detail'
import { Transcoder } from './transcoder'

export interface EditorToolbarProps {
  className?: string
  disabled: {
    format: boolean
    save: boolean
  }
  dragConstraints: React.RefObject<HTMLElement | null>
  isCreate: boolean
  post: DefaultPostType
  setPost: Updater<DefaultPostType>
  onCompare: () => void
  onCreate: () => void
  onFormat: () => void
  onPreview: () => void
  onUpdate: (type: 'normal' | 'secret') => void
}

export const EditorToolbar = ({
  className,
  disabled,
  dragConstraints,
  isCreate,
  post,
  setPost,
  onCompare,
  onCreate,
  onFormat,
  onPreview,
  onUpdate
}: EditorToolbarProps) => {
  const dragControls = useDragControls()

  return (
    <Card asChild className={cn('flex flex-wrap-reverse items-center gap-3 p-2 backdrop-blur-xs', className)}>
      <motion.section
        drag
        aria-label="post editor toolbar"
        dragConstraints={dragConstraints}
        dragControls={dragControls}
        dragElastic={0}
        dragListener={false}
        dragMomentum={false}
        role="toolbar"
        whileDrag={{
          cursor: 'grabbing',
          userSelect: 'none'
        }}
      >
        <TooltipProvider>
          <Button
            className="cursor-grab touch-none border"
            size="icon"
            variant="secondary"
            onPointerDown={event => {
              dragControls.start(event)
            }}
          >
            <Hand />
          </Button>
          <Separator />
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
      </motion.section>
    </Card>
  )
}

const Separator = () => <hr className="bg-divide h-4 w-0.5 rounded-full" />
