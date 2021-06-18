window.onload = function(){


var canvas = document.getElementById("canvas")	
var ctx = canvas.getContext("2d")			
var path = document.getElementById("path")	
var dis = document.getElementById("dis")
var start = document.getElementById("start")
var colI = document.getElementById("colInp")
var rowI = document.getElementById("rowInp")

console.log(rowI.value)

var colorPicker = new iro.ColorPicker("#picker", {
width: 140,
color: "rgb(255, 111, 60)" ,
layout: [
    {
      component: iro.ui.Box,
    },
    {
      component: iro.ui.Slider,
      options: {
        id: 'hue-slider',
        sliderType: 'hue'
      }
    }
  ]
});
var colorPicker2 = new iro.ColorPicker("#picker2", {
width: 140,
color: "rgb(255, 111, 60)" ,
layout: [
    {
      component: iro.ui.Box,
    },
    {
      component: iro.ui.Slider,
      options: {
        id: 'hue-slider',
        sliderType: 'hue'
      }
    }
  ]
});

var running = false;

start.onclick = function(){
if (!running) {
 running = true

var cols, rows;
rows = rowI.value
cols = colI.value
var canvas_w = window.innerWidth - (window.innerWidth % cols) 

var w = canvas_w/cols*2
var canvas_h = w*rows
var grid = [];
var current;
var stack = [];

path.max = w-2
path.min = 2

var path_col;
var high_col = "white";
var wall_col;
var isended = 0;

canvas.width = canvas_w*2
canvas.height = canvas_h

function image(){
 var gimg = canvas.toDataURL("image/png"); 
 var fimg = document.createElement("img");
 fimg.src = gimg
 fimg.style.width = "92vw"
 dis.appendChild(fimg);  
 //dis.innerHTML = '<img src="'+gimg+'"/>'
}

function randomint(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
	
function init(){
		
		for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}//init
		

function draw() {

 path_col = colorPicker.color.hexString;
 wall_col = colorPicker2.color.hexString
 
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  // STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    //STEP 2
    stack.push(current);

    // STEP 3
    removeWalls(current, next);

    // STEP 4
    current = next;
  } 
  else if(stack.length > 0){
      current = stack.pop();
  }
  
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}		

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  
  this.highlight = function(){
      var x = this.i*w;
      var y = this.j*w;
      if(x == 0 && y == 0){
      isended++;
      if(isended == 2){
         high_col = path_col;
          
         }
      }
      
      ctx.beginPath();
      ctx.fillStyle = high_col
      ctx.rect(x+path.value/2,y+path.value/2,w-path.value,w-path.value);
      ctx.fill()
      ctx.closePath();
  }

  this.checkNeighbors = function() {
    var neighbors = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = randomint(0, neighbors.length-1);
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;
    
    ctx.strokeStyle = wall_col
    ctx.lineWidth = path.value
    ctx.lineCap='square';
    
    if (this.walls[0]) {
      ctx.beginPath();
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.stroke()
      ctx.closePath()
    }
    if (this.walls[1]) {
      ctx.beginPath();
      ctx.moveTo(x + w, y)
      ctx.lineTo(x + w, y + w)
      ctx.stroke()
      ctx.closePath()
    }
    if (this.walls[2]) {
      ctx.beginPath();
      ctx.moveTo(x + w, y + w)
      ctx.lineTo(x , y + w)
      ctx.stroke()
      ctx.closePath()
    }
    if (this.walls[3]) {
      ctx.beginPath();
      ctx.moveTo(x, y + w)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.closePath()
    }

    if (this.visited) {
      ctx.fillStyle = path_col
      ctx.beginPath()
      ctx.rect(x+path.value/2, y+path.value/2, w, w);
      ctx.fill()
      ctx.closePath()
    }
    

  };
}

		
				
function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
				
function animate(){

if (isended == 2) {
ctx.strokeStyle = wall_col
ctx.lineWidth = path.value
ctx.lineCap='round';
ctx.beginPath()
ctx.moveTo(0 , canvas.height)
ctx.lineTo(canvas.width, canvas.height)
ctx.lineTo(canvas.width, 0)
ctx.stroke()
ctx.closePath()

		image()
}

if (isended != 2) {
requestAnimationFrame(animate)
}
else{
	running = false;
}

		draw()
		
		if (path.value % 2 != 0) {
				path.value -= 1
		}
}

init()

animate()

}
}

}
