import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { ResizableBoxSize } from '@repo/ui/components-self/resizable-box'
import { findChildren } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'

import { ExcalidrawAttributes } from '../../extensions/excalidraw'

/**
 * 将宽高应用到 SVG 的 width/height 属性上
 */
export function applySizeToSvg(svgHtml: string, { height, width }: Partial<ResizableBoxSize>) {
  if (width) {
    svgHtml = svgHtml.replace(/width="[^"]*"/, `width="${Math.round(width)}"`)
  }
  if (height) {
    svgHtml = svgHtml.replace(/height="[^"]*"/, `height="${Math.round(height)}"`)
  }
  return svgHtml
}

/**
 * 从 SVG 中解析宽高
 */
export function parseSvgSize(svgHtml: string): null | ResizableBoxSize {
  const wm = /width="([^"]+)"/.exec(svgHtml)
  const hm = /height="([^"]+)"/.exec(svgHtml)
  if (wm?.[1] && hm?.[1]) {
    const width = Number.parseFloat(wm[1])
    const height = Number.parseFloat(hm[1])
    if (!Number.isNaN(width) && !Number.isNaN(height)) {
      return { height, width }
    }
  }
  return null
}

/**
 * 将 Excalidraw elements 渲染为 SVG 字符串
 */
export async function renderExcalidrawElements(elements: readonly ExcalidrawElement[]): Promise<null | string> {
  try {
    const { exportToSvg } = await import('@excalidraw/utils')
    const svgEl = await exportToSvg({
      elements,
      files: null,
      appState: {
        exportBackground: false
      }
    })
    document.body.append(svgEl)
    const { height, width, x, y } = svgEl.getBBox()
    svgEl.remove()
    svgEl.setAttribute('viewBox', `${x - 10},${y - 10},${width + 20},${height + 20}`)
    return new XMLSerializer().serializeToString(svgEl)
  } catch {
    return null
  }
}

/**
 * 预渲染文档中所有 `excalidraw` 节点为 SVG
 */
export async function renderExcalidrawNodes(pmNode: ProseMirrorNode) {
  const cache = new WeakMap<ProseMirrorNode, null | string>()
  const tasks: Promise<void>[] = []

  for (const { node } of findChildren(pmNode, child => child.type.name === 'excalidraw')) {
    const { elements, height, textAlign, width } = node.attrs as Partial<ExcalidrawAttributes>
    if (!Array.isArray(elements) || elements.length === 0) {
      cache.set(node, null)
      continue
    }

    tasks.push(
      renderExcalidrawElements(elements)
        .then(svg => {
          if (!svg) {
            cache.set(node, null)
            return
          }
          cache.set(
            node,
            `<div data-type="excalidraw" data-excalidraw-align="${textAlign}">
              ${applySizeToSvg(svg, { height, width })}
              <script type="application/json">${JSON.stringify(elements)}</script>
            </div>`
          )
        })
        .catch(() => {
          cache.set(node, null)
        })
    )
  }

  await Promise.all(tasks)

  return cache
}
