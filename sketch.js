// TO DO: pixels, check the for loop (nature of code), pop

// p5sound variables
var soundFile;

var centerX;
var centerY;

var stars = []; // array to hold array of star objects
var trails = [];

var xLoc = 0; // starting x and y location of point moving around circumference of circle
var yLoc = 0; 
var degree = 0; // how far around the circle

var thisCanvas;

// =======================
// variables tied to music
// =======================

var soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
var duration = 0;
var currentTime = 0;
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;

var amplitude;
var volume;

var numBands = 1024;
// array of all the frequency values
var freqValues = [];

function setup () {
  background(0);
  thisCanvas = createCanvas(windowWidth, windowHeight);
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
  fft = new FFT(.01, numBands);
  amplitude = new Amplitude(.985); // amplitude takes 'smoothing'
}

function draw() { 

  volume = amplitude.process();

  var bRed = map(currentTime, 0, duration, 20, 0);
  var bBlue = map(currentTime, 0, duration, 20, 40);
  if (frameCount % 15 == 0 ){
    if (duration > 0) {
      background(bRed,0,bBlue,10);
    } else {
      background(0,0,0,200);
    }
  }

  updateIncrement();

  freqValues = fft.processFrequency();
  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {
    stars[i].color[2] = i % 256
    if (volume > .1) {
      stars[i].diameter = map(freqValues[i], 120, 256, 0, 35.0)*volume;
    } else {
      stars[i].diameter = map(freqValues[i], 120, 256, 0, 15.0)*volume;
    }
    // stars[i].color[3] = freqValues[i]/5; // map brightness to frequency value

    // move and draw the star
    stars[i].update();
  }


}

// The star object
function Star() {
  this.color = [255, 255, 0, 20]; // color is an array in javascript
  this.diameter = random(0,.5); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/1.2, width/1.2);
  this.x = centerX + (this.radius * cos(radians(this.degree)));
  this.y = centerY + (this.radius * sin(radians(this.degree)));
}


// called by draw loop
Star.prototype.update = function() {

    // update the x and y position based on the increment
    this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
    this.y = centerY + (this.radius * sin(radians(this.degree + increment)));

    // draw an ellipse at the new x and y position
    stroke(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    // point(this.x, this.y);
}


// update rotation based on song time / duration
function updateIncrement() {
  currentTime = soundFile.currentTime();
  duration = soundFile.duration();
  var myIncrement = map(currentTime, 0, duration, 0, 360);
  if (isNaN(myIncrement)) {
    console.log('not ready');
  }
  else {
    increment = myIncrement;
  }
}
