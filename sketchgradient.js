// TO DO: pixels, check the for loop (nature of code), pop

// p5sound variables
var p5s = new p5Sound(this);
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

// p5sound context
var p5s = new p5Sound(this);
var soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
var duration = 0;
var currentTime = 0;
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;

var amplitude;
var volume;

// 
var numBands = 1024;
// array of all the frequency values
var freqValues = [];

// adapting http://processing.org/examples/lineargradient.html

// Constants
var Y_AXIS = 1;
var X_AXIS = 2;


// color sets
var sunsetA = [
  [35, 48, 67,10], //Dark Blue
  [47, 80, 115], //Medium Blue
  [115, 136, 135], //Light Blue
  [196, 86, 61], //Dark Orange 
  [96, 34, 49], //Dark Red
  'sunsetA'
];

// This one looks really weird. 
var sunsetB = [
  [51, 78, 105], //Medium Blue
  [125, 149, 159], //Light Blue
  [252, 197, 117], //Yellow 
  [206, 169, 151], //Pink
  [234, 138, 87], //Orange
  'sunsetB'
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

// put all the above times of day into an array
var times = [sunsetB, sunsetA, twilight, nightTime, sunriseEnd, sunsetB];
// times[timePos] = sunsetA
var timePos = 0;

var lerpAmount = .00001;


function setup () {
  //background(0);
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
  amplitude = new Amplitude(.985);
  amplitude.input();
  amplitude.toggleNormalize();
}
//}

function draw() { 

  lerpAmount = ( (frameCount) % 1000 ) / 1000; //lerpAmount goes from 0.0 to 1.0

  // change to the next times' color palette when lerpAmount reaches 0
  if (lerpAmount == 0) {
    timePos++;
    timePos = timePos % (times.length-1);
    print('transitioning from ' + times[timePos][5] +' to ' +times[timePos+1][5]); // print out what time it is
  }

  // generate 5 colors by lerping between the colors [R, G, B] in the time array at timePos and timePos+1
  // Example: times[3] = nightTime, times[3][0] = first color, times[3][0][0] = Red value.
  var color0 = [lerp(times[timePos][0][0],times[timePos+1][0][0],lerpAmount),lerp(times[timePos][0][1],times[timePos+1][0][1],lerpAmount),lerp(times[timePos][0][2],times[timePos+1][0][2],lerpAmount)];
  var color1 = [lerp(times[timePos][1][0],times[timePos+1][1][0],lerpAmount),lerp(times[timePos][1][1],times[timePos+1][1][1],lerpAmount),lerp(times[timePos][1][2],times[timePos+1][1][2],lerpAmount)];
  var color2 = [lerp(times[timePos][2][0],times[timePos+1][2][0],lerpAmount),lerp(times[timePos][2][1],times[timePos+1][2][1],lerpAmount),lerp(times[timePos][2][2],times[timePos+1][4][2],lerpAmount)];
  var color3 = [lerp(times[timePos][3][0],times[timePos+1][3][0],lerpAmount),lerp(times[timePos][3][1],times[timePos+1][3][1],lerpAmount),lerp(times[timePos][3][2],times[timePos+1][3][2],lerpAmount)];
  var color4 = [lerp(times[timePos][4][0],times[timePos+1][4][0],lerpAmount),lerp(times[timePos][4][1],times[timePos+1][4][1],lerpAmount),lerp(times[timePos][4][2],times[timePos+1][4][2],lerpAmount)];


  // divide the background into six rectangles of gradients. (Top and bottom are actually same color, not gradients)
  setGradient(0, 0, width, height/6, color0, color0, Y_AXIS);
  setGradient(0, height/6, width, height/6, color0, color1, Y_AXIS);
  setGradient(0, 2*height/6, width, height/6, color1, color2, Y_AXIS);
  setGradient(0, 3*height/6, width, height/6, color2, color3, Y_AXIS);
  setGradient(0, 4*height/6, width, height/6, color3, color4, Y_AXIS);


  volume = amplitude.process();
  console.log(volume);

  /*var bRed = map(currentTime, 0, duration, 20, 0);
  var bBlue = map(currentTime, 0, duration, 20, 40);
  if (frameCount % 15 == 0 ){
    if (duration > 0) {
      background(bRed,0,bBlue,10);
    } else {
      background(0,0,0,200);
    }
  } */

  updateIncrement();

  freqValues = fft.processFrequency();
  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {
    //stars[i].color[2] = i % 256
    if (volume > .1) {
      stars[i].diameter = map(freqValues[i], 120, 256, 0, 35.0)*volume;
    } else {
      stars[i].diameter = map(freqValues[i], 120, 256, 0, 15.0)*volume;
    }
    // stars[i].color[3] = freqValues[i]/5; // map brightness to frequency value

    // move and draw the star
    stars[i].update();
  }

  // tell all the items in this star's trail to draw themselves
  // for (var i = trails.length-1; i>= 0; i--) {
  //   if (trails[i].c[3] < 5) {
  //     trails.splice(i,1); // remove the item from the array if its alpha is less than zero
  //   } else {
  //     trails[i].update();
  //   }
  // }


  function setGradient(x, y, w, h, c1, c2, axis) {

  noFill();
  //var alph = 10;

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter)];   // lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter)];
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}
}

// The star object
function Star() {
  this.color = [255, 255, 255, 255]; // color is an array in javascript
  this.diameter = random(0,.5); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/1.2, width/1.2);
  this.x = centerX + (this.radius * cos(radians(this.degree)));
  this.y = centerY + (this.radius * sin(radians(this.degree)));
}


// called by draw loop
Star.prototype.update = function() {

    if (frameCount % 2 == 0 ){
      // before updating x & y, add coordinates to the star's trail
      trails.push( new starTrail(this.x, this.y, this.color, this.diameter) );
    }
    // update the x and y position based on the increment
    this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
    this.y = centerY + (this.radius * sin(radians(this.degree + increment)));

    // draw an ellipse at the new x and y position
    stroke(this.color);
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

