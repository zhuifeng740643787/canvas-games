/**
 * Created by gongyidong on 2018/2/5.
 */
// 模型层 (面板)
let Model =  function (boxData, prevData = null, swapStr = '') {
  const EMPTY = '*'

  this.M = boxData.length
  this.N = boxData[0].length
  this.prevData = prevData
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
    let d = new Model(this.boxData, this.prevData)
    return d
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
        this.swap(i, j, cur, j)
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