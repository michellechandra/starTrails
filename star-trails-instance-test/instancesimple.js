
/* "noisy landscape" by oggy, licensed under Creative Commons Attribution-Share Alike 3.0 and GNU GPL license.
Work: http://openprocessing.org/visuals/?visualID= 153917 
License: 
http://creativecommons.org/licenses/by-sa/3.0/
http://creativecommons.org/licenses/GPL/2.0/
*/

/* 
To Do:
Figure out the degree or x,y position so can fade out stars when reach sea landscape
Change shapes from circles to squares at certain points in music and rotate
Maybe have less stars and more clear delineation between shapes
Change their degree so jump forward more if song changes
Less stars/bigger stars
See individual shapes, have it look less like a line is being drawn
Larger shapes
Change color of stars at certain points?
Create Arc/Mountain shape instead of flat line

*/


// Global p5.sound variables \\
var volume = 0.01; // initial starting volume of amplitude (necessary for p5.sound)
var numBands = 256; // numer of frequency waves we are visualizing
var soundFile;  // variable to contain song we are visualizing
var fft;   
var amplitude;  
var duration = 0;  // length of song 
var currentTime = 0;   // finding the current time in the song to make changes at certain points of song
var freqValues = [];  // storing freqValues in an array
var lastVol;  // comparing previous and last volume
var lastHigh;

////////  ****** Start of LANDSCAPE Sketch by Oggy ported to p5.js as derivative sketch ******* \\\\\\\\\\

// Working in p5 instance mode, start of Sketch 1 of two sketches
// Instance mode allows us to layer canvas sketches

var s0 = function(sketch) {

  var rootn;   
  var windowScreen;
  var dvec;

  // Load our song to be visualized and play in callback function
	sketch.setup = function() {
   soundFile = sketch.loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3', function() {
     soundFile.play();
   });
    
    // create a canvas for this sketch that is the width of the user's browser window
 	  var thisCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    // using p5 dom library to position canvas on screen 
    thisCanvas.position(0,0);

    // using p5 dom library to give the canvas a css id 
    thisCanvas.id("canvas0");

    // create vectors to store x,y values of our landscape
	  windowScreen = sketch.createVector(0,0);
	  rootn = sketch.createVector(0, 0); 
	  dvec = sketch.createVector(0,0);
     
    // call p5 sound fft function for the number of waves to be analyzed
    fft = new p5.FFT(.01, numBands);

    // call p5 sound library function to get the amplitude of our song
    amplitude = new p5.Amplitude(.985); 

	}

	sketch.draw = function() {

 	 sketch.clear(); // transparent background

   // offset our landscape 150 below middle of screen
   var offset = 150;

   // how long will each vertice be in line drawn for landscape
   // changing this value makes landscape smoother like water or more jagged like terrain
   var xstep = 10;

   // how far apart the lines are of our landscape
   var ystep = 10;
  
   // changing these values affects how fast the landscape lines are added to the screen
 	 var dx = 3*volume;       
   var dy = 5*volume;       

   dvec.x = dx;
   dvec.y = dy;
   windowScreen.sub(dvec);  // remove vector line from screen 
   rootn.add(sketch.createVector(.019*dx, .1*dy));  // add vecotr line to screen

      // using vector to store y values
      for (var j = 0; j < sketch.height/2; j += ystep) {
        
        // Drawing lines, don't need fill
    	  sketch.noFill();
        
        // using beginShape() to draw landscape lines
		    sketch.beginShape();

      // using vector to store x values
    	for (var i = 0; i < sketch.width; i += xstep) {
          
          // getting amplitude level of song to move the landscape to the volume
     	    volume = amplitude.getLevel();
          
          // landscape line organic motion created using noise function affected by volume
          var n = sketch.noise(rootn.x + .019*i, rootn.y + .02*j)*volume; 
          
          var tmpy = offset * (n - 1) + j; 

          // mapping stroke and stroke weight to volume
          sketch.stroke(sketch.map(n, 0, .6, 200, 255))*volume;
          sketch.strokeWeight(sketch.map(n, 0, .6, .25, 5));

          // our shape is just a bunch of vertex points!
          sketch.vertex(i, sketch.height - tmpy);
    	}
    // end of drawing line shape
    sketch.endShape();

  }
}
}; 

var p5withsound = new p5(s0); // stores a reference to s0 sketch and initializes an instance of p5

////////  ****** End of Landscape setup ******* \\\\\\\\\\

////////  ****** Start of SKY Sketch ******* \\\\\\\\\\

// Working in p5 instance mode, start of Sketch 2 of two sketches
var s1 = function(sketch) {

var stars = []; // array to hold array of star objects
var increment = 0;  // value to increment our stars to complete circle shape

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
 
  updateIncrement();  // update increment value stars drawn according to song currentTime and duration
  
  // get frequency wave analysis and store in array
  freqValues = fft.analyze();

  // get frequency wave analysis for waves that correlate to certain sound types
  var bass = fft.getEnergy('bass');
  var lowMid = fft.getEnergy('lowMid');
  var mid = fft.getEnergy('mid');
  var high = fft.getEnergy('highMid');

  // for every Star object in the array called 'stars'...

  for (var i = 0; i<stars.length; i++) {
    
    // map different sizes and colors to different stars depending on FFT waves they represent
    if (i < stars.length/3 && (volume - lastVol > 0.01) ) {
      stars[i].diameter = sketch.map(bass, 50, 244, 15, 20)*volume;
      stars[i].increment = sketch.map(bass, 50, 244, 0, 360)*volume;
      stars[i].color[4] = sketch.map(bass, 50, 244, 0, 255)*volume;  // this isn't noticeably affecting alpha
    }
    else if (i < stars.length/2 && high - lastHigh > 0.04) {
      stars[i].diameter = sketch.map(lowMid, 68, 215, 6, 13)*volume;
      stars[i].increment = sketch.map(lowMid, 68, 215, 0, 360)*volume;
      stars[i].color[4] = sketch.map(lowMid, 68, 215, 0, 255)*volume;
    }
    else {
      stars[i].diameter = sketch.map(mid, 60, 160, 0, 1)*volume;
      stars[i].increment = sketch.map(mid, 60, 160, 0, 360)*volume;
      stars[i].color[4] = sketch.map(mid, 60, 160, 0, 255)*volume;
    }
    stars[i].update();  
  }
   
  // reset these variables  
  lastVol = volume;
  lastHigh = high;

}

// The star constructor for each star object 
// our (initial starting values), don't need to give a value here but can
function Star(i) {
  
  // assign color to our stars depending on which frequency waves they represent
  var totalStarCount = numBands/2;

  if (i < totalStarCount/5 ){
   this.color = [143, 180, 182, 255]; // gray teal
  }
  
  else if (i < totalStarCount/2){
    this.color = [42, 63, 85, 255];
  }
  else {
      this.color = [227, 226, 208, 255];
  } 
  this.color;

  // diameter of circle drawn for each star
  this.diameter;

  // what degree angle to start the star around the circle
  this.degree = sketch.random(0, 360);

  // distance from center of circle
  this.radius = sketch.random(0, sketch.width/1.2);

  // sin/cos equation to convert polar coordinates to cartesian and draw stars in a circle
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
    sketch.fill(this.color, 255);  // set color and alpha
    sketch.ellipse(this.x, this.y, this.diameter, this.diameter);  // give the circles x, y and diamter
}

// update rotation based on song time / duration
function updateIncrement() {

  // get the currentTime of the song using p5 getter function
  currentTime = soundFile.currentTime();

  // get the length of the song using p5 sound library
  duration = soundFile.duration();

  // map the time it takes to draw stars in a circle to duration of song
  var myIncrement = sketch.map(currentTime, 0, duration, 0, 360);

  // check for errors before proceeding
  if (isNaN(myIncrement)) {
   // console.log('loading...');
  }
  else {
    increment = myIncrement;
  }

  // variables to fade out our gradients 
  var fadeOutOne = 40;
  var fadeOutTwo = 90;

  // Check state of currentTime and fade out gradient
  if (currentTime > fadeOutOne ) {
  $('.gradientTwo').animate({ opacity: 0 }, 30000); 
    }
}

  // when document is loaded and ready, execute jQuery manipulations to fade out gradient backgrounds

   $(document).ready(function() {
  // Fade out my first gradient when the DOM is ready
  $('.gradientOne').animate({ opacity:0 }, 30000 );
 });

	};

var p5nosound = new p5(s1); // stores a reference to s0 sketch and initializes an instance of p5

////////  ****** End of Sky sketch ******* \\\\\\\\\\
