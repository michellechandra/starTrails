// p5sound variables
var p5s = new p5Sound(this);
var soundFile;

var centerX;
var centerY;

var stars = []; // array to hold array of star objects
var xLoc = 0; // starting x and y location of point moving around circumference of circle
var yLoc = 0; 
var degree = 0; // how far around the circle


function setup () {
  createCanvas(windowWidth, windowHeight);
  background(0);
  ellipseMode(CENTER);

  centerX = width/2; // center of the circle
  centerY = height/2; // center of the circle


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

    // move the star
   stars[i].move();

    // then draw the star
    stars[i].update();
  }


}

// The star object
function Star() {
  this.color = [255, 255, 0]; // color is an array in javascript
  // this.x = random(0, width);
  // this.y = random(0, height);
  this.d = random(1,4); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/2, width/2);
}


// called by draw loop
Star.prototype.update = function() {
  fill(this.color);
  ellipse(this.x, this.y, this.d, this.d);
  
}

// called by draw loop
Star.prototype.move = function() {
    // update the degree
    this.degree++;

    this.x = centerX + (this.radius * cos(radians(this.degree)));
    this.y = centerY + (this.radius * sin(radians(this.degree)));
}
