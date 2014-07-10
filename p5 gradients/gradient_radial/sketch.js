// adapting http://processing.org/examples/radialgradient.html


var dim;

function setup() {
  createCanvas(640, 360);
  background(0);
  dim = width/2;
  colorMode(HSB, 360, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(1);
}

function draw() {
  background(0);
  for (var x = 0; x <= width; x+=dim) {
    drawGradient(x, height/2);
  }
}

function drawGradient(x, y) {
  var radius = dim/2;
  var h = random(1,350);
  for (var r = radius; r > 0; r--) {
    h = (h + 1) % 360;
    fill(h, 90, 90);
    ellipse(x, y, r, r);
  }
}
