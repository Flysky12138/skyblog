interface PixiModel {
  addChild: (options: { visible: boolean }) => void
  focus: (x: number, y: number) => void
  height: number
  motion: (area: string, index: number) => void
  on: (event: string, callBack: (hitAreas: string[]) => void) => void
  scale: {
    set: (scale: number) => void
  }
  textures: string[]
  toggle: () => number
  width: number
  x: number
  y: number
}

interface PixiApp {
  destroy: (removeView: boolean, stageOptions: boolean) => void
  renderer: {
    view: {
      height: number
      width: number
    }
  }
  stage: {
    addChild: (child: PixiModel) => void
  }
}

interface Window {
  PIXI: {
    Application: new (options: {
      antialias: boolean
      autoStart: boolean
      backgroundAlpha: number
      height: number
      view: HTMLCanvasElement
      width: number
    }) => PixiApp | null
    live2d: {
      HitAreaFrames: new () => {
        visible: boolean
      }
      Live2DModel: {
        from: (path: string) => PixiModel
      }
      ZipLoader: {
        getFilePaths: (reader: JSZip) => Promise<string[]>
        getFiles: (reader: JSZip, paths: string[]) => Promise<File[]>
        readText: (reader: JSZip, path: string) => Promise<string>
        releaseReader: (reader: JSZip) => void
        zipReader: (data: Blob, url: string) => Promise<JSZip>
      }
    }
  }
}
