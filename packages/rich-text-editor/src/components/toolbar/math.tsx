'use client'

import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Textarea } from '@repo/ui/components/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap } from '@tiptap/react'
import { SigmaIcon } from 'lucide-react'
import React from 'react'

import { setMathClickHandler } from '../../lib/dialog-bridge/math-dialog-bridge'
import { TriggerButton } from './_components/button'

export function Math() {
  const { editor } = useTiptap()

  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<'block' | 'inline'>('inline')
  const [latex, setLatex] = React.useState('')
  const [editingPos, setEditingPos] = React.useState<null | number>(null)

  const normalizedLatex = latex.trim()
  const isEditing = editingPos !== null

  // 注册全局回调，让拓展层的 onClick 能打开弹窗
  React.useEffect(() => {
    setMathClickHandler(({ node, pos }) => {
      const isBlock = node.type.name === 'blockMath'
      setMode(isBlock ? 'block' : 'inline')
      setLatex((node.attrs.latex as string | undefined) ?? '')
      setEditingPos(pos)
      setOpen(true)
    })
    return () => {
      setMathClickHandler(null)
    }
  }, [])

  const handleOpenChangeComplete = (newOpen: boolean) => {
    if (!newOpen) {
      // setMode('inline')
      setLatex('')
      setEditingPos(null)
    }
  }

  const handleConfirm = () => {
    if (!normalizedLatex) return

    if (editingPos !== null) {
      // 更新已有公式
      if (mode === 'inline') {
        editor.chain().focus().updateInlineMath({ latex: normalizedLatex, pos: editingPos }).run()
      } else {
        editor.chain().focus().updateBlockMath({ latex: normalizedLatex, pos: editingPos }).run()
      }
    } else {
      // 插入新公式
      if (mode === 'inline') {
        editor.chain().focus().insertInlineMath({ latex: normalizedLatex }).run()
      } else {
        editor.chain().focus().insertBlockMath({ latex: normalizedLatex }).run()
      }
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} onOpenChangeComplete={handleOpenChangeComplete}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <TriggerButton aria-label="数学公式">
                  <SigmaIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>数学公式</TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑 LaTeX 数学公式' : '插入 LaTeX 数学公式'}</DialogTitle>
          <DialogDescription>支持 KaTeX 语法的 LaTeX 数学公式</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldTitle>公式类型</FieldTitle>
            <div className="flex gap-2">
              <Button
                disabled={isEditing}
                variant={mode === 'inline' ? 'default' : 'outline'}
                onClick={() => {
                  setMode('inline')
                }}
              >
                行内公式
              </Button>
              <Button
                disabled={isEditing}
                variant={mode === 'block' ? 'default' : 'outline'}
                onClick={() => {
                  setMode('block')
                }}
              >
                块级公式
              </Button>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="math-latex">LaTeX 代码</FieldLabel>
            <Textarea
              autoComplete="off"
              className="min-h-40 font-code"
              id="math-latex"
              placeholder={mode === 'inline' ? 'E = mc^2' : '\\sum_{i=1}^{n} x_i = X'}
              value={latex}
              onChange={event => {
                setLatex(event.target.value)
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  handleConfirm()
                }
              }}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button
            className="px-6"
            size="lg"
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
          >
            取消
          </Button>
          <Button className="px-20" disabled={!normalizedLatex} size="lg" onClick={handleConfirm}>
            {isEditing ? '更新' : '插入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
