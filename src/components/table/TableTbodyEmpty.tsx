interface TableTbodyEmptyPropsType {
  colSpan: number
  enable: boolean
}

export default function TableTbodyEmpty({ colSpan, enable }: TableTbodyEmptyPropsType) {
  if (!enable) return null

  return (
    <tr>
      <td className="h-11 text-center" colSpan={colSpan}>
        内容为空
      </td>
    </tr>
  )
}
