import { loadJSFile } from '@/lib/file/load'
import JSZip from 'jszip'
import { JSONObject, Live2DFactoryOptions, Live2DModel, ModelSettings } from 'pixi-live2d-display'
import { Application, IApplicationOptions } from 'pixi.js'
import React from 'react'
import { useAsync } from 'react-use'

enum PADDING {
  x = 10,
  y = 10
}

/**
 * Live2D
 * @see https://github.com/guansss/pixi-live2d-display
 * @see https://github.com/Stuk/jszip
 */
export default function useLive2D(
  source?: string | JSONObject | ModelSettings,
  options: Partial<{
    app: (model: Live2DModel) => IApplicationOptions
    model: Live2DFactoryOptions
  }> = {}
) {
  const model = React.useRef<Live2DModel>()
  // 模型加载
  useAsync(async () => {
    if (!source) return
    try {
      if (!window.PIXI) {
        // live2d v2/3+ support & pixi & pixi-live2d-display
        await loadJSFile('/live2d/lib/live2d.min.js')
        await loadJSFile('/live2d/lib/live2dcubismcore.min.js')
        await loadJSFile('/live2d/lib/pixi.min.js')
        await loadJSFile('/live2d/lib/index.min.js')
      }
      // .zip 模型文件加载方法实现
      window.PIXI.live2d.ZipLoader.zipReader = data => JSZip.loadAsync(data)
      window.PIXI.live2d.ZipLoader.readText = (reader, path) => reader.file(path).async('text')
      window.PIXI.live2d.ZipLoader.getFilePaths = reader => Promise.resolve(Object.keys(reader.files))
      window.PIXI.live2d.ZipLoader.getFiles = (reader, paths) =>
        Promise.all(paths.map(async path => new File([await reader.file(path).async('blob')], path.slice(path.lastIndexOf('/') + 1))))
      // 设置模型样式
      model.current = await window.PIXI.live2d.Live2DModel.from(source, options.model)
      model.current.x = PADDING.x
      model.current.y = PADDING.y
      model.current.scale.set(Math.min((window.innerWidth / model.current.width) * 0.5, (window.innerHeight / model.current.height) * 0.5))
      // 目前 BUG 不会执行，所以手动执行
      options.model?.onLoad?.()
    } catch (error) {
      options.model?.onError?.(error as Error)
    }
  }, [source])

  const app = React.useRef<Application>()
  const live2dRef = React.useRef<HTMLCanvasElement>(null)
  // 创建容器，并装载模型
  React.useEffect(() => {
    if (!model.current || !live2dRef.current) return
    app.current = new window.PIXI.Application(
      Object.assign(
        {
          antialias: true,
          autoStart: true,
          backgroundAlpha: 0,
          height: model.current.height + PADDING.y * 2,
          width: model.current.width + PADDING.x * 2,
          view: live2dRef.current
        } satisfies IApplicationOptions,
        options.app?.(model.current)
      )
    )
    app.current.stage.addChild(model.current)
    return () => {
      app.current?.destroy(true, true)
      model.current = undefined
      app.current = undefined
    }
  }, [model.current, live2dRef.current])

  // 鼠标离开窗口后，让人物正视前方
  React.useEffect(() => {
    if (!model.current || !app.current) return
    const listener = () => model.current!.focus(app.current!.renderer.view.width / 2, (app.current!.renderer.view.height - PADDING.y) / 3)
    document.documentElement.addEventListener('pointerleave', listener)
    return () => {
      document.documentElement.removeEventListener('pointerleave', listener)
    }
  }, [app.current, model.current])

  return {
    app: app.current,
    model: model.current,
    live2dRef
  }
}
