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
  soundFile = loadSound('Chris_Zabriskie_-_06_-_Divider.mp3');
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
    stars[i].color[4] = map (freqValues[i], 120, 256, 0, 255);
    if (i < stars.length/3) {
      stars[i].diameter = volume*map(bass, 150, 210, 0, 5);
    }
    else if (i < 2*stars.length/3) {
      stars[i].diameter = volume*map(lowMid, 140, 200, 0, 5);
    }
    else {
      stars[i].diameter = volume*map(mid, 0, 256, 0, 5);
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
  if (i < stars.length/3 ){
   this.color = [191, 214, 236, 200]; // light blue
  }
  else if (i < 2*stars.length/3){
    this.color = [235, 215, 224, 200]; // light red
  }
  else {
    this.color = [252, 238, 223, 200]; // light yellow
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

  var fadeOutOne = 60;
  var fadeOutTwo = 120;

  // when document is loaded and ready, execute my jQuery manipulations!

   $(document).ready(function() {
  //console.log('jquery is working');
  
  // Fade out gradients every 60 seconds
  $('.gradientOne').animate({ opacity:0 }, 30000 );

  if (currentTime > fadeOutOne ) {
  $('.gradientTwo').animate({ opacity: 0 }, 30000); 
    }

  if (currentTime > fadeOutTwo ){
  $('.gradientThree').animate({ opacity: 0}, 60000); }
 });
}