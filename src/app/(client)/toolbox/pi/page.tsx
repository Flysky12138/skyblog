'use client'

import { AlertCircle } from 'lucide-react'
import React from 'react'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup } from '@/components/ui/button-group'
import '@/components/mdx/css/index'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import Arctan_ from './_components/arctan.mdx'
import ChudnovskyBsCode_ from './_components/chudnovsky-bs-code.mdx'
import ChudnovskyBs_ from './_components/chudnovsky-bs.mdx'
import ChudnovskyCode_ from './_components/chudnovsky-code.mdx'
import Chudnovsky_ from './_components/chudnovsky.mdx'
import { Print } from './_components/print'

const Arctan = React.memo(Arctan_)
const ChudnovskyBsCode = React.memo(ChudnovskyBsCode_)
const ChudnovskyBs = React.memo(ChudnovskyBs_)
const ChudnovskyCode = React.memo(ChudnovskyCode_)
const Chudnovsky = React.memo(Chudnovsky_)

type ModeType = 'arctan' | 'chudnovsky' | 'chudnovsky-bs'

const OPTIONS: Record<ModeType, number[]> = {
  arctan: [],
  chudnovsky: [1e4, 1e5, 1e6],
  'chudnovsky-bs': [1e4, 1e5, 1e6, 5e6, 1e7, 3e7, 5e7, 7e7]
}

export default function Page() {
  const [form, setForm] = useImmer<{ mode: ModeType; size: number }>({
    mode: 'chudnovsky-bs',
    size: 1e4
  })

  const [result, setResult] = React.useState<null | { error: Error; pi: string; time: number }>(null)
  const [loading, setLoading] = React.useState(false)

  const workerRef = React.useRef<Worker>(null)
  React.useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
      setResult(data)
      setLoading(false)
    }
    workerRef.current = worker
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  return (
    <Card className="p-card flex flex-col gap-3">
      <div className="flex flex-wrap gap-4">
        <ButtonGroup className="grow sm:grow-0">
          <Select
            defaultValue={form.mode}
            onValueChange={(mode: ModeType) => {
              setForm(draft => {
                draft.mode = mode
                if (!OPTIONS[mode].includes(draft.size)) {
                  draft.size = Math.min(...OPTIONS[mode])
                }
              })
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arctan">反正切</SelectItem>
              <SelectItem value="chudnovsky">Chudnovsky</SelectItem>
              <SelectItem value="chudnovsky-bs">Chudnovsky - BS</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="min-w-28 grow">源码</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-transparent p-0! text-sm" showCloseButton={false}>
              <DialogHeader className="hidden">
                <DialogTitle />
                <DialogDescription />
              </DialogHeader>
              {form.mode == 'chudnovsky' && <ChudnovskyCode />}
              {form.mode == 'chudnovsky-bs' && <ChudnovskyBsCode />}
            </DialogContent>
          </Dialog>
        </ButtonGroup>
        <DisplayByConditional condition={form.mode != 'arctan'}>
          <ButtonGroup className="grow">
            <Select
              defaultValue={String(form.size)}
              onValueChange={value => {
                if (!value) return
                setForm(draft => {
                  draft.size = Number(value)
                })
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS[form.mode].map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="grow"
              loading={loading}
              onClick={() => {
                setResult(null)
                workerRef.current?.postMessage(form)
                setLoading(true)
              }}
            >
              计算
            </Button>
          </ButtonGroup>
        </DisplayByConditional>
      </div>

      <DisplayByConditional condition={form.mode == 'arctan'}>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>收敛速度太慢，不提供计算</AlertTitle>
        </Alert>
      </DisplayByConditional>

      {result && (
        <DisplayByConditional
          condition={!result.error}
          fallback={
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{result.error?.message}</AlertTitle>
            </Alert>
          }
        >
          <Print
            pi={result.pi}
            size={form.size}
            time={result.time}
            onClose={() => {
              setResult(null)
            }}
          />
        </DisplayByConditional>
      )}

      <article className="mt-5 max-w-none">
        {form.mode == 'arctan' && <Arctan />}
        {form.mode == 'chudnovsky' && <Chudnovsky />}
        {form.mode == 'chudnovsky-bs' && <ChudnovskyBs />}
      </article>
    </Card>
  )
}
