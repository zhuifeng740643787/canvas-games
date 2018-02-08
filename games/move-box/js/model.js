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
  this.M = boxData.length // 行数
  this.N = boxData[0].length // 列数
  for (let i = 1; i < this.M; i++) {
    if (boxData[i].length != this.N) {
      throw new Error('箱子数据有误')
    }
  }

  // 初始化数据
  this.startBoard = new Board(boxData) // 初始盘面
  this.showBoard = this.startBoard.clone() // 显示盘面

  // 是否在区域内
  this.inArea = (x, y) => {
    return x >= 0 && x < this.M && y >= 0 && y < this.N
  }

}

// 盘面
let Board = function (boxData, prevBoard = null) {
  const EMPTY = '*'

  this.M = boxData.length
  this.N = boxData[0].length
  this.prevBoard = prevBoard
  this.boxData = new Array()
  for (let i = 0; i < boxData.length; i++) {
    this.boxData[i] = new Array()
    for (let j = 0; j < boxData[i].length; j++) {
      this.boxData[i][j] = boxData[i][j]
    }
  }

  // 是否为空隙
  this.isEmpty = (x, y) => {
    return this.boxData[x][y] === EMPTY
  }

  // 克隆数据
  this.clone = () => {
    let d = new Board(this.boxData, this.prevBoard)
    return d
  }
}