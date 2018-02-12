/**
 * Created by gongyidong on 2018/2/5.
 */
// 模型层 (面板)
let Model =  function (boxData, prevData = null, swapStr = '') {
  const EMPTY = '*'

  this.M = boxData.length
  this.N = boxData[0].length
  this.prevData = prevData
  this.boxData = [] // 数值
  this.flags = [] // 是否被标记
  this.swapStr = swapStr
  for (let i = 0; i < boxData.length; i++) {
    this.boxData[i] = []
    this.flags[i] = []
    if (boxData[i].length != this.N) {
      throw new Error('箱子数据有误')
    }
    for (let j = 0; j < boxData[i].length; j++) {
      this.boxData[i][j] = boxData[i][j]
      this.flags[i][j] = false
    }
  }

  // 清除标记
  this.clearFlags = () => {
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        this.flags[i][j] = false
      }
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
    let data = new Model(this.boxData)
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        data.flags[i][j] = this.flags[i][j]
      }
    }
    return data
  }

  // 交换box
  this.swap = (x1, y1, x2, y2) => {
    if (x1 == x2 && y1 == y2) {
      return
    }
    let t = this.boxData[x1][y1]
    this.boxData[x1][y1] = this.boxData[x2][y2]
    this.boxData[x2][y2] = t
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

  // 判断是否能赢
  this.canWin = () => {
    let dataMap = {}
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        if (this.boxData[i][j] == EMPTY) {
          continue
        }
        if (dataMap[this.boxData[i][j]] === undefined) {
          dataMap[this.boxData[i][j]] = 1
        } else {
          dataMap[this.boxData[i][j]]++
        }
      }
    }
    let can = true
    Object.keys(dataMap).forEach(function(key) {
      if(dataMap[key] <= 2) {
        can = false
      }
    })
    return can
  }

}