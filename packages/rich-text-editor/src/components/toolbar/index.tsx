import { TooltipProvider } from '@repo/ui/components/tooltip'
import { cn } from '@repo/ui/lib/utils'
import React from 'react'

import { Separator } from './_components/separator'
import { Blockquote } from './blockquote'
import { Bold } from './bold'
import { ClearFormatting } from './clear-formatting'
import { CodeBlock } from './code-block'
import { CodeInline } from './code-inline'
import { ColorHighlight } from './color-highlight'
import { Divider } from './divider'
import { Emoji } from './emoji'
import { FontFamily } from './font-family'
import { FontSize } from './font-size'
import { Heading } from './heading'
import { ImageUploadPlaceholder } from './image-upload-placeholder'
import { Italic } from './italic'
import { LineHeight } from './line-height'
import { Link } from './link'
import { List } from './list'
import { Math } from './math'
import { SearchAndReplace } from './search-and-replace'
import { Strike } from './strike'
import { Subscript } from './subscript'
import { Superscript } from './superscript'
import { Table } from './table'
import { TextAlign } from './text-align'
import { Underline } from './underline'
import { UndoRedo } from './undo-redo'

const Excalidraw = React.lazy(() => import('./excalidraw').then(module => ({ default: module.Excalidraw })))

interface ToolBarProps {
  children?: React.ReactNode
  className?: string
}

export function ToolBar({ children, className }: ToolBarProps) {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-3', className)} role="toolbar">
        <UndoRedo />

        <Separator />

        <Heading />
        <List />
        <TextAlign />
        <Blockquote />
        <CodeBlock />

        <Separator />

        <Bold />
        <Italic />
        <Strike />
        <Underline />
        <Subscript />
        <Superscript />
        <CodeInline />
        <Link />
        <FontFamily />
        <FontSize />
        <LineHeight />
        <ColorHighlight />
        <ClearFormatting />

        <Separator />

        <Table />
        <ImageUploadPlaceholder />
        <Excalidraw />
        <Divider />
        <Emoji />
        <Math />
        <SearchAndReplace />

        {children}
      </div>
    </TooltipProvider>
  )
}

export {
  Blockquote,
  Bold,
  ClearFormatting,
  CodeBlock,
  CodeInline,
  ColorHighlight,
  Divider,
  Emoji,
  Excalidraw,
  FontFamily,
  FontSize,
  Heading,
  ImageUploadPlaceholder,
  Italic,
  LineHeight,
  Link,
  List,
  Math,
  SearchAndReplace,
  Separator,
  Strike,
  Subscript,
  Superscript,
  Table,
  TextAlign,
  Underline,
  UndoRedo
}
