'use client'

import { cn } from '@/lib/cn'
import { Option, Select } from '@mui/joy'
import { Pagination, PaginationProps } from '@mui/material'

const OPTIONS = [10, 30, 50, 100]

interface PaginationTableProps extends Omit<PaginationProps, 'onChange'> {
  className?: string
  limit?: number
  onChange: (pagination: { limit: number; page: number }) => void
}

export default function PaginationTable({ className, limit = OPTIONS[0], onChange, ...props }: PaginationTableProps) {
  return (
    <section className={cn('flex items-center gap-x-5', className)}>
      <Pagination
        onChange={(_, page) => {
          onChange({ limit, page })
        }}
        {...props}
      />
      <Select
        defaultValue={limit}
        sx={{
          '--Select-minHeight': '32px',
          '--joy-palette-background-surface': 'transparent',
          '--variant-outlinedHoverBg': 'var(--mui-palette-action-hover)'
        }}
        onChange={(_, value) => {
          onChange({ limit: value || limit, page: 1 })
        }}
      >
        {OPTIONS.map(option => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </section>
  )
}
