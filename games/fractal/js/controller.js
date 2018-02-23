/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列的迷宫
let Controller = function (width, height, depth = 10, delay = 200) {
  const DELAY = Math.max(parseInt(delay), 5) // 延迟毫秒数
  // 初始化数据
  let canvasWidth = Math.max(parseInt(width), 400)
  let canvasHeight = Math.max(parseInt(height), 400)
  let setTimeoutRender // 延迟渲染
  let renderInterval // 定时渲染

  this.isPausedRender = false // 是否暂停渲染
  // 析构函数
  this.__destructor__ = () => {
    if (!this.data) {
      return
    }
    this.data = null
    this.frame.clear()
    this.frame = null
    if (setTimeoutRender) {
      window.clearTimeout(setTimeoutRender)
    }
    if (renderInterval) {
      window.clearInterval(renderInterval)
    }
    delete this
  }

  // 绘制
  this.draw = (method) => {
    switch (parseInt(method)) {
      case 1:
        document.title = '同心圆'
        let radius = parseInt(Math.min(canvasWidth, canvasHeight) / 2) - 5
        depth = parseInt(radius / 2)
        this.data = new CircleModel(parseInt(canvasWidth / 2), parseInt(canvasHeight / 2), radius, depth, 5)
        this.frame = new CircleFrame(canvasWidth, canvasHeight)
        this.frame.draw(this.data)
        break
      case 2:
        document.title = 'Vicsek分形图'
        console.log(depth)
        this.data = new VicsekModel(depth)
        this.frame = new VicsekFrame(canvasWidth, canvasHeight)
        this.frame.draw(this.data)
        break
      default:
        break
    }

  }
}

