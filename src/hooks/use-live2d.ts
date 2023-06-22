import { loadJSFile } from '@/lib/file/load'
import JSZip from 'jszip'
import { JSONObject, Live2DFactoryOptions, Live2DModel, ModelSettings } from 'pixi-live2d-display'
import { IApplicationOptions } from 'pixi.js'
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
export const useLive2D = (
  source?: string | JSONObject | ModelSettings,
  options: Partial<{
    app: (model: Live2DModel) => IApplicationOptions
    model: Live2DFactoryOptions
  }> = {}
) => {
  const [model, setModel] = React.useState<Live2DModel>()
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
      const _model = await window.PIXI.live2d.Live2DModel.from(source, options.model)
      _model.x = PADDING.x
      _model.y = PADDING.y
      _model.scale.set(Math.min((window.innerWidth / _model.width) * 0.5, (window.innerHeight / _model.height) * 0.5))
      setModel(_model)
      // 目前 BUG 不会执行，所以手动执行
      options.model?.onLoad?.()
    } catch (error) {
      options.model?.onError?.(error as Error)
    }
  }, [source])

  const live2dRef = React.useRef<HTMLCanvasElement>(null)
  // 创建容器，并装载模型
  React.useEffect(() => {
    if (!model || !live2dRef.current) return
    const app = new window.PIXI.Application(
      Object.assign(
        {
          antialias: true,
          autoDensity: true,
          autoStart: true,
          backgroundAlpha: 0,
          height: model.height + PADDING.y * 2,
          resolution: window.devicePixelRatio,
          view: live2dRef.current,
          width: model.width + PADDING.x * 2
        } satisfies IApplicationOptions,
        options.app?.(model)
      )
    )
    app.stage.addChild(model)
    // 鼠标离开窗口后，让人物正视前方
    const listener = () => model!.focus(app!.renderer.view.width / 2, (app!.renderer.view.height - PADDING.y) / 3)
    document.documentElement.addEventListener('pointerleave', listener)
    return () => {
      app?.destroy(true, true)
      document.documentElement.removeEventListener('pointerleave', listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  return {
    live2dRef,
    model
  }
}
