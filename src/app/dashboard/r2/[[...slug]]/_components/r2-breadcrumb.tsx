import React from 'react'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface R2BreadcrumbProps {
  paths?: string[]
  onPathChange?: (paths: string[]) => void
}

export const R2Breadcrumb = ({ paths, onPathChange }: R2BreadcrumbProps) => {
  return (
    <Card asChild className="rounded-sm px-3 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="cursor-pointer"
              onClick={() => {
                onPathChange?.([])
              }}
            >
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {paths?.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <DisplayByConditional
                condition={index == paths.length - 1}
                fallback={
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      asChild
                      className="cursor-pointer"
                      onClick={() => {
                        onPathChange?.(paths.slice(0, index + 1))
                      }}
                    >
                      <span>{decodeURIComponent(path)}</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                }
              >
                <BreadcrumbItem>
                  <BreadcrumbPage className="break-all">{decodeURIComponent(path)}</BreadcrumbPage>
                </BreadcrumbItem>
              </DisplayByConditional>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </Card>
  )
}
