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
        return
      }
      this.draw(this.renderQueue.shift())
    }, 100)
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
    this._handle(this.data)
    this.renderSolveProcess()
  }

  // 绘制
  this.draw = (data) => {
    this.frame.draw(data, this.isMaking)
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
  this.searchSolve = (callback) => {
    if (this.stepNum < 0) {
      return false
    }

    // 先处理一下
    this._handle(this.data)
    if (this.data.isWin()) {
      callback(this.answer, '当前关卡初始状态已经为成功')
      throw new Error('当前关卡初始状态已经为成功')
    }
    let result = this._solve(this.data, this.stepNum)
    if (result) {
      this.renderSolveProcess()
    }
    callback(this.answer, this.answer.length > 0 ? '成功' : '失败')
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

  this._solve = (data, stepNum) => {
    // 判断是否已经赢了
    if (data.isWin()) {
      this.getAnswer(data)
      return true
    }
    if (stepNum <= 0) {
      return false
    }

    // 判断是否还能赢
    if (!data.canWin()) {
      return false
    }

    // 递归遍历每一个box
    for (let x = 0; x < data.M; x++) {
      for (let y = 0; y < data.N; y++) {
        if (data.isEmpty(x, y)) {
          continue
        }

        // 减支，如果右边有箱子，当前箱子就不再右移了, 因为当前箱子右移跟右边箱子左移是一样的
        let dirArr = [[0, -1], [0, 1], [1, 0]] // 左右下三个方向
        let rightX = x, rightY = y + 1
        if (data.inArea(rightX, rightY) && !data.isEmpty(rightX, rightY)) {
          dirArr = [[0, -1], [1, 0]] // 左下两个方向
        }
        // 移动箱子
        for (let i = 0; i < dirArr.length; i++) {
          let newX = x + dirArr[i][0]
          let newY = y + dirArr[i][1]
          if (!data.inArea(newX, newY)) {
            continue
          }
          // 如果两个箱子相同，就不再遍历了
          if (data.boxData[x][y] == data.boxData[newX][newY]) {
            continue
          }
          let swapStr = `change (${x}, ${y}) and (${newX}, ${newY})`
          let nextData = new Model(data.boxData, data, swapStr)
          // 移动箱子
          nextData.swap(x, y, newX, newY)
          this.renderQueue.push(nextData)
          // 处理盘面
          this._handle(nextData)
          this.renderQueue.push(nextData.clone())
          // 下一步递归
          if (this._solve(nextData, stepNum - 1)) {
            return true
          }
        }
      }
    }
    return false
  }

  // 处理盘面
  this._handle = (data) => {
    // 处理箱子掉落和消除
    do {
      this._drop(data)
    } while (this._remove(data))
  }

  // 处理箱子掉落
  this._drop = (data) => {
    // 处理N列
    for (let j = 0; j < data.N; j++) {
      let cur = data.M - 1 // cur 当前要放box的位置，i为由下到上要遍历的box
      for (let i = data.M - 1; i >= 0; i--) {
        if (data.boxData[i][j] == EMPTY) {
          continue
        }
        // 交换cur 与 j对应的box
        data.swap(i, j, cur, j)
        // cur向上移动
        cur--
      }
    }
    this.renderQueue.push(data.clone())
  }

  // 处理箱子消除
  this._remove = (data) => {
    // 对要消除的box先进行标记
    let isRemove = false
    for (let x = 0; x < data.M; x++) {
      for (let y = 0; y < data.N; y++) {
        if (data.boxData[x][y] == EMPTY) {
          continue
        }
        // 向右和向下看是否有三个一样的box
        let dirs = [[0, 1], [1, 0]]
        for (let i = 0; i < dirs.length; i++) {
          let x2 = x + dirs[i][0]
          let y2 = y + dirs[i][1]
          let x3 = x + dirs[i][0] * 2
          let y3 = y + dirs[i][1] * 2
          if (data.inArea(x2, y2) && data.inArea(x3, y3)
            && data.boxData[x2][y2] === data.boxData[x][y] && data.boxData[x3][y3] === data.boxData[x][y]) {
            data.flags[x][y] = true
            data.flags[x2][y2] = true
            data.flags[x3][y3] = true
            isRemove = true
          }
        }
      }
    }
    if (!isRemove) {
      return false
    }
    this.renderQueue.push(data.clone())

    // 消除标记的箱子
    for (let x = 0; x < data.M; x++) {
      for (let y = 0; y < data.N; y++) {
        if (data.flags[x][y]) {
          data.boxData[x][y] = EMPTY
        }
      }
    }
    data.clearFlags()
    this.renderQueue.push(data.clone())
    return true
  }

  this.draw(this.data)
}

