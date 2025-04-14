import Loading from '@/assets/svg/loading.svg'
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
      loading: () => (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )
    }
  )

  return <Componet {...props} />
}
