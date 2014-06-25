// adapted from Levente Sandor, CC BY-NC-SA http://www.openprocessing.org/sketch/128188

var wave1, wave2, wave3;

function setup() {
  createCanvas(500, 500);
  wave1 = new SineWave(250, 300, 10);
  wave2 = new SineWave(50, 20, 5);
  wave3 = new SineWave(200, 50, 200);
}
 
function draw() {
  fill(255,255,255,2);
  noStroke();
  rect(0, 0, width, height);
  noFill();
  stroke(0);
  for (var y = 0; y < height; y += 5) {
    beginShape();
    for (var x = 0; x <= width; x += 5) {
      var a =  (wave1.amplitude(x, y) + wave2.amplitude(x, y) + wave3.amplitude(x, y)) * 2;
      vertex(x, y + a);
    }
    endShape();
  }
}
 
var SineWave = function(cx, cy, wavelength) {
    this.cx = cx;
    this.cy = cy;
    this.wavelength = wavelength;
  };

SineWave.prototype.amplitude = function(x, y) {
    var dx = x - this.cx;
    var dy = y - this.cy;
    return sin((sqrt(dx * dx + dy * dy) - frameCount) / this.wavelength);
  };
