// adapted from Levente Sandor, CC BY-NC-SA http://www.openprocessing.org/sketch/128188

var wave1, wave2, wave3;
var soundFile, fft, waveform, ampl;

function setup() {
  soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
  fft = new FFT();
  ampl = new Amplitude();
  soundFile.load(play);
  createCanvas(1000, 1000);
  wave1 = new SineWave(width/2, 0, 100);
  wave2 = new SineWave(50, 20, 5);
  wave3 = new SineWave(200, 2, 50);
}

function draw() {


  oldWaveform = waveform;
  waveform = fft.waveform();

  // if (ampl.getLevel() > .04) {
    waveform = fft.waveform();
    if (ampl.getLevel() > .04) {
      for (i = 0; i<waveform.length; i++) {
        oldWaveform[i] = sqrt(oldWaveform[i] * oldWaveform[i] + waveform[i] * waveform[i]);
      }
    }

  fill(255,255,255,10);
  noStroke();
  rect(0, 0, width, height);
  noFill();
  for (var y = 0; y < waveform.length; y += 5) {
    strokeWeight(1+sin(x)*10);
    beginShape();
    stroke(0,noise(x)+50,noise(y)*50 + 105);
    for (var x = 0; x <= waveform.length; x += 10) {
      var theY = y * (noise(y)*oldWaveform[x]+oldWaveform[y]); // lerp(waveform[y], oldWaveform[y], map(frameCount%fcount,0,29,1,0) );
      var a =  2+(wave1.amplitude(x, theY) + wave2.amplitude(x, theY) + wave3.amplitude(x, theY) * 2);
      vertex( x, (y + a));
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