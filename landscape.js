/* "noisy landscape" by oggy, licensed under Creative Commons Attribution-Share Alike 3.0 and GNU GPL license.
Work: http://openprocessing.org/visuals/?visualID= 153917 
License: 
http://creativecommons.org/licenses/by-sa/3.0/
http://creativecommons.org/licenses/GPL/2.0/
*/

// Creative JavaScript wiki on instance mode: https://github.com/lmccart/itp-creative-js/wiki/Week-5
// Maybe Landscape changes on beat detection instead of volume?
// oscillate noise function based on sine wave

var offset = 100;
var rootn;
var xstep = 5;
var ystep = 5;
var windowScreen;
var dvec;
// p5 sound variables
var soundFile;
var fft;
var amplitude;
var volume = 0;

// array of all the frequency values
var freqValues = [];
var lastVol;
var lastHigh;
var numBands = 512;

function preload() {
  soundFile = loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3');
  //soundFile = loadSound('Schoenberg_03.mp3');
}

function setup () {
  var thisCanvas = createCanvas(windowWidth, windowHeight);
  //thisCanvas.position(0,0);
  windowScreen = createVector(0,0);
  rootn = createVector(0, 0); // initialize vectors once in setup (not in draw)
  dvec = createVector(0,0);

   // sound
  soundFile.play();
  fft = new p5.FFT(.01, numBands);
  amplitude = new p5.Amplitude(.985); // amplitude takes 'smoothing'
}
 
function draw() {
  clear(); // transparent background

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
  windowScreen.sub(dvec);
  rootn.add(createVector(.0019*dx, .02*dy));  

  // using the vector to store x and y values

  for (var j = 0; j < height/2; j += ystep) {

     noFill();

     beginShape();

    for (var i = 0; i < width; i += xstep) {
      
      volume = amplitude.getLevel();
      
      var n = noise(rootn.x + .019*i, rootn.y + .02*j)*volume; //ystep);   
      // calculating 2D noise by calculating x, y values in two for loops (noise grid)

      var tmpy = (offset + volume) * (n - 1) + j; // can affect tmpy value by multiplying by volume
      // or try affecting the noise value calculations with sound values instead
      //stroke(255);
      stroke(map(n, 0, .6, 180, 250))*volume;
    //  stroke(205, 205, 205, 205)*volume;
     // strokeWeight(map(n, 0, .6, 3, 10)*volume);
      vertex(i, height - tmpy);
    }
  

    endShape();

  }
}

