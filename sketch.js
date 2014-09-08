// p5sound variables
var soundFile;

var centerX;
var centerY;

var stars = []; // array to hold array of star objects

//var degree = 0; // how far around the circle

var duration = 0;
var currentTime = 0;
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;

var amplitude;
var volume;

var numBands = 1024;

// array of all the frequency values
var freqValues = [];

function preload() {
  soundFile = loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3');
}

function setup () {
  var thisCanvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  noStroke();

  centerX = width/2; // center of the circle
  centerY = height/2; // center of the circle

  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (var i =0; i<=numBands/2; i++) {
    stars.push(new Star(i));
  }

  // sound
  soundFile.play();
  fft = new p5.FFT(.01, numBands);
  amplitude = new p5.Amplitude(.985); // amplitude takes 'smoothing'
}

function draw() { 

  volume = amplitude.getLevel();

  updateIncrement();

  freqValues = fft.analyze();
  var bass = fft.getEnergy('bass');
  var lowMid = fft.getEnergy('lowMid');
  var mid = fft.getEnergy('mid');

  // for every Star object in the array called 'stars'...

  for (var i = 0; i<stars.length; i++) {
    stars[i].color[4] = (map(freqValues[i], 120, 256, 0, 100))*volume;
    if (i < stars.length/3) {
      stars[i].diameter = (map(bass, 50, 244, 6, 11))*volume;
    }
    else if (i < stars.length/2) {
      stars[i].diameter = (map(lowMid, 68, 215, 4, 8))*volume;
    }
    else {
      stars[i].diameter = (map(mid, 60, 160, 0, 1))*volume;
    }
    stars[i].update();
  }

  // for (var i =0; i<stars.length; i++) {
  //   stars[i].color[4] = map (freqValues[i], 120, 256, 0, 255);
  //   if (volume > .1) {
  //     stars[i].diameter = map(freqValues[i], 0, 256, 0, 50.0)*volume;
  //   } else {
  //     stars[i].diameter = map(freqValues[i], 0, 256, 0, 30.0)*volume;
  //   }
  //   stars[i].update();
  // }
}

// The star object
function Star(i) {

  var totalStarCount = numBands/2;
   if (i < totalStarCount/5 ){
   this.color = [143, 180, 182, 255]; // gray teal
  }
     else if (i < totalStarCount/2){
 // else if (i < 2*stars.length/3){
    this.color = [42, 63, 85, 255];
  }
  else {
      this.color = [227, 226, 208, 255];
  }
  this.diameter = random(0,2); // diameter of each star ellipse
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
    noStroke;
    // draw an ellipse at the new x and y position
    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
}


// update rotation based on song time / duration
function updateIncrement() {
  currentTime = soundFile.currentTime();
  duration = soundFile.duration();
  var myIncrement = map(currentTime, 0, duration, 0, 360);
  if (isNaN(myIncrement)) {
    console.log('loading...');
  }
  else {
    increment = myIncrement;
  }

  var fadeOutOne = 40;
  var fadeOutTwo = 90;

  // when document is loaded and ready, execute my jQuery manipulations!

   $(document).ready(function() {
  //console.log('jquery is working');
  
  // Fade out gradients every 60 seconds
  $('.gradientOne').animate({ opacity:0 }, 30000 );

  if (currentTime > fadeOutOne ) {
  $('.gradientTwo').animate({ opacity: 0 }, 30000); 
    }

 /* if (currentTime > fadeOutTwo ){
  $('.gradientThree').animate({ opacity: 0}, 60000); } */
 });
}