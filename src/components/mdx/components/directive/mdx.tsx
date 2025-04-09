import { Card } from '@/components/layout/card'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Code } from '../element/code'

interface MdxProps extends React.PropsWithChildren {
  path: string
}

export const Mdx = ({ path, ...props }: MdxProps) => {
  const Componet = dynamic<Omit<MdxProps, 'path'>>(
    () => {
      return import(`@/mdx/${path}`).catch(() => ({
        default: () => (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>
              导入 <Code>{`@/mdx/${path}`}</Code> 失败
            </AlertTitle>
          </Alert>
        )
      }))
    },
    {
      loading: () => <Card className="skeleton font-title flex h-20 items-center justify-center">Loading</Card>
    }
  )

  return <Componet {...props} />
}
