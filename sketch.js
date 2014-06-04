// p5sound variables
var p5s = new p5Sound(this);
var soundFile;

var centerX; // center of the circle
var centerY; // center of the circle

var stars = []; // array to hold array of star objects
var xLoc = 0; // starting x and y location of point moving around circumference of circle
var yLoc = 0; 
var degree = 0; // how far around the circle

function setup () {
  createCanvas(windowWidth, windowHeight);
  background(0);
  ellipseMode(CENTER);

  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (i =0; i<=512; i++) {
    stars.push(new Star());
  }
}

function draw() { 

  //radius = random(0, width/2);

  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {

    // move a star
    stars[i].move();

    // then draw the star
    stars[i].update();
  }
  degree++;


}

// The star object
function Star() {
  this.color = [255, 255, 0]; // color is an array in javascript
  this.x = random(0, width);
  this.y = random(0, height);
  this.centerX = width/2;
  this.centerY = height/2; 
  this.d = random(1,4); // diameter of each star ellipse
  this.degree = 0;
  this.radius = random(0, width/2);
}


// called by draw loop
Star.prototype.update = function() {
  fill(this.color);
  ellipse(this.x, this.y, this.d, this.d);
  
}

// called by draw loop
Star.prototype.move = function() {
    this.x = this.centerX + (this.radius * cos(radians(degree)));
    this.y = this.centerY + (this.radius * sin(radians(degree)));
}
