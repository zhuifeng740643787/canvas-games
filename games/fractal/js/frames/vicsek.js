/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let VicsekFrame = function (canvasWidth, canvasHeight) {
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
    this.ctx.fillStyle = '#ff0000'
    this._drawVicsek(0, 0, this.canvas.width, this.canvas.height, 0)
  }

  /**
   * 递归绘制
   * @param depth 递归深度
   * @private
   */
  this._drawVicsek = (x, y, width, height, depth) => {
    // 递归终止情况
    if (depth >= this.data.depth) {
      this.ctx.fillRect(x, y, width, height)
      return
    }
    let w_3 = parseInt(width / 3)
    let h_3 = parseInt(height / 3)
    if (w_3 <= 1 || h_3 <= 1) {
      this.ctx.fillRect(x, y, width, height)
      return
    }

    // 递归
    this._drawVicsek(x, y, w_3, h_3, depth + 1)
    this._drawVicsek(x + width - w_3 , y, w_3, h_3, depth + 1)
    this._drawVicsek(x + w_3, y + h_3, width - 2 * w_3, height - 2 * h_3, depth + 1)
    this._drawVicsek(x, y + height - h_3, w_3, h_3, depth + 1)
    this._drawVicsek(x + width - w_3, y + height - h_3, w_3, h_3, depth + 1)
  }



  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

}