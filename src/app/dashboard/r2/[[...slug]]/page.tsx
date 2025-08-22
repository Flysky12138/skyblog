import { R2Breadcrumb } from './_components/r2-breadcrumb'
import { R2Table } from './_components/r2-table'

export default async function Page({ params }: PageProps<'/dashboard/r2/[[...slug]]'>) {
  const { slug } = await params

  return (
    <div className="flex flex-col gap-4">
      <R2Breadcrumb paths={slug} />
      <R2Table paths={slug} />
    </div>
  )
}
