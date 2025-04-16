'use client'

import { DisplayByConditional } from '@/components/display/display-by-conditional'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Info, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useToggle } from 'react-use'
import { useImmer } from 'use-immer'
import Arctan from './arctan.mdx'
import ChudnovskyBsCode from './chudnovsky-bs-code.mdx'
import ChudnovskyBs from './chudnovsky-bs.mdx'
import ChudnovskyCode from './chudnovsky-code.mdx'
import Chudnovsky from './chudnovsky.mdx'
import { Print } from './print'

type ModeType = 'arctan' | 'chudnovsky' | 'chudnovsky-bs'

const OPTIONS: Record<ModeType, number[]> = {
  arctan: [],
  chudnovsky: [1e4, 1e5, 1e6],
  'chudnovsky-bs': [1e4, 1e5, 1e6, 5e6, 1e7, 3e7, 5e7, 7e7]
}

export default function Pi() {
  const [form, setForm] = useImmer<{ mode: ModeType; size: number }>({
    mode: 'chudnovsky-bs',
    size: 1e4
  })

  const [result, setResult] = React.useState<{ error: Error; pi: string; time: number } | null>(null)
  const [loading, loadingToggle] = useToggle(false)

  const workerRef = React.useRef<Worker>(null)
  React.useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
      setResult(data)
      loadingToggle(false)
    }
    workerRef.current = worker
    return () => {
      workerRef.current?.terminate()
    }
  }, [loadingToggle])

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-4">
        <Select
          defaultValue={form.mode}
          onValueChange={(mode: ModeType) => {
            setForm(state => {
              state.mode = mode
              if (!OPTIONS[mode].includes(state.size)) {
                state.size = Math.min(...OPTIONS[mode])
              }
            })
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arctan">反正切</SelectItem>
            <SelectItem value="chudnovsky">Chudnovsky</SelectItem>
            <SelectItem value="chudnovsky-bs">Chudnovsky - BS</SelectItem>
          </SelectContent>
        </Select>
        <DisplayByConditional condition={form.mode != 'arctan'}>
          <Select
            defaultValue={String(form.size)}
            onValueChange={value => {
              if (!value) return
              setForm(state => {
                state.size = Number(value)
              })
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPTIONS[form.mode].map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option.toExponential().replace('+', '')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>源码</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 **:data-[slot='scroll-area-viewport']:max-h-[90svh] [&>button]:hidden">
              {form.mode == 'chudnovsky' && <ChudnovskyCode />}
              {form.mode == 'chudnovsky-bs' && <ChudnovskyBsCode />}
            </DialogContent>
          </Dialog>
          <Button
            className="grow"
            disabled={loading}
            onClick={() => {
              setResult(null)
              workerRef.current?.postMessage(form)
              loadingToggle(true)
            }}
          >
            {loading && <Loader2 className="animate-spin" />}
            计算
          </Button>
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
      <div>
        {form.mode == 'arctan' && <Arctan />}
        {form.mode == 'chudnovsky' && <Chudnovsky />}
        {form.mode == 'chudnovsky-bs' && <ChudnovskyBs />}
      </div>
      <DisplayByConditional condition={['chudnovsky', 'chudnovsky-bs'].includes(form.mode)}>
        <Alert>
          <Info />
          <AlertTitle>引用文献</AlertTitle>
          <AlertDescription>
            <Link href="https://pi-calculator.netlify.app/" rel="noreferrer nofollow" target="_blank">
              https://pi-calculator.netlify.app/
            </Link>
            <Link href="https://www.craig-wood.com/nick/articles/pi-chudnovsky/" rel="noreferrer nofollow" target="_blank">
              https://www.craig-wood.com/nick/articles/pi-chudnovsky/
            </Link>
          </AlertDescription>
        </Alert>
      </DisplayByConditional>
    </section>
  )
}
