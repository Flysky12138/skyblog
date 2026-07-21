import { highlightCode } from '@repo/rich-text-editor/shiki'
import { Card } from '@repo/ui/components-self/card'
import { Spinner } from '@repo/ui/components/spinner'
import { cn } from '@repo/ui/lib/utils'
import useSWR from 'swr'

interface JsonViewerProps {
  className?: string
  json: object
}

export function JsonViewer({ className, json }: JsonViewerProps) {
  const code = JSON.stringify(json, null, 2)

  const { data, isLoading } = useSWR(['019f8e1a-6f51-7775-963a-568a874a9f00', code], () => highlightCode(code, { lang: 'json' }), {
    fallbackData: '',
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return (
    <Card className={cn('rounded-md p-3 font-code text-sm', className)}>
      {isLoading ? (
        <div className="flex items-center justify-center p-3">
          <Spinner />
        </div>
      ) : (
        <span
          dangerouslySetInnerHTML={{ __html: data }}
          className="break-all *:whitespace-pre-wrap **:text-(--shiki-light) dark:**:text-(--shiki-dark)"
        />
      )}
    </Card>
  )
}
