import { StorageBreadcrumb } from './_components/storage-breadcrumb'
import { StorageTable } from './_components/storage-table'

export default async function Page({ searchParams }: PageProps<'/dashboard/storage'>) {
  const { id } = (await searchParams) as { id: string }

  return (
    <>
      <StorageBreadcrumb id={id} />
      <StorageTable id={id} />
    </>
  )
}
