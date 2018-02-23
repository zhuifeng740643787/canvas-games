/**********************************************
 扫雷游戏:
 洗牌算法
 floodfill算法
 ************************************************/
const EMPTY = '*'
const STORAGE_BOX_DATA_KEY = 'BOX_DATA'
const STORAGE_OPTION_KEY = 'OPTION_DATA'
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
      movedBox: null, // 移动对象
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
      // 初始化箱子数据
      initBoxData: function () {
        if (window.localStorage.getItem(STORAGE_OPTION_KEY)) {
          this.option = JSON.parse(window.localStorage.getItem(STORAGE_OPTION_KEY))
        }
        if (window.localStorage.getItem(STORAGE_BOX_DATA_KEY)) {
          this.boxData = JSON.parse(window.localStorage.getItem(STORAGE_BOX_DATA_KEY))
          return
        }
        let data = new Array()
        for (let i = 0; i < this.option.rowNum; i++) {
          data[i] = new Array()
          for (let j = 0; j < this.option.colNum; j++) {
            data[i][j] = EMPTY
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

        this.controller = new Controller(this.option.stepNum, this.boxData, this.option.blockSide)
      },
      // 重新制作
      handleClearAndMake: function () {
        if (this.controller) {
          this.controller.__destructor__()
          this.controller = null
        }
        window.localStorage.removeItem(STORAGE_OPTION_KEY)
        window.localStorage.removeItem(STORAGE_BOX_DATA_KEY)
        this.initBoxData()
        this.controller = new Controller(this.option.stepNum, this.boxData, this.option.blockSide)
      },
      handleFinishMake: function () {
        this.controller.finishMaking()
        window.localStorage.setItem(STORAGE_OPTION_KEY, JSON.stringify(this.option))
        window.localStorage.setItem(STORAGE_BOX_DATA_KEY, JSON.stringify(this.boxData))
      },
      // 重玩
      handleSearchSolve: function () {
        if (!this.controller || this.controller.isMaking) {
          return
        }
        this.answer = []
        this.controller.searchSolve(this.solveCallback)
      },
      // 成功或失败的回调
      solveCallback: function (answer, message) {
        this.answer = answer
        document.querySelector('.tip-modal').classList.add('show')
        if (message) {
          document.querySelector('.tip-modal span').textContent = message
        }
        setTimeout(() => {
          document.querySelector('.tip-modal').classList.remove('show')
        }, 3000)
      },
      // 拖拽箱子
      dragAndDropBox: function () {
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
      },
      // 移动箱子
      moveBox: function () {
        let isEmpty = (x, y) => {
          return this.isMaking && this.boxData[x][y] == EMPTY
        }

        let canvas = this.$refs.canvas
        // 按下鼠标
        canvas.addEventListener('mousedown', (event) => {
          let xIndex = parseInt(event.offsetY / this.option.blockSide)
          let yIndex = parseInt(event.offsetX / this.option.blockSide)
          if (isEmpty(xIndex, yIndex)) {
            event.preventDefault()
            this.movedBox = null
            return
          }
          this.movedBox = {
            offsetX: event.offsetX,
            offsetY: event.offsetY,
          }
        })
        // 移动鼠标
        canvas.addEventListener('mousemove', (event) => {
          if (!this.movedBox) {
            event.preventDefault()
            return
          }
        })
        // 抬起鼠标
        canvas.addEventListener('mouseup', (event) => {
          if (!this.movedBox) {
            event.preventDefault()
            return
          }
          let fromX = parseInt(this.movedBox.offsetY / this.option.blockSide)
          let fromY = parseInt(this.movedBox.offsetX / this.option.blockSide)
          let toX = parseInt(event.offsetY / this.option.blockSide)
          let toY = parseInt(event.offsetX / this.option.blockSide)
          if (this.isMaking) { // 制作中
            if (this.boxData[fromX][fromY] == this.boxData[toX][toY]) {
              return
            }
            // 按下alt表示复制, 否则为交换
            if (event.altKey) {
              this.boxData[toX][toY] = this.boxData[fromX][fromY]
            } else {
              let tmp = this.boxData[fromX][fromY]
              this.boxData[fromX][fromY] = this.boxData[toX][toY]
              this.boxData[toX][toY] = tmp
            }
            this.controller.updateData(this.option.stepNum, this.boxData)
          } else { // 游戏中
            this.controller.move(fromX, fromY, toX, toY)
          }
          this.movedBox = null
        })
      }

    },
    mounted: function () {
      this.handleMake()
      this.colorBoxes = helpers.colors
      this.dragAndDropBox()
      this.moveBox()
    }
  })

}
