/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let SierpinskiTriangleFrame = function (canvasWidth, canvasHeight) {
  let canvas = document.getElementById('ui-layer');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  canvas.width = Math.max(canvasWidth, canvasHeight)
  canvas.height = canvasWidth
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
    this.ctx.fillStyle = '#ff0000'

    this._drawFractal(0, this.canvas.height, this.canvas.width, 1)
  }

  /**
   * 递归绘制
   * @param x 左下角坐标X
   * @param y 左下角坐标Y
   * @param side 边长
   * @param depth 递归深度
   * @private
   */
  this._drawFractal = (x, y, side, depth) => {

    if (side <= 1) {
      this.ctx.fillRect(x, y, 1, 1)
      return
    }
    let h = parseInt(Math.sin(Math.PI / 180 * this.data.angle) * side)
    let aX = x, aY = y
    let bX = x + side, bY = y
    let cX = x + parseInt(side / 2), cY = y - h

    // 递归终止情况
    if (depth >= this.data.depth) {
      this.ctx.beginPath()
      this.ctx.moveTo(aX, aY)
      this.ctx.lineTo(bX, bY)
      this.ctx.lineTo(cX, cY)
      this.ctx.closePath()
      this.ctx.fill()
      return
    }

    let newSide = parseInt(side / 2)
    let newH = parseInt(h / 2)
    // 递归
    this._drawFractal(aX + parseInt(side / 4), y - newH, newSide, depth + 1)
    this._drawFractal(aX, y, newSide, depth + 1)
    this._drawFractal(aX + newSide, y, newSide, depth + 1)

  }

  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

}