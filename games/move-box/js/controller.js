/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列
let Controller = function (stepNum, boxData, blockSide = 50) {
  stepNum = parseInt(stepNum)
  blockSide = Math.max(parseInt(blockSide), 50)
  if (typeof boxData != 'object' || boxData.length === 0 || boxData[0].length == 0) {
    throw new Error('箱子区域不能为空')
  }
  // 初始化数据
  this.data = new Model(stepNum, boxData)
  this.dataCopy = null
  let M = boxData.length, N = boxData[0].length
  let canvasWidth = N * blockSide
  let canvasHeight = M * blockSide
  this.frame = new Frame(canvasWidth, canvasHeight)
  this.isMaking = true // 是否在制作关卡中

  this.moveBox = null
  let mouseDownEventListener = (event) => {
    let xIndex = parseInt(event.offsetY / blockSide)
    let yIndex = parseInt(event.offsetX / blockSide)
    if (this.data.startBoard.isEmpty(xIndex, yIndex)) {
      event.preventDefault()
      this.moveBox = null
      return
    }
    this.moveBox = {
      xIndex: xIndex,
      yIndex: yIndex,
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    }
  }
  let mouseMoveEventListener = (event) => {
    if (!this.moveBox) {
      event.preventDefault()
      return
    }
  }
  let mouseUpEventListener = (event) => {
    if (!this.moveBox) {
      event.preventDefault()
      return
    }
    // 判断移动的距离
    console.log(this.moveBox, event)
    if (event.offsetX - this.moveBox.offsetX >= blockSide) {
      console.log('向右移动')
    } else if (this.moveBox.offsetX - event.offsetX >= blockSide) {
      console.log('向左移动')
    } else if (event.offsetY - this.moveBox.offsetY >= blockSide) {
      console.log('向下移动')
    } else if (this.moveBox.offsetY - event.offsetY >= blockSide) {
      console.log('向上移动')
    } else {
      console.log('未移动')
    }

  }
  // 按下鼠标
  this.frame.canvas.addEventListener('mousedown', mouseDownEventListener)
  // 移动鼠标
  this.frame.canvas.addEventListener('mousemove', mouseMoveEventListener)
  // 抬起鼠标
  this.frame.canvas.addEventListener('mouseup', mouseUpEventListener)

  this.setMaking = () => {
    this.isMaking = true
    this.draw()
  }
  // 析构函数
  this.__destructor__ = () => {
    if (!this.data) {
      return
    }
    this.data = null
    this.frame.clear()
    this.frame.canvas.removeEventListener('mousemove', moveEventListener)
    this.frame = null
    delete this
  }

  // 绘制
  this.draw = () => {
    this.frame.setMaking(this.isMaking)
    this.frame.draw(this.data)
  }

  // 求解
  this.play = (callback) => {
    this.data.solve()
    callback(this.data.answer)
  }

  this.updateData = (stepNum, boxData) => {
    this.data = new Model(stepNum, boxData)
    this.draw()
  }

  this.finishMaking = () => {
    this.isMaking = false
    this.draw()
  }


  this.draw()
}

