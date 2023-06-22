interface TableStatusProps {
  colSpan: number
  isEmpty: boolean
  isError?: boolean
  isLoading: boolean
}

export default function TableStatus({ colSpan, isEmpty, isLoading, isError }: TableStatusProps) {
  if (!isError && !isEmpty && !isLoading) return null

  return (
    <tr>
      <td className="s-subtitle h-10 text-center align-middle font-title" colSpan={colSpan}>
        {isError ? 'Error' : isLoading ? 'Loading...' : '内容为空'}
      </td>
    </tr>
  )
}
