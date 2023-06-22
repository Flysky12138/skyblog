interface TableTheadLoadingProps {
  colSpan: number
  loading: boolean
}

export default function TableTheadLoading({ loading, colSpan }: TableTheadLoadingProps) {
  if (!loading) return null

  return (
    <tr>
      <th className="s-subtitle h-10 border-none text-center align-middle font-title" colSpan={colSpan}>
        Loading...
      </th>
    </tr>
  )
}
