'use client'

import { Button } from '@repo/ui/components/button'
import { ColorPicker } from '@repo/ui/components/color-picker/color-picker'
import { Field, FieldGroup } from '@repo/ui/components/field'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { NodeSelection } from '@tiptap/pm/state'
import { useTiptap, useTiptapState } from '@tiptap/react'
import { round } from 'es-toolkit'
import { HighlighterIcon } from 'lucide-react'
import React from 'react'

import { TriggerButton } from './_components/button'

const presets = [
  'oklch(0.98 0 0)',
  'oklch(0.92 0 0)',
  'oklch(0.82 0 0)',
  'oklch(0.68 0 0)',
  'oklch(0.52 0 0)',
  'oklch(0.38 0 0)',
  'oklch(0.24 0 0)',
  'oklch(0.12 0 0)',
  'oklch(0.62 0.22 25)',
  'oklch(0.72 0.18 50)',
  'oklch(0.82 0.16 95)',
  'oklch(0.78 0.18 125)',
  'oklch(0.72 0.18 145)',
  'oklch(0.72 0.16 185)',
  'oklch(0.70 0.16 210)',
  'oklch(0.68 0.18 250)',
  'oklch(0.62 0.20 290)',
  'oklch(0.68 0.18 335)'
]

export function ColorHighlight() {
  const { editor } = useTiptap()
  const { activeColor, activeHighlight, canDo, isNodeSelected, isSelectionEmpty } = useTiptapState(({ editor }) => ({
    activeColor: editor.getAttributes('textStyle')?.color as string | undefined,
    activeHighlight: editor.getAttributes('highlight')?.color as string | undefined,
    canDo: editor.can().setColor('') || editor.can().setHighlight(),
    isNodeSelected: editor.state.selection instanceof NodeSelection,
    isSelectionEmpty: editor.state.selection.empty
  }))

  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<'color' | 'highlight'>('color')
  const [color, setColor] = React.useState<string | undefined>(undefined)
  const [highlight, setHighlight] = React.useState<string | undefined>(undefined)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setColor(activeColor)
      setHighlight(activeHighlight)
    }
    setOpen(nextOpen)
  }

  const handleConfirm = () => {
    if (color === undefined) {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(color).run()
    }
    if (highlight === undefined) {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().setHighlight({ color: highlight }).run()
    }
    setOpen(false)
  }

  const handleReset = () => {
    setColor(undefined)
    setHighlight(undefined)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <TriggerButton aria-label="颜色高亮" disabled={isSelectionEmpty || isNodeSelected || !canDo}>
                  <HighlighterIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>颜色高亮</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="color">文字颜色</TabsTrigger>
            <TabsTrigger value="highlight">背景高亮</TabsTrigger>
          </TabsList>
        </Tabs>
        <FieldGroup>
          <Field>
            <div className="rounded-md py-3 text-center text-xl font-bold" role="status" style={{ backgroundColor: highlight, color }}>
              预览文本
            </div>
            <ColorPicker.Root
              className="border-none p-0 shadow-none"
              format="oklch"
              value={tab === 'color' ? color : highlight}
              onValueChange={({ alpha, c, h, l }) => {
                const newColor = `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 3)} / ${round(alpha, 3)})`
                if (tab === 'color') {
                  setColor(newColor)
                } else {
                  setHighlight(newColor)
                }
              }}
            >
              <ColorPicker.Area showWarningLines mode="oklch-cl" />
              <div className="flex flex-col gap-1.5">
                <ColorPicker.Hue />
                <ColorPicker.Lightness />
                <ColorPicker.Alpha />
              </div>
              <div className="flex h-8 gap-2">
                <ColorPicker.EyeDropper />
                <ColorPicker.GamutBadge />
              </div>
              <ColorPicker.ChannelInput showFormat={false} />
              <ColorPicker.Swatches presets={presets} />
            </ColorPicker.Root>
          </Field>
          <Field orientation="horizontal">
            <Button className="w-16" variant="outline" onClick={handleReset}>
              重置
            </Button>
            <Button className="grow" onClick={handleConfirm}>
              确认
            </Button>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
