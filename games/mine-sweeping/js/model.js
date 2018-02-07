/**
 * Created by gongyidong on 2018/2/5.
 */
// 模型层 M行N列的雷区，包含mineNum个雷
let Model = function (M, N, mineNum) {
  M = parseInt(M)
  N = parseInt(N)
  mineNum = parseInt(mineNum)
  if (M <= 0 || N <= 0 || mineNum < 0) {
    window.alert('雷区尺寸和雷的个数必须为正整数')
    throw new Error('雷区尺寸和雷的个数必须为正整数')
  }
  if (mineNum > M * N) {
    window.alert('雷的个数不能大于雷区容量')
    throw new Error('雷的个数不能大于雷区容量')
  }

  this.M = M // 行数
  this.N = N // 列数
  this.mineNum = mineNum // 雷的个数
  this.mine = new Array() // 是否为雷
  this.open = new Array() // 是否打开
  this.flags = new Array() // 是否被标位旗帜
  this.numbers = new Array() // 周边八个位置的雷的个数，-1表示当前方格为雷
  this.failuerPos = {x: -1, y: -1} // 失败点击的位置
  // 初始化数据
  for (let i = 0; i < this.M; i++) {
    this.mine[i] = new Array()
    this.open[i] = new Array()
    this.flags[i] = new Array()
    this.numbers[i] = new Array()
    for (let j = 0; j < this.N; j++) {
      this.mine[i][j] = false
      this.open[i][j] = false
      this.flags[i][j] = false
      this.numbers[i][j] = 0
    }
  }

  // 生成雷区
  this.generate = () => {
    // 先将前雷的个数的位置设为雷
    for (let i = 0; i < mineNum; i++) {
      let x = parseInt(i / this.N)
      let y = i % this.N
      this.mine[x][y] = true
    }
    // 使用洗牌算法打乱雷区
    this._shuffle()

    // 计算numbers数据
    this._calculateNumbers()
  }

  // 洗牌算法
  this._shuffle = () => {
    let _swap = (i, j) => {
      let iX = parseInt(i / this.N)
      let iY = i % this.N
      let jX = parseInt(j / this.N)
      let jY = j % this.N
      let tmp = this.mine[iX][iY]
      this.mine[iX][iY] = this.mine[jX][jY]
      this.mine[jX][jY] = tmp
    }

    for (let i = this.M * this.N - 1; i >= 0; i--) {
      // 在前i个元素中随机抽取一个元素
      let randomIndex = parseInt(Math.random() * (i + 1))
      // 交换
      _swap(i, randomIndex)
    }
  }

  // 计算numbers的数据
  this._calculateNumbers = () => {
    let _calc = (x, y) => {
      // 判断是否为雷
      if (this.mine[x][y]) {
        this.numbers[x][y] = -1
        return
      }
      // 遍历周围8个方向
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          // 是否在区域类
          if (!this.inArea(i, j)) {
            continue
          }
          // 是否为雷
          if (this.mine[i][j]) {
            this.numbers[x][y]++
          }
        }
      }

    }
    // 遍历每一个格子
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        // 获取周围八个方向上雷的个数
        _calc(i, j)
      }
    }

  }

  // 使用floodfill算法 打开雷区
  this.openBlock = (x, y) => {
    if (this.mine[x][y]) {
      throw new Error('此位置为雷, 不能打开')
    }
    this.open[x][y] = true
    if (this.numbers[x][y] > 0) {
      return
    }
    let dirArr = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    // 深度优先遍历方式打开左边区域
    let _open = (x, y) => {
      // 遍历4个方向
      for (let i = 0; i < dirArr.length; i++) {
        let newX = x + dirArr[i][0]
        let newY = y + dirArr[i][1]
        if (this.inArea(newX, newY) && !this.open[newX][newY]
          && !this.mine[newX][newY] && !this.flags[newX][newY]) {
          this.open[newX][newY] = true
          _open(newX, newY)
        }
      }
    }
    _open(x, y)

  }

  // 设为失败
  this.setFailure = (x, y) => {
    this.failuerPos = {x: x, y: y}
  }

  // 是否失败
  this.isFailure = () => {
    return this.failuerPos.x !== -1
  }

  // 是否成功
  this.isSuccess = () => {
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        // 非雷且未被打开
        if (!this.mine[i][j] && !this.open[i][j]) {
          return false
        }
      }
    }
    return true
  }

  // 克隆数据
  this.clone = () => {
    let d = new Model(this.M, this.N, this.mineNum)
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        d.mine[i][j] = this.mine[i][j]
        d.open[i][j] = this.open[i][j]
        d.flags[i][j] = this.flags[i][j]
        d.numbers[i][j] = this.numbers[i][j]
      }
    }
    return d
  }

  // 是否在区域内
  this.inArea = (x, y) => {
    return x >= 0 && x < this.M && y >= 0 && y < this.N
  }

}
