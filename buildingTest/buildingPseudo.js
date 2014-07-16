// pseudo code for Building and Window classes


var buildings = []; // array of buildings
var numberOfBuildings = 80;
/**
 *  The threshold for whether windows will be on/off is between 0.0 and 1.0.
 *  Every Window gets its own random onThreshold that does not change.
 *  So we just raise this number to turn more windows on, or lower to turn more off.
 */
var onThreshold; // changing this to use NOISE just for fun!
var xoff = 0;
var xincrement = 0.01;


// called during setup
function createBuildings(numberOfBuildings) {
  for (var i = 0; i < numberOfBuildings; i++){
    buildings.push( new Building() );
  }
};

// The Building Class
var Building = function() {
  // these are important to position the range of the buildings
  this.height = random(40, 120);
  this.width = this.height / random(1.2, 3);
  this.xPos = random(0, window.width);
  this.yPos = random(windowHeight, windowHeight-40); // align the bottom of the buildings

  this.c = random(0,50);

  // creates an array of this buildings' windows
  this.windows = [];
  this.createWindows(this.xPos, this.yPos - this.height, this.width, this.height);
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
  rect(this.xPos, this.yPos, this.width, -this.height);
  for (i = 0; i < this.windows.length; i++) {
    this.windows[i].update();
  }
};


// The Window Class
var Window = function(_x, _y, _w, _h) {
  this.c = random(170,250);
  this.x = _x;
  this.y = _y;
  this.w = _w;
  this.h = _h;
  rect(this.x, this.y, this.w, this.h);
  this.onThreshold = random(); // each building has an unchanging onThreshold betw 0.0 and 1.0
};

Window.prototype.update = function(){
  if (this.onThreshold > onThreshold) {
    fill(this.c);
  } else {
    fill(0);
  }
  rect(this.x, this.y, this.w, this.h);
};


// code for setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  createBuildings(numberOfBuildings);
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