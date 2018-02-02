window.onload = function () {
  // 生成迷宫
  makeMaze()
}

// 生成迷宫
let makeMaze = function () {

  let _this = this

  // 控制层
  let Controller = function (canvasWidth, canvasHeight) {
    this.view = new View(canvasWidth, canvasHeight)

    this.run = function () {
      this.view.draw()
    }

  }

  // 模型层 m行n列的数据
  let Model = function (m, n) {
    this.m = 0
    this.n = 0
    this.wall = '#' // 墙
    this.road = ' ' // 路

    this.__constructor__ = function (m, n) {
      m = parseInt(m)
      n = parseInt(n)
      if (m <= 0 || n <= 0) {
        throw new Error('m,n必须为正整数')
      }
      // m，n必须为奇数
      if (m % 2 === 0 || n % 2 === 0) {
        throw new Error('m,n必须为奇数')
      }
      this.m = m
      this.n = n

    }

    this.__constructor__(m, n)

  }
  // 视图层
  let View = function (minCanvasWidth, minCanvasHeight) {
    const backCanvasMargin = 100
    const offset = 50
    this.backCanvas = null
    this.canvas = null
    this.ctx = null
    // 构造函数
    this.__constructor__ = (minCanvasWidth, minCanvasHeight) => {
      let backCanvas = document.getElementById('background-layer');
      let canvas = document.getElementById('ui-layer');
      if (!backCanvas.getContext) {
        throw new Error('浏览器不支持Canvas')
      }

      let bodyRect = document.body.getBoundingClientRect()
      // 设置背景画布的尺寸
      backCanvas.width = Math.max(bodyRect.width - backCanvasMargin, minCanvasWidth + 2 * offset)
      backCanvas.height = Math.max(bodyRect.height - backCanvasMargin, minCanvasHeight + 2 * offset)
      // 设置UI画布的尺寸
      canvas.width = backCanvas.width - 2 * offset,
        canvas.height = backCanvas.height - 2 * offset

      // 移动位置
      canvas.style.left = offset + 'px'
      canvas.style.top = offset + 'px'

      this.backCanvas = backCanvas
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
    }

    // 动画
    this.draw = () => {
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.stroke()
    }

    // 清除画布
    this.clear = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    this.__constructor__(minCanvasWidth, minCanvasHeight)
  }

  // 运行
  let run = function () {
    let controller = new Controller(800, 800)
    controller.run()

  }

  run()

}
