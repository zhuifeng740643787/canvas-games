/**********************************************
 分形图:
 1、自相似
 2、树
 3、递归
 ************************************************/


window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      controller: null,
      option: {
        width: 400, // 行数
        height: 400, // 列数
        depth: 5, // 递归深度
        angle: 60, // 角度
        delay: 500, // 延迟毫秒数
        method: 6, // 绘制方法
      }
    },
    computed: {
      // 是否可绘制
      canDraw: function () {
        return this.option.width > 0 && this.option.height > 0 && this.option.depth > 0 && this.option.delay > 0 && this.option.method > 0
      },
      // 是否显示深度选项
      showDepthOption: function() {
        return this.option.method != 1
      },
      // 是否显示角度选项
      showAngleOption: function() {
        return this.option.method == 4 || this.option.method == 5 || this.option.method == 6
      }
    },
    methods: {
      // 绘制
      handleDraw: function () {
        if (this.controller) {
          this.controller.__destructor__()
          this.controller = null
        }
        this.controller = new Controller(this.option.width, this.option.height, this.option.depth, this.option.angle, this.option.delay)
        this.controller.draw(this.option.method)
      }
    },
    mounted: function () {
      // 添加键盘事件
      window.addEventListener('keyup', (event) => {
        // 按下空格键，暂停 / 继续
        if (event.keyCode == 32 && this.controller) {
          console.log(123)
        }
      })
    }
  })

}

