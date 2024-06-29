import { loadJSFile } from '@/lib/file/load'
import JSZip from 'jszip'

interface Live2DProps {
  hitAreaVisible: boolean
  path: string
  px: number
  py: number
  view: HTMLCanvasElement
}

/**
 * Live2D
 * @see https://github.com/guansss/pixi-live2d-display
 * @see https://guansss.github.io/pixi-live2d-display/api/index.html
 * @see https://github.com/Stuk/jszip
 */
export default async function Live2D({ path, px, py, view, hitAreaVisible }: Live2DProps) {
  try {
    // live2d v2/3+ support & pixi & pixi-live2d-display
    if (!window.PIXI) {
      await loadJSFile('/live2d/lib/live2d.min.js')
      await loadJSFile('/live2d/lib/live2dcubismcore.min.js')
      await loadJSFile('/live2d/lib/pixi.min.js')
      await loadJSFile('/live2d/lib/index.min.js')
    }
    // zip 模型文件加载方法实现
    window.PIXI.live2d.ZipLoader.zipReader = data => JSZip.loadAsync(data)
    window.PIXI.live2d.ZipLoader.readText = (reader, _path) => (reader.file(_path) as JSZip.JSZipObject).async('text')
    window.PIXI.live2d.ZipLoader.getFilePaths = reader => Promise.resolve(Object.keys(reader.files))
    window.PIXI.live2d.ZipLoader.getFiles = (reader, paths) =>
      Promise.all(paths.map(async _path => new File([await (reader.file(_path) as JSZip.JSZipObject).async('blob')], _path.slice(_path.lastIndexOf('/') + 1))))
    // 模型加载
    const model = await window.PIXI.live2d.Live2DModel.from(path)
    model.x = px
    model.y = py
    model.scale.set(Math.min((window.innerWidth / model.width) * 0.5, (window.innerHeight / model.height) * 0.5))
    // 创建容器
    const app = new window.PIXI.Application({
      antialias: true,
      autoStart: true,
      backgroundAlpha: 0,
      height: model.height + py * 2,
      view: view,
      width: model.width + px * 2
    })
    if (app) {
      // 向容器中添加模型
      app?.stage.addChild(model)
      // 切换皮肤；textures 数组中的不同皮肤
      // model.toggle = () => model.textures.push(model.textures.shift() || '')
      // 鼠标离开窗口后，让人物正视前方
      const pointerleaveEvent = () => model.focus(app.renderer.view.width / 2, (app.renderer.view.height - py) / 3)
      document.documentElement.addEventListener('pointerleave', pointerleaveEvent)
      const destroy = app.destroy
      app.destroy = (...props) => {
        document.documentElement.removeEventListener('pointerleave', pointerleaveEvent)
        destroy.apply(app, props)
      }
    }
    return Promise.resolve({ app, model })
  } catch (error) {
    return Promise.reject(error)
  }
}
