// pseudo code for Building and Window classes


var buildings = []; // array of buildings

/**
 *  The threshold for whether windows will be on/off is between 0.0 and 1.0.
 *  Every Window gets its own random onThreshold that does not change.
 *  So we just raise this number to turn more windows on, or lower to turn more off.
 */
var onThreshold; // changing this to use NOISE just for fun!
var xoff = 0;
var xincrement = 0.01;

// The Building Class
var Building = function() {
  this.height = random(10, 100);
  this.width = random(10,100);
  this.xPos = random(0, window.width);
  this.yPos = random(0, window.height);

  this.c = [10,10,10];

  // creates an array of this buildings' windows
  this.windows = [];
  this.createWindows(this.xPos, this.yPos, this.width, this.height);
};

// called by every Building when they are instantiated
Building.prototype.createWindows = function(bX, bY, bW, bH) {
  // fill the building with windows every 10 pixels based on building x,y,w,h (bX, bY, bW, bH)
  var wWidth = 7;
  var wHeight = 10;
  for (var i = bX + wWidth; i < bX + bW - wWidth; i += wWidth) {
    for (var j = bY + wHeight; j < bY + bH - wHeight; j += wHeight) {
      this.windows.push( new Window(i, j, wWidth/4, wHeight/2) ); // dividing wWidth and wHeight by 2, the other half will be window spacing
    }
  }
};

Building.prototype.update = function() {
  fill(0);
  rect(this.xPos, this.yPos, this.width, this.height);
  for (i = 0; i < this.windows.length; i++) {
    this.windows[i].update();
  }
};

// called during setup
function createBuildings(numberOfBuildings) {
  for (var i = 0; i < numberOfBuildings; i++){
    buildings.push( new Building() );
  }
};

// The Window Class
var Window = function(_x, _y, _w, _h) {
  this.c = [200,200,200];
  this.x = _x;
  this.y = _y;
  this.w = _w;
  this.h = _h;
  rect(this.x, this.y, this.w, this.h);
  this.onThreshold = random();
};

Window.prototype.update = function(){
  if (this.onThreshold > onThreshold) {
    fill(250,250,0);
  } else {
    fill(0);
  }
  rect(this.x, this.y, this.w, this.h);
};


// code for setup
function setup() {
  createCanvas(400,400);
  createBuildings(10);
  noStroke();
}

// code for draw loop
function draw() {
  for (var i = 0; i < buildings.length; i++){
    buildings[i].update();

    // flicker the windows on / off
    if (frameCount % 10 == 0) {
      onThreshold = noise(xoff);
      xoff += xincrement;
    }
  }
}