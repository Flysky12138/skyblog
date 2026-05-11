'use client'

import { useAccessibleClick, useDropArea } from '@repo/react-hooks'
import { LucideIcon } from 'lucide-react'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../components/empty'
import { FieldLabel } from '../components/field'
import { Input } from '../components/input'
import { cn } from '../lib/utils'

interface FileSelectBaseProps extends React.ComponentProps<'label'>, React.PropsWithChildren {
  description?: string
  logo: LucideIcon
  title: string
}

interface FileSelectProps extends Pick<FileSelectBaseProps, 'className' | 'description' | 'logo' | 'title'> {
  /**
   * 接受的文件类型
   *
   * @default '*'
   */
  accept?: string
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

export function FileSelect({ accept, className, multiple, type, onChange, ...props }: FileSelectProps) {
  const accessibleProps = useAccessibleClick(event => {
    event.currentTarget.click()
  })

  const [bond, state] = useDropArea({
    onFiles: onChange
  })

  return (
    <FileSelectBase
      className={cn(
        {
          'border-green-500/75': state.over
        },
        className
      )}
      {...props}
      {...accessibleProps}
      {...bond}
    >
      <Input
        hidden
        accept={accept}
        multiple={multiple}
        type="file"
        webkitdirectory={type == 'folder' ? 'true' : undefined}
        onChange={event => {
          onChange(Array.from(event.target.files ?? []))
        }}
      />
    </FileSelectBase>
  )
}

export function FileSelectBase({ children, className, description, logo: Logo, title, ...props }: FileSelectBaseProps) {
  return (
    <FieldLabel
      className={cn(
        'mx-auto w-full max-w-2xl cursor-pointer rounded-lg border border-dashed bg-card transition-all',
        'hover:border-blue-500/75',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        className
      )}
      {...props}
    >
      <Empty className="pointer-events-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Logo />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          {description && <EmptyDescription>{description}</EmptyDescription>}
        </EmptyHeader>
      </Empty>
      {children}
    </FieldLabel>
  )
}
