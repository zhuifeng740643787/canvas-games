/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let SierpinskiRectangleFrame = function (canvasWidth, canvasHeight) {
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
    this._drawFractal(0, 0, this.canvas.width, this.canvas.height, 1)
  }

  /**
   * 递归绘制
   * @param depth 递归深度
   * @private
   */
  this._drawFractal = (x, y, width, height, depth) => {

    let w_3 = parseInt(width / 3)
    let h_3 = parseInt(height / 3)

    // 递归终止情况
    if (w_3 <= 1 || h_3 <= 1) {
      this.ctx.fillRect(x, y, 1, 1)
      return
    }

    if (depth >= this.data.depth) {
      this.ctx.fillRect(x + w_3, y + h_3, width - 2 * w_3, height - 2 * h_3)
      return
    }

    // 递归
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
          this.ctx.fillRect(x + w_3, y + h_3, width - 2 * w_3, height - 2 * h_3)
          continue
        }

        let newX = j == 2 ? x + width - w_3 : x + j * w_3
        let newY = i == 2 ? y + height - h_3 : y + i * h_3
        let newWidth = j == 1 ? width - 2 * w_3 : w_3
        let newHeight = i == 1 ? height - 2 * h_3 : h_3
        this._drawFractal(newX , newY, newWidth, newHeight, depth + 1)
      }
    }
  }

  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

}