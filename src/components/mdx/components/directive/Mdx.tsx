import { Alert } from '@mui/material'
import dynamic from 'next/dynamic'
import Code from '../element/Code'

interface MdxProps {
  path: string
}

export default function Mdx({ path }: MdxProps) {
  const Componet = dynamic(() =>
    import(`@/mdx/${path}`).catch(() => (
      <Alert severity="error">
        导入 <Code>{`@/mdx/${path}`}</Code> 失败
      </Alert>
    ))
  )

  return <Componet />
}
