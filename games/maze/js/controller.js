/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列的迷宫
let Controller = function (M, N, wallSize = 10, roadSize = 10, delay = 30) {
  const BLOCK_SIDE = roadSize // 方格的尺寸
  const DELAY = Math.max(parseInt(delay), 5) // 延迟毫秒数
  M = parseInt(M)
  N = parseInt(N)
  // 初始化数据
  this.data = new MazeData(M, N)

  let canvasWidth = N * BLOCK_SIDE
  let canvasHeight = M * BLOCK_SIDE
  this.frame = new Frame(canvasWidth, canvasHeight)
  let dirArr = [[-1, 0], [0, 1], [1, 0], [0, -1]] // 上右下左遍历顺序
  let renderQueue = new RenderQueue(this.data.clone()) // 用于渲染的队列
  let renderSearchPathQueue // 由于检索的队列
  this.isMaking = false // 是否在创建迷宫中
  this.isSearching = false // 是否在检索路径中
  let setTimeoutRender // 延迟渲染
  let renderInterval // 定时渲染

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

  // 生成迷宫
  this.make = (method) => {
    this.isMaking = true
    this.frame.draw(this.data)
    switch (parseInt(method)) {
      case 1:
        // 深度优先遍历（递归）, 从入口之后的第一个方格开始
        document.title = '深度优先遍历(递归)'
        this.goByDFSRecursion(this.data.entryX, this.data.entryY + 1)
        break
      case 2:
        // 深度优先遍历（非递归）
        document.title = '深度优先遍历(非递归)'
        this.goByDFSNOTRecursion(this.data.entryX, this.data.entryY + 1)
        break
      case 3:
        // 广度优先遍历
        document.title = '广度优先遍历'
        this.goByBFS(this.data.entryX, this.data.entryY + 1)
        break
      case 4:
        // 随机队列
        document.title = '随机队列'
        this.goByRandomQueue(this.data.entryX, this.data.entryY + 1)
        break
      case 5:
        // 随机队列, 结合深度和广度优先遍历思想
        document.title = '随机队列, 结合深度和广度优先遍历思想'
        this.goByRandomDFSANDBFSQueue(this.data.entryX, this.data.entryY + 1)
        break
      default:
        break
    }

    // 延迟开始渲染
    setTimeoutRender = setTimeout(() => {
      this.render()
    }, 500)

  }

  this.findPath = (method) => {
    this.isSearching = true
    window.dd = this.data.clone()
    renderSearchPathQueue = new RenderSearchPathQueue(this.data.clone())
    switch (parseInt(method)) {
      case 1:
        this.searchPathByDFSRecursion()
        break
      case 2:
        this.searchPathByDFSNOTRecursion()
        break
      case 3:
        this.searchPathByBFS()
      default:
        break
    }

    // 延迟开始渲染路径检索
    setTimeout(() => {
      this.renderSearchPath()
    }, 500)
  }
  // 清空路径
  this.clearPath = () => {
    renderSearchPathQueue = null
    this.data.path = null
    this.data.clearPath()

  }
  // 查找路径
  this.searchPathByDFSRecursion = () => {
    // 查找
    if (!this.findByDFSRecursion(this.data.entryX, this.data.entryY)) {
      console.log('没有检索到路径')
    }
  }
  // 查找路径
  this.searchPathByDFSNOTRecursion = () => {
    // 储存查找到的路径
    this.data.path = new Array()
    for (let i = 0; i < this.data.M; i++) {
      this.data.path[i] = new Array()
    }
    // 查找
    if (!this.findByDFSNOTRecursion(this.data.entryX, this.data.entryY)) {
      console.log('没有检索到路径')
    }
  }
  // 查找路径
  this.searchPathByBFS = () => {
    // 储存查找到的路径
    this.data.path = new Array()
    for (let i = 0; i < this.data.M; i++) {
      this.data.path[i] = new Array()
    }
    // 查找
    if (!this.findByBFS(this.data.entryX, this.data.entryY)) {
      console.log('没有检索到路径')
    }
  }

  // 深度优先遍历递归-检索路径
  this.findByDFSRecursion = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }
    // 判断是否为出口
    if (x == this.data.exitX && y == this.data.exitY) {
      return true
    }

    this._setSearchData(x, y, true)
    // 遍历四个方向
    for (let i = 0; i < dirArr.length; i++) {
      let newX = x + dirArr[i][0]
      let newY = y + dirArr[i][1]
      if (this.data.inArea(newX, newY) && !this.data.searchVisited[newX][newY] && this.data.isRoad(this.data.maze[newX][newY])) {
        if (this.findByDFSRecursion(newX, newY)) {
          return true
        }
      }
    }

    this._setSearchData(x, y, false)

    return false
  }

  // 深度优先遍历非递归-检索路径
  this.findByDFSNOTRecursion = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }

    this.data.path[x][y] = new PositionBySearchPath(x, y, false, null)
    // 判断是否为出口
    if (x == this.data.exitX && y == this.data.exitY) {
      return true
    }

    // 使用栈
    let stack = new Array()
    stack.unshift(new Position(x, y))
    this._setSearchData(x, y, true)
    while (stack.length > 0) {
      let p = stack.shift()
      if (p.x == this.data.exitX && p.y == this.data.exitY) {
        this._setSearchData(p.x, p.y, true)
        return true
      }
      for (let i = 0; i < dirArr.length; i++) {
        let newX = p.x + dirArr[i][0]
        let newY = p.y + dirArr[i][1]
        if (this.data.inArea(newX, newY) && !this.data.searchVisited[newX][newY] && this.data.isRoad(this.data.maze[newX][newY])) {
          this.data.path[newX][newY] = new PositionBySearchPath(newX, newY, false, p)
          stack.unshift(new Position(newX, newY))
          this._setSearchData(newX, newY, false)
        }
      }
    }
    return false
  }

  // 广度优先遍历-检索路径
  this.findByBFS = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }

    this.data.path[x][y] = new PositionBySearchPath(x, y, false, null)
    // 判断是否为出口
    if (x == this.data.exitX && y == this.data.exitY) {
      return true
    }

    // 使用队列
    let queue = new Array()
    queue.push(new Position(x, y))
    this._setSearchData(x, y, true)
    while (queue.length > 0) {
      let p = queue.shift()
      if (p.x == this.data.exitX && p.y == this.data.exitY) {
        this._setSearchData(p.x, p.y, true)
        return true
      }
      for (let i = 0; i < dirArr.length; i++) {
        let newX = p.x + dirArr[i][0]
        let newY = p.y + dirArr[i][1]
        if (this.data.inArea(newX, newY) && !this.data.searchVisited[newX][newY] && this.data.isRoad(this.data.maze[newX][newY])) {
          this.data.path[newX][newY] = new PositionBySearchPath(newX, newY, false, p)
          queue.push(new Position(newX, newY))
          this._setSearchData(newX, newY, false)
        }
      }
    }
    return false
  }

  // 深度优先遍历（递归）
  this.goByDFSRecursion = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }
    this.data.setVisited(x, y)
    // 遍历该方格的上下左右四个方向，都去走一遍
    for (let i = 0; i < dirArr.length; i++) {
      let newX = x + dirArr[i][0] * 2 // 跳两格，中间的一格是墙
      let newY = y + dirArr[i][1] * 2
      if (this.data.inArea(newX, newY) && !this.data.visited[newX][newY]) {
        // 打破中间的墙
        this._setData(x + dirArr[i][0], y + dirArr[i][1])
        this.goByDFSRecursion(newX, newY)
      }
    }
  }

  // 深度优先遍历（非递归）
  this.goByDFSNOTRecursion = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }

    // 使用`栈`结构，先入先出
    let stack = new Array()
    stack.unshift(new Position(x, y)) // 入栈
    this.data.setVisited(x, y)
    while (stack.length > 0) {
      let p = stack.shift()
      for (let i = 0; i < dirArr.length; i++) {
        let newX = p.x + dirArr[i][0] * 2
        let newY = p.y + dirArr[i][1] * 2
        if (this.data.inArea(newX, newY) && !this.data.visited[newX][newY]) {
          // 打破中间的墙
          this._setData(p.x + dirArr[i][0], p.y + dirArr[i][1])
          stack.unshift(new Position(newX, newY))
          this.data.setVisited(newX, newY)
        }
      }
    }
  }

  // 广度优先遍历
  this.goByBFS = (x, y) => {

    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }

    // 使用`队列`结构，先入后出
    let queue = new Array()
    queue.push(new Position(x, y))
    this.data.setVisited(x, y)
    while (queue.length > 0) {
      // 出队
      let p = queue.shift()
      for (let i = 0; i < dirArr.length; i++) {
        let newX = p.x + dirArr[i][0] * 2
        let newY = p.y + dirArr[i][1] * 2
        if (this.data.inArea(newX, newY) && !this.data.visited[newX][newY]) {
          this._setData(p.x + dirArr[i][0], p.y + dirArr[i][1])
          queue.push(new Position(newX, newY))
          this.data.setVisited(newX, newY)
        }
      }
    }
  }

  // 使用随机队列
  this.goByRandomQueue = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }

    let randomQueue = new RandomQueue()
    randomQueue.add(new Position(x, y))
    this.data.setVisited(x, y)
    while (!randomQueue.isEmpty()) {
      let p = randomQueue.remove()
      for (let i = 0; i < dirArr.length; i++) {
        let newX = p.x + dirArr[i][0] * 2
        let newY = p.y + dirArr[i][1] * 2
        if (this.data.inArea(newX, newY) && !this.data.visited[newX][newY]) {
          this._setData(p.x + dirArr[i][0], p.y + dirArr[i][1])
          this.data.setVisited(newX, newY)
          randomQueue.add(new Position(newX, newY))
        }
      }
    }
  }

  // 使用随机队列, 结合深度和广度遍历思想
  this.goByRandomDFSANDBFSQueue = (x, y) => {
    if (!this.data.inArea(x, y)) {
      throw new Error('索引越界')
    }

    let randomQueue = new RandowDFSANDBFSQueue()
    randomQueue.add(new Position(x, y))
    this.data.setVisited(x, y)
    while (!randomQueue.isEmpty()) {
      let p = randomQueue.remove()
      for (let i = 0; i < dirArr.length; i++) {
        let newX = p.x + dirArr[i][0] * 2
        let newY = p.y + dirArr[i][1] * 2
        if (this.data.inArea(newX, newY) && !this.data.visited[newX][newY]) {
          this._setData(p.x + dirArr[i][0], p.y + dirArr[i][1])
          this.data.setVisited(newX, newY)
          randomQueue.add(new Position(newX, newY))
        }
      }
    }
  }

  this._setData = (x, y) => {
    if (this.data.inArea(x, y)) {
      // 设为路
      this.data.setRoad(x, y)
      // 加入到渲染队列
      renderQueue.add(new Position(x, y))
    }
  }

  this._setSearchData = (x, y, isPath) => {
    if (this.data.inArea(x, y)) {
      // 设为路
      this.data.setSearchVisited(x, y)
      this.data.isPath[x][y] = isPath
      // 加入到渲染队列
      renderSearchPathQueue.add(new PositionBySearchPath(x, y, isPath))
    }
  }

  // 定时渲染(生成迷宫)
  this.render = () => {
    renderInterval = window.setInterval(() => {
      if (renderQueue.isEmpty()) {
        window.clearInterval(renderInterval)
        this.isMaking = false
        return
      }
      let data = renderQueue.remove()
      this.frame.draw(data)
    }, DELAY)
  }

  // 检索迷宫路径
  this.renderSearchPath = () => {
    renderInterval = window.setInterval(() => {
      if (renderSearchPathQueue.isEmpty()) {
        this.isSearching = false
        window.clearInterval(renderInterval)

        _renderPath()
        return
      }
      let data = renderSearchPathQueue.remove()
      this.frame.draw(data)
    }, DELAY)

    let _renderPath = () => {
      if (!this.data.path) {
        return
      }
      let pos = this.data.path[this.data.exitX][this.data.exitY]
      while (pos) {
        this.data.isPath[pos.x][pos.y] = true
        if (!pos.prevPos) {
          break
        }
        pos = this.data.path[pos.prevPos.x][pos.prevPos.y]
      }
      this.frame.draw(this.data)
    }
  }
}

// 位置
function Position (x, y) {
  this.x = x
  this.y = y
}

// 随机队列, 队尾入堆，随机出队
function RandomQueue () {

  this.data = new Array()

  // 入队
  this.add = (ele) => {
    this.data.push(ele)
  }
  // 出队
  this.remove = () => {
    if (this.data.length == 0) {
      throw new Error('队列为空')
    }
    // 随机选择一个索引
    let randomIndex = parseInt(Math.random() * this.data.length)
    // 记录该值
    let randomD = this.data[randomIndex]
    // 与最后一个元素进行交换
    this.data[randomIndex] = this.data[this.data.length - 1]
    // 删除最后一个元素
    this.data.pop()
    // 返回该随机索引对应的值
    return randomD
  }

  // 清空队列
  this.clear = () => {
    this.data.splice(0, this.queue.length)
  }

  // 队列是否为空
  this.isEmpty = () => {
    return this.data.length === 0
  }

}

// 随机队列，深度和广度结合
function RandowDFSANDBFSQueue () {
  this.data = new Array()

  // 入队, 随机入队首和队尾
  this.add = (ele) => {
    if (Math.random() < 0.5) {
      this.data.push(ele)
    } else {
      this.data.unshift(ele)
    }

  }
  // 出队, 随机出队首和队尾
  this.remove = () => {
    if (this.data.length == 0) {
      throw new Error('队列为空')
    }

    if (Math.random() < 0.5) {
      return this.data.pop()
    } else {
      return this.data.shift()
    }

  }
  // 清空队列
  this.clear = () => {
    this.data.splice(0, this.queue.length)
  }
  // 队列是否为空
  this.isEmpty = () => {
    return this.data.length === 0
  }
}

// 用于渲染的队列
function RenderQueue (initData) {
  this.initData = initData // 初始化的数据

  this.queue = new Array() // 渲染队列

  // p 是一个Position元素
  this.add = (p) => {
    this.queue.push(p)
  }

  this.remove = () => {
    if (this.isEmpty()) {
      throw new Error('数据为空')
    }
    let p = this.queue.shift()
    this.initData.setRoad(p.x, p.y)
    return this.initData
  }

  // 清空队列
  this.clear = () => {
    this.queue.splice(0, this.queue.length)
  }
  this.isEmpty = () => {
    return this.queue.length === 0
  }

}

// 位置,用于检索路径
function PositionBySearchPath (x, y, isPath, prevPos = null) {
  this.x = x
  this.y = y
  this.isPath = isPath
  this.prevPos = prevPos // 上一个位置
}

// 用于渲染路径搜索的队列(递归算法)
function RenderSearchPathQueue (initData) {
  this.initData = initData // 初始化的数据

  this.queue = new Array() // 渲染队列

  // p 是一个PositionBySearchPath元素
  this.add = (p) => {
    this.queue.push(p)
  }

  this.remove = () => {
    if (this.isEmpty()) {
      throw new Error('数据为空')
    }
    let p = this.queue.shift()
    this.initData.setSearchVisited(p.x, p.y)
    this.initData.isPath[p.x][p.y] = p.isPath
    return this.initData
  }

  this.isEmpty = () => {
    return this.queue.length === 0
  }

}
