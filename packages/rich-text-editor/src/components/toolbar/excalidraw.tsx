'use client'

import '@excalidraw/excalidraw/index.css'
import { Excalidraw as ExcalidrawComponent, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw'
import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTheme } from '@repo/ui/hooks/use-theme'
import { useTiptap } from '@tiptap/react'
import { PencilRulerIcon } from 'lucide-react'
import React from 'react'

import { ExcalidrawAttributes } from '../../extensions/excalidraw'
import { setExcalidrawEditHandler } from '../../lib/dialog-bridge/excalidraw-dialog-bridge'
import { TriggerButton } from './_components/button'

export function Excalidraw() {
  const { editor } = useTiptap()
  const { isDark } = useTheme()

  const [open, setOpen] = React.useState(false)
  const [excalidrawAPI, setExcalidrawAPI] = React.useState<ExcalidrawImperativeAPI | null>(null)
  const [elements, setElements] = React.useState<readonly ExcalidrawElement[]>([])
  const [editingPos, setEditingPos] = React.useState<null | number>(null)

  const isEditing = editingPos !== null

  // 注册编辑回调，供视图层点击 SVG 时触发
  React.useEffect(() => {
    setExcalidrawEditHandler(({ elements: payloadElements, pos }) => {
      setElements(payloadElements)
      setEditingPos(pos)
      setOpen(true)
    })
    return () => {
      setExcalidrawEditHandler(null)
    }
  }, [])

  const handleSave = () => {
    if (elements.length === 0) return

    const attrs: ExcalidrawAttributes = { elements: [...elements] }

    if (editingPos !== null) {
      editor.chain().focus().setNodeSelection(editingPos).updateAttributes('excalidraw', attrs).run()
    } else {
      editor.chain().focus().insertExcalidraw(attrs).run()
    }

    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={newOpen => {
        if (newOpen) {
          window.dispatchEvent(new Event('resize'))
        } else {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            excalidrawAPI?.resetScene()
            setElements([])
            setEditingPos(null)
          })
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <TriggerButton aria-label="Excalidraw 画板">
                  <PencilRulerIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>Excalidraw 画板</TooltipContent>
      </Tooltip>
      <DialogContent fullScreen className="h-full p-0">
        <ExcalidrawComponent
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              toggleTheme: false
            }
          }}
          excalidrawAPI={setExcalidrawAPI}
          initialData={{
            elements,
            scrollToContent: true,
            appState: {
              viewBackgroundColor: 'transparent'
            }
          }}
          langCode="zh-CN"
          renderTopRightUI={() => (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                }}
              >
                关闭
              </Button>
              <Button
                disabled={elements.length === 0}
                onClick={() => {
                  void handleSave()
                }}
              >
                {isEditing ? '保存' : '插入画板'}
              </Button>
            </>
          )}
          theme={isDark ? 'dark' : 'light'}
          onChange={els => {
            setElements(els)
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.SearchMenu />
            <MainMenu.DefaultItems.Help />
            <MainMenu.DefaultItems.ClearCanvas />
          </MainMenu>
          <WelcomeScreen />
        </ExcalidrawComponent>
      </DialogContent>
    </Dialog>
  )
}
