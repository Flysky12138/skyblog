import {
  columnSizingFeature,
  createSortedRowModel,
  createTableHook,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures
} from '@tanstack/react-table'

import { DataTable } from '.'
import { DataTableRowActionButton, DataTableRowDeleteButton, DataTableRowsDeleteButton } from './components/action'
import { DataTableCellDate, DataTableRowSelection } from './components/cell'
import { DataTableRowsSelection } from './components/header'
import { DataTablePagination } from './components/pagination'

export interface ColumnMeta {
  align?: 'center' | 'end' | 'start'
  autoWidth?: boolean
  /**
   * 是否允许排序
   *
   * @description 由于列配置不能覆盖全局配置，因此额外添加这个属性，实现控制某列是否允许排序
   */
  enableSorting?: boolean
}

export const { createAppColumnHelper, useAppTable, useCellContext, useHeaderContext, useTableContext } = createTableHook({
  cellComponents: {
    Button: DataTableRowActionButton,
    ButtonDelete: DataTableRowDeleteButton,
    Date: DataTableCellDate,
    Selection: DataTableRowSelection
  },
  features: tableFeatures({
    columnMeta: metaHelper<ColumnMeta>(),
    columnSizingFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: {
      alphanumeric: sortFn_alphanumeric,
      datetime: sortFn_datetime,
      text: sortFn_text
    }
  }),
  headerComponents: {
    Button: DataTableRowActionButton,
    Selection: DataTableRowsSelection
  },
  tableComponents: {
    Pagination: DataTablePagination,
    RowsDeleteButton: DataTableRowsDeleteButton,
    Table: DataTable
  },
  getRowId: (row: { id: string }) => String(row.id)
})
