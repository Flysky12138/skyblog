'use client'

import { cn } from '@/lib/cn'
import { Option, Select } from '@mui/joy'
import { Pagination, PaginationProps } from '@mui/material'
import { PaginationArgs } from 'prisma-paginate'

export interface PaginationSearch extends MakeRequired<Pick<PaginationArgs, 'limit' | 'page'>> {}

interface PaginationTableProps extends Omit<PaginationProps, 'onChange' | 'page'>, PaginationSearch {
  onChange?: (pagination: PaginationSearch) => void
}

export default function PaginationTable({ className, limit, onChange, ...props }: PaginationTableProps) {
  return (
    <section className={cn('flex items-center gap-x-5', className)}>
      <Pagination
        onChange={(_, page) => {
          onChange?.({ limit, page })
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
          onChange?.({ limit: value || limit, page: 1 })
        }}
      >
        {[10, 20, 30, 50, 100].map(limit => (
          <Option key={limit} value={limit}>
            {limit}
          </Option>
        ))}
      </Select>
    </section>
  )
}
