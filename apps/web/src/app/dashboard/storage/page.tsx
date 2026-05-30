'use client'

import { isBrowser } from 'es-toolkit'
import React from 'react'

import { STORAGE } from '@/lib/constants'

import { StorageBreadcrumb } from './_components/storage-breadcrumb'
import { StorageTable } from './_components/storage-table'

const getId = () => (isBrowser() ? (new URLSearchParams(window.location.search).get('id') ?? STORAGE.ROOT_DIRECTORY_ID) : STORAGE.ROOT_DIRECTORY_ID)

export default function Page() {
  const [id, setId] = React.useState<string>(getId)

  const handleChange = (id: string) => {
    setId(id)
    window.history.pushState({}, '', `/dashboard/storage?id=${id}`)
  }

  return (
    <>
      <StorageBreadcrumb id={id} onChange={handleChange} />
      <StorageTable id={id} onFolderRowClick={handleChange} />
    </>
  )
}
