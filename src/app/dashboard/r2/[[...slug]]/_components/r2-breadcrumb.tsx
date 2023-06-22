import Link from 'next/link'
import React from 'react'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface R2BreadcrumbProps {
  paths?: string[]
}

export const R2Breadcrumb = ({ paths }: R2BreadcrumbProps) => {
  return (
    <Card asChild className="rounded-sm px-3 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link replace href="/dashboard/r2/">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {paths?.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <DisplayByConditional
                condition={index == paths.length - 1}
                fallback={
                  <BreadcrumbLink asChild>
                    <Link replace href={`/dashboard/r2/${paths.slice(0, index + 1).join('/')}`}>
                      {decodeURIComponent(path)}
                    </Link>
                  </BreadcrumbLink>
                }
              >
                <BreadcrumbPage className="break-all">{decodeURIComponent(path)}</BreadcrumbPage>
              </DisplayByConditional>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </Card>
  )
}
