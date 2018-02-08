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
      },
      boxData: { // 箱子的数据
        stepNum: 1, // 步数
        data: [], // 数据
        M: 0, // 行数
        N: 0, // 列数
      }
    },
    computed: {
      canMake: function () {
        return this.option.rowNum > 0 && this.option.colNum > 0 && this.option.blockSide > 0 && this.option.mineNum > 0
      }, // 是否可生成雷区
      canPlay: function () {
        return this.controller && !this.controller.isMaking
      },
      isPlaySuccess: function () {
        return this.controller ? this.controller.playSuccess : false
      }
    },
    methods: {
      // 读取文件内容
      _readTextFile: function (file) {
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = () => {
          if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
              let arr = rawFile.responseText.split("\n")
              if (arr.length <= 1) {
                throw new Error('数据有误')
              }
              this.boxData.stepNum = parseInt(arr[0])
              this.boxData.M = arr.length - 1
              this.boxData.N = arr[1].length
              for (let i = 1; i < arr.length; i++) {
                if (arr[i].length !== this.boxData.N) {
                  throw new Error('列数不一致')
                }
                this.boxData.data.push(arr[i].split(''))
              }
              if (this.controller) {
                this.controller.__destructor__()
                this.controller = null
              }
              this.controller = new Controller(this.boxData.stepNum, this.boxData.data)
              this.controller.make()
            }
          }
        }
        rawFile.send(null);
      },
      // 生成
      handleMake: function () {
        // 读取文件
        this._readTextFile('./level_01.txt')
      },
      // 重玩
      handlePlay: function () {
        if (!this.controller || this.controller.isMaking) {
          return
        }
        this.controller.play()
      },
      // 成功或失败的回调
      palyCallback: function (isSuccess) {
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
      this.handleMake()
    }
  })

}
