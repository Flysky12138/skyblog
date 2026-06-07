import { CommandProps, Editor as CoreEditor, Range } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { rebaseNextResult, scrollToAndFocus } from './helper'

/**
 * 替换选中的结果
 */
export const replace = (replaceTerm: string, results: Range[], selectedResult: number, { dispatch, state, view }: CommandProps) => {
  const currentResult = results[selectedResult]

  if (!currentResult) {
    return
  }

  if (!dispatch) {
    return
  }

  const { from, to } = currentResult

  dispatch(state.tr.insertText(replaceTerm, from, to))

  scrollToAndFocus(view, from)
}

/**
 * 替换所有匹配项
 */
export const replaceAll = (replaceTerm: string, results: Range[], { dispatch, tr }: CommandProps) => {
  if (!results.length) {
    return
  }

  if (!dispatch) {
    return
  }

  let offset = 0

  for (let i = 0; i < results.length; i++) {
    const { from, to } = results[i]
    tr.insertText(replaceTerm, from, to)
    const rebaseResponse = rebaseNextResult(replaceTerm, i, offset, results)

    if (rebaseResponse) {
      offset = rebaseResponse[0]
    }
  }

  dispatch(tr)
}

/**
 * 选中下一个匹配项
 */
export const selectNext = (editor: CoreEditor) => {
  const { results, selectedResult } = editor.storage.searchAndReplace

  if (!results.length) {
    return
  }

  let newIndex: number
  if (selectedResult >= results.length - 1) {
    newIndex = 0
  } else {
    newIndex = selectedResult + 1
  }

  editor.storage.searchAndReplace.selectedResult = newIndex

  const { from } = results[newIndex]

  const { state, view } = editor
  const tr = state.tr
  tr.setSelection(TextSelection.create(tr.doc, from, from))
  view.dispatch(tr)

  scrollToAndFocus(view, from)
}

/**
 * 选中上一个匹配项
 */
export const selectPrevious = (editor: CoreEditor) => {
  const { results, selectedResult } = editor.storage.searchAndReplace

  if (!results.length) {
    return
  }

  let newIndex: number
  if (selectedResult <= 0) {
    newIndex = results.length - 1
  } else {
    newIndex = selectedResult - 1
  }

  editor.storage.searchAndReplace.selectedResult = newIndex

  const { from } = results[newIndex]

  const { state, view } = editor
  const tr = state.tr
  tr.setSelection(TextSelection.create(tr.doc, from, from))
  view.dispatch(tr)

  scrollToAndFocus(view, from)
}
