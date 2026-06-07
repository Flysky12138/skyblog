'use client'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useTiptap, useTiptapState } from '@tiptap/react'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowDownFromLineIcon,
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  ArrowUpFromLineIcon,
  BetweenHorizontalEndIcon,
  Grid2x2Icon,
  Grid2x2PlusIcon,
  Grid2x2XIcon,
  MergeIcon,
  SheetIcon,
  SplitIcon,
  Table2Icon,
  Trash2Icon
} from 'lucide-react'

import { PaddingValue } from '../../extensions/table-style'
import { ToggleButton } from './_components/button'

const TABLE_ALIGNMENTS = [
  { icon: <AlignLeftIcon />, label: '左对齐', value: null },
  { icon: <AlignCenterIcon />, label: '居中对齐', value: 'center' },
  { icon: <AlignRightIcon />, label: '右对齐', value: 'end' }
] as const

const PADDING_OPTIONS: { icon?: React.ReactNode; label: string; value: PaddingValue }[] = [
  { label: '无', value: 'none' },
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' }
]

type TableAlignment = (typeof TABLE_ALIGNMENTS)[number]['value']

export function Table() {
  const { editor } = useTiptap()
  const { currentAlignment, currentBorder, currentPadding, hasHeaderRow, isActive } = useTiptapState(({ editor }) => {
    const isActive = editor.isActive('table')

    return {
      currentAlignment: editor.getAttributes('table').tableAlign as TableAlignment | undefined,
      currentBorder: isActive && (editor.getAttributes('table').tableBorder as boolean | undefined),
      currentPadding: editor.getAttributes('table').cellPadding as PaddingValue | undefined,
      isActive,
      hasHeaderRow:
        isActive &&
        (() => {
          const { $from } = editor.state.selection
          for (let d = $from.depth; d > 0; d--) {
            const node = $from.node(d)
            if (node.type.name === 'table') {
              return node.firstChild?.firstChild?.type.name === 'tableHeader'
            }
          }
        })()
    }
  })

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <ToggleButton aria-label="表格" pressed={isActive}>
                  <Table2Icon />
                </ToggleButton>
              }
            />
          }
        />
        <TooltipContent>表格</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: true }).run()
            }}
          >
            <Grid2x2PlusIcon />
            插入表格
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().deleteTable().run()
            }}
          >
            <Grid2x2XIcon />
            删除表格
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().addColumnBefore().run()
            }}
          >
            <ArrowLeftFromLineIcon />
            向左插入列
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run()
            }}
          >
            <ArrowRightFromLineIcon />
            向右插入列
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().deleteColumn().run()
            }}
          >
            <Trash2Icon />
            删除列
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().addRowBefore().run()
            }}
          >
            <ArrowUpFromLineIcon />
            向上插入行
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().addRowAfter().run()
            }}
          >
            <ArrowDownFromLineIcon />
            向下插入行
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().deleteRow().run()
            }}
          >
            <Trash2Icon />
            删除行
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().mergeCells().run()
            }}
          >
            <MergeIcon />
            合并单元格
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().splitCell().run()
            }}
          >
            <SplitIcon />
            拆分单元格
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>布局选项</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={hasHeaderRow}
            disabled={!isActive}
            onClick={() => {
              editor.chain().focus().toggleHeaderRow().run()
            }}
          >
            <SheetIcon />
            表头行
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={currentBorder}
            disabled={!isActive}
            onCheckedChange={() => {
              editor.chain().focus().toggleTableBorder().run()
            }}
          >
            <Grid2x2Icon />
            边框
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={!isActive}>
              <AlignLeftIcon />
              整表对齐
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={currentAlignment}
                onValueChange={(alignment: TableAlignment) => {
                  if (alignment) {
                    editor.chain().focus().setTableAlign(alignment).run()
                  } else {
                    editor.chain().focus().unsetTableAlign().run()
                  }
                }}
              >
                {TABLE_ALIGNMENTS.map(({ icon, label, value }) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {icon}
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={!isActive}>
              <BetweenHorizontalEndIcon />
              单元格间距
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={currentPadding}
                onValueChange={(value: PaddingValue) => {
                  if (value !== currentPadding) {
                    editor.chain().focus().setCellPadding(value).run()
                  } else {
                    editor.chain().focus().unsetCellPadding().run()
                  }
                }}
              >
                {PADDING_OPTIONS.map(({ label, value }) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
