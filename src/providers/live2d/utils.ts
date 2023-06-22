import JSZip from 'jszip'
import { JSONObject, ModelSettings } from 'pixi-live2d-display'

import { loadJSFile } from '@/lib/file/load'

export const PADDING = {
  x: 10,
  y: 10
}

/**
 * 初始化源码资源
 * @see https://github.com/guansss/pixi-live2d-display
 */
export const initGlobalScript = async () => {
  if (window.PIXI?.live2d?.ZipLoader) return
  // live2d v2/3+ support & pixi & pixi-live2d-display
  await loadJSFile('/live2d/lib/live2d.min.js')
  await loadJSFile('/live2d/lib/live2dcubismcore.min.js')
  await loadJSFile('/live2d/lib/pixi.min.js')
  await loadJSFile('/live2d/lib/index.min.js')
  // .zip 模型文件加载方法实现
  if (window.PIXI?.live2d) {
    window.PIXI.live2d.ZipLoader.zipReader = data => JSZip.loadAsync(data)
    window.PIXI.live2d.ZipLoader.readText = (reader, path) => reader.file(path).async('text')
    window.PIXI.live2d.ZipLoader.getFilePaths = reader => Promise.resolve(Object.keys(reader.files))
    window.PIXI.live2d.ZipLoader.getFiles = (reader, paths) =>
      Promise.all(paths.map(async path => new File([await reader.file(path).async('blob')], path.slice(path.lastIndexOf('/') + 1))))
  }
}

/**
 * 加载模型
 * @see https://github.com/Stuk/jszip
 */
export const loadModel = async (source: JSONObject | ModelSettings | string) => {
  try {
    if (!window.PIXI?.live2d) throw new Error('Live2D is not loaded')
    const model = await window.PIXI.live2d.Live2DModel.from(source)
    // 设置模型样式
    model.x = PADDING.x
    model.y = PADDING.y
    model.scale.set(Math.min((window.innerWidth / model.width) * 0.5, (window.innerHeight / model.height) * 0.5))
    return model
  } catch (error) {
    return Promise.reject(error)
  }
}
