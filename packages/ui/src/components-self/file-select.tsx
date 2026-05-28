'use client'

import { useRender } from '@base-ui/react'
import { useAccessibleClick, useDropArea } from '@repo/react-hooks'
import { LucideIcon } from 'lucide-react'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../components/empty'
import { Input } from '../components/input'
import { cn } from '../lib/utils'

interface FileSelectBaseProps extends useRender.ComponentProps<'div'> {
  description?: string
  logo: LucideIcon
  title: string
}

interface FileSelectProps extends Omit<FileSelectBaseProps, 'onChange'> {
  /**
   * 接受的文件类型
   *
   * @default '*'
   */
  accept?: string
  disabled?: boolean
  /**
   * 是否多选
   *
   * @default false
   */
  multiple?: boolean
  /**
   * 文件选择方式
   *
   * @default 'file'
   */
  type?: 'file' | 'folder'
  onChange: (files: File[]) => void
}

export function FileSelect({ accept, className, disabled, multiple, type, onChange, ...props }: FileSelectProps) {
  const accessibleProps = useAccessibleClick(event => {
    event.currentTarget.click()
  })

  const [bond, state] = useDropArea({
    onFiles: files => {
      onChange(multiple ? files : files.slice(0, 1))
    }
  })

  return (
    <FileSelectBase
      className={cn(
        'block',
        {
          'border-green-500/75': !disabled && state.over,
          'pointer-events-none cursor-not-allowed opacity-50': disabled
        },
        className
      )}
      render={<label />}
      {...props}
      {...(!disabled && {
        ...accessibleProps,
        ...bond
      })}
    >
      <Input
        hidden
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        type="file"
        webkitdirectory={type == 'folder' ? 'true' : undefined}
        onChange={event => {
          onChange(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
    </FileSelectBase>
  )
}

export function FileSelectBase({ children, className, description, logo: Logo, render, title, ...props }: FileSelectBaseProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      children: (
        <>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Logo />
              </EmptyMedia>
              <EmptyTitle>{title}</EmptyTitle>
              {description && <EmptyDescription>{description}</EmptyDescription>}
            </EmptyHeader>
          </Empty>
          {children}
        </>
      ),
      className: cn(
        'mx-auto w-full max-w-2xl rounded-md border border-dashed bg-transparent transition-all dark:bg-input/30',
        'hover:border-blue-500/75',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        className
      ),
      ...props
    }
  })
}
