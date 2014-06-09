// adapting http://processing.org/examples/lineargradient.html

/** Simple Linear Gradient 
 *
 *The lerpColor() function is useful for interpolating between two colors.
 */

// Constants
var Y_AXIS = 1;
var X_AXIS = 2;


// color sets
var sunsetA = [
  [96, 34, 49], //Dark Red
  [35, 48, 67], //Dark Blue
  [163, 190, 192], //Light Blue
  [196, 86, 61], //Dark Orange 
  [47, 80, 115] //Medium Blue
];
var sunsetB = [
  [234, 138, 87], //Orange
  [206, 169, 151], //Pink
  [125, 149, 159], //Light Blue
  [252, 197, 117], //Yellow 
  [51, 78, 105] //Medium Blue
];
var twilight = [ 
  [29, 86, 141],
  [66, 69, 102],
  [24, 32, 79],
  [41, 58, 86],
  [22, 34, 60]
];
var nightTime = [ 
  [53, 55, 58],
  [38, 41, 48],
  [65, 67, 73],
  [23, 27, 35], 
  [98, 100, 103]
];
var sunriseEnd = [
  [243, 248, 251],
  [246, 240, 216],
  [233, 182, 129],
  [116, 141, 161],
  [232, 177, 146],
  [72, 112, 138]
];

var times = [sunsetA, twilight, nightTime, sunriseEnd];
var timePos = 0;

var lerpAmount = 0;

function setup() {
  createCanvas(640, 640);
  background(0);
}

function draw() {

  lerpAmount = ( (frameCount + 1) % 3000 ) / 3000; //lerpAmount goes from 0.0 to 1.0

  // change to the next times' color palette when lerpAmount reaches 0
  if (lerpAmount == 0) {
    timePos++;
    timePos = timePos % (times.length-1);
  }

  // generate 5 colors by lerping between the colors in the time array
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
  setGradient(0, 5*height/6, width, height/6, color4, color4, Y_AXIS);
}

function setGradient(x, y, w, h, c1, c2, axis) {

  noFill();
  var alph = 255;

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), alph];   // lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = [lerp(c1[0],c2[0],inter),lerp(c1[1],c2[1],inter),lerp(c1[2],c2[2],inter), alph];
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}
