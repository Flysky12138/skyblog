// random helper [a,b)
const random = (a: number, b: number): number => {
  return Math.random() * (b - a) + a
}
// screen helper
const screenInfo = () => {
  const [doc, body] = [document.documentElement, document.body]
  const height = window.innerHeight || doc.clientHeight || body.clientHeight || 0,
    scrollx = (window.pageXOffset || doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || 0),
    scrolly = (window.pageYOffset || doc.scrollTop || body.scrollTop || 0) - (doc.clientTop || 0),
    width = window.innerWidth || doc.clientWidth || body.clientWidth || 0
  return {
    centerx: width / 2,
    centery: height / 2,
    height,
    ratio: width / height,
    scrollx,
    scrolly,
    width
  }
}

interface Options {
  [key: string]: unknown
  // add animation effect to each ribbon section over time
  animateSections: boolean
  // ribbon color opacity amount
  colorAlpha: number
  // ribbon color HSL brightness amount
  colorBrightness: string
  // how fast to cycle through colors in the HSL color space
  colorCycleSpeed: number
  // ribbon color HSL saturation amount
  colorSaturation: string
  // how fast to get to the other side of the screen
  horizontalSpeed: number
  // move ribbons vertically by a factor on page scroll
  parallaxAmount: number
  // how many ribbons to keep on screen at any given time
  ribbonCount: number
  // add stroke along with ribbon fill colors
  strokeSize: number
  // where to start from on the Y axis on each side
  verticalPosition: 'bottom' | 'center' | 'random' | 'top'
}

interface RibbonType {
  alpha: number
  color: number
  delay: number
  dir: string
  phase: number
  point1: Point
  point2: Point
  point3: Point
}
class Point {
  public x: number
  public y: number

  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  public add(x: number, y: number) {
    this.x += x || 0
    this.y += y || 0
    return this
  }

  public clampX(min: number, max: number) {
    this.x = Math.max(min, Math.min(this.x, max))
    return this
  }

  public clampY(min: number, max: number) {
    this.y = Math.max(min, Math.min(this.y, max))
    return this
  }

  public copy(point: { x: number; y: number }) {
    this.x = point.x || 0
    this.y = point.y || 0
    return this
  }

  public divide(x: number, y: number) {
    this.x /= x || 1
    this.y /= y || 1
    return this
  }

  public flipX() {
    this.x *= -1
    return this
  }

  public flipY() {
    this.y *= -1
    return this
  }

  public multiply(x: number, y: number) {
    this.x *= x || 1
    this.y *= y || 1
    return this
  }

  public subtract(x: number, y: number) {
    this.x -= x || 0
    this.y -= y || 0
    return this
  }
}

class Ribbon {
  private _canvas: HTMLCanvasElement
  private _context: CanvasRenderingContext2D | undefined
  private _height: number
  private _options: Options
  private _ribbons: (null | RibbonType[])[]
  private _scroll: number
  private _width: number

  constructor(canvas: HTMLCanvasElement, options?: Partial<Options>) {
    this._canvas = canvas
    this._width = 0
    this._height = 0
    this._scroll = 0
    this._ribbons = []
    this._options = {
      animateSections: true,
      colorAlpha: 0.65,
      colorBrightness: '60%',
      colorCycleSpeed: 6,
      colorSaturation: '80%',
      horizontalSpeed: 200,
      parallaxAmount: -0.5,
      ribbonCount: 3,
      strokeSize: 0,
      verticalPosition: 'random'
    }

    this._onDraw = this._onDraw.bind(this)
    this._onResize = this._onResize.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this.setOptions(options)
    this.init()
  }

  public destroy() {
    window.removeEventListener('resize', this._onResize)
    window.removeEventListener('scroll', this._onScroll)
  }

  // Draw single section
  private _drawRibbonSection(section: RibbonType) {
    if (section) {
      if (section.phase >= 1 && section.alpha <= 0) {
        return true // done
      }
      if (section.delay <= 0) {
        section.phase += 0.02
        section.alpha = Math.sin(section.phase) * 1
        section.alpha = section.alpha <= 0 ? 0 : section.alpha
        section.alpha = section.alpha >= 1 ? 1 : section.alpha
        if (this._options.animateSections) {
          const mod = Math.sin(1 + (section.phase * Math.PI) / 2) * 0.1
          if (section.dir == 'right') {
            section.point1.add(mod, 0)
            section.point2.add(mod, 0)
            section.point3.add(mod, 0)
          } else {
            section.point1.subtract(mod, 0)
            section.point2.subtract(mod, 0)
            section.point3.subtract(mod, 0)
          }
          section.point1.add(0, mod)
          section.point2.add(0, mod)
          section.point3.add(0, mod)
        }
      } else {
        section.delay -= 0.5
      }

      const l = this._options.colorBrightness,
        s = this._options.colorSaturation,
        c = 'hsla(' + section.color + ', ' + s + ', ' + l + ', ' + section.alpha + ' )'
      if (this._context) {
        this._context.save()
        if (this._options.parallaxAmount != 0) {
          this._context.translate(0, this._scroll * this._options.parallaxAmount)
        }
        this._context.beginPath()
        this._context.moveTo(section.point1.x, section.point1.y)
        this._context.lineTo(section.point2.x, section.point2.y)
        this._context.lineTo(section.point3.x, section.point3.y)
        this._context.fillStyle = c
        this._context.fill()
        if (this._options.strokeSize > 0) {
          this._context.lineWidth = this._options.strokeSize
          this._context.strokeStyle = c
          this._context.lineCap = 'round'
          this._context.stroke()
        }
        this._context.restore()
      }
    }
    return false // not done yet
  }

  // Draw ribbons
  private _onDraw() {
    // cleanup on ribbons list to rtemoved finished ribbons
    for (let i = 0, t = this._ribbons.length; i < t; ++i) {
      if (!this._ribbons[i]) {
        this._ribbons.splice(i, 1)
      }
    }
    // draw new ribbons
    this._context?.clearRect(0, 0, this._width, this._height)
    // single ribbon
    for (let a = 0; a < this._ribbons.length; a++) {
      const ribbon = this._ribbons[a]
      if (!ribbon) continue
      let numDone = 0
      // ribbon section
      for (const r of ribbon) {
        if (this._drawRibbonSection(r)) {
          numDone++ // section done
        }
      }
      if (numDone >= ribbon.length) {
        this._ribbons[a] = null // ribbon done
      }
    }
    // maintain optional number of ribbons on canvas
    if (this._ribbons.length < this._options.ribbonCount) {
      this.addRibbon()
    }
    requestAnimationFrame(this._onDraw)
  }

  // Update container size info
  private _onResize() {
    const screen = screenInfo()
    this._width = screen.width
    this._height = screen.height
    if (this._canvas) {
      this._canvas.width = this._width
      this._canvas.height = this._height
      if (this._context) {
        this._context.globalAlpha = this._options.colorAlpha
      }
    }
  }

  // Update container size info
  private _onScroll() {
    const screen = screenInfo()
    this._scroll = screen.scrolly
  }

  // Create a new random ribbon and to the list
  private addRibbon() {
    // movement data
    const dir = Math.round(random(1, 9)) > 5 ? 'right' : 'left',
      hide = 200,
      max = this._width + hide,
      min = 0 - hide,
      startx = dir == 'right' ? min : max
    let movex = 0,
      movey = 0,
      starty = Math.round(random(0, this._height)),
      stop = 1000

    // asjust starty based on options
    if (this._options.verticalPosition == 'top') {
      starty = 0 + hide
    } else if (this._options.verticalPosition == 'center') {
      starty = this._height / 2
    } else if (this._options.verticalPosition == 'bottom') {
      starty = this._height - hide
    }

    // ribbon sections data
    const point1 = new Point(startx, starty),
      point2 = new Point(startx, starty),
      ribbon: RibbonType[] = []
    let color = Math.round(random(0, 360)),
      delay = 0,
      point3 = null

    // buils ribbon sections

    while (true) {
      if (stop <= 0) break
      stop--

      movex = Math.round((Math.random() * 1 - 0.2) * this._options.horizontalSpeed)
      movey = Math.round((Math.random() * 1 - 0.5) * (this._height * 0.25))

      point3 = new Point()
      point3.copy(point2)

      if (dir == 'right') {
        point3.add(movex, movey)
        if (point2.x >= max) break
      } else if (dir == 'left') {
        point3.subtract(movex, movey)
        if (point2.x <= min) break
      }
      // point3.clampY(0, this._height)

      ribbon.push({
        alpha: 0,
        color: color,
        delay: delay,
        dir: dir,
        phase: 0,
        // single ribbon section
        point1: new Point(point1.x, point1.y),
        point2: new Point(point2.x, point2.y),
        point3: point3
      })

      point1.copy(point2)
      point2.copy(point3)

      delay += 4
      color += this._options.colorCycleSpeed
    }
    this._ribbons.push(ribbon)
  }

  // Initialize the ribbons effect
  private init() {
    this._onResize()
    window.addEventListener('resize', this._onResize)
    window.addEventListener('scroll', this._onScroll)
    this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D
    this._context.clearRect(0, 0, this._width, this._height)
    this._context.globalAlpha = this._options.colorAlpha
    this._onDraw()
  }

  // Set and merge local options
  private setOptions(options?: Partial<Options>) {
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(this._options, key)) {
        this._options[key] = options[key]
      }
    }
  }
}

export { Ribbon }
