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
  this.isMaking = false

  // 设置是否在进行制作中
  this.setMaking = (isMaking) => {
    this.isMaking = isMaking
  }
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
        if (!board.isEmpty(x, y) || this.isMaking) {
          this.drawBox(this.ctx, board, y * w + 1, x * h + 1, w - 2, h - 2, x, y)
        }
      }
    }
  }
  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  this.drawBox = (ctx, board, x, y, w, h, xIndex, yIndex) => {
    let text = board.boxData[xIndex][yIndex]
    ctx.save()
    if (this.isMaking) {
      ctx.strokeStyle = '#000000'
      ctx.setLineDash([2, 2]);
      ctx.beginPath()
      ctx.moveTo(x + 2, y + 2)
      ctx.lineTo(x + w - 2, y + 2)
      ctx.lineTo(x + w - 2, y + h - 2)
      ctx.lineTo(x + 2, y + h - 2)
      ctx.closePath()
      ctx.stroke()
    }
    if (board.isEmpty(xIndex, yIndex)) {
      ctx.fillStyle = 'transparent'
    } else {
      ctx.fillStyle = helpers.colors[text]
      ctx.fillRect(x, y, w, h)
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, x + parseInt(w / 2), y + parseInt(h / 3), w / 2)
      ctx.fillText(`(${xIndex}, ${yIndex})`, x + parseInt(w / 2), y + parseInt(h * 2 / 3), w / 2)
    }


    ctx.restore()
  }

}