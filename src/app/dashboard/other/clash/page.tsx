'use client'

import TableClash from './_components/TableClash'
import TableTemplate from './_components/TableTemplate'

export default function Page() {
  return (
    <section className="flex flex-col gap-y-12">
      <TableTemplate />
      <TableClash />
    </section>
  )
}
