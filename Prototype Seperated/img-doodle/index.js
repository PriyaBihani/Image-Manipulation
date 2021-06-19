var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var lastX;
var lastY;
var strokeColor = 'red';
var strokeWidth = 2;
var mouseX;
var mouseY;
var canvasOffset = $('#canvas').offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var isMouseDown = false;
var brushSize = 20;
var brushColor = '#ff0000';
ctx.lineJoin = 'round';
var img = new Image();

window.addEventListener('load', (e) => {
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'https://unsplash.it/450/450/?random';
  console.log(ctx);
});

// command pattern -- undo
var points = [];

function handleMouseDown(e) {
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // Put your mousedown stuff here
  ctx.beginPath();
  if (ctx.lineWidth != brushSize) {
    ctx.lineWidth = brushSize;
  }
  if (ctx.strokeStyle != brushColor) {
    ctx.strokeStyle = brushColor;
  }
  console.log(ctx);
  ctx.moveTo(mouseX, mouseY);
  console.log(ctx.moveTo(mouseX, mouseY));
  points.push({
    x: mouseX,
    y: mouseY,
    size: brushSize,
    color: brushColor,
    mode: 'begin',
  });
  lastX = mouseX;
  lastY = mouseY;
  isMouseDown = true;
}

function handleMouseUp(e) {
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // Put your mouseup stuff here
  isMouseDown = false;
  points.push({
    x: mouseX,
    y: mouseY,
    size: brushSize,
    color: brushColor,
    mode: 'end',
  });
}

function handleMouseMove(e) {
  console.log(e.clientX - offsetX, ', ', e.clientY - offsetY);
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // Put your mousemove stuff here
  if (isMouseDown) {
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    lastX = mouseX;
    lastY = mouseY;
    // command pattern stuff
    points.push({
      x: mouseX,
      y: mouseY,
      size: brushSize,
      color: brushColor,
      mode: 'draw',
    });
  }
}

$('#canvas').mousedown(function (e) {
  handleMouseDown(e);
});
$('#canvas').mousemove(function (e) {
  handleMouseMove(e);
});
$('#canvas').mouseup(function (e) {
  handleMouseUp(e);
});

function redrawAll() {
  if (points.length == 0) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];

    var begin = false;

    if (ctx.lineWidth != pt.size) {
      ctx.lineWidth = pt.size;
      begin = true;
    }
    if (ctx.strokeStyle != pt.color) {
      ctx.strokeStyle = pt.color;
      begin = true;
    }
    if (pt.mode == 'begin' || begin) {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
    }
    ctx.lineTo(pt.x, pt.y);
    if (pt.mode == 'end' || i == points.length - 1) {
      ctx.stroke();
    }
  }
  ctx.stroke();
}

function undoLast() {
  points.pop();
  redrawAll();
}

$('#brush5').click(function () {
  brushSize = 5;
});
$('#brush10').click(function () {
  brushSize = 10;
});
$('#brushRed').click(function () {
  brushColor = '#ff0000';
});
$('#brushBlue').click(function () {
  brushColor = '#0000ff';
});

var interval;
$('#undo')
  .mousedown(function () {
    interval = setInterval(undoLast, 50);
  })
  .mouseup(function () {
    clearInterval(interval);
  });
