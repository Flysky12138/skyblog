declare module '@tanstack/react-table' {
  interface ColumnMeta {
    align?: 'center' | 'end' | 'start'
    autoWidth?: boolean
  }

  interface TableMeta {
    isLoading?: boolean
  }
}

export {}
