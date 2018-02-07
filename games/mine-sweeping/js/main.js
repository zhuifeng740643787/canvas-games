/**********************************************
 扫雷游戏:
  洗牌算法
  floodfill算法
 ************************************************/


window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      controller: null,
      option: {
        rowNum: 20, // 行数
        colNum: 20, // 列数
        mineNum: 20, // 雷的个数
        blockSide: 25, // 方格尺寸
      }
    },
    computed: {
      canMake: function() {
        return this.option.rowNum > 0 && this.option.colNum > 0 && this.option.blockSide > 0 && this.option.mineNum > 0
      }, // 是否可生成雷区
      canPlay: function() {
        return this.controller && !this.controller.isMaking
      },
      isPlaySuccess: function() {
        return this.controller ? this.controller.playSuccess : false
      }
    },
    methods: {
      // 生成迷宫
      handleMakeMaze: function() {
        if (this.controller) {
          this.controller.__destructor__()
          this.controller = null
        }
        this.controller = new Controller(this.option.rowNum, this.option.colNum, this.option.mineNum, this.option.blockSide, this.palyCallback)
        this.controller.make()
      },
      // 重玩
      handlePlay: function () {
        if (!this.controller || this.controller.isMaking) {
          return
        }
        this.controller.play()
      },
      // 成功或失败的回调
      palyCallback: function(isSuccess) {
        if (isSuccess) {
          document.querySelector('.tip-modal').classList.add('show', 'haha')
        } else {
          document.querySelector('.tip-modal').classList.add('show', 'asdjlak')
        }
        setTimeout(() => {
          document.querySelector('.tip-modal').classList.remove('show')
        }, 3000)
      }

    },
    mounted: function () {
      this.handleMakeMaze()
    }
  })

}

