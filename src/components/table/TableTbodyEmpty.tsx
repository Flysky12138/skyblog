interface TableTbodyEmptyProps {
  colSpan: number
  enable: boolean
}

export default function TableTbodyEmpty({ colSpan, enable }: TableTbodyEmptyProps) {
  if (!enable) return null

  return (
    <tr>
      <td className="s-subtitle h-11 text-center font-title" colSpan={colSpan}>
        内容为空
      </td>
    </tr>
  )
}
