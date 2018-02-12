/**
 * Created by gongyidong on 2018/2/5.
 */
// 模型层
let Model = function (stepNum, boxData) {
  stepNum = parseInt(stepNum)
  if (stepNum <= 0) {
    throw new Error('步数不能为0')
  }

  if (typeof boxData != 'object' || boxData.length === 0 || boxData[0].length == 0) {
    throw new Error('箱子区域不能为空')
  }
  this.stepNum = stepNum // 步数
  // 初始化数据
  this.startBoard = new Board(boxData) // 初始盘面
  this.M = this.startBoard.M // 行数
  this.N = this.startBoard.N // 列数
  this.showBoard = this.startBoard.clone() // 显示盘面
  this.answer = [] // 答案
  // 是否在区域内
  this.inArea = (x, y) => {
    return x >= 0 && x < this.M && y >= 0 && y < this.N
  }

  // 求解
  this.solve = () => {
    if (this.stepNum < 0) {
      return false
    }

    return this._solve(this.startBoard, this.stepNum)
  }

  // 是否已成功
  this.isWin = () => {
    return this.startBoard.isWin()
  }
  // 获取答案
  this.getAnswer = (board) => {
    // 先打印上一步的
    let stack = []
    while (board) {
      if (board.swapStr) {
        stack.unshift(board.swapStr)
      }
      board = board.prevBoard
    }
    this.answer = []
    while (stack.length > 0) {
      this.answer.push(stack.shift())
    }
  }
  // 左右下三个方向
  let dirArr = [[0, -1], [0, 1], [1, 0]]
  this._solve = (board, stepNum) => {
    // 判断是否已经赢了
    if (board.isWin()) {
      this.getAnswer(board)
      return true
    }
    if (stepNum <= 0) {
      return false
    }

    // 递归遍历每一个box
    for (let x = 0; x < this.M; x++) {
      for (let y = 0; y < this.N; y++) {
        if (board.isEmpty(x, y)) {
          continue
        }
        // 向左右下三个方向移动
        for (let i = 0; i < dirArr.length; i++) {
          let newX = x + dirArr[i][0]
          let newY = y + dirArr[i][1]
          if (!board.inArea(newX, newY)) {
            continue
          }
          let swapStr = `change (${x}, ${y}) and (${newX}, ${newY})`
          let nextBoard = new Board(board.boxData, board, swapStr)
          // 移动箱子
          nextBoard._swap(x, y, newX, newY)
          // 处理盘面
          nextBoard._handle()
          // 下一步递归
          if (this._solve(nextBoard, stepNum - 1)) {
            return true
          }
        }
      }
    }
    return false
  }

}

// 盘面
let Board = function (boxData, prevBoard = null, swapStr = '') {
  const EMPTY = '*'

  this.M = boxData.length
  this.N = boxData[0].length
  this.prevBoard = prevBoard
  this.swapStr = swapStr

  this.boxData = new Array()
  for (let i = 0; i < boxData.length; i++) {
    this.boxData[i] = new Array()
    if (boxData[i].length != this.N) {
      throw new Error('箱子数据有误')
    }
    for (let j = 0; j < boxData[i].length; j++) {
      this.boxData[i][j] = boxData[i][j]
    }
  }

  // 是否在区域内
  this.inArea = (x, y) => {
    return x >= 0 && x < this.M && y >= 0 && y < this.N
  }

  // 是否为空隙
  this.isEmpty = (x, y) => {
    if (!this.inArea(x, y)) {
      throw new Error('索引越界')
    }
    return this.boxData[x][y] === EMPTY
  }

  // 克隆数据
  this.clone = () => {
    let d = new Board(this.boxData, this.prevBoard)
    return d
  }

  // 交换box
  this._swap = (x1, y1, x2, y2) => {
    if (x1 == x2 && y1 == y2) {
      return
    }
    let t = this.boxData[x1][y1]
    this.boxData[x1][y1] = this.boxData[x2][y2]
    this.boxData[x2][y2] = t
  }

  // 处理盘面
  this._handle = () => {
    // 处理箱子掉落和消除
    do {
      this._drop()
    } while (this._remove())
  }

  // 处理箱子掉落
  this._drop = () => {
    // 处理N列
    for (let j = 0; j < this.N; j++) {
      let cur = this.M - 1 // cur 当前要放box的位置，i为由下到上要遍历的box
      for (let i = this.M - 1; i >= 0; i--) {
        if (this.boxData[i][j] == EMPTY) {
          continue
        }
        // 交换cur 与 j对应的box
        this._swap(i, j, cur, j)
        // cur向上移动
        cur--
      }
    }
  }

  // 处理箱子消除
  this._remove = () => {
    // 对要消除的box先进行标记
    let flags = new Array()
    // 初始化flags
    for (let x = 0; x < this.M; x++) {
      flags[x] = new Array()
      for (let y = 0; y < this.N; y++) {
        flags[x][y] = false
      }
    }
    let isRemove = false
    for (let x = 0; x < this.M; x++) {
      for (let y = 0; y < this.N; y++) {
        if (this.boxData[x][y] == EMPTY) {
          continue
        }
        // 向右和向下看是否有三个一样的box
        let dirs = [[0, 1], [1, 0]]
        for (let i = 0; i < dirs.length; i++) {
          let x2 = x + dirs[i][0]
          let y2 = y + dirs[i][1]
          let x3 = x + dirs[i][0] * 2
          let y3 = y + dirs[i][1] * 2
          if (this.inArea(x2, y2) && this.inArea(x3, y3)
            && this.boxData[x2][y2] === this.boxData[x][y] && this.boxData[x3][y3] === this.boxData[x][y]) {
            flags[x][y] = true
            flags[x2][y2] = true
            flags[x3][y3] = true
            isRemove = true
          }
        }
      }
    }
    if (!isRemove) {
      return false
    }

    // 消除标记的箱子
    for (let x = 0; x < this.M; x++) {
      for (let y = 0; y < this.N; y++) {
        if (flags[x][y]) {
          this.boxData[x][y] = EMPTY
        }
      }
    }
    return true
  }

  // 是否已成功
  this.isWin = () => {
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        if (this.boxData[i][j] != EMPTY) {
          return false
        }
      }
    }

    return true
  }

}