'use client'

import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog'
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@repo/ui/components/field'
import { Textarea } from '@repo/ui/components/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap } from '@tiptap/react'
import { SigmaIcon } from 'lucide-react'
import React from 'react'

import { setMathClickHandler } from '../../lib/math-dialog-bridge'
import { TriggerButton } from './_components/button'

export function Math() {
  const { editor } = useTiptap()

  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<'block' | 'inline'>('inline')
  const [latex, setLatex] = React.useState('')
  const [editingPos, setEditingPos] = React.useState<null | number>(null)

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

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // 检查当前光标是否在已有公式节点上
      if (editor?.isActive('inlineMath')) {
        const { from } = editor.state.selection
        const node = editor.state.doc.nodeAt(from)
        if (node?.type.name === 'inlineMath') {
          setMode('inline')
          setLatex((node.attrs.latex as string | undefined) ?? '')
          setEditingPos(from)
          setOpen(true)
          return
        }
      }
      if (editor?.isActive('blockMath')) {
        const { from } = editor.state.selection
        const node = editor.state.doc.nodeAt(from)
        if (node?.type.name === 'blockMath') {
          setMode('block')
          setLatex((node.attrs.latex as string | undefined) ?? '')
          setEditingPos(from)
          setOpen(true)
          return
        }
      }
      // 没有选中公式，进入新建模式
      setMode('inline')
      setLatex('')
      setEditingPos(null)
    } else {
      setEditingPos(null)
    }
    setOpen(newOpen)
  }

  const handleConfirm = () => {
    if (!latex.trim()) return

    if (editingPos !== null) {
      // 更新已有公式
      if (mode === 'inline') {
        editor.chain().focus().updateInlineMath({ latex: latex.trim(), pos: editingPos }).run()
      } else {
        editor.chain().focus().updateBlockMath({ latex: latex.trim(), pos: editingPos }).run()
      }
    } else {
      // 插入新公式
      if (mode === 'inline') {
        editor.chain().focus().insertInlineMath({ latex: latex.trim() }).run()
      } else {
        editor.chain().focus().insertBlockMath({ latex: latex.trim() }).run()
      }
    }

    setOpen(false)
    setLatex('')
    setEditingPos(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <Button className="px-20" disabled={!latex.trim()} size="lg" onClick={handleConfirm}>
            {isEditing ? '更新' : '插入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
