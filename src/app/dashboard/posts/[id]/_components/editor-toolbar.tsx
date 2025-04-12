'use client'

import { R2Upload } from '@/app/dashboard/r2/[[...slug]]/_components/r2-upload'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AppWindow, Binary, CloudUpload, Eye, EyeClosed, GitCompare, ReceiptText, Save, WandSparkles } from 'lucide-react'
import { Updater } from 'use-immer'
import { DefaultPostType } from '../page'
import { PostDetail } from './post-detail'
import { Transcoder } from './transcoder'

interface EditorToolbarProps {
  disabled: {
    format: boolean
    save: boolean
  }
  isCreate: boolean
  onCompare: () => void
  onFormat: () => void
  onPreview: () => void
  onSave: () => void
  post: DefaultPostType
  setPost: Updater<DefaultPostType>
}

const EditorToolbar = ({ post, isCreate, disabled, setPost, onCompare, onFormat, onPreview, onSave }: EditorToolbarProps) => {
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
        <span aria-hidden="true" className="grow"></span>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled={disabled.save} size="icon" onClick={onSave}>
              <Save />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCreate ? '创建' : '更新'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </section>
  )
}
export { EditorToolbar }

const Separator = () => <hr className="bg-divide h-4 w-0.5 rounded-full" />
