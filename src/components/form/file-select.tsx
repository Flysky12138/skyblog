'use client'

import { LucideIcon } from 'lucide-react'
import { useDropArea } from 'react-use'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAccessibleClick } from '@/hooks/use-accessible-click'
import { cn } from '@/lib/utils'

interface FileSelectProps {
  /**
   * 接受的文件类型
   * @example '*'
   */
  accept?: string
  className?: string
  description?: string
  logo: LucideIcon
  /**
   * 是否多选
   * @default false
   */
  multiple?: boolean
  title: string
  onChange: (files: File[]) => void
}

export function FileSelect({ accept = '*', className, description, logo: Logo, multiple = false, title, onChange }: FileSelectProps) {
  const accessibleProps = useAccessibleClick(event => {
    event.currentTarget.click()
  })

  const [bond, state] = useDropArea({
    onFiles: onChange
  })

  return (
    <FieldLabel
      className={cn(
        'bg-card mx-auto w-full max-w-2xl cursor-pointer rounded-lg border border-dashed transition-all focus-visible:ring-3',
        {
          'ring-3': state.over
        },
        className
      )}
      {...accessibleProps}
      {...bond}
    >
      <Empty className="pointer-events-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Logo />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Input
        hidden
        accept={accept}
        multiple={multiple}
        type="file"
        onChange={event => {
          onChange(Array.from(event.target.files ?? []))
        }}
      />
    </FieldLabel>
  )
}
