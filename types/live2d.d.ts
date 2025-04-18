interface Window {
  PIXI?: typeof import('pixi.js') & {
    live2d?: typeof import('pixi-live2d-display')
  }
}
