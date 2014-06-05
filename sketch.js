// p5sound variables
var p5s = new p5Sound(this);
var soundFile;

var centerX;
var centerY;

var stars = []; // array to hold array of star objects
var xLoc = 0; // starting x and y location of point moving around circumference of circle
var yLoc = 0; 
var degree = 0; // how far around the circle

// =======================
// variables tied to music
// =======================

// p5sound context
var p5 = new p5Sound(this);
var soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;
// 
var numBands = 2048;
// array of all the frequency values
var freqValues = [];

function setup () {
  createCanvas(windowWidth, windowHeight);
  background(0);
  ellipseMode(CENTER);
  noStroke();

  centerX = width/2; // center of the circle
  centerY = height/2; // center of the circle


  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (i =0; i<=numBands/2; i++) {
    stars.push(new Star());
  }

  // sound
  soundFile.play();
  fft = new FFT(.1, numBands);
}

function draw() { 
  background(0, 0, 0, 100);

  updateIncrement();

  freqValues = fft.processFrequency();

  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {
    stars[i].color[2] = i % 256
    stars[i].diameter = map(freqValues[i], 0, 256, 0.2, 8.0);
    // move the star
    stars[i].move();

    // then draw the star
    stars[i].update();
  }

}

// The star object
function Star() {
  this.color = [255, 255, 0, 50]; // color is an array in javascript
  this.diameter = random(0,.5); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/1.5, width/1.5);
  this.x = centerX + (this.radius * cos(radians(this.degree)));
  this.y = centerY + (this.radius * sin(radians(this.degree)));

  // an array of the star's previous positions as X, Y, color, diameter
  this.prev = [];
}


// called by draw loop
Star.prototype.update = function() {
  fill(this.color);
  ellipse(this.x, this.y, this.diameter, this.diameter);
  for (var i = this.prev.length; i> 0; i--) {
    this.prev[i]
  }
}

// called by draw loop
Star.prototype.move = function() {
    this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
    this.y = centerY + (this.radius * sin(radians(this.degree + increment)));
}

function updateIncrement() {
  var currentTime = soundFile.currentTime();
  var duration = soundFile.duration();
  var myIncrement = map(currentTime, 0, duration, 0, 360);
  if (isNaN(myIncrement)) {
    console.log('not ready');
  }
  else {
    increment = myIncrement;
  }
}
