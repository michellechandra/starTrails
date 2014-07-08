
// p5sound variables
var soundFile;

var centerX; // position star trails radially in the center
var centerY;

var stars = []; // array to hold array of star objects

var xLoc = 0; // starting x and y location of point moving around circumference of circle
var yLoc = 0; 
var degree = 0; // how far around the circle

var thisCanvas;

// p5sound 
var duration = 0;
var currentTime = 0; // variable to store current time of mp3
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;

var amplitude;
var volume;

// 
var numBands = 1024; // number of frequency waves 1024
// array of all the frequency values
var freqValues = [];

// adapting http://processing.org/examples/lineargradient.html

// Constants
var Y_AXIS = 1; // horizontal gradient
var X_AXIS = 2; // vertical gradient


// color arrays for gradient
var sunsetA = [
  [35, 48, 67], //Dark Blue
  [47, 80, 115], //Medium Blue
  [115, 136, 135], //Light Blue
  [196, 86, 61], //Dark Orange 
  [96, 34, 49], //Dark Red
  'sunsetA'
];

// Weird/Sharp Transition from sunsetA to Twilight
var twilight = [ 
  [22, 34, 60], // Dark Gray Blue
  [22, 34, 60], // Dark Gray Blue
  [22, 34, 60], // Dark Gray Blue
  [41, 58, 86], // Gray Blue
  [29, 86, 141], // Lighter Blue
  'twilight'
]; 

// Perfection! This should just stay dark then lighten?
var nightTime = [ 
  [23, 27, 35],  // Black
  [38, 41, 48],  // Dark Gray
  [38, 41, 48],  // Dark Gray
  [53, 55, 58],  // Charcoal Gray
  [65, 67, 73],  // Medium Gray 
  'nightTime'
];

// The transition from night to sunriseEnd looks greeny/weird but the colors otherwise are fantastic
var sunriseEnd = [
  [116, 141, 161],  // Gray Blue
  [243, 248, 251],  // Pale Blue
  [246, 240, 216],  // Pale Yellow
  [232, 177, 146],  // Pink Orange
  [233, 182, 129],  // Orange
//  [72, 112, 138],  //getting rid of this because all the rest have 5 colors.
  'sunriseEnd'
];

function setup () {
  soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');

  background(0);
  thisCanvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  noStroke();

  centerX = width/4; // center of the circle
  centerY = height/4; // center of the circle


  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (i =0; i<=numBands/2; i++) {
    stars.push(new Star());
  }

  // sound
  soundFile.play();
  fft = new FFT(.01, numBands);
  amplitude = new Amplitude(.985);
 // amplitude.input();
  amplitude.toggleNormalize();
}

function draw() { 

  volume = amplitude.getLevel();
  console.log(volume);

  var bRed = map(currentTime, 0, duration, 20, 0);
  var bBlue = map(currentTime, 0, duration, 20, 40);
  if (frameCount % 40 == 0 ){
    if (duration > 0) {
      background(bRed,0,bBlue,10);
    } else {
      background(0,0,0,250);
    }
  } 

  updateIncrement();

  freqValues = fft.processFreq();
  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {
    //stars[i].color[2] = i % 256
    if (volume > .1) {
      stars[i].diameter = map(freqValues[i], 120, 256, 1, 15)*volume;
    } else {
      stars[i].diameter = map(freqValues[i], 120, 256, 1, 10)*volume;
    }
    // stars[i].color[3] = freqValues[i]/5; // map brightness to frequency value

    // move and draw the star
    stars[i].update();
  }

  function setGradient(x, y, w, h, c1, c2, axis, c) {

  noStroke();

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), 250];   // lerpColor(c1, c2, inter);
      //var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), alph]; 
     // stroke(c);
    stroke(c);

      line(x, i, x+w, i);

      fill(c);
      ellipse(this.x, this.y, this.diameter, this.diameter);
      
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), 250];
      stroke(c);
      line(i, y, i, y+h);

      fill(c);
          ellipse(this.x, this.y, this.diameter, this.diameter);

      line(i, y, i, y+h);
    }
  }
}
} 

// The star object
function Star() {
  this.color = [255, 255, 255, 255]; // color is an array in javascript
  //this.c;
  this.diameter = random(0,.5); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/1.2, width/1.2);
   // NOTE this line of code for this.x will make an ellipse: 
    

    if (this.degree >= TWO_PI && this.degree <= PI) {
      this.x = centerX + (((this.radius)*1.25) * cos(radians(this.degree)));
      this.y = centerY + (((this.radius)*3) * sin(radians(this.degree + increment)));
  //this.x = centerX + (this.radius * cos(radians(this.degree));
    } else {
      this.x = centerX + (((this.radius)*1.25) * cos(radians(this.degree)));
      this.y = centerY + (this.radius * sin(radians(this.degree)));
}
}


// called by draw loop
Star.prototype.update = function() {

    /*if (frameCount % 2 == 0 ){
      // before updating x & y, add coordinates to the star's trail
      trails.push( new starTrail(this.x, this.y, this.color, this.diameter) );
    } */
    // update the x and y position based on the increment
    // NOTE this line of code for this.x will make an ellipse: 
   // this.x = centerX + (((this.radius)*2) * cos(radians(this.degree + increment)));
    //this.x = centerX + (this.radius * cos(radians(this.degree + increment));

      if (this.degree >= TWO_PI && this.degree <= PI) {
            this.x = centerX + (((this.radius)*1.25) * cos(radians(this.degree + increment)));

    this.y = centerY + (((this.radius)*3) * sin(radians(this.degree + increment)));
  } else {
        this.x = centerX + (((this.radius)*1.25) * cos(radians(this.degree + increment)));

    this.y = centerY + (this.radius * sin(radians(this.degree + increment)));
  }

    // draw an ellipse at the new x and y position
    stroke(this.c);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    // point(this.x, this.y);
}


/**
 * We're not using these at the moment...
 */
function starTrail(_x, _y, _c, _d) {
  this.x = _x;
  this.y = _y;
  this.c = _c;
  this.diameter = _d;
}

starTrail.prototype.update = function() {
  if (frameCount % 300 == 0) {
    this.c[3] = this.c[3] - .1; // decrease variable could be based on the music?
  }
  stroke(this.c);
  //    ellipse(this.x, this.y, this.diameter, this.diameter);
  point(this.x, this.y, 255);
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

