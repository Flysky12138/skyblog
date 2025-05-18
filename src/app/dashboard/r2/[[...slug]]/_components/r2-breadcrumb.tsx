import Link from 'next/link'
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from 'ui/breadcrumb'

import { DisplayByConditional } from '@/components/display/display-by-conditional'

interface R2BreadcrumbProps {
  paths?: string[]
}

export const R2Breadcrumb = ({ paths }: R2BreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link replace href="/dashboard/r2">
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
  )
}
