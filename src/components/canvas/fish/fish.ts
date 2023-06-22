class Fish {
  private POINT_INTERVAL = 5
  private FISH_COUNT = 3
  private MAX_INTERVAL_COUNT = 50
  public INIT_HEIGHT_RATE = 0.5
  public THRESHOLD = 50
  private WATCH_INTERVAL = 0

  private parentElement: HTMLElement
  private canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  constructor(canvas: HTMLCanvasElement) {
    this.parentElement = canvas.parentElement as HTMLElement
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D

    this.reconstructMethods()
    this.setup()
    this.bindEvent()
    this.render()
  }

  public destroy() {
    this.clearTimer()
    window.removeEventListener('resize', this.watchWindowSize)
    this.parentElement.removeEventListener('mouseenter', this.startEpicenter)
    this.parentElement.removeEventListener('mousemove', this.moveEpicenter)
  }

  public width = 0
  private pointInterval = 0
  private points: SURFACE_POINT[] = []
  private createSurfacePoints() {
    const count = Math.round(this.width / this.POINT_INTERVAL)
    this.pointInterval = this.width / (count - 1)
    this.points.push(new SURFACE_POINT(this, 0))
    for (let i = 1; i < count; i++) {
      const point = new SURFACE_POINT(this, i * this.pointInterval)
      const previous = this.points[i - 1]
      point.setPreviousPoint(previous)
      previous.setNextPoint(point)
      this.points.push(point)
    }
  }

  private reconstructMethods() {
    this.watchWindowSize = this.watchWindowSize.bind(this)
    this.jdugeToStopResize = this.jdugeToStopResize.bind(this)
    this.startEpicenter = this.startEpicenter.bind(this)
    this.moveEpicenter = this.moveEpicenter.bind(this)
    this.render = this.render.bind(this)
  }

  private fishes: FISH[] = []
  private intervalCount = 0
  public height = 0
  private fishCount = 0
  public reverse = false
  private setup() {
    this.clearTimer()
    const fillStyle = this.context.fillStyle
    this.points.length = 0
    this.fishes.length = 0
    this.intervalCount = this.MAX_INTERVAL_COUNT
    this.width = this.parentElement.offsetWidth
    this.height = this.parentElement.offsetHeight
    this.fishCount = (((this.FISH_COUNT * this.width) / 500) * this.height) / 500
    this.canvas.setAttribute('width', this.width.toString())
    this.canvas.setAttribute('height', this.height.toString())
    this.reverse = false
    this.fishes.push(new FISH(this))
    this.createSurfacePoints()
    this.context.fillStyle = fillStyle
  }

  private tmpWidth = 0
  private tmpHeight = 0
  private watchIds: NodeJS.Timeout[] = []
  private watchWindowSize() {
    this.clearTimer()
    this.tmpWidth = window.innerWidth
    this.tmpHeight = window.innerHeight
    this.watchIds.push(setTimeout(this.jdugeToStopResize, this.WATCH_INTERVAL))
  }

  private clearTimer() {
    while (this.watchIds.length > 0) {
      clearTimeout(this.watchIds.pop())
    }
  }

  private jdugeToStopResize() {
    const width = window.innerWidth,
      height = window.innerHeight,
      stopped = width == this.tmpWidth && height == this.tmpHeight
    this.tmpWidth = width
    this.tmpHeight = height
    if (stopped) this.setup()
  }

  private bindEvent() {
    window.addEventListener('resize', this.watchWindowSize)
    this.parentElement.addEventListener('mouseenter', this.startEpicenter)
    this.parentElement.addEventListener('mousemove', this.moveEpicenter)
  }

  private getAxis(event: MouseEvent) {
    const offset = {
      left: this.parentElement.getBoundingClientRect().left + window.scrollX,
      top: this.parentElement.getBoundingClientRect().top + window.scrollY
    }
    return {
      x: event.clientX - offset.left + window.screenX,
      y: event.clientY - offset.top + window.scrollY
    }
  }

  private axis: { x: number; y: number } = { x: 0, y: 0 }
  private startEpicenter(event: MouseEvent) {
    this.axis = this.getAxis(event)
  }

  private moveEpicenter(event: MouseEvent) {
    const axis = this.getAxis(event)
    if (!this.axis) this.axis = axis
    this.generateEpicenter(axis.x, axis.y, axis.y - this.axis.y)
    this.axis = axis
  }

  public generateEpicenter(x: number, y: number, velocity: number) {
    if (y < this.height / 2 - this.THRESHOLD || y > this.height / 2 + this.THRESHOLD) return
    const index = Math.round(x / this.pointInterval)
    if (index < 0 || index >= this.points.length) return
    this.points[index].interfere(y, velocity)
  }

  private controlStatus() {
    for (let i = 0, count = this.points.length; i < count; i++) this.points[i].updateSelf()
    for (let i = 0, count = this.points.length; i < count; i++) this.points[i].updateNeighbors()
    if (this.fishes.length < this.fishCount) {
      if (--this.intervalCount == 0) {
        this.intervalCount = this.MAX_INTERVAL_COUNT
        this.fishes.push(new FISH(this))
      }
    }
  }

  private render() {
    requestAnimationFrame(this.render)
    this.controlStatus()
    this.context.clearRect(0, 0, this.width, this.height)
    for (let i = 0, count = this.fishes.length; i < count; i++) this.fishes[i].render(this.context)
    this.context.save()
    this.context.globalCompositeOperation = 'xor'
    this.context.beginPath()
    this.context.moveTo(0, this.reverse ? 0 : this.height)
    for (let i = 0, count = this.points.length; i < count; i++) this.points[i].render(this.context)
    this.context.lineTo(this.width, this.reverse ? 0 : this.height)
    this.context.closePath()
    this.context.fill()
    this.context.restore()
  }
}

class SURFACE_POINT {
  private SPRING_CONSTANT = 0.03
  private SPRING_FRICTION = 0.9
  private WAVE_SPREAD = 0.3
  private ACCELARATION_RATE = 0.01

  private renderer: Fish
  private x: number
  private initHeight: number
  private height: number
  constructor(renderer: Fish, x: number) {
    this.renderer = renderer
    this.x = x
    this.initHeight = this.renderer.height * this.renderer.INIT_HEIGHT_RATE
    this.height = this.initHeight
  }

  private previous: SURFACE_POINT | null = null
  public setPreviousPoint(previous: SURFACE_POINT) {
    this.previous = previous
  }

  private next: SURFACE_POINT | null = null
  public setNextPoint(next: SURFACE_POINT) {
    this.next = next
  }

  private fy = 0
  public interfere(y: number, velocity: number) {
    this.fy = this.renderer.height * this.ACCELARATION_RATE * (this.renderer.height - this.height - y >= 0 ? -1 : 1) * Math.abs(velocity)
  }

  public updateSelf() {
    this.fy += this.SPRING_CONSTANT * (this.initHeight - this.height)
    this.fy *= this.SPRING_FRICTION
    this.height += this.fy
  }

  private force = { next: 0, previous: 0 }
  public updateNeighbors() {
    if (this.previous) this.force.previous = this.WAVE_SPREAD * (this.height - this.previous.height)
    if (this.next) this.force.next = this.WAVE_SPREAD * (this.height - this.next.height)
  }

  public render(context: CanvasRenderingContext2D) {
    if (this.previous) {
      this.previous.height += this.force.previous
      this.previous.fy += this.force.previous
    }
    if (this.next) {
      this.next.height += this.force.next
      this.next.fy += this.force.next
    }
    context.lineTo(this.x, this.renderer.height - this.height)
  }
}

class FISH {
  private GRAVITY = 0.4

  private renderer: Fish
  constructor(renderer: Fish) {
    this.renderer = renderer
    this.init()
  }

  private direction = false
  private x = 0
  private vx = 0
  private y = 0
  private vy = 0
  private ay = 0
  private previousY = 0
  private isOut = false
  private theta = 0
  private phi = 0
  private init() {
    this.direction = Math.random() < 0.5
    this.x = this.direction ? this.renderer.width + this.renderer.THRESHOLD : -this.renderer.THRESHOLD
    this.previousY = this.y
    this.vx = this.getRandomValue(4, 10) * (this.direction ? -1 : 1)
    if (this.renderer.reverse) {
      this.y = this.getRandomValue((this.renderer.height * 1) / 10, (this.renderer.height * 4) / 10)
      this.vy = this.getRandomValue(2, 5)
      this.ay = this.getRandomValue(0.05, 0.2)
    } else {
      this.y = this.getRandomValue((this.renderer.height * 6) / 10, (this.renderer.height * 9) / 10)
      this.vy = this.getRandomValue(-5, -2)
      this.ay = this.getRandomValue(-0.2, -0.05)
    }
    this.isOut = false
    this.theta = 0
    this.phi = 0
  }

  private getRandomValue(min: number, max: number) {
    return min + (max - min) * Math.random()
  }

  private controlStatus() {
    this.previousY = this.y
    this.x += this.vx
    this.y += this.vy
    this.vy += this.ay
    if (this.renderer.reverse) {
      if (this.y > this.renderer.height * this.renderer.INIT_HEIGHT_RATE) {
        this.vy -= this.GRAVITY
        this.isOut = true
      } else {
        if (this.isOut) {
          this.ay = this.getRandomValue(0.05, 0.2)
        }
        this.isOut = false
      }
    } else {
      if (this.y < this.renderer.height * this.renderer.INIT_HEIGHT_RATE) {
        this.vy += this.GRAVITY
        this.isOut = true
      } else {
        if (this.isOut) {
          this.ay = this.getRandomValue(-0.2, -0.05)
        }
        this.isOut = false
      }
    }
    if (!this.isOut) {
      this.theta += Math.PI / 20
      this.theta %= Math.PI * 2
      this.phi += Math.PI / 30
      this.phi %= Math.PI * 2
    }
    this.renderer.generateEpicenter(this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD, this.y, this.y - this.previousY)
    if ((this.vx > 0 && this.x > this.renderer.width + this.renderer.THRESHOLD) || (this.vx < 0 && this.x < -this.renderer.THRESHOLD)) {
      this.init()
    }
  }

  public render(context: CanvasRenderingContext2D) {
    context.save()
    context.translate(this.x, this.y)
    context.rotate(Math.PI + Math.atan2(this.vy, this.vx))
    context.scale(1, this.direction ? 1 : -1)
    context.beginPath()
    context.moveTo(-30, 0)
    context.bezierCurveTo(-20, 15, 15, 10, 40, 0)
    context.bezierCurveTo(15, -10, -20, -15, -30, 0)
    context.fill()
    context.save()
    context.translate(40, 0)
    context.scale(0.9 + 0.2 * Math.sin(this.theta), 1)
    context.beginPath()
    context.moveTo(0, 0)
    context.quadraticCurveTo(5, 10, 20, 8)
    context.quadraticCurveTo(12, 5, 10, 0)
    context.quadraticCurveTo(12, -5, 20, -8)
    context.quadraticCurveTo(5, -10, 0, 0)
    context.fill()
    context.restore()
    context.save()
    context.translate(-3, 0)
    context.rotate((Math.PI / 3 + (Math.PI / 10) * Math.sin(this.phi)) * (this.renderer.reverse ? -1 : 1))
    context.beginPath()
    if (this.renderer.reverse) {
      context.moveTo(5, 0)
      context.bezierCurveTo(10, 10, 10, 30, 0, 40)
      context.bezierCurveTo(-12, 25, -8, 10, 0, 0)
    } else {
      context.moveTo(-5, 0)
      context.bezierCurveTo(-10, -10, -10, -30, 0, -40)
      context.bezierCurveTo(12, -25, 8, -10, 0, 0)
    }
    context.closePath()
    context.fill()
    context.restore()
    context.restore()
    this.controlStatus()
  }
}

export default Fish
