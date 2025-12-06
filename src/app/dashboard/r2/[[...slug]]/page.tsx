'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import { R2Breadcrumb } from './_components/r2-breadcrumb'
import { R2Table } from './_components/r2-table'

export default function Page() {
  const pathname = usePathname()

  const [paths, setPaths] = React.useState<string[]>(pathname.split('/').filter(Boolean).slice(2))

  const handlePathChange = React.useEffectEvent((paths: string[]) => {
    setPaths(paths)
    window.history.replaceState(null, '', `/dashboard/r2/${paths.join('/')}`)
  })

  return (
    <div className="flex flex-col gap-4">
      <R2Breadcrumb paths={paths} onPathChange={handlePathChange} />
      <R2Table paths={paths} onFolderRowClick={handlePathChange} />
    </div>
  )
}
