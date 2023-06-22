import { LinearProgress } from '@mui/joy'

interface TableTheadProgressPropsType {
  colSpan: number
  loading: boolean
}

export default function TableTheadProgress({ loading, colSpan }: TableTheadProgressPropsType) {
  if (!loading) return null

  return (
    <tr>
      <th className="h-0 border-none p-0" colSpan={colSpan}>
        <LinearProgress
          sx={{
            '--LinearProgress-radius': 0
          }}
        />
      </th>
    </tr>
  )
}
