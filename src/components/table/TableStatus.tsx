interface TableStatusProps {
  colSpan: number
  isEmpty: boolean
  isLoading: boolean
}

export default function TableStatus({ colSpan, isEmpty, isLoading }: TableStatusProps) {
  if (!isEmpty && !isLoading) return null

  return (
    <tr>
      <td className="s-subtitle h-10 text-center align-middle font-title" colSpan={colSpan}>
        {isLoading ? 'Loading...' : '内容为空'}
      </td>
    </tr>
  )
}
