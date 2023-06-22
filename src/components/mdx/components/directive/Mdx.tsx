import { Alert } from '@mui/material'
import dynamic from 'next/dynamic'
import Code from '../Code'

interface MdxPropsType {
  path: string
}

export default function Page({ path }: MdxPropsType) {
  const Componet = dynamic(() =>
    import(`@/mdx/${path}`).catch(() => (
      <Alert severity="error">
        导入 <Code>{`@/mdx/${path}`}</Code> 失败
      </Alert>
    ))
  )

  return <Componet />
}
