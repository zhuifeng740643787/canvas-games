/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列的迷宫
let Controller = function (M, N) {
  const BLOCK_SIDE = 8 // 方格的尺寸
  const DELAY = 50 // 延迟毫秒数
  M = parseInt(M)
  N = parseInt(N)
  // 初始化数据
  this.data = new MazeData(M, N)

  let canvasWidth = N * BLOCK_SIDE
  let canvasHeight = M * BLOCK_SIDE
  this.frame = new Frame(canvasWidth, canvasHeight)
  let dirArr = [[-1, 0], [0, 1], [1, 0], [0, -1]] // 上右下左遍历顺序
  let renderQueue = new Array() // 用于渲染的队列
  let isMaking = false // 是否在创建迷宫中

  window.addEventListener('keydown', (e) => {
    // 检索路径
    if (e.keyCode == '32' && !isMaking) {
      this.searchPath(this.data.entryX, this.data.entryY)
    }
  })

  this.run = () => {
    isMaking = true
    this.frame.draw(this.data)
    let hash = window.location.hash
    switch (hash) {
      case '#1':
        // 深度优先遍历（递归）, 从入口之后的第一个方格开始
        document.title = '深度优先遍历(递归)'
        this.goByDFSRecursion(this.data.entryX, this.data.entryY + 1)
        break
      case '#2':
        // 深度优先遍历（非递归）
        document.title = '深度优先遍历(非递归)'
        this.goByDFSNOTRecursion(this.data.entryX, this.data.entryY + 1)
        break
      case '#3':
        // 广度优先遍历
        document.title = '广度优先遍历'
        this.goByBFS(this.data.entryX, this.data.entryY + 1)
        break
      case '#4':
        // 随机队列
        document.title = '随机队列'
        this.goByRandomQueue(this.data.entryX, this.data.entryY + 1)
        break
      case '#5':
        // 随机队列
        document.title = '随机队列, 结合深度和广度优先遍历思想'
        this.goByRandomDFSANDBFSQueue(this.data.entryX, this.data.entryY + 1)
        break
      default:
        // 调试
        document.title = '调试'
        this.test(this.data.entryX, this.data.entryY + 1)
        break
    }

    // 延迟开始渲染
    setTimeout(() => {
      this.render()
    }, 500)

  }

  // 查找路径
  this.searchPath = (x, y) => {



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
        this._setData(p.x + dirArr[i][0], p.y + dirArr[i][1])
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


  // 调试
  this.test = (x, y) => {
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
        this.test(newX, newY)
      }
    }
  }

  this._setData = (x, y) => {
    if (this.data.inArea(x, y)) {
      // 设为路
      this.data.setRoad(x, y)
      // 加入到渲染队列
      renderQueue.push(this.data.clone())
    }
  }

  // 定时渲染
  this.render = () => {
    let interval = window.setInterval(() => {
      if (renderQueue.length == 0) {
        window.clearInterval(interval)
        isMaking = false
        return
      }
      let data = renderQueue.shift()
      this.frame.draw(data)
    }, DELAY)
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

  // 队列是否为空
  this.isEmpty = () => {
    return this.data.length === 0
  }
}