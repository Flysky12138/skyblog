import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { ResizableBoxSize } from '@repo/ui/components-self/resizable-box'

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
