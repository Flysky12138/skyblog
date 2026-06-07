'use client'

import { Button } from '@repo/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { ScrollArea } from '@repo/ui/components/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { emojis, emojiToShortcode } from '@tiptap/extension-emoji'
import { useTiptap } from '@tiptap/react'
import { groupBy } from 'es-toolkit'
import { SmilePlusIcon } from 'lucide-react'
import React from 'react'

import { TriggerButton } from './_components/button'

export function Emoji() {
  const { editor } = useTiptap()

  const emojisGroup = React.useMemo(() => groupBy(emojis, item => item.group ?? 'unknown'), [])

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <TriggerButton aria-label="Emoji">
                  <SmilePlusIcon />
                </TriggerButton>
              }
            />
          }
        />
        <TooltipContent>Emoji</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-auto">
        <Tabs className="gap-4" defaultValue="unknown">
          <TabsList className="w-full">
            {Object.entries(emojisGroup).map(([groupName, emojis]) => (
              <TabsTrigger key={groupName} className="w-10 p-0" value={groupName}>
                {emojis[0].emoji}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(emojisGroup).map(([groupName, emojis]) => (
            <TabsContent key={groupName} value={groupName}>
              <ScrollArea className="h-64 *:data-[slot=scroll-area-scrollbar]:hidden *:data-[slot=scroll-area-viewport]:overscroll-contain">
                <div className="grid grid-cols-10 gap-1">
                  {emojis.map(({ emoji, name }, index) => (
                    <Button
                      key={index}
                      size="icon"
                      title={name}
                      variant="ghost"
                      onClick={() => {
                        const shortcode = emojiToShortcode(emoji!, emojis)
                        if (shortcode && !editor.isActive('codeBlock')) {
                          editor.chain().focus().setEmoji(shortcode).run()
                        } else {
                          editor.chain().focus().insertContent(emoji!).run()
                        }
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
