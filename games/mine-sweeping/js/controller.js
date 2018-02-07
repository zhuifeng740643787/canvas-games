/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列的迷宫
let Controller = function (M, N, mineNum, blockSide = 25, playCallback) {
  M = parseInt(M)
  N = parseInt(N)
  mineNum = parseInt(mineNum)
  blockSide = Math.max(parseInt(blockSide), 20)
  // 初始化数据
  this.data = new Model(M, N, mineNum)
  this.dataCopy = null
  let canvasWidth = N * blockSide
  let canvasHeight = M * blockSide
  this.frame = new Frame(canvasWidth, canvasHeight)
  this.isMaking = false // 是否在生成雷区中
  this.playSuccess = false // 是否是扫雷成功
  this.playFailure = false // 是否是扫雷失败
  this.playCallback = playCallback // 玩游戏成功与否时的回调
  // 设置左键点击监听器
  this.leftClickListener = (e) => {
    if (e.button == 0) {
      this._click(e.offsetY, e.offsetX, true)
    }
  }
  this.frame.canvas.addEventListener('mousedown', this.leftClickListener)

  // 设置右键点击监听器同时屏蔽右键菜单
  this.rightClickListener = (e) => {
    // 兼容IE
    if (document.all) {
      window.event.returnValue = false
    } else {
      e.preventDefault()
    }
    this._click(e.offsetY, e.offsetX, false)
  }
  this.frame.canvas.addEventListener('contextmenu', this.rightClickListener)

  // 点击事件
  this._click = (posX, posY, isLeftClick = true) => {
    // 判断是否还在生成雷区中
    if (this.isMaking) {
      return
    }
    let x = parseInt(posX / blockSide)
    let y = parseInt(posY / blockSide)

    // 是否已打开且已成功或失败
    if (this.playSuccess || this.playFailure || this.data.open[x][y]) {
      return
    }

    // 处理右键点击
    if (!isLeftClick) {
      if (this.data.open[x][y]) {
        return
      }
      this.data.flags[x][y] = !this.data.flags[x][y]
    } else {
      // 处理左键点击
      if (this.data.flags[x][y]) {
        return
      }
      if (this.data.mine[x][y]) {
        // game over
        console.log('Game Over')
        this.data.setFailure(x, y) // 设为失败
        this.playFailure = true
        this.playCallback(false)
      } else {
        this.data.openBlock(x, y)
      }
    }
    this.frame.draw(this.data)
    // 检查是否成功
    if (this.data.isSuccess()) {
      this.playSuccess = true
      this.playCallback(true)
    }
  }
  // 析构函数
  this.__destructor__ = () => {
    if (!this.data) {
      return
    }
    this.data = null
    this.frame.clear()
    this.frame.canvas.removeEventListener('mousedown', this.leftClickListener)
    this.frame.canvas.removeEventListener('contextmenu', this.rightClickListener)
    this.frame = null
    delete this
  }

  // 生成雷区
  this.make = () => {
    this.isMaking = true
    this.data.generate()
    this.dataCopy = this.data.clone()
    this.frame.draw(this.data)
    this.isMaking = false
  }

  // 重玩
  this.play = () => {
    this.playSuccess = false
    this.playFailure = false
    this.data = this.dataCopy.clone()
    this.frame.draw(this.data)
  }


}

