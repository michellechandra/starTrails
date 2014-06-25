// adapted from Levente Sandor, CC BY-NC-SA http://www.openprocessing.org/sketch/128188

var wave1, wave2, wave3;
var soundFile, fft, waveform;

function setup() {
  soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
  fft = new FFT();
  soundFile.load(play);
  createCanvas(500, 500);
  wave1 = new SineWave(width/2, 0, 200);
  wave2 = new SineWave(50, 20, 5);
  wave3 = new SineWave(200, 50, 200);
}

function draw() {
  waveform = fft.waveform();

  fill(255,255,255,20);
  noStroke();
  rect(0, 0, width, height);
  noFill();
  stroke(0,0,255);
  strokeWeight(2)
  for (var y = 0; y < waveform.length; y += 5) {
    beginShape();
    for (var x = 0; x <= width; x += 5) {
      var a =  (wave1.amplitude(x, waveform[y]) + wave2.amplitude(x, waveform[y]) + wave3.amplitude(x, waveform[y])) * 2;
      vertex(y + a, x);
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


function play(aSound) {
  aSound.play();
}