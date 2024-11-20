'use client'

import ModalCore from '@/components/modal/ModalCore'
import { download } from '@/lib/file/download'
import { Button, FormControl, FormLabel, Option, Radio, RadioGroup, Select } from '@mui/joy'
import { Alert } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { useMeasure, useScrollbarWidth } from 'react-use'
import { FixedSizeList } from 'react-window'
import { useImmer } from 'use-immer'
import Arctan from './Arctan.mdx'
import Chudnovsky from './Chudnovsky.mdx'
import ChudnovskyBs from './ChudnovskyBs.mdx'
import ChudnovskyBsCode from './ChudnovskyBsCode.mdx'
import ChudnovskyCode from './ChudnovskyCode.mdx'
import Label from './Label.mdx'

type ModeType = 'arctan' | 'chudnovsky' | 'chudnovsky-bs'

const OPTIONS: Record<ModeType, number[]> = {
  arctan: [],
  chudnovsky: [1e4, 1e5, 1e6],
  'chudnovsky-bs': [1e4, 1e5, 1e6, 5e6, 1e7, 3e7, 5e7, 7e7, 1e8]
}

export default function Pi() {
  const [form, setForm] = useImmer<{ mode: ModeType; size: number }>({
    mode: 'chudnovsky-bs',
    size: 1e4
  })

  const [result, setResult] = React.useState<{ error: Error; pi: string; time: number } | null>(null)
  const [loading, setLoading] = React.useState(false)
  const workerRef = React.useRef<Worker>()
  React.useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
      setResult(data)
      setLoading(false)
    }
    workerRef.current = worker
    return () => {
      worker.terminate()
    }
  }, [])

  const [sectionRef, { width }] = useMeasure<HTMLElement>()
  const [fontRef, { width: fontWidth }] = useMeasure<HTMLElement>()
  const scrollbarWidth = useScrollbarWidth() || 0
  const piStr = React.useMemo(() => {
    if (!result?.pi) return []
    const ans = []
    const pi = result.pi
    const interval = Math.floor((width - scrollbarWidth) / fontWidth - 3)
    for (let i = 0; i < pi.length; i += interval) {
      ans.push(pi.slice(i, i + interval))
    }
    return ans
  }, [fontWidth, result, scrollbarWidth, width])

  return (
    <section ref={sectionRef} className="flex flex-col gap-y-3">
      <FormControl>
        <FormLabel>1、算法</FormLabel>
        <RadioGroup
          className="flex-wrap gap-x-5 gap-y-3 space-x-0"
          orientation="horizontal"
          sx={{
            label: {
              '& p': {
                m: 0
              }
            }
          }}
          value={form.mode}
          onChange={event => {
            setForm(state => {
              const mode = event.target.value as ModeType
              state.mode = mode
              if (!OPTIONS[mode].includes(state.size)) state.size = Math.min(...OPTIONS[mode])
            })
          }}
        >
          <Radio label={<Label />} value="arctan" />
          <Radio label="Chudnovsky" value="chudnovsky" />
          <Radio label="Chudnovsky - BS" value="chudnovsky-bs" />
        </RadioGroup>
      </FormControl>
      <FormControl className="h-20">
        <FormLabel>2、计算位数</FormLabel>
        {form.mode == 'arctan' ? (
          <Alert className="mt-2 py-px" severity="warning">
            收敛速度太慢，不提供计算
          </Alert>
        ) : (
          <div className="mt-2 flex gap-x-6">
            <Select
              className="w-20"
              value={form.size}
              onChange={(_, value) => {
                if (!value) return
                setForm(state => {
                  state.size = value
                })
              }}
            >
              {OPTIONS[form.mode].map(option => (
                <Option key={option} value={option}>
                  {option.toExponential().replace('+', '')}
                </Option>
              ))}
            </Select>
            <ModalCore
              className="s-bg-root p-0 [&_figure]:s-hidden-scrollbar [&_figure]:overflow-auto [&_pre]:bg-transparent"
              component={props => (
                <Button variant="soft" {...props}>
                  源码
                </Button>
              )}
            >
              {form.mode == 'chudnovsky' && <ChudnovskyCode />}
              {form.mode == 'chudnovsky-bs' && <ChudnovskyBsCode />}
            </ModalCore>
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
          </div>
        )}
      </FormControl>
      <span ref={fontRef} aria-hidden="true" className="invisible absolute h-0 self-start font-code">
        3
      </span>
      {result ? (
        result.error ? (
          <Alert severity="error">{result.error.message}</Alert>
        ) : (
          <div className="mb-5">
            <div className="pb-1">
              耗时 {result.time} 毫秒；
              <Button
                className="text-base"
                size="sm"
                sx={{
                  '--Button-minHeight': '0'
                }}
                variant="plain"
                onClick={() => {
                  const blob = new Blob([piStr.join('')], { type: 'text/plain;charset=utf-8' })
                  download(blob, `pi-${form.size}.txt`)
                }}
              >
                下载
              </Button>
            </div>
            <div className="s-bg-sheet s-border-color-card overflow-hidden rounded-lg border py-2 pl-3 font-code">
              <FixedSizeList height={400} itemCount={piStr.length} itemData={piStr} itemSize={20} overscanCount={10} width="100%">
                {({ data, style, index }) => (
                  <span key={index} style={style}>
                    {data[index]}
                  </span>
                )}
              </FixedSizeList>
            </div>
          </div>
        )
      ) : null}
      <div>
        {form.mode == 'arctan' && <Arctan />}
        {form.mode == 'chudnovsky' && <Chudnovsky />}
        {form.mode == 'chudnovsky-bs' && <ChudnovskyBs />}
      </div>
      {['chudnovsky', 'chudnovsky-bs'].includes(form.mode) && (
        <Alert className="mt-5 [&_a]:block" severity="info">
          <Link href="https://pi-calculator.netlify.app/" target="_blank">
            https://pi-calculator.netlify.app/
          </Link>
          <Link href="https://www.craig-wood.com/nick/articles/pi-chudnovsky/" target="_blank">
            https://www.craig-wood.com/nick/articles/pi-chudnovsky/
          </Link>
        </Alert>
      )}
    </section>
  )
}
