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
        rowNum: 10, // 行数
        colNum: 7, // 列数
        stepNum: 1, // 雷的个数
        blockSide: 50, // 方格尺寸
      },
      colorBoxes: [], // 箱子
      dragBox: null, // 拖拽对象
      boxData: [], // 箱子数据,
      answer: [], // 答案
    },
    computed: {
      canMake: function () {
        return this.option.rowNum > 0 && this.option.colNum > 0 && this.option.blockSide > 0 && this.option.stepNum > 0
      }, // 是否可制作关卡
      isMaking: function () {
        return this.controller && this.controller.isMaking
      },
      canPlay: function () {
        return this.controller && !this.controller.isMaking
      },
      isPlaySuccess: function () {
        return this.answer.length > 0
      }
    },
    methods: {
      // 获取箱子数据
      initBoxData: function () {
        let data = new Array()
        for (let i = 0; i < this.option.rowNum; i++) {
          data[i] = new Array()
          for (let j = 0; j < this.option.colNum; j++) {
            data[i][j] = '*'
          }
        }
        this.boxData = data
      },

      // 生成
      handleMake: function () {
        if (this.isMaking) {
          this.handleFinishMake()
          return
        }

        // 开始制作
        if (!this.controller) {
          this.initBoxData()
        }

        this.controller = new Controller(this.option.stepNum, this.boxData)
      },
      handleClearAndMake: function () {
        if (this.controller) {
          this.controller.__destructor__()
          this.controller = null
        }
        this.initBoxData()
        this.controller = new Controller(this.option.stepNum, this.boxData)
      },
      handleFinishMake: function () {
        this.controller.finishMaking()
      },
      // 重玩
      handlePlay: function () {
        if (!this.controller || this.controller.isMaking) {
          return
        }
        this.answer = []
        this.controller.play(this.playCallback)
      },
      // 成功或失败的回调
      playCallback: function (answer) {
        this.answer = answer
        document.querySelector('.tip-modal').classList.add('show')
        setTimeout(() => {
          document.querySelector('.tip-modal').classList.remove('show')
        }, 3000)
        console.log(this.answer)
      },
      // 拖拽箱子
      dragAndDropBox: function () {
        let canvas = this.$refs.canvas
        // 拖拽开始
        document.addEventListener("dragstart", (event) => {
          if (!this.isMaking) {
            event.preventDefault()
            return
          }
          if (!event.target.classList.contains('drag-box')) {
            this.dropBox = null
            return
          }
          this.dropBox = {
            target: event.target,
            offsetX: event.offsetX,
            offsetY: event.offsetY,
          }
        });
        // 必须要写，需要禁用默认事件
        document.addEventListener("dragover", (event) => {
          event.preventDefault();
        }, false);
        // 拖拽结束
        document.addEventListener("drop", (event) => {
          if (!this.isMaking) {
            return
          }
          event.preventDefault();
          if (!this.dropBox || event.target.id != 'ui-layer') {
            return
          }
          // 设置数据
          // 使用offsetX, offsetY
          let x = parseInt((event.offsetY - this.dropBox.offsetY + this.option.blockSide / 2) / this.option.blockSide)
          let y = parseInt((event.offsetX - this.dropBox.offsetX + this.option.blockSide / 2) / this.option.blockSide)
          this.boxData[x][y] = this.dropBox.target.getAttribute('value')
          this.controller.updateData(this.option.stepNum, this.boxData)
        });
      }

    },
    mounted: function () {
      this.handleMake()
      this.colorBoxes = helpers.colors

      this.dragAndDropBox()
    }
  })

}
