import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    align?: 'center' | 'end' | 'start'
    widthFit?: boolean
  }

  interface TableMeta {
    isLoading?: boolean
  }
}
