/**
 * Created by gongyidong on 2018/2/5.
 */
// 同心圆
let CircleModel = function (x, y, r, d, step) {
  this.centerX = x // 圆心坐标
  this.centerY = y // 圆心坐标
  this.startR = r // 初始半径
  this.depth = d  // 递归深度
  this.step = step  // 步长
}
