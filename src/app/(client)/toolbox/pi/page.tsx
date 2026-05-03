'use client'

import '@/components/mdx/css/index'

import { AlertCircleIcon } from 'lucide-react'
import React from 'react'
import { useImmer } from 'use-immer'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Card } from '@/components/static/card'
import { Button } from '@/components/ui-overwrite/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui-overwrite/dialog'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup } from '@/components/ui/button-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { haptic } from '@/lib/haptic'

import Arctan_ from './_components/arctan.mdx'
import _ChudnovskyBsCode from './_components/chudnovsky-bs-code.mdx'
import _ChudnovskyBs from './_components/chudnovsky-bs.mdx'
import _ChudnovskyCode from './_components/chudnovsky-code.mdx'
import _Chudnovsky from './_components/chudnovsky.mdx'
import { Print } from './_components/print'

const Arctan = React.memo(Arctan_)
const ChudnovskyBsCode = React.memo(_ChudnovskyBsCode)
const ChudnovskyBs = React.memo(_ChudnovskyBs)
const ChudnovskyCode = React.memo(_ChudnovskyCode)
const Chudnovsky = React.memo(_Chudnovsky)

type ModeType = 'arctan' | 'chudnovsky' | 'chudnovsky-bs'

const items: { label: string; value: ModeType }[] = [
  { label: '反正切', value: 'arctan' },
  { label: 'Chudnovsky', value: 'chudnovsky' },
  { label: 'Chudnovsky - BS', value: 'chudnovsky-bs' }
]
const options: Record<ModeType, number[]> = {
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

  const optionItemValues = React.useMemo(() => {
    return options[form.mode].map(option => ({
      label: option.toLocaleString(),
      value: option
    }))
  }, [form.mode])

  const workerRef = React.useRef<Worker>(null)
  React.useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
      setResult(data)
      setLoading(false)
      haptic()
    }
    workerRef.current = worker
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  return (
    <Card className="p-card space-y-3">
      <div className="flex flex-wrap gap-4">
        <ButtonGroup className="grow sm:grow-0">
          <Select
            items={items}
            value={form.mode}
            onValueChange={mode => {
              if (!mode) return
              setForm(draft => {
                draft.mode = mode
                if (!options[mode].includes(draft.size)) {
                  draft.size = Math.min(...options[mode])
                }
              })
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger className="min-w-28 grow" render={<Button />}>
              源码
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-transparent p-0! text-sm *:[figure]:rounded-lg!" showCloseButton={false}>
              <DialogHeader className="sr-only">
                <DialogTitle>{form.mode}</DialogTitle>
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
              disabled={loading}
              items={optionItemValues}
              value={form.size}
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
                <SelectGroup>
                  {optionItemValues.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
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
          <AlertCircleIcon />
          <AlertTitle>收敛速度太慢，不提供计算</AlertTitle>
        </Alert>
      </DisplayByConditional>

      {result && (
        <DisplayByConditional
          condition={!result.error}
          fallback={
            <Alert variant="destructive">
              <AlertCircleIcon />
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
