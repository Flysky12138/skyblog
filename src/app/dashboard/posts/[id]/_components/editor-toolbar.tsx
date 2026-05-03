'use client'

import { motion, useDragControls } from 'framer-motion'
import {
  AppWindowIcon,
  BinaryIcon,
  CloudUploadIcon,
  EyeClosedIcon,
  EyeIcon,
  GitCompareIcon,
  HandIcon,
  ReceiptTextIcon,
  SaveIcon,
  WandSparklesIcon
} from 'lucide-react'
import { Updater } from 'use-immer'

import { StorageUploadModal } from '@/app/dashboard/storage/_components/storage-upload-modal'
import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
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
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { STORAGE } from '@/lib/constants'
import { cn } from '@/lib/utils'

import { PostType } from '../utils'
import { PostEditModal } from './post-edit-modal'
import { TranscoderModal } from './transcoder-modal'

export interface EditorToolbarProps {
  className?: string
  dragConstraints: React.RefObject<HTMLElement | null>
  isCreate: boolean
  post: PostType
  setPost: Updater<PostType>
  disabled: {
    format: boolean
    save: boolean
  }
  onCompare: () => void
  onCreate: () => void
  onFormat: () => void
  onPreview: () => void
  onUpdate: (type: 'normal' | 'secret') => void
}

export function EditorToolbar({
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
}: EditorToolbarProps) {
  const dragControls = useDragControls()

  return (
    <Card
      className={cn('flex w-max max-w-[calc(100%---spacing(8))] flex-wrap-reverse items-center gap-3 p-2 backdrop-blur-xs', className)}
      render={
        <motion.section
          drag
          aria-label="monaco editor toolbar"
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
          <Button
            className="cursor-grab touch-none border"
            size="icon"
            variant="secondary"
            onPointerDown={event => {
              dragControls.start(event)
            }}
          >
            <HandIcon />
          </Button>
          <Separator />
          <Tooltip>
            <TranscoderModal>
              <TooltipTrigger render={<Button size="icon" variant="outline" />}>
                <BinaryIcon />
              </TooltipTrigger>
            </TranscoderModal>
            <TooltipContent>转码</TooltipContent>
          </Tooltip>
          <Separator />
          <Tooltip>
            <TooltipTrigger render={<Button size="icon" variant="outline" onClick={onCompare} />}>
              <GitCompareIcon />
            </TooltipTrigger>
            <TooltipContent>Diff 对比</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button disabled={disabled.format} size="icon" variant="outline" onClick={onFormat} />}>
              <WandSparklesIcon />
            </TooltipTrigger>
            <TooltipContent>格式化</TooltipContent>
          </Tooltip>
          <Separator />
          <Tooltip>
            <StorageUploadModal id={STORAGE.ROOT_DIRECTORY_ID}>
              <TooltipTrigger render={<Button disabled={isCreate} size="icon" variant="outline" />}>
                <CloudUploadIcon />
              </TooltipTrigger>
            </StorageUploadModal>
            <TooltipContent>文件</TooltipContent>
          </Tooltip>
          <Separator />
          <Tooltip>
            <PostEditModal value={post} onChange={setPost}>
              <TooltipTrigger render={<Button size="icon" variant="outline" />}>
                <ReceiptTextIcon />
              </TooltipTrigger>
            </PostEditModal>
            <TooltipContent>信息</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setPost(state => {
                      state.isPublished = !state.isPublished
                    })
                  }}
                />
              }
            >
              {post.isPublished ? <EyeIcon /> : <EyeClosedIcon />}
            </TooltipTrigger>
            <TooltipContent>{post.isPublished ? '公开' : '隐藏'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button size="icon" variant="outline" onClick={onPreview} />}>
              <AppWindowIcon />
            </TooltipTrigger>
            <TooltipContent>预览</TooltipContent>
          </Tooltip>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger render={<AlertDialogTrigger render={<Button disabled={disabled.save} size="icon" />} />}>
                <SaveIcon />
              </TooltipTrigger>
              <TooltipContent>{isCreate ? '创建' : '更新'}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
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
        </motion.section>
      }
    />
  )
}

function Separator() {
  return <hr className="bg-divide h-4 w-0.5 rounded-full" />
}
