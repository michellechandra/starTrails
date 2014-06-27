// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Additive Wave
// Create a more complex wave by adding two waves together.

// Maybe better for this answer to be OOP???

var xspacing = 2;   // How far apart should each horizontal position be spaced
var w;              // Width of entire wave
var maxwaves = 20;   // total # of waves to add together

var theta = 0.4;
var amplitudewaves = [];   // Height of wave
var dx = [];          // Value for incrementing X, to be calculated as a function of period and xspacing
var yvalues;                           // Using an array to store height values for the wave (not entirely necessary)

// p5sound variables
var soundFile;

// =======================
// variables tied to music
// =======================

// p5sound 
//var soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
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


var centerX; // position star trails radially in the center
var centerY;


function setup() {
  soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
  createCanvas(900,360);

  colorMode(RGB, 255, 255, 255, 100);
    background(0, 0, 0, 4);
  w = width + 200;

  // sound
  soundFile.play();
  fft = new FFT(.01, numBands);
  amplitude = new Amplitude(.985);
 // amplitude.input();
  amplitude.toggleNormalize();

  for (var i = 0; i < maxwaves; i++) {
    amplitudewaves[i] = random(10, 30);
   // xspacing = random(5,10);
    var period = random(100,300); // How many pixels before the wave repeats
    dx[i] = (TWO_PI / period) * xspacing;
  }

  yvalues = [];



}

function draw() {
  background(51, 51, 51, 25);
  volume = amplitude.getLevel();
  //console.log(volume);
  freqValues = fft.processFreq();
  calcWave();
  renderWave();

}

function calcWave() {
  // Increment theta (try different values for 'angular velocity' here
  theta += .1;


  // Set all height values to zero
  for (var i = 0; i < w/xspacing; i++) {
    yvalues[i] = 0;
  }

  // Accumulate wave height values
  for (var j = 0; j < maxwaves; j++) {
    var x = theta;
    for (var i = 0; i < yvalues.length; i++) {
      // Every other wave is cosine instead of sine
      if (j % 2 == 0)  yvalues[i] += sin(x)*amplitudewaves[j];
      else yvalues[i] += cos(x)*amplitudewaves[j];
      x+=dx[j];
    }
  }
}

function renderWave() {
  // A simple way to draw the wave with an ellipse at each position

  noStroke();
  fill(0,180, 255,250);

  for (var x = 0; x < yvalues.length; x++) {
 if (freqValues[x] == 0) {
  var diameter = 3;
 }
  else if (volume > .1) {
   var diameter = map(freqValues[x], 120, 256, 30, 90)*volume;
}
    else {
      var diameter = map(freqValues[x],120, 256, 10, 30)*volume;
    }
 
 console.log(diameter);

  fill(30,180, 255,100);
  ellipse(x*xspacing-250,height/2.2+yvalues[x],diameter,diameter);
  fill(0,180, 255,200);
  ellipse(x*xspacing-100,((height/2.1)+20)+yvalues[x],diameter,diameter);

  fill(30,180, 255,100);
  ellipse(x*xspacing,height/3+yvalues[x],diameter,diameter);
  fill(0,180, 255,200);
  ellipse(x*xspacing-50,height/2+yvalues[x],diameter,diameter);

    
   fill(230,180, 255,100);
   ellipse(x*xspacing,height/3.1+yvalues[x],diameter,diameter);
   fill(0,180, 255,200);
   ellipse(x*xspacing,height/3.2+yvalues[x],diameter,diameter);
   fill(230,180, 255,100);

   /*fill(230,180, 255,100);
   ellipse(x*xspacing-100,height/2.1+yvalues[x],diameter,diameter);
   fill(0,180, 255,200);
   ellipse(x*xspacing-100,height/2.2+yvalues[x],diameter,diameter);
   fill(230,180, 255,100);

       
   ellipse(x*xspacing,(height/4)*3+yvalues[x],diameter,diameter);
   ellipse(x*xspacing-250,(height/6)*5+yvalues[x],diameter,diameter);
   ellipse(x*xspacing-100,(height/6)*4+yvalues[x],diameter,diameter);
   ellipse(x*xspacing-50,(height/5)*3+yvalues[x],diameter,diameter); */
  

}
}