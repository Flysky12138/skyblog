'use client'

import React from 'react'

import { STORAGE } from '@/lib/constants'

import { StorageBreadcrumb } from './_components/storage-breadcrumb'
import { StorageTable } from './_components/storage-table'

export default function Page() {
  const [id, setId] = React.useState<string>(STORAGE.ROOT_DIRECTORY_ID)

  const handleChange = React.useEffectEvent((id: string) => {
    setId(id)
    window.history.pushState({}, '', `/dashboard/storage?id=${id}`)
  })

  React.useEffect(() => {
    setId(new URL(location.href).searchParams.get('id') ?? STORAGE.ROOT_DIRECTORY_ID)
  }, [])

  return (
    <>
      <StorageBreadcrumb id={id} onChange={handleChange} />
      <StorageTable id={id} onFolderRowClick={handleChange} />
    </>
  )
}
