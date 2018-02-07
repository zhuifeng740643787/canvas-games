/**********************************************
 迷宫的定义:
 1、只有一个出口和入口(1,0) 和 (m-2, n-1)
 2、只有一条路径(没有环)
 3、路径是连续的
 4、墙和路都占用一个单元格
 5、绘制在一个方形画布上
 ************************************************/


window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      controller: null,
      option: {
        rowNum: 51, // 行数
        colNum: 51, // 列数
        blockSide: 10, // 方格尺寸
        delay: 20, // 延迟毫秒数
        makeMethod: 1, // 生成迷宫算法
        findPathMethod: 1, // 寻路算法
      }
    },
    computed: {
      canMake: function() {
        return this.option.rowNum > 0 && this.option.colNum > 0 && this.option.blockSide > 0
      }, // 是否可生成迷宫
      canFindPath: function() {
        return this.controller && !this.controller.isMaking && !this.controller.isSearching
      }, // 是否可寻找路径
    },
    methods: {
      // 生成迷宫
      handleMakeMaze: function() {
        if (this.controller) {
          this.controller.__destructor__()
          this.controller = null
        }
        this.controller = new Controller(this.option.rowNum, this.option.colNum, this.option.blockSide, this.option.delay)
        this.controller.make(this.option.makeMethod)
      },
      // 路径检索
      handleFindPath: function() {
        this.controller.clearPath()
        this.controller.findPath(this.option.findPathMethod)
      }
    }
  })

}

