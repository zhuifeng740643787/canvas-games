/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列的迷宫
let Controller = function (width, height, depth = 10, angle = 60, delay = 200) {
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
    if (renderInterval) {
      window.clearInterval(renderInterval)
    }

    let renderFunc
    switch (parseInt(method)) {
      case 1:
        document.title = '同心圆'
        let radius = parseInt(Math.min(canvasWidth, canvasHeight) / 2) - 5
        let step = 3
        depth = parseInt(radius / step)
        renderFunc = (depth) => {
          this.data = new CircleModel(parseInt(canvasWidth / 2), parseInt(canvasHeight / 2), radius, depth, step)
          this.frame = new CircleFrame(canvasWidth, canvasHeight)
          this.frame.draw(this.data)
        }
        break
      case 2:
        document.title = 'Vicsek分形图'
        renderFunc = (depth) => {
          this.data = new VicsekModel(depth)
          this.frame = new VicsekFrame(canvasWidth, canvasHeight)
          this.frame.draw(this.data)
        }
        break
      case 3:
        document.title = 'Sierpinski 矩形'
        renderFunc = (depth) => {
          this.data = new SierpinskiRectangleModel(depth)
          this.frame = new SierpinskiRectangleFrame(canvasWidth, canvasHeight)
          this.frame.draw(this.data)
        }
        break
      case 4:
        document.title = 'Sierpinski 三角形'
        renderFunc = (depth) => {
          this.data = new SierpinskiTriangleModel(depth, angle)
          this.frame = new SierpinskiTriangleFrame(canvasWidth, canvasHeight)
          this.frame.draw(this.data)
        }
        break
      case 5:
        document.title = '雪花'
        renderFunc = (depth) => {
          this.data = new SnowflakeModel(depth, angle)
          this.frame = new SnowflakeFrame(canvasWidth, canvasHeight)
          this.frame.draw(this.data)
        }
        break
      case 6:
        document.title = '树'
        renderFunc = (depth) => {
          this.data = new TreeModel(depth, angle)
          this.frame = new TreeFrame(canvasWidth, canvasHeight)
          this.frame.draw(this.data)
        }
        break
      default:
        throw new Error('method error')
        break

    }
    let renderDepth = 0
    renderInterval = window.setInterval(() => {
      renderDepth++
      if (renderDepth > depth) {
        window.clearInterval(renderInterval)
        return
      }
      console.log('递归深度', renderDepth)
      // 渲染
      renderFunc(renderDepth)
    }, DELAY)

  }

}

