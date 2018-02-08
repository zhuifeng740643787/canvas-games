/**
 * Created by gongyidong on 2018/2/5.
 */
// 视图层
let Frame = function (canvasWidth, canvasHeight) {
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
    this.clear()
    this.data = data
    this._draw()
  }

  // 具体绘制
  this._draw = () => {
    // 计算出每一个格子的宽和高
    let w = parseInt(this.canvas.width / this.data.N)
    let h = parseInt(this.canvas.height / this.data.M)

    // 遍历绘制
    let board = this.data.showBoard
    for (let x = 0; x < this.data.M; x++) {
      for (let y = 0; y < this.data.N; y++) {
        // 绘制BOX
        if (!board.isEmpty(x, y)) {
          this.drawBox(this.ctx, board.boxData[x][y], y * w, x * h, w, h)
        }
      }
    }
  }
  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  this.drawBox = (ctx, text, x, y, w, h) => {
    ctx.save()
    ctx.fillStyle = helpers.colors[text]
    ctx.fillRect(x, y, w, h)
    ctx.restore()
  }

}