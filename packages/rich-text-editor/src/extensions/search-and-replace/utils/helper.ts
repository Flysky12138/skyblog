import { Editor as CoreEditor, Range } from '@tiptap/core'
import { Node as PMNode } from '@tiptap/pm/model'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

interface ProcessedSearches {
  decorationsToReturn: DecorationSet
  results: Range[]
}

interface TextNodeWithPosition {
  pos: number
  text: string
}

/**
 * 获取用于搜索的正则表达式
 */
export const getRegex = (searchString: string, disableRegex: boolean, caseSensitive: boolean): RegExp => {
  const escapedString = disableRegex ? searchString.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') : searchString
  return new RegExp(escapedString, caseSensitive ? 'gu' : 'gui')
}

/**
 * 处理搜索操作
 */
export const processSearches = (
  doc: PMNode,
  searchTerm: RegExp,
  selectedResultIndex: number,
  searchResultClass: string,
  selectedResultClass: string
): ProcessedSearches => {
  const decorations: Decoration[] = []
  const results: Range[] = []
  const textNodesWithPosition: TextNodeWithPosition[] = []

  if (!searchTerm) {
    return { decorationsToReturn: DecorationSet.empty, results: [] }
  }

  doc.descendants((node, pos) => {
    if (node.isText) {
      textNodesWithPosition.push({ pos, text: node.text ?? '' })
    }
  })

  for (const { pos, text } of textNodesWithPosition) {
    const matches = Array.from(text.matchAll(searchTerm)).filter(([matchText]) => matchText.trim())

    for (const match of matches) {
      if (match.index !== undefined) {
        results.push({
          from: pos + match.index,
          to: pos + match.index + match[0].length
        })
      }
    }
  }

  for (let i = 0; i < results.length; i++) {
    const { from, to } = results[i]
    decorations.push(
      Decoration.inline(from, to, {
        class: selectedResultIndex === i ? selectedResultClass : searchResultClass
      })
    )
  }

  return {
    decorationsToReturn: DecorationSet.create(doc, decorations),
    results
  }
}

/**
 * 重新计算结果位置
 */
export const rebaseNextResult = (replaceTerm: string, index: number, lastOffset: number, results: Range[]): [number, Range[]] | null => {
  const nextIndex = index + 1

  if (!results[nextIndex]) {
    return null
  }

  const { from: currentFrom, to: currentTo } = results[index]

  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset

  const { from, to } = results[nextIndex]

  results[nextIndex] = {
    from: from - offset,
    to: to - offset
  }

  return [offset, results]
}

/**
 * 滚动到指定位置并聚焦编辑器
 */
export const scrollToAndFocus = (view: CoreEditor['view'], from: number) => {
  const node = view.domAtPos(from).node as HTMLElement | undefined
  node?.scrollIntoView({ behavior: 'instant', block: 'center' })
  view.focus()
}
