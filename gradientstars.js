// TO DO: pixels, check the for loop (nature of code), pop

// p5sound variables
var soundFile;

var centerX; // position star trails radially in the center
var centerY;

var stars = []; // array to hold array of star objects

var xLoc = 0; // starting x and y location of point moving around circumference of circle
var yLoc = 0; 
var degree = 0; // how far around the circle

var thisCanvas;

// =======================
// variables tied to music
// =======================

// p5sound 
var soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
var duration = 0;
var currentTime = 0; // variable to store current time of mp3
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;
var peaks = []; // array of peaks in the sound file
var amplitude;
var volume;

var numBands = 1024; // number of frequency waves
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

// put all the above times of day into an array
var times = [sunsetA, twilight, nightTime, sunriseEnd];
times[timePos] = sunsetA;
var timePos = 0;

var lerpAmount = .01;


function setup () {
  background(0);
  thisCanvas = createCanvas(windowWidth, windowHeight);
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
  // amplitude.toggleNormalize();
}



function draw() { 
  lerpAmount = ( (frameCount) % 1000 ) / 1000; //lerpAmount goes from 0.0 to 1.0

  // change to the next times' color palette when lerpAmount reaches 0
  if (lerpAmount == 0) {
    timePos++;
    timePos = timePos % (times.length-1);
   // print('transitioning from ' + times[timePos][5] +' to ' +times[timePos+1][5]); // print out what time it is
  }

  // setColors();

  volume = amplitude.process();

  var bRed = map(currentTime, 0, duration, 20, 0);
  var bBlue = map(currentTime, 0, duration, 20, 40);
  if (frameCount % 100 == 0 ){
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

    // only draw colors if lots of energy in that frequency
    if (freqValues[i] == 0) {
        stars[i].diameter = .00;
    }
    else if (volume > .1) {
        stars[i].diameter = map(freqValues[i], 60, 256, 0, 35.0)*volume;
    }
    else {
      stars[i].diameter = map(freqValues[i], 60, 256, .1, 15.0)*volume;
    }
      // stars[i].color[3] = freqValues[i]/5; // map brightness to frequency value

      // set the star gradient
      var lerpPercentage = map(i, 0, stars.length, 0, 1);

      var c1 = lerpGrad([233, 182, 129],[96, 34, 49], lerpAmount);
      var c2 = lerpGrad([246, 240, 216],[196, 86, 61], lerpAmount);
      var c = lerpGrad(c1, c2, lerpPercentage);
      fill(c);
      // move and draw the star
      stars[i].update();
  }

    // tell the landscape to draw
    drawLandscape();

} // END DRAW LOOP



// The star object
function Star() {
  this.c;
  this.diameter = random(0,.5); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/1.2, width/1.2);
  this.x = centerX + (this.radius * cos(radians(this.degree)));
  this.y = centerY + (this.radius * sin(radians(this.degree)));
}


// called by draw loop
Star.prototype.update = function() {
    strokeWeight(this.diameter*volume);
    // update the x and y position based on the increment
    this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
    this.y = centerY + (this.radius * sin(radians(this.degree + increment)));

    // draw an ellipse at the new x and y position
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

// helper function to lerp between two colors [r, g, b] at a specified lerp amount
function lerpGrad(color1, color2, lerpAmt) {
  var c = [lerp(color1[0], color2[0], lerpAmt), lerp(color1[1], color2[1], lerpAmt), lerp(color1[1], color2[1], lerpAmt)  ];
  return c;
}

function drawLandscape() {

  // draw water
  rectGradient(0,height-150,width,150,sunsetA[0],twilight[3],Y_AXIS, 20);

  var divider = 2; // determines the precision of the waveform

  var c = lerpGrad(nightTime[4], sunsetA[0], lerpAmount);
  stroke(c);

  if (soundFile.isLoaded() ) {

    // get the peaks from the soundfile just once. 
    if (peaks.length === 0) {
      peaks = soundFile.getPeaks(width/divider);
    }

    strokeWeight(divider*5);
    // draw the waveform
    beginShape();
    // draw it once
    for (var i = 0; i< peaks.length; i++){
      // set the stroke color

      var percent = map(i, 0, peaks.length, 0.0, 1.0);
      stroke(lerpColor(sunriseEnd[2], sunriseEnd[3], percent) );

      // peak X position
      var xPoint = map(i, 0, peaks.length, -2*width/peaks.length, width + 3*width/peaks.length);

      // peak Y position
      var yPoint = map(peaks[i], 1, 0, height-375, height-150);
      curveVertex(xPoint, yPoint);
    }

    // draw again at yPoint-10, with lines that go to the bottom
    strokeWeight(divider)
    for (var i = 0; i< peaks.length; i++){

      var percent = map(i, 0, peaks.length, 0.0, 1.0);
      stroke(lerpColor(sunriseEnd[2], sunriseEnd[3], percent) );

      // peak X position
      var xPoint = map(i, 0, peaks.length, -2*width/peaks.length, width + 3*width/peaks.length);

      // peak Y position
      var yPoint = map(peaks[i], 1, 0, height-375, height-150);
      curveVertex(xPoint+divider, yPoint-divider);
      curveVertex(xPoint+2*divider, height-100);
    }
    endShape();
  } // end if (soundFile.isLoaded)

}



/**
 *  Draws a gradient in a rectangular shape.
 *  This was used to set the background gradient and is no longer in use
 *  
 *  @param {[type]} x    x position of rectangle
 *  @param {[type]} y    y position of rectangle
 *  @param {[type]} w    width of rectangle
 *  @param {[type]} h    height of rectangle
 *  @param {[type]} c1   color #1 [r, g, b]
 *  @param {[type]} c2   color #2 [r, g, b]
 *  @param {[type]} axis Y_AXIS = top to bottom, X_AXIS = left to right
 */
function rectGradient(x, y, w, h, c1, c2, axis, _alph) {

//  noFill();

  // if alpha is given, use it. Otherwise, 250. 
  var alph = _alph || 250;

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), alph];   // lerpColor(c1, c2, inter);
      //var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), alph]; 
      fill(c);
      stroke(c);

      // ellipse(this.x, this.y, this.diameter, this.diameter);

      //line(x, i, x+w, i);

      rect(x,y,w,h);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), alph];
      fill(c);

      // ellipse(this.x, this.y, this.diameter, this.diameter);

      //line(i, y, i, y+h);
    }
  }
}



/**
 *  Generate four different color variables [r,g,b] (color0-3)
 *  
 *  Then use those colors to create five gradient rectangles
 *  by calling rectGradient five times.
 *  
 *  Each color variable is generated by lerping between colors from the
 *  "times" array which contains [r,g,b] color palettes for
 *  sunset, twilight, nightTime and sunrise.
 *
 *  The lerpAmount which is based on how far along we are in the song).
 *  
 * 
 */
function setColors() {
    // generate 5 colors by lerping between the colors [R, G, B] in the time array at timePos and timePos+1
  // Example: times[3] = nightTime, times[3][0] = first color, times[3][0][0] = Red value.
  var color0 = 

  [lerp(times[timePos][0][0],times[timePos+1][0][0],lerpAmount), // each line linked to R-G-B value
   lerp(times[timePos][0][1],times[timePos+1][0][1],lerpAmount), // color0 = sunsetA (first one in times array)
   lerp(times[timePos][0][2],times[timePos+1][0][2],lerpAmount)];
  // lerp(times[timePos][0][3],times[timePos+1][0][3],lerpAmount)];

  var color1 = 

  [lerp(times[timePos][1][0],times[timePos+1][1][0],lerpAmount),
   lerp(times[timePos][1][1],times[timePos+1][1][1],lerpAmount),
   lerp(times[timePos][1][2],times[timePos+1][1][2],lerpAmount)];
  // lerp(times[timePos][1][3],times[timePos+1][1][3],lerpAmount)];

  var color2 = 

  [lerp(times[timePos][2][0],times[timePos+1][2][0],lerpAmount),
  lerp(times[timePos][2][1],times[timePos+1][2][1],lerpAmount),
  lerp(times[timePos][2][2],times[timePos+1][2][2],lerpAmount)];
  //lerp(times[timePos][2][3],times[timePos+1][2][3],lerpAmount)];

  var color3 = 

  [lerp(times[timePos][3][0],times[timePos+1][3][0],lerpAmount),
   lerp(times[timePos][3][1],times[timePos+1][3][1],lerpAmount),
   lerp(times[timePos][3][2],times[timePos+1][3][2],lerpAmount)];
  // lerp(times[timePos][3][3],times[timePos+1][3][3],lerpAmount)];

  /*var color4 = 

  [lerp(times[timePos][4][0],times[timePos+1][4][0],lerpAmount),
  lerp(times[timePos][4][1],times[timePos+1][4][1],lerpAmount),
  lerp(times[timePos][4][2],times[timePos+1][4][2],lerpAmount)];*/


  // divide the background into six rectangles of gradients. (Top and bottom are actually same color, not gradients)

  rectGradient(0, 0, width, height/6, color0, color0, Y_AXIS);
  rectGradient(0, height/6, width, height/6, color0, color1, Y_AXIS);
  rectGradient(0, 2*height/6, width, height/6, color1, color2, Y_AXIS);
  rectGradient(0, 3*height/6, width, height/6, color2, color3, Y_AXIS);
  rectGradient(0, 4*height/6, width, height/6, color3, color3, Y_AXIS); 

}