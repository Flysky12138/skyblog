import { Extension } from '@tiptap/core'
import { ResolvedPos } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'

const LIST_CONTAINER_TYPES = new Set(['bulletList', 'orderedList', 'taskList'])
const LIST_ITEM_TYPES = new Set(['listItem', 'taskItem'])

// 查找最近的上层列表项容器
function findListItemInfo($from: ResolvedPos) {
  for (let d = $from.depth; d >= 0; d--) {
    const node = $from.node(d)
    if (LIST_ITEM_TYPES.has(node.type.name)) {
      const parentNode = $from.node(d - 1)
      if (parentNode && LIST_CONTAINER_TYPES.has(parentNode.type.name)) {
        return { depth: d, itemTypeName: node.type.name }
      }
    }
  }
  return null
}

/**
 * `Ctrl+Enter` 在下方插入行，`Ctrl+Shift+Enter` 在上方插入行
 */
export const InsertLine = Extension.create({
  name: 'insertLine',
  priority: 1000,

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        const { view } = this.editor

        const { dispatch, state } = view
        const { selection, tr } = state
        const { $from } = selection

        const listInfo = findListItemInfo($from)

        if (listInfo) {
          // 在列表内 — 插入同类型的列表项（而不是普通段落）
          const pos = $from.after(listInfo.depth)
          const newItem = state.schema.nodes[listInfo.itemTypeName].createAndFill()!
          tr.insert(pos, newItem)
          // 新 item 的起始内容位置
          tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)))
          tr.scrollIntoView()

          dispatch(tr)
          return true
        }

        // 普通块 — 插入空段落
        const pos = $from.after()
        tr.insert(pos, state.schema.nodes.paragraph.create())
        tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)))
        tr.scrollIntoView()

        dispatch(tr)
        return true
      },

      'Shift-Mod-Enter': () => {
        const { view } = this.editor

        const { dispatch, state } = view
        const { selection, tr } = state
        const { $from } = selection

        const listInfo = findListItemInfo($from)

        if (listInfo) {
          // 在列表内 — 插入同类型的列表项
          const pos = $from.before(listInfo.depth)
          const newItem = state.schema.nodes[listInfo.itemTypeName].createAndFill()!
          tr.insert(pos, newItem)
          tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)))
          tr.scrollIntoView()

          dispatch(tr)
          return true
        }

        // 普通块 — 插入空段落
        const pos = $from.before()
        tr.insert(pos, state.schema.nodes.paragraph.create())
        tr.setSelection(TextSelection.near(tr.doc.resolve(pos)))
        tr.scrollIntoView()

        dispatch(tr)
        return true
      }
    }
  }
})
