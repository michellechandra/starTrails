var margin = 100;
var rootn;
var xstep = 10;
var ystep = 5;
var windowScreen;

function setup () {
  var thisCanvas = createCanvas(displayWidth, displayHeight);
  windowScreen = createVector(0,0);
  rootn = createVector(0, 0);
}
 
function draw() {
  background(220);

  var dx = map(mouseX, 0, displayWidth, -5, 5);
  var dy = map(mouseY, 0, displayHeight, 5, -5);

  if (abs(dx) < .3) {
    return dx = 0;
  }

  if (abs(dy) < .3) {
    return dy = 0;
  }

  windowScreen.sub(createVector(dx, dy));
  rootn.add(createVector(.019*dx, .02*dy));

  for (var j = 0; j < height; j += ystep) {

     noFill();

     beginShape();

    for (var i = 0; i < width; i += xstep) {

      var n = noise(rootn.x + .019*i, rootn.y + .02*j); //ystep);
      var tmpy = margin * (n - 1) + j;

      stroke(map(n, 0, .6, 0, 155));
      vertex(i, height - tmpy);
    }

    endShape();

  }
}

