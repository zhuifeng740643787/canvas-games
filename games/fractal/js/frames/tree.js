/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let TreeFrame = function (canvasWidth, canvasHeight) {
  let canvas = document.getElementById('ui-layer');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  canvas.width = canvasWidth
  canvas.height = canvasHeight
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

    this._drawFractal(this.canvas.width / 2, this.canvas.height, this.canvas.height, 0, 1)
  }

  /**
   * 递归绘制
   * @param x 起点坐标X
   * @param y 起点坐标Y
   * @param side 长度
   * @param angle 倾斜角度
   * @param depth 递归深度
   * @private
   */
  this._drawFractal = (x, y, side, angle, depth) => {

    this.ctx.lineWidth = 10 / depth + Math.random()
    // 递归终止情况
    if (side <= 1) {
      this.ctx.fillRect(x, y, 1, 1)
      return
    }
    if (depth >= this.data.depth) {
      // 绘制一条直线
      this._drawLine(x, y, x - side * Math.sin(Math.PI / 180 * angle), y - side * Math.cos(Math.PI / 180 * angle))
      return
    }

    // 递归
    let newSide = side * 5 / 8 + side * Math.random() / 5
    let x2 = x - (side - newSide) * Math.sin(Math.PI / 180 * angle)
    let y2 = y - (side - newSide) * Math.cos(Math.PI / 180 * angle)
    // 先绘制一半
    this._drawLine(x, y, x2, y2)

    // 绘制两边
    let leftSide = newSide * 2 / 3 + newSide * Math.random() / 3
    let leftAngle = angle + (Math.random() * this.data.splitAngle / 6 + this.data.splitAngle / 3)
    this._drawFractal(x2, y2, leftSide, leftAngle, depth + 1)

    let rightSide = newSide * 5 / 6 + newSide * Math.random() / 6
    let rightAngle = angle - (Math.random() * this.data.splitAngle / 6 + this.data.splitAngle / 3)
    this._drawFractal(x2, y2, rightSide, rightAngle, depth + 1)

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