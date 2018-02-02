window.onload = function () {
  draw1()
  draw2()
  draw3()
  draw4()
  draw5()
  window.addEventListener('keydown', function (e) {
    let code = e.keyCode
    let index = code - 49 + 1
    if (index < 0 || index > 9) {
      return
    }
    switchDraw(index)
  })
  switchDraw(1)
}

function switchDraw(index) {
  let canvasList = document.querySelectorAll('canvas')
  canvasList.forEach(function(item, i) {
    if (index == i + 1 && !item.classList.contains('active')) {
      item.classList.add('active')
    }
    if (index != i + 1 && item.classList.contains('active')) {
      item.classList.remove('active')
    }
  })

}
let draw1 = function () {
  let canvas = document.getElementById('canvas1');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  let bodyRect = document.body.getBoundingClientRect()
  canvas.width = Math.max(bodyRect.width - 100, 800)
  canvas.height = Math.max(bodyRect.height - 100, 800)
  let ctx = canvas.getContext('2d')

  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255,165,0, 0.5)'
  ctx.strokeStyle = '#0000ff'
  // ctx.setLineDash([5, 10]);
  // 填充矩形
  ctx.fillRect(25, 25, 100, 100);
  ctx.clearRect(45, 45, 60, 60);
  ctx.strokeRect(50, 50, 50, 50);
  // 绘制三角形
  ctx.beginPath();
  ctx.moveTo(200, 10);
  ctx.lineTo(400, 10);
  ctx.lineTo(300, 100);
  ctx.lineTo(200, 10);
  ctx.stroke();

  // 绘制圆弧
  ctx.beginPath()
  ctx.arc(500, 100, 50, 0, Math.PI, true);
  ctx.closePath()
  ctx.stroke();

  // 绘制直线
  ctx.beginPath();
  ctx.moveTo(600, 100);
  ctx.lineTo(700, 50);
  ctx.stroke();

  // 华丽的分割线
  ctx.beginPath();
  ctx.moveTo(0, 180)
  ctx.lineTo(800, 180)
  ctx.stroke()

  // 绘制二次贝塞尔曲线
  ctx.beginPath()
  ctx.moveTo(50, 300)
  ctx.quadraticCurveTo(100, 200, 200, 300);
  ctx.stroke()

  // 绘制三次贝塞尔曲线
  ctx.beginPath()
  ctx.moveTo(250, 300)
  ctx.bezierCurveTo(300, 200, 350, 380, 500, 300);
  ctx.stroke()

  // 绘制矩形
  ctx.beginPath()
  ctx.rect(550, 200, 100, 100)
  ctx.stroke()

  // 华丽的分割线
  ctx.beginPath();
  ctx.moveTo(0, 380)
  ctx.lineTo(800, 380)
  ctx.stroke()

  // Path2D
  let rectangle = new Path2D()
  rectangle.rect(10, 400, 100, 100);
  let circle = new Path2D()
  circle.arc(300, 500, 100, 0, Math.PI, true);

  ctx.stroke(rectangle)
  ctx.fill(circle)

  // SVG Path
  let p = new Path2D("M500 400 h 80 v 80 h -80 Z");
  ctx.stroke(p)

  // 颜色渐变
  // 线性渐变
  let linearGradient = ctx.createLinearGradient(10, 600, 10, 700)
  linearGradient.addColorStop(0, '#00ABEB');
  linearGradient.addColorStop(0.5, '#fff');
  linearGradient.addColorStop(0.5, '#26C000');
  linearGradient.addColorStop(1, '#fff');
  ctx.fillStyle = linearGradient
  ctx.beginPath()
  ctx.rect(10, 600, 100, 100)
  ctx.fill()

  // 绘制文本
  ctx.font = '20px serif'
  ctx.fillText('Hello啊', 200, 600)
  ctx.strokeText('你好啊', 200, 650)

  // 绘制图片
  let img = new Image()
  img.src = './images/1.jpg'
  img.onload = function () {
    // 绘制
    ctx.drawImage(img, 0, 0, 2000, 2000, 500, 500, 200, 200)
  }
}

let draw2 = function () {
  let canvas = document.getElementById('canvas2');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  let bodyRect = document.body.getBoundingClientRect()
  canvas.width = Math.max(bodyRect.width - 100, 800)
  canvas.height = Math.max(bodyRect.height - 100, 800)
  let ctx = canvas.getContext('2d')
  // translate 移动原点
  ctx.fillRect(0, 0, 300, 300);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.save();
      ctx.strokeStyle = "#9CFF00";
      ctx.fillStyle = "#9C0000";
      ctx.translate(50 + j * 100, 50 + i * 100);
      ctx.beginPath()
      ctx.arc(0, 0, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore();
    }
  }
  ctx.save()
  ctx.translate(100, 400)
  ctx.rotate(Math.PI * 2 / 30)
  // rotating 旋转
  ctx.fillRect(0, 0, 100, 100)
  ctx.restore()
  ctx.save()
  ctx.scale(0.8, 1.2)
  ctx.fillRect(400, 400, 100, 100)
  ctx.restore()
  ctx.save()
  // transform 变形
  let sin = Math.sin(Math.PI / 6);
  let cos = Math.cos(Math.PI / 6);
  ctx.translate(500, 100);
  let c1, c2, c3;
  for (let i = 0; i <= 12; i++) {
    c1 = Math.ceil(Math.random() * 255)
    c2 = Math.ceil(Math.random() * 255)
    c3 = Math.ceil(Math.random() * 255)
    ctx.fillStyle = "rgb(" + c1 + "," + c2 + "," + c3 + ")";
    ctx.fillRect(0, 0, 100, 10);
    ctx.transform(cos, sin, -sin, cos, 0, 0);
  }
  ctx.setTransform(-1, 0, 0, 1, 100, 100);
  ctx.restore()
  // clip 裁切
  ctx.save()
  ctx.translate(400, 400)
  ctx.fillStyle = '#ff0000'
  ctx.beginPath()
  ctx.arc(100, 100, 100, 0, Math.PI * 2)
  ctx.clip()
  ctx.fillRect(0, 0, 200, 200)
  ctx.restore()
  ctx.translate(0, 0)

}

let draw3 = function () {
  let canvas = document.getElementById('canvas3');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  let bodyRect = document.body.getBoundingClientRect()
  canvas.width = Math.max(bodyRect.width - 100, 800)
  canvas.height = Math.max(bodyRect.height - 100, 800)
  let ctx = canvas.getContext('2d')
  let img = new Image();

// User letiables - customize these to change the image being scrolled, its
// direction, and the speed.

  img.src = 'https://mdn.mozillademos.org/files/4553/Capitan_Meadows,_Yosemite_National_Park.jpg';
  let CanvasXSize = 800;
  let CanvasYSize = 200;
  let speed = 10; //lower is faster
  let scale = 1;
  let y = -4.5; //vertical offset

// Main program

  let dx = 0.75;
  let imgW;
  let imgH;
  let x = 0;
  let clearX;
  let clearY;

  img.onload = function () {
    imgW = img.width * scale;
    imgH = img.height * scale;
    if (imgW > CanvasXSize) { x = CanvasXSize - imgW; } // image larger than canvas
    if (imgW > CanvasXSize) { clearX = imgW; } // image larger than canvas
    else { clearX = CanvasXSize; }
    if (imgH > CanvasYSize) { clearY = imgH; } // image larger than canvas
    else { clearY = CanvasYSize; }
    //Get Canvas Element
    //Set Refresh Rate
    return setInterval(draw, speed);
  }

  function draw () {
    //Clear Canvas
    ctx.clearRect(0, 0, clearX, clearY);
    //If image is <= Canvas Size
    if (imgW <= CanvasXSize) {
      //reset, start from beginning
      if (x > (CanvasXSize)) { x = 0; }
      //draw aditional image
      if (x > (CanvasXSize - imgW)) { ctx.drawImage(img, x - CanvasXSize + 1, y, imgW, imgH); }
    }
    //If image is > Canvas Size
    else {
      //reset, start from beginning
      if (x > (CanvasXSize)) { x = CanvasXSize - imgW; }
      //draw aditional image
      if (x > (CanvasXSize - imgW)) { ctx.drawImage(img, x - imgW + 1, y, imgW, imgH); }
    }
    //draw image
    ctx.drawImage(img, x, y, imgW, imgH);
    //amount to move
    x += dx;
  }
}

let draw4 = function () {
  let canvas = document.getElementById('canvas4');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  let bodyRect = document.body.getBoundingClientRect()
  canvas.width = Math.max(bodyRect.width - 100, 800)
  canvas.height = Math.max(bodyRect.height - 100, 800)
  let ctx = canvas.getContext('2d')
  let offset = 50
  let canvasWidth = canvas.width - 2 * offset, canvasHeight = canvas.height - 2 * offset
  let raf //requestAnimationFrame
  let running = false // 是否在移动
  // 画布与浏览器的相对位置
  let canvasBoundingClientRect = canvas.getBoundingClientRect()
  let canvasLeftOffset = canvasBoundingClientRect.left
  let canvasTopOffset = canvasBoundingClientRect.top

  ctx.translate(offset, offset)
  // ctx.rect(0, 0, canvasWidth, canvasHeight)
  // ctx.strokeStyle = '#000000'
  // ctx.lineWidth = 1
  // ctx.stroke()
  // 标尺
  let scaleplate = {
    gap: 100, // 间隔
    start: 0, // 起始位置
    width: 1, // 线宽
    lineColor: '#cccccc', // 线条颜色
    textColor: '#ff0000', // 文字颜色
    draw: function () {
      ctx.lineWidth = this.width
      // 垂直标尺
      for (let pos = this.start; pos <= canvasWidth; pos += this.gap) {
        ctx.strokeStyle = this.lineColor
        ctx.beginPath()
        ctx.moveTo(pos, 0)
        ctx.lineTo(pos, canvasHeight)
        ctx.closePath()
        ctx.stroke()
        if (pos == this.start || pos == canvasWidth || pos % 100 !== 0) {
          continue
        }
        ctx.strokeStyle = this.textColor
        ctx.strokeText(`${pos}`, pos - 3, -10)
      }
      // 水平标尺
      for (let pos = this.start; pos <= canvasHeight; pos += this.gap) {
        ctx.strokeStyle = this.lineColor
        ctx.beginPath()
        ctx.moveTo(0, pos)
        ctx.lineTo(canvasWidth, pos)
        ctx.closePath()
        ctx.stroke()
        if (pos == this.start || pos == canvasHeight || pos % 100 !== 0) {
          continue
        }
        ctx.fillStyle = this.textColor
        ctx.fillText(`${pos}`, -25, pos + 5)
      }
    }
  }
  // 小球
  let ball = {
    x: 100,
    y: 100,
    vx: 3, // x轴移动步长
    vy: 2, // y轴移动步长
    radius: 25,
    color: '#ff0f00',
    draw: function () {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = this.color
      ctx.fill()
    }
  }

  // 动画
  function draw () {
    clear()
    scaleplate.draw()
    ball.draw()
    let nextX = ball.x + ball.vx, nextY = ball.y + ball.vy
    if (nextX + ball.radius > canvasWidth || nextX - ball.radius < 0) {
      ball.vx = -ball.vx
    }
    if (nextY + ball.radius > canvasHeight || nextY - ball.radius < 0) {
      ball.vy = -ball.vy
    }
    ball.x += ball.vx
    ball.y += ball.vy
    ball.vy *= .99;
    ball.vy += .25;

    raf = window.requestAnimationFrame(draw)
  }

  // 清除画布
  function clear () {
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    // 长尾效果
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // 画出标尺 和 小球
  scaleplate.draw()
  ball.draw()

  // 小球跟随鼠标移动
  canvas.addEventListener('mousemove', function (e) {
    if (running) {
      return
    }
    // 是否在小球活动范围内
    let posX = e.clientX - canvasLeftOffset - offset
    let posY = e.clientY - canvasTopOffset - offset
    if (posX - ball.radius < 0 || posX + ball.radius > canvasWidth) {
      return
    }
    if (posY - ball.radius < 0 || posY + ball.radius > canvasHeight) {
      return
    }
    clear()
    ball.x = posX
    ball.y = posY
    scaleplate.draw()
    ball.draw()
  })

  canvas.addEventListener('click', function (e) {
    if (running) {
      return
    }
    raf = window.requestAnimationFrame(draw)
    running = true
  })

  canvas.addEventListener('mouseout', function (e) {
    window.cancelAnimationFrame(raf)
    running = false
  })

}

let draw5 = function () {
  let canvas = document.getElementById('canvas5');
  if (!canvas.getContext) {
    throw new Error('浏览器不支持Canvas')
  }
  let bodyRect = document.body.getBoundingClientRect()
  canvas.width = Math.max(bodyRect.width - 100, 800)
  canvas.height = Math.max(bodyRect.height - 100, 800)
  let ctx = canvas.getContext('2d')
  let img = new Image()
  img.src = './images/1.jpg'
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    img.style.display = 'none'
  }
  function pick(event) {
    console.log(event)
    var x = event.layerX - bodyRect.left;
    var y = event.layerY - bodyRect.top;
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = 'rgba(' + data[0] + ',' + data[1] +
      ',' + data[2] + ',' + (data[3] / 255) + ')';
    console.log(x, y, rgba)
  }
  canvas.addEventListener('mousemove', pick);





}