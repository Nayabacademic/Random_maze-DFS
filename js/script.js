        				
 
var cols, rows;
rows = 30;
cols = 30;
var canvas_w = window.innerWidth - (window.innerWidth % rows) 
var w = canvas_w/rows
var grid = [];
var current;
var stack = [];

var path_col = "#FF6F3C"; //"#1D80F2";
var high_col = "#fff";
var isended = 0;

function setup() {
  createCanvas(canvas_w, canvas_w);
  path = createSlider(2,w-2,2);
  path.style("appearance", "none");
  path.style('width', '200px');
  path.style('height', '15px');
  path.style("backgroundColor", 'rgb(57,62,70)');
  path.style("outline", "none");
  path.style('border-radius', '15px');
  path.style('overflow', 'hidden');
  path.style('boxShadow', 'inset 0px 0px 5px #111');
  
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw() {
  background(57,62,70);
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
         high_col = "#FF6F3C";
         save();
         noLoop();
         }
      }
      else{
          high_col = "#fff";
      }
      noStroke();
      fill(high_col);
      rect(x+path.value()/2,y+path.value()/2,w-path.value(),w-path.value());
      
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
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);
    strokeWeight(path.value());
    strokeCap(PROJECT);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(path_col);
      rect(x+path.value()/2, y+path.value()/2, w, w);
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