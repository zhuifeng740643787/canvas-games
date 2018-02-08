/**
 * Created by gongyidong on 2018/2/5.
 */
// 控制层, M行N列
let Controller = function (stepNum, boxData, blockSide = 50) {
  stepNum = parseInt(stepNum)
  blockSide = Math.max(parseInt(blockSide), 50)
  if (typeof boxData != 'object' || boxData.length === 0 || boxData[0].length == 0) {
    throw new Error('箱子区域不能为空')
  }
  // 初始化数据
  this.data = new Model(stepNum, boxData)
  this.dataCopy = null
  let M = boxData.length, N = boxData[0].length
  let canvasWidth = N * blockSide
  let canvasHeight = M * blockSide
  this.frame = new Frame(canvasWidth, canvasHeight)
  this.isMaking = false // 是否在生成雷区中

  // 析构函数
  this.__destructor__ = () => {
    if (!this.data) {
      return
    }
    this.data = null
    this.frame.clear()
    this.frame = null
    delete this
  }

  // 生成
  this.make = () => {
    this.frame.draw(this.data)
  }

  // 重玩
  this.play = () => {
  }


}

