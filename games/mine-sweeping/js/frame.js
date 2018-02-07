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

  // 图片映射关系
  const IMAGE_MAP = {
    MINE: document.querySelector('#image-wrapper .img-mine'),
    ERROR: document.querySelector('#image-wrapper .img-error'),
    FLAG: document.querySelector('#image-wrapper .img-flag'),
    BLANK: document.querySelector('#image-wrapper .img-blank'),
    BLOOD: document.querySelector('#image-wrapper .img-blood'),
    N_0: document.querySelector('#image-wrapper .img-0'),
    N_1: document.querySelector('#image-wrapper .img-1'),
    N_2: document.querySelector('#image-wrapper .img-2'),
    N_3: document.querySelector('#image-wrapper .img-3'),
    N_4: document.querySelector('#image-wrapper .img-4'),
    N_5: document.querySelector('#image-wrapper .img-5'),
    N_6: document.querySelector('#image-wrapper .img-6'),
    N_7: document.querySelector('#image-wrapper .img-7'),
    N_8: document.querySelector('#image-wrapper .img-8'),
  }

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
    for (let i = 0; i < this.data.M; i++) {
      for (let j = 0; j < this.data.N; j++) {
        // 绘制图片
        if (!this.data.open[i][j]) {
          if (this.data.flags[i][j]) {
            this.drawImage(this.ctx, IMAGE_MAP.FLAG, j * w, i * h, w, h)
          } else {
            this.drawImage(this.ctx, IMAGE_MAP.BLANK, j * w, i * h, w, h)
          }
        } else {
          if (this.data.mine[i][j]) {
            this.drawImage(this.ctx, IMAGE_MAP.MINE, j * w, i * h, w, h)
          } else {
            this.drawImage(this.ctx, IMAGE_MAP[`N_${this.data.numbers[i][j]}`], j * w, i * h, w, h)
          }
        }

        if (this.data.isFailure() && this.data.mine[i][j]) {
          if (this.data.failuerPos.x == i && this.data.failuerPos.y == j) {
            this.drawImage(this.ctx, IMAGE_MAP.BLOOD, j * w, i * h, w, h)
          } else if(this.data.flags[i][j]){
            this.drawImage(this.ctx, IMAGE_MAP.ERROR, j * w, i * h, w, h)
          } else {
            this.drawImage(this.ctx, IMAGE_MAP.MINE, j * w, i * h, w, h)
          }
        }
      }
    }
  }
  // 清除画布
  this.clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  this.drawImage = (ctx, img, x, y, w, h) => {
    ctx.drawImage(img, x, y, w, h)
  }


}