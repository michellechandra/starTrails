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

// code for setup
function setup() {
  soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
  createCanvas(windowWidth, windowHeight);
  createBuildings(numberOfBuildings);
  noStroke();
  ellipseMode(CENTER);
  noStroke();

  centerX = width/4; // center of the circle
  centerY = -height/4; // center of the circle

  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (i =0; i<=numBands/2; i++) {
    stars.push(new Star(i));
  }

  // sound
  soundFile.play();
  fft = new FFT(.01, numBands);
  amplitude = new Amplitude(.985); // amplitude takes 'smoothing'
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
  volume = amplitude.getLevel();

  //var bRed = map(currentTime, 0, duration, 20, 0);
  //var bBlue = map(currentTime, 0, duration, 20, 40);

  updateIncrement();

  freqValues = fft.processFreq();

  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {
   // stars[i].color[4] = map (freqValues[i], 120, 256, 0, 255);
   stars[i].this.starColor[3] = i % 100;
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
function Star(i) {
  var totalStarCount = numBands/2;
  if (i < totalStarCount/5 ){
       this.starColor = [252, 238, 223, 100]; // light yellow
    //this.color = [0,0,0,200];
  }
  else if (i < totalStarCount/2){
    this.starColor = [235, 215, 224, 100]; // light red
    // this.color = [0,0,0,200];
  }
  else {
    this.starColor = [191, 214, 236, 100]; // light blue
  }
  this.diameter = random(1,2); // diameter of each star ellipse
  this.degree = random(-360, 360);
  this.radius = random(-width/1.2, width/1.2);

    if (this.degree >= radians(-315) && this.degree <= radians(-225)) {
    this.starColor = [0,1];
}
 // this.x = centerX + (this.radius * cos(radians(this.degree)));
 // this.y = centerY + (this.radius * sin(radians(this.degree)));

  if (this.degree >= TWO_PI && this.degree <= PI) {
      this.x = centerX + (((this.radius)) * cos(radians(this.degree)));
      this.y = centerY + (((this.radius)*250) * sin(radians(this.degree)));
  //this.x = centerX + (this.radius * cos(radians(this.degree));
    } else {
      this.x = centerX + (((this.radius)) * cos(radians(this.degree)));
      this.y = centerY + (this.radius * sin(radians(this.degree)));
}
}


// called by draw loop
Star.prototype.update = function() {
    // update the x and y position based on the increment
   // this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
  //  this.y = centerY + (this.radius * sin(radians(this.degree + increment)));

    if (this.degree >= TWO_PI && this.degree <= PI) {
      this.x = centerX + (((this.radius)) * cos(radians(this.degree + increment)));
      this.y = centerY + (((this.radius)*250) * sin(radians(this.degree + increment)));
  //this.x = centerX + (this.radius * cos(radians(this.degree));
    } else {
      this.x = centerX + (((this.radius)) * cos(radians(this.degree+ increment)));
      this.y = centerY + (this.radius * sin(radians(this.degree+ increment)));
}
    noStroke;
    // draw an ellipse at the new x and y position
    fill(this.starColor);
    if (this.degree >= TWO_PI && this.degree <= PI) {
    this.starColor = [0,1];
}
   // stroke(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
}


// update rotation based on song time / duration
function updateIncrement() {
  currentTime = soundFile.currentTime();
  //console.log(currentTime);

  duration = soundFile.duration();
  var myIncrement = map(currentTime, 0, duration, 0, 360);
  if (isNaN(myIncrement)) {
    console.log('not ready');
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

     // Checking element is selected
 /* if ( $( '.gradientOne' ).length) {
    console.log('jquery' ); 
  } */
}



// called during setup
function createBuildings(numberOfBuildings) {
  for (var i = 0; i < numberOfBuildings; i++){
  //   var n = numberOfBuildings[i];
  //  this.xPos = map(i,0,this.numberOfBuildings.length,100,windowWidth - 100);
  //  this.width = map(i,0,max(numberOfBuildings),14,120);
    buildings.push( new Building() );

  }
};

// The Building Class
var Building = function(_w, _xPos) {
  // these are important to position the range of the buildings
    this.height = random(20, 200);
    this.width = this.height / random(1.2, 5);
   // this.width = _w;
   // this.xPos = _xPos;
    this.yPos = windowHeight; // align the bottom of the buildings
  //this.xpos = map(i,0,40,this.width,windowWidth - 100);
  //this.yPos = random(windowHeight, windowHeight-40); // align the bottom of the buildings
   this.xPos = random(0, window.width);
 
  this.buildingColor = [20, 20, 20, 1];
 

  // creates an array of this buildings' windows
  this.windows = [];
  this.createWindows(this.xPos, this.yPos - this.height, this.width, this.height);
};

/*Building.prototype.createBuildings = function() {
    for (var i = 0; i < buildings.length; i++) {
     this.width = map(i, 0, max(buildings), buildings.length, windowWidth);
     this.xpos = map(i, 0, buildings.length, 100, windowWidth-100);
    }

};*/

// called by every Building when they are instantiated
Building.prototype.createWindows = function(bX, bY, bW, bH) {
  // fill the building with windows every 10 pixels based on building x,y,w,h (bX, bY, bW, bH)
  var wWidth = 10;
  var wHeight = 10;
  for (var i = bX + wWidth; i < bX + bW - wWidth; i += wWidth) {
    for (var j = bY + wHeight; j < bY + bH - wHeight; j += wHeight) {
      this.windows.push( new Window(i, j, wWidth/6, wHeight/6) ); // dividing wWidth and wHeight by 2, the other half will be window spacing
    }
  }
};

Building.prototype.update = function() {
  //fill(this.c);
 // fill(this.buildingColor);
 // stroke(this.buildingColor);
  //stroke(20);
   fill(this.buildingColor);
  rect(this.xPos, this.yPos, this.width, -this.height);
  for (i = 0; i < this.windows.length; i++) {
    this.windows[i].update();
  }
};


// The Window Class
var Window = function(_x, _y, _w, _h) {
  this.windowColor = random(160,180);
  this.x = _x;
  this.y = _y;
  this.w = _w;
  this.h = _h;
  ellipse(this.x, this.y, this.w, this.h);
  this.onThreshold = random(); // each building has an unchanging onThreshold betw 0.0 and 1.0
};

Window.prototype.update = function(){
  //if (this.onThreshold > onThreshold) {
    fill(this.windowColor);
 // } else {
//   fill(0);
//  }
//  noStroke();
  ellipse(this.x, this.y, this.w, this.h);
};




