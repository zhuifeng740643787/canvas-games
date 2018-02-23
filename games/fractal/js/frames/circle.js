/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let CircleFrame = function (canvasWidth, canvasHeight) {
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
    this.ctx.lineWidth = 1
    this._drawCircle(this.data.startR, 1)
  }

  /**
   * 递归绘制
   * @param r 半径
   * @param depth 递归深度
   * @private
   */
  this._drawCircle = (r, depth) => {
    // 递归终止情况
    if (r <= this.data.step + 1 || depth > this.data.depth) {
      return
    }

    // 绘制圆
    this.ctx.beginPath()
    this.ctx.arc(this.data.centerX, this.data.centerY, r, 0, Math.PI * 2)
    this.ctx.stroke()
    this.ctx.closePath()

    // 递归
    this._drawCircle(r - this.data.step, depth + 1)
  }



  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

}