/**
 * Created by gongyidong on 2018/2/5.
 */
// 模型层 M行N列的数据
let MazeData = function (M, N) {
  const WALL = '#' // 墙
  const ROAD = ' ' // 路

  if (M <= 0 || N <= 0) {
    throw new Error('行数和列数必须为正整数')
  }
  // M，N必须为奇数
  if (M % 2 === 0 || N % 2 === 0) {
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
  // 初始化数据,最外层的四周都是墙（除入口和出口外）
  for (let i = 0; i < this.M; i++) {
    this.maze[i] = new Array()
    this.visited[i] = new Array()
    for (let j = 0; j < this.N; j++) {
      // 设置路和墙
      if (i % 2 == 1 && j % 2 == 1) {
        this.maze[i][j] = ROAD
      } else {
        this.maze[i][j] = WALL
      }
      // 初始化都未被访问过
      this.visited[i][j] = false
    }
  }
  this.maze[this.entryX][this.entryY] = ROAD
  this.maze[this.exitX][this.exitY] = ROAD
  this.visited[this.entryX][this.entryY] = true
  this.visited[this.exitX][this.exitY] = true

  this.clone = () => {
    let d = new MazeData(this.M, this.N)
    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.M; j++) {
        d.maze[i][j] = this.maze[i][j]
        d.visited[i][j] = this.visited[i][j]
      }
    }
    return d
  }

  this.setRoad = (x, y) => {
    if (!this.inArea(x, y)) {

      throw new Error('索引越界')
    }
    this.maze[x][y] = ROAD
  }

  this.setVisited = (x, y) => {
    if (!this.inArea(x, y)) {

      throw new Error('索引越界')
    }
    this.visited[x][y] = true
  }

  // 是否在区域内
  this.inArea = (x, y) => {
    return x >= 0 && x < this.N && y >= 0 && y < this.M
  }

  // 是否为墙
  this.isWall = (d) => {
    return d === WALL
  }
  // 是否为路
  this.isRoad = (d) => {
    return d === ROAD
  }

}
