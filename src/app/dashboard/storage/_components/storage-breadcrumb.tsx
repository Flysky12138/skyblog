'use client'

import React from 'react'
import useSWR from 'swr'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { rpc, unwrap } from '@/lib/http/rpc'

interface StorageBreadcrumbProps {
  id: string
  onChange?: (id: string) => void
}

export function StorageBreadcrumb({ id, onChange }: StorageBreadcrumbProps) {
  const { data: paths, isLoading } = useSWR(
    ['019b93bf-9819-71a7-933a-a1c87f1736cd', id],
    () => rpc.dashboard.storage.paths({ id }).get().then(unwrap),
    {
      fallbackData: [],
      keepPreviousData: true
    }
  )

  if (isLoading && paths.length == 0) {
    return <Skeleton className="h-9 w-60" />
  }

  return (
    <Card
      className="w-fit rounded-sm border-none px-3 py-2 dark:ring-0"
      render={
        <Breadcrumb>
          <BreadcrumbList>
            {paths.map((path, index) => (
              <React.Fragment key={path.id}>
                <DisplayByConditional condition={index > 0}>
                  <BreadcrumbSeparator />
                </DisplayByConditional>
                <BreadcrumbItem>
                  <DisplayByConditional
                    condition={index == paths.length - 1}
                    fallback={
                      <BreadcrumbLink
                        className="cursor-pointer"
                        render={<span />}
                        onClick={() => {
                          onChange?.(path.id)
                        }}
                      >
                        {path.name}
                      </BreadcrumbLink>
                    }
                  >
                    <BreadcrumbPage className="break-all">{path.name}</BreadcrumbPage>
                  </DisplayByConditional>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      }
    />
  )
}
