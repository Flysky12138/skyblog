import { Extension, Range } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { DecorationSet } from '@tiptap/pm/view'

import { replace, replaceAll, selectNext, selectPrevious } from './utils/commands'
import { getRegex, processSearches } from './utils/helper'

export interface SearchAndReplaceOptions {
  /**
   * 是否禁用正则表达式搜索
   *
   * @default true
   */
  disableRegex: boolean
  /**
   * 搜索结果块的类名
   */
  searchResultClass: string
  /**
   * 为选定的搜索结果块设置类名
   */
  selectedResultClass: string
}

export interface SearchAndReplaceStorage {
  /**
   * 大小写状态
   */
  caseSensitive: boolean
  /**
   * 上次大小写状态
   */
  lastCaseSensitiveState: boolean
  /**
   * 上次搜索词
   */
  lastSearchTerm: string
  /**
   * 上次选择的搜索结果索引
   */
  lastSelectedResult: number
  /**
   * 替换词
   */
  replaceTerm: string
  /**
   * 搜索结果
   */
  results: Range[]
  /**
   * 搜索词
   */
  searchTerm: string
  /**
   * 当前选定的搜索结果索引
   */
  selectedResult: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    search: {
      /**
       * 将第一个搜索结果替换为给定的替换词
       */
      replace: () => ReturnType
      /**
       * 将所有搜索结果替换为给定的替换词
       */
      replaceAll: () => ReturnType
      /**
       * 选择下一个搜索结果
       */
      selectNextResult: () => ReturnType
      /**
       * 选择上一个搜索结果
       */
      selectPreviousResult: () => ReturnType
      /**
       * 设置扩展中是否区分大小写
       */
      setCaseSensitive: (caseSensitive: boolean) => ReturnType
      /**
       * 设置扩展中的替换词
       */
      setReplaceTerm: (replaceTerm: string) => ReturnType
      /**
       * 设置扩展中的搜索词
       */
      setSearchTerm: (searchTerm: string) => ReturnType
    }
  }

  interface Storage {
    searchAndReplace: SearchAndReplaceStorage
  }
}

export const SearchAndReplace = Extension.create<SearchAndReplaceOptions, SearchAndReplaceStorage>({
  name: 'searchAndReplace',

  addCommands() {
    return {
      replace: () => {
        return props => {
          const { replaceTerm, results, selectedResult } = props.editor.storage.searchAndReplace
          replace(replaceTerm, results, selectedResult, props)
          return false
        }
      },
      replaceAll: () => {
        return props => {
          const { replaceTerm, results } = props.editor.storage.searchAndReplace
          replaceAll(replaceTerm, results, props)
          return false
        }
      },
      selectNextResult: () => {
        return ({ editor }) => {
          selectNext(editor)
          return true
        }
      },
      selectPreviousResult: () => {
        return ({ editor }) => {
          selectPrevious(editor)
          return true
        }
      },
      setCaseSensitive: caseSensitive => {
        return ({ editor }) => {
          editor.storage.searchAndReplace.caseSensitive = caseSensitive
          return false
        }
      },
      setReplaceTerm: replaceTerm => {
        return ({ editor }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm
          return false
        }
      },
      setSearchTerm: searchTerm => {
        return ({ editor }) => {
          editor.storage.searchAndReplace.searchTerm = searchTerm
          return false
        }
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-f': () => {
        const { editor } = this
        const { doc, selection, tr } = editor.state

        if (!selection.empty) {
          const selectedText = doc.textBetween(selection.from, selection.to)
          editor.storage.searchAndReplace.searchTerm = selectedText
        }

        tr.setMeta('searchAndReplace-open', true)
        editor.view.dispatch(tr)

        return true
      }
    }
  },

  addOptions() {
    return {
      disableRegex: true,
      searchResultClass: 'bg-yellow-500 text-white text-shadow-lg selection:bg-transparent',
      selectedResultClass: 'bg-green-500 text-white text-shadow-lg selection:bg-transparent'
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this
    const { disableRegex, searchResultClass, selectedResultClass } = this.options

    return [
      new Plugin({
        props: {
          decorations(state) {
            return this.getState(state)
          }
        },
        state: {
          init: () => DecorationSet.empty,
          apply({ doc, docChanged }, oldState) {
            const { caseSensitive, lastCaseSensitiveState, lastSearchTerm, lastSelectedResult, searchTerm, selectedResult } =
              editor.storage.searchAndReplace

            if (!docChanged && lastSearchTerm === searchTerm && selectedResult === lastSelectedResult && lastCaseSensitiveState === caseSensitive) {
              return oldState
            }

            editor.storage.searchAndReplace.lastSearchTerm = searchTerm
            editor.storage.searchAndReplace.lastSelectedResult = selectedResult
            editor.storage.searchAndReplace.lastCaseSensitiveState = caseSensitive

            if (!searchTerm) {
              editor.storage.searchAndReplace.selectedResult = 0
              editor.storage.searchAndReplace.results = []
              return DecorationSet.empty
            }

            const { decorationsToReturn, results } = processSearches(
              doc,
              getRegex(searchTerm, disableRegex, caseSensitive),
              selectedResult,
              searchResultClass,
              selectedResultClass
            )

            editor.storage.searchAndReplace.results = results

            if (selectedResult > results.length) {
              editor.storage.searchAndReplace.selectedResult = 1
              editor.commands.selectPreviousResult()
            }

            return decorationsToReturn
          }
        }
      })
    ]
  },

  addStorage() {
    return {
      caseSensitive: false,
      lastCaseSensitiveState: false,
      lastSearchTerm: '',
      lastSelectedResult: 0,
      replaceTerm: '',
      results: [],
      searchTerm: '',
      selectedResult: 0
    }
  }
})
