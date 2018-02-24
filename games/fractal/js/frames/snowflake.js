/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let SnowflakeFrame = function (canvasWidth, canvasHeight) {
  let canvas = document.getElementById('ui-layer');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  canvas.width = Math.max(canvasWidth, canvasHeight)
  canvas.height = canvasWidth * 4 / 3 * Math.sin(Math.PI / 180 * 60)
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')
  this.data = null

  // 绘画
  this.draw = (data) => {
    this.data = data
    window.requestAnimationFrame(this._draw)
  }

  // 具体绘制
  this._draw = () => {
    this.clear()
    this.ctx.strokeStyle = '#ff0000'
    this.ctx.fillStyle = '#ff0000'
    this.ctx.lineWidth = 2

    let side = this.canvas.width
    let h = side * Math.sin(Math.PI / 180 * 60)
    this._drawFractal(0, h, side, 60, 1)
    this._drawFractal(side / 2, 0, side, -60, 1)
    this._drawFractal(side, h, side, 180, 1)
  }

  /**
   * 递归绘制
   * @param x 左下角坐标X
   * @param y 左下角坐标Y
   * @param side 边长
   * @param angle 倾斜角度
   * @param depth 递归深度
   * @private
   */
  this._drawFractal = (x, y, side, angle, depth) => {
    // 递归终止情况
    if (side <= 1) {
      this.ctx.fillRect(x, y, 1, 1)
      return
    }
    if (depth >= this.data.depth) {
      // 绘制一条直线
      this._drawLine(x, y, x + side * Math.cos(Math.PI / 180 * angle), y - side * Math.sin(Math.PI / 180 * angle))
      return
    }

    // 递归, 中间冒出一个小三角形
    let s_3 = side / 3
    let triangleSide = s_3 / (2 * Math.cos(Math.PI / 180 * this.data.angle)) // 冒尖的边长
    let x2 = x + s_3 * Math.cos(Math.PI / 180 * angle)
    let y2 = y - s_3 * Math.sin(Math.PI / 180 * angle)
    let x3 = x2 + triangleSide * Math.cos(Math.PI / 180 * (angle + this.data.angle))
    let y3 = y2 - triangleSide * Math.sin(Math.PI / 180 * (angle + this.data.angle))
    let x4 = x + 2 * s_3 * Math.cos(Math.PI / 180 * angle)
    let y4 = y - 2 * s_3 * Math.sin(Math.PI / 180 * angle)
    this._drawFractal(x, y, s_3, angle, depth + 1) // x,y -> x2,y2
    this._drawFractal(x2, y2, triangleSide, angle + this.data.angle, depth + 1) // x2,y2 -> x3,y3
    this._drawFractal(x3, y3, triangleSide, 360 - (this.data.angle - angle), depth + 1) // x3,y3 -> x4,y4
    this._drawFractal(x4, y4, s_3, angle, depth + 1) // x3,y3 -> x4,y4
  }

  // 绘制一条直线
  this._drawLine = (x1, y1, x2, y2) => {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.closePath()
    this.ctx.stroke()
  }
  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

}