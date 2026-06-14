import { Editor, Extension } from '@tiptap/core'

export type Alignment = 'center' | 'end' | 'left' | 'right' | 'start'
export type PaddingValue = 'large' | 'medium' | 'none' | 'small'

export interface TableStyleOptions {
  /**
   * 允许的对齐方式
   *
   * @default ['start', 'center', 'end']
   */
  alignments: Alignment[]
  /**
   * 默认对齐
   *
   * @default null
   */
  defaultAlignment: Alignment | null
  /**
   * 默认是否显示边框
   *
   * @default true
   */
  defaultBorder: boolean
  /**
   * 默认 cell padding
   *
   * @default null
   */
  defaultPadding: null | PaddingValue
  /**
   * 允许的 cell padding 值
   *
   * @default ['none', 'small', 'medium', 'large']
   */
  paddings: PaddingValue[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableStyle: {
      /**
       * 设置单元格间距
       */
      setCellPadding: (padding: PaddingValue) => ReturnType
      /**
       * 设置整表对齐
       */
      setTableAlign: (alignment: Alignment) => ReturnType
      /**
       * 设置表格边框
       */
      toggleTableBorder: () => ReturnType
      /**
       * 取消单元格间距
       */
      unsetCellPadding: () => ReturnType
      /**
       * 取消整表对齐
       */
      unsetTableAlign: () => ReturnType
    }
  }
}

/**
 * 为 `<table>` 添加 `tableAlign` `tableBorder` 和 `cellPadding` 属性。
 *
 * - 编辑态：通过 `onTransaction` / `onCreate` 将属性同步到 DOM 样式
 * - 非编辑态（HTML 导出）：通过 `addGlobalAttributes.renderHTML` 输出 `data-table-align` / `data-table-border` / `data-cell-padding` 属性，配合 CSS 渲染
 */
export const TableStyle = Extension.create<TableStyleOptions>({
  name: 'tableStyle',

  addCommands() {
    return {
      setCellPadding: padding => {
        return ({ commands }) => {
          if (!this.options.paddings.includes(padding)) {
            return false
          }
          return commands.updateAttributes('table', { cellPadding: padding })
        }
      },
      setTableAlign: alignment => {
        return ({ commands }) => {
          if (!this.options.alignments.includes(alignment)) {
            return false
          }
          return commands.updateAttributes('table', { tableAlign: alignment })
        }
      },
      toggleTableBorder: () => {
        return ({ commands, editor }) => {
          const current = editor.getAttributes('table').tableBorder as boolean | null
          return commands.updateAttributes('table', { tableBorder: current === false })
        }
      },
      unsetCellPadding: () => {
        return ({ commands }) => {
          return commands.resetAttributes('table', 'cellPadding')
        }
      },
      unsetTableAlign: () => {
        return ({ commands }) => {
          return commands.resetAttributes('table', 'tableAlign')
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['table'],
        attributes: {
          cellPadding: {
            default: this.options.defaultPadding,
            parseHTML: element => {
              const value = element.getAttribute('data-cell-padding') as null | PaddingValue
              if (value && this.options.paddings.includes(value)) {
                return value
              }
              return this.options.defaultPadding
            },
            renderHTML: attributes => {
              const padding = attributes.cellPadding as null | PaddingValue
              if (!padding || padding === this.options.defaultPadding) {
                return {}
              }
              return { 'data-cell-padding': padding }
            }
          },
          tableAlign: {
            default: this.options.defaultAlignment,
            parseHTML: element => {
              const align = element.getAttribute('data-table-align') as Alignment | null
              if (align && this.options.alignments.includes(align)) {
                return align
              }
              return this.options.defaultAlignment
            },
            renderHTML: attributes => {
              const tableAlign = attributes.tableAlign as Alignment | null
              if (!tableAlign || tableAlign === 'start') {
                return {}
              }
              return { 'data-table-align': tableAlign }
            }
          },
          tableBorder: {
            default: this.options.defaultBorder,
            parseHTML: element => {
              const value = element.getAttribute('data-table-border')
              return value !== 'false'
            },
            renderHTML: attributes => {
              const border = attributes.tableBorder as boolean | null
              if (border === false) {
                return { 'data-table-border': 'false' }
              }
              return {}
            }
          }
        }
      }
    ]
  },

  addOptions() {
    return {
      alignments: ['start', 'center', 'end'],
      defaultAlignment: null,
      defaultBorder: true,
      defaultPadding: null,
      paddings: ['none', 'small', 'medium', 'large']
    }
  },

  onCreate() {
    syncTableStyleAttributes(this.editor)
  },

  onTransaction({ transaction }) {
    if (!transaction.docChanged) return
    syncTableStyleAttributes(this.editor)
  }
})

function syncTableStyleAttributes(editor: Editor) {
  const { view } = editor

  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'table') return

    const dom = view.nodeDOM(pos)
    if (!dom || !(dom instanceof HTMLElement)) return

    // TableView.dom 可能是 div.tableWrapper，里面包含 <table>
    const tableEl = dom.tagName === 'TABLE' ? dom : dom.querySelector('table')
    if (!tableEl) return

    const align = node.attrs.tableAlign as Alignment | null
    const hasBorder = node.attrs.tableBorder as boolean | null
    const padding = node.attrs.cellPadding as null | PaddingValue

    // 设置对齐样式
    align ? tableEl.setAttribute('data-table-align', align) : tableEl.removeAttribute('data-table-align')
    // 设置表格边框：只在无边框时设置 data-table-border="false"
    hasBorder ? tableEl.removeAttribute('data-table-border') : tableEl.setAttribute('data-table-border', 'false')
    // 设置单元格间距：样式由 CSS 通过 border-spacing 控制
    padding ? tableEl.setAttribute('data-cell-padding', padding) : tableEl.removeAttribute('data-cell-padding')
  })
}
