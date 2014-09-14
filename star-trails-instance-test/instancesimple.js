
/* "noisy landscape" by oggy, licensed under Creative Commons Attribution-Share Alike 3.0 and GNU GPL license.
Work: http://openprocessing.org/visuals/?visualID= 153917 
License: 
http://creativecommons.org/licenses/by-sa/3.0/
http://creativecommons.org/licenses/GPL/2.0/
*/


// Global p5.sound Variables \\
var volume = 0.01;
var numBands = 512;
var soundFile;
var fft;
var amplitude;
var duration = 0;
var currentTime = 0;
var freqValues = [];
var lastVol;
var lastHigh;

////////  ****** Start of LANDSCAPE Sketch ******* \\\\\\\\\\

var s0 = function(sketch) {

  var rootn;
  var windowScreen;
  var dvec;

	//sketch.preload = function() {
  //     soundFile = sketch.loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3');
 //   }

	/* EXAMPLE CODE

	sketch.sound = sketch.loadSound('blah.mp3');
	sketch.volume = 0;
    
    This variable cannot be accessed anywhere except inside this s0 thing
	var x = 0;

	This variable can be accessed outside of s0
	sketch.y = 0;

	sketch.volume = sketch.sound.getLevel(); */

	sketch.setup = function() {
    soundFile = sketch.loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3', function() {
      soundFile.play();
    });

 	  var thisCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    thisCanvas.position(0,0);
    thisCanvas.id("canvas0");
	  windowScreen = sketch.createVector(0,0);
	  rootn = sketch.createVector(0, 0); 
	  dvec = sketch.createVector(0,0);
     
    fft = new p5.FFT(.01, numBands);
    amplitude = new p5.Amplitude(.985); 

	}

	sketch.draw = function() {
 	 sketch.clear(); // transparent background
   var offset = 100;
   var xstep = 10;
   var ystep = 10;


 	 // don't need these variables outside of this sketch, so no need to namespace
 	   var dx = 5;       
     var dy = 3;       

      if (sketch.abs(dx) < .3) {
        return dx = 0;
      }

      if (sketch.abs(dy) < .3) {
        return dy = 0;
      } 

      dvec.x = dx;
      dvec.y = dy;
      windowScreen.sub(dvec);
      rootn.add(sketch.createVector(.0019*dx, .02*dy));  

      // using the vector to store x and y values
      for (var j = 0; j < sketch.height/2; j += ystep) {

    	sketch.noFill();
		  sketch.beginShape();

    	for (var i = 0; i < sketch.width; i += xstep) {
      
     	volume = amplitude.getLevel();
        var n = sketch.noise(rootn.x + .019*i, rootn.y + .02*j)*volume; 

        var tmpy = (offset + volume) * (n - 1) + j; 
        sketch.stroke(sketch.map(n, 0, .6, 0, 100))*volume;
        sketch.vertex(i, sketch.height - tmpy);
    	}
 
    sketch.endShape();

  }
}
}; // end of sketch0 setup

var p5withsound = new p5(s0); // this stores a reference to s0 sketch and initializes an instance of p5

////////  ****** Start of SKY Sketch ******* \\\\\\\\\\

var s1 = function(sketch) {

var stars = []; // array to hold array of star objects
var increment = 0;

sketch.setup = function() {
 
  var myCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
  myCanvas.position(0,0);
  myCanvas.id("canvas1");

  sketch.ellipseMode(sketch.CENTER);
  sketch.noStroke();

  centerX = sketch.width/2; // center of the circle
  centerY = sketch.height/2; // center of the circle

  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (var i =0; i<=numBands/2; i++) {
    stars.push(new Star(i));
  }
}

sketch.draw = function() {

  updateIncrement();

  
  freqValues = fft.analyze();
  var bass = fft.getEnergy('bass');
  var lowMid = fft.getEnergy('lowMid');
  var mid = fft.getEnergy('mid');
  var high = fft.getEnergy('highMid');

  // for every Star object in the array called 'stars'...

  for (var i = 0; i<stars.length; i++) {
    //stars[i].color[4] = map(freqValues[i], 120, 256, 0, 50)*volume;
    if (i < stars.length/3 && volume - lastVol > 0.01) {
      stars[i].diameter = sketch.map(bass, 50, 244, 15, 20)*volume;
      stars[i].increment = sketch.map(bass, 50, 244, 0, 360)*volume;
      stars[i].color[4] = sketch.map(bass, 50, 244, 0, 50)*volume;  // this isn't noticeably affecting alpha
    }
    else if (i < stars.length/2 && high - lastHigh > 0.04) {
      stars[i].diameter = sketch.map(lowMid, 68, 215, 6, 13)*volume;
      stars[i].increment = sketch.map(lowMid, 68, 215, 0, 360)*volume;
      stars[i].color[4] = sketch.map(lowMid, 68, 215, 0, 50)*volume;
    }
    else {
      stars[i].diameter = sketch.map(mid, 60, 160, 0, 1)*volume;
      stars[i].increment = sketch.map(mid, 60, 160, 0, 360)*volume;
      stars[i].color[4] = sketch.map(mid, 60, 160, 0, 50)*volume;
    }
    stars[i].update();
  }

    lastVol = volume;
  lastHigh = high;

}

// The star object
function Star(i) {

  var totalStarCount = numBands/2;
   if (i < totalStarCount/5 ){
   this.color = [143, 180, 182]; // gray teal
  }
     else if (i < totalStarCount/2){
 // else if (i < 2*stars.length/3){
    this.color = [42, 63, 85];
  }
  else {
      this.color = [227, 226, 208];
  }
  this.diameter = 0;
  this.degree = sketch.random(-360, 360);
  this.radius = sketch.random(-sketch.width/1.2, sketch.width/1.2);
  this.x = centerX + (this.radius * sketch.cos(sketch.radians(this.degree)));
  this.y = centerY + (this.radius * sketch.sin(sketch.radians(this.degree)));
}

// called by draw loop
Star.prototype.update = function() {
    // update the x and y position based on the increment
    this.x = centerX + (this.radius * sketch.cos(sketch.radians(this.degree + increment)));
    this.y = centerY + (this.radius * sketch.sin(sketch.radians(this.degree + increment)));
    sketch.noStroke;
    // draw an ellipse at the new x and y position
    sketch.fill(this.color);
    sketch.ellipse(this.x, this.y, this.diameter, this.diameter);
}

// update rotation based on song time / duration
function updateIncrement() {
  currentTime = soundFile.currentTime();
  duration = soundFile.duration();
  var myIncrement = sketch.map(currentTime, 0, duration, 0, 360);
  if (isNaN(myIncrement)) {
   // console.log('loading...');
  }
  else {
    increment = myIncrement;
  }
}
	};

var p5nosound = new p5(s1);
