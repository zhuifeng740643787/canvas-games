/**
 * Created by gongyidong on 2018/2/5.
 */

// 控制层, M行N列
let Controller = function (stepNum, boxData, blockSide = 50) {
  stepNum = parseInt(stepNum)
  if (stepNum <= 0) {
    throw new Error('步数不能为0')
  }
  blockSide = Math.max(parseInt(blockSide), 50)
  if (typeof boxData != 'object' || boxData.length === 0 || boxData[0].length == 0) {
    throw new Error('箱子区域不能为空')
  }

  this.data = new Model(boxData) // 初始化数据
  this.bakData = this.data.clone() // 备份数据
  this.stepNum = stepNum // 步数
  // 初始化数据
  this.M = this.data.M // 行数
  this.N = this.data.N // 列数
  this.answer = [] // 答案

  let canvasWidth = this.N * blockSide
  let canvasHeight = this.M * blockSide
  this.frame = new Frame(canvasWidth, canvasHeight)
  this.isMaking = true // 是否在制作关卡中
  this.renderQueue = [] // 渲染队列
  this.renderInteval = null

  // 析构函数
  this.__destructor__ = () => {
    if (!this.data) {
      return
    }
    this.data = null
    this.frame.clear()
    this.frame = null
    if (this.renderInteval) {
      window.clearInterval(this.renderInteval)
    }
    this.renderQueue = []
    delete this
  }

  // 渲染求解过程
  this.renderSolveProcess = () => {
    this.renderInteval = window.setInterval((event) => {
      if (this.renderQueue.length == 0) {
        window.clearInterval(this.renderInteval)
        this.data = this.bakData.clone()
        this.draw(this.data)
        return
      }
      this.draw(this.renderQueue.shift())
    }, 1000)
  }



  // 移动箱子 fromX, fromY, toX, toY 索引坐标
  this.move = (fromX, fromY, toX, toY) => {
    if (this.data.boxData[fromX][fromY] == this.data.boxData[fromY][toY]) {
      return
    }
    // 只能移动一步
    if (toX > fromX) { // 下移
      toX = fromX + 1
      toY = fromY
    } else if (toX < fromX) { // 上移
      toX = fromX - 1
      toY = fromY
    } else if (toY > fromY) { // 右移
      toX = fromX
      toY = fromY + 1
    } else if (toY < fromY) { // 左移
      toX = fromX
      toY = fromY - 1
    } else {
      return
    }

    if (!this.data.inArea(toX, toY)) {
      return
    }
    this.data.swap(fromX, fromY, toX, toY)
    this.draw(this.data)
  }

  // 绘制
  this.draw = (data) => {
    this.frame.draw(data, this.isMaking)
  }

  // 求解
  this.play = (callback) => {
    this.solve()
    callback(this.answer)
  }

  this.updateData = (stepNum, boxData) => {
    this.stepNum = stepNum
    this.data = new Model(boxData)
    this.bakData = this.data.clone()
    this.draw(this.data)
  }

  this.finishMaking = () => {
    this.isMaking = false
    this.draw(this.data)
  }

  // 求解
  this.solve = () => {
    if (this.stepNum < 0) {
      return false
    }

    let result = this._solve(this.data, this.stepNum)
    this.renderSolveProcess()
    return result
  }

  // 获取答案
  this.getAnswer = (data) => {
    // 先打印上一步的
    let stack = []
    while (data) {
      if (data.swapStr) {
        stack.unshift(data.swapStr)
      }
      data = data.prevData
    }
    this.answer = []
    while (stack.length > 0) {
      this.answer.push(stack.shift())
    }
  }
  // 左右下三个方向
  let dirArr = [[0, -1], [0, 1], [1, 0]]
  this._solve = (data, stepNum) => {
    // 判断是否已经赢了
    if (data.isWin()) {
      this.getAnswer(data)
      return true
    }
    if (stepNum <= 0) {
      return false
    }

    // 递归遍历每一个box
    for (let x = 0; x < data.M; x++) {
      for (let y = 0; y < data.N; y++) {
        if (data.isEmpty(x, y)) {
          continue
        }
        // 向左右下三个方向移动
        for (let i = 0; i < dirArr.length; i++) {
          let newX = x + dirArr[i][0]
          let newY = y + dirArr[i][1]
          if (!data.inArea(newX, newY)) {
            continue
          }
          let swapStr = `change (${x}, ${y}) and (${newX}, ${newY})`
          let nextData = new Model(data.boxData, data, swapStr)
          // 移动箱子
          nextData.swap(x, y, newX, newY)
          this.renderQueue.push(nextData)
          // 处理盘面
          nextData._handle()
          this.renderQueue.push(nextData)
          // 下一步递归
          if (this._solve(nextData, stepNum - 1)) {
            return true
          }
        }
      }
    }
    return false
  }




  this.draw(this.data)
}

