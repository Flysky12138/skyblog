interface TableTbodyEmptyProps {
  colSpan: number
  enable: boolean
}

export default function TableTbodyEmpty({ colSpan, enable }: TableTbodyEmptyProps) {
  if (!enable) return null

  return (
    <tr>
      <td className="h-11 text-center" colSpan={colSpan}>
        内容为空
      </td>
    </tr>
  )
}
