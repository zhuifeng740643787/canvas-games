/**
 * Created by gongyidong on 2018/2/5.
 */
// 模型层 M行N列的数据
let Model = function (M, N) {
  const WALL = '#' // 墙
  const ROAD = ' ' // 路

  if (M <= 0 || N <= 0) {
    window.alert('行数和列数必须为正整数')
    throw new Error('行数和列数必须为正整数')
  }
  // M，N必须为奇数
  if (M % 2 === 0 || N % 2 === 0) {
    window.alert('行数和列数必须为奇数')
    throw new Error('行数和列数必须为奇数')
  }

  this.M = parseInt(M) // 行数
  this.N = parseInt(N) // 列数
  this.entryX = 1 // 入口X索引
  this.entryY = 0 // 入口Y索引
  this.exitX = this.M - 2 // 出口X索引
  this.exitY = this.N - 1 // 出口Y索引
  this.maze = new Array() // 墙和路的数据
  this.visited = new Array() // 是否被访问过
  this.searchVisited = new Array() // 是否在查找路径时被访问过
  this.isPath = new Array() // 是否为路径
  this.isOpen = new Array() // 是否打开
  // 初始化数据,最外层的四周都是墙（除入口和出口外）
  for (let i = 0; i < this.M; i++) {
    this.maze[i] = new Array()
    this.visited[i] = new Array()
    this.searchVisited[i] = new Array()
    this.isPath[i] = new Array()
    this.isOpen[i] = new Array()
    for (let j = 0; j < this.N; j++) {
      // 设置路和墙
      if (i % 2 == 1 && j % 2 == 1) {
        this.maze[i][j] = ROAD
      } else {
        this.maze[i][j] = WALL
      }
      // 初始化都未被访问过
      this.visited[i][j] = false
      this.searchVisited[i][j] = false
      this.isPath[i][j] = false
      this.isOpen[i][j] = false
    }
  }
  this.maze[this.entryX][this.entryY] = ROAD
  this.maze[this.exitX][this.exitY] = ROAD
  this.visited[this.entryX][this.entryY] = true
  this.visited[this.exitX][this.exitY] = true
  this.isPath[this.entryX][this.entryY] = true
  this.isPath[this.exitX][this.exitY] = true

  // 克隆数据
  this.clone = () => {
    let d = new Model(this.M, this.N)
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        d.maze[i][j] = this.maze[i][j]
        d.visited[i][j] = this.visited[i][j]
        d.searchVisited[i][j] = this.searchVisited[i][j]
        d.isPath[i][j] = this.isPath[i][j]
        d.isOpen[i][j] = this.isOpen[i][j]
      }
    }
    return d
  }

  this.setRoad = (x, y) => {
    if (!this.inArea(x, y)) {

      throw new Error('索引越界')
    }
    this.maze[x][y] = ROAD
    // 相邻的四个格子的八个方向上都设为可见
    let dirArr = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    for (let d = 0; d < dirArr.length; d ++) {
      let dirX = x + dirArr[d][0]
      let dirY = y + dirArr[d][1]
      if (!this.inArea(dirX, dirY)) {
        continue
      }
      // 设置周边八个方向的元素为可见
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let newX = dirX + i
          let newY = dirY + j
          if (this.inArea(newX, newY)) {
            this.isOpen[newX][newY] = true
          }
        }
      }
    }
  }

  this.setVisited = (x, y) => {
    if (!this.inArea(x, y)) {

      throw new Error('索引越界')
    }
    this.visited[x][y] = true
  }

  this.setSearchVisited = (x, y) => {
    if (!this.inArea(x, y)) {

      throw new Error('索引越界')
    }
    this.searchVisited[x][y] = true
  }

  // 是否在区域内
  this.inArea = (x, y) => {
    return x >= 0 && x < this.M && y >= 0 && y < this.N
  }

  // 是否为墙
  this.isWall = (d) => {
    return d === WALL
  }
  // 是否为路
  this.isRoad = (d) => {
    return d === ROAD
  }

  // 清空路径
  this.clearPath = () => {
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        this.searchVisited[i][j] = false
        this.isPath[i][j] = false
      }
    }
    this.isPath[this.entryX][this.entryY] = true
    this.isPath[this.exitX][this.exitY] = true
  }

}
