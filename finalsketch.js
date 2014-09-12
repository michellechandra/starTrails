/* "noisy landscape" by oggy, licensed under Creative Commons Attribution-Share Alike 3.0 and GNU GPL license.
Work: http://openprocessing.org/visuals/?visualID= 153917 
License: 
http://creativecommons.org/licenses/by-sa/3.0/
http://creativecommons.org/licenses/GPL/2.0/
*/

// Creative JavaScript wiki on instance mode: https://github.com/lmccart/itp-creative-js/wiki/Week-5
// Maybe Landscape changes on beat detection instead of volume?
// oscillate noise function based on sin wave?


// p5 sound variables
var soundFile;
var fft;
var amplitude;

// array of all the frequency values
var freqValues = [];
var lastVol;
var lastHigh;
var numBands = 512;
var duration = 0;
var currentTime = 0;

var stars = [];
var increment = 0; // map(currentTime, 0, duration, 0, 360)

function setup() {
  createCanvas(windowWidth, windowHeight);
  soundFile = loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3', startSound);
  fft = new p5.FFT(.01, numBands);
  amplitude = new p5.Amplitude(.985); // amplitude takes 'smoothing'

  var s0 = function( sketch ) { 

    var volume = 0;

    var offset = 100;
    var rootn;
    var xstep = 5;
    var ystep = 5;
    var windowScreen;
    var dvec;

    sketch.setup = function() {
      var thisCanvas = sketch.createCanvas(windowWidth, windowHeight);
      //thisCanvas.position(0,0);
      windowScreen = sketch.createVector(0,0);
      rootn = sketch.createVector(0, 0); // initialize vectors once in setup (not in draw)
      dvec = sketch.createVector(0,0);
    }
   
    sketch.draw = function() {
      sketch.clear(); // transparent background

      var dx = 5;       //map(mouseX, 0, displayWidth, -5, 5);
      var dy = 3;       //map(mouseY, 0, displayHeight, 5, -5);

      if (abs(dx) < .3) {
        return dx = 0;
      }

      if (abs(dy) < .3) {
        return dy = 0;
      } 

   // var vol = map(mouseX,0,width,0,1);

  //volume = amplitude.getLevel();
    
    dvec.x = dx;
    dvec.y = dy;
    sketch.windowScreen.sub(dvec);
    sketch.rootn.add(createVector(.0019*dx, .02*dy));  

    // using the vector to store x and y values

    for (var j = 0; j < height/2; j += ystep) {

       sketch.noFill();

       beginShape();

      for (var i = 0; i < width; i += xstep) {
        
        volume = amplitude.getLevel();
        
        var n = noise(rootn.x + .019*i, rootn.y + .02*j)*volume; //ystep);   
        // calculating 2D noise by calculating x, y values in two for loops (noise grid)

        var tmpy = (offset + volume) * (n - 1) + j; // can affect tmpy value by multiplying by volume
        // or try affecting the noise value calculations with sound values instead
        //stroke(255);
        sketch.stroke(map(n, 0, .6, 180, 250))*volume;
      //  stroke(205, 205, 205, 205)*volume;
       // strokeWeight(map(n, 0, .6, 3, 10)*volume);
        vertex(i, height - tmpy);
      }
    

      endShape();

    }
  }
};

  var myp5_0 = new p5(s0, 'canvas0');



  var s1 = function( sketch ) {
    var volume = 0;

    var centerX;
    var centerY;

    //var degree = 0; // how far around the circle

    var lastVol;
    var lastHigh;


    sketch.setup = function() {
      var thisCanvas = sketch.createCanvas(windowWidth, windowHeight);
      sketch.ellipseMode(CENTER);
      sketch.noStroke();

      centerX = width/2; // center of the circle
      centerY = height/2; // center of the circle

      // create a bunch of star objects and add them to the array called stars
      // length of stars array will be linked to buffer size
      for (var i =0; i<=numBands/2; i++) {
        stars.push(new Star(i));
      }
    }

  sketch.draw = function() { 
    // get volume from the amplitude process
    volume = amplitude.getLevel();

    freqValues = fft.analyze();
    var bass = fft.getEnergy('bass');
    var lowMid = fft.getEnergy('lowMid');
    var mid = fft.getEnergy('mid');
    var high = fft.getEnergy('highMid');
    // for every Star object in the array called 'stars'...

    for (var i = 0; i<stars.length; i++) {
      //stars[i].color[4] = map(freqValues[i], 120, 256, 0, 50)*volume;
      if (i < stars.length/3 && volume - lastVol > 0.01) {
        stars[i].diameter = map(bass, 50, 244, 15, 20)*volume;
        stars[i].increment = map(bass, 50, 244, 0, 360)*volume;
        stars[i].color[4] = map(bass, 50, 244, 0, 50)*volume;  // this isn't noticeably affecting alpha
      }
      else if (i < stars.length/2 && high - lastHigh > 0.04) {
        stars[i].diameter = map(lowMid, 68, 215, 6, 13)*volume;
        stars[i].increment = map(lowMid, 68, 215, 0, 360)*volume;
        stars[i].color[4] = map(lowMid, 68, 215, 0, 50)*volume;
      }
      else {
        stars[i].diameter = map(mid, 60, 160, 0, 1)*volume;
        stars[i].increment = map(mid, 60, 160, 0, 360)*volume;
        stars[i].color[4] = map(mid, 60, 160, 0, 50)*volume;
      }
      stars[i].update();
    }

    lastVol = volume;
    lastHigh = high;

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
      sketch.this.color = [42, 63, 85, 255];
    }
    else {
      sketch.this.color = [227, 226, 208, 255];
    }
    sketch.this.diameter;
    this.degree = sketch.random(-360, 360);
    sketch.this.radius = random(-width/1.2, width/1.2);
    sketch.this.x = centerX + (this.radius * cos(radians(this.degree)));
    sketch.this.y = centerY + (this.radius * sin(radians(this.degree)));
  }

  Star.prototype.update = function() {
    // update the x and y position based on the increment
    sketch.this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
    sketch.this.y = centerY + (this.radius * sin(radians(this.degree + increment)));
  //  console.log(this.x, this.y);
    sketch.noStroke;
    // draw an ellipse at the new x and y position
    sketch.fill(this.color);
    sketch.ellipse(this.x, this.y, this.diameter, this.diameter);
  }


  };

  var myp5_1 = new p5(s1, 'canvas1');

} // end setup()

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
}

function draw() {
  updateIncrement();
}

function startSound() {
  soundFile.play();

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
 // });
}