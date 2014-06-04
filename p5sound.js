/**
 *  This library defines the P5sound class and webaudio wrappers for p5.
 *
 *  Version .0001
 *  Experimenting with Web Audio wrapper for p5.js
 *  Incorporates elements from:
 *   - TONE.js (c) Yotam Mann, 2014. Licensed under The MIT License (MIT). https://github.com/TONEnoTONE/Tone.js
 *   - buzz.js (c) Jay Salvat, 2013. Licensed under The MIT License (MIT). http://buzz.jaysalvat.com/
 */


/**
 * Web Audio SHIMS and helper functions to ensure compatability across browsers
 */

// If window.AudioContext is unimplemented, it will alias to window.webkitAudioContext.
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Create the Audio Context
var audiocontext;
audiocontext = new AudioContext();

// SHIMS (inspired by tone.js and the AudioContext MonkeyPatch https://github.com/cwilso/AudioContext-MonkeyPatch/ (c) 2013 Chris Wilson, Licensed under the Apache License) //

if (typeof audiocontext.createGain !== "function"){
  audioContext.createGain = audioContext.createGainNode;
}
if (typeof audiocontext.createDelay !== "function"){
  audioContext.createDelay = audioContext.createDelayNode;
}
if (typeof AudioBufferSourceNode.prototype.start !== "function"){
  AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn;
}
if (typeof AudioBufferSourceNode.prototype.stop !== "function"){
  AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff;
}
if (typeof OscillatorNode.prototype.start !== "function"){
  OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
}
if (typeof OscillatorNode.prototype.stop !== "function"){
  OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff; 
}
if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')){
  AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
}


/**
 * Determine which filetypes are supported (inspired by buzz.js)
 * The audio element (el) will only be used to test browser support for various audio formats
 */
el = document.createElement('audio');

isSupported = function() {
  return !!el.canPlayType;
}
isOGGSupported = function() {
  return !!el.canPlayType && el.canPlayType('audio/ogg; codecs="vorbis"');
}
isMP3Supported = function() {
  return !!el.canPlayType && el.canPlayType('audio/mpeg;');
}
isWAVSupported = function() {
  return !!el.canPlayType && el.canPlayType('audio/wav; codecs="1"');
}
isAACSupported = function() {
  return !!el.canPlayType && (el.canPlayType('audio/x-m4a;') || el.canPlayType('audio/aac;'));
}
isAIFSupported = function() {
  return !!el.canPlayType && el.canPlayType('audio/x-aiff;');
}
isFileSupported = function(extension) {
  switch(extension.toLowerCase())
  {
    case 'mp3':
      return this.isMP3Supported();
      break;
    case 'wav':
      return this.isWAVSupported();
      break;
    case 'ogg':
      return this.isOGGSupported();
      break;
    case 'aac', 'm4a', 'mp4':
      return this.isAACSupported();
      break;
    case 'aif', 'aiff':
      return this.isAIFSupported();
    default:
      return false;
      break;
  }
}


/**
 * Callbacks to be used for soundfile playback & loading
 */

// If a SoundFile is played before the buffer.source has loaded, it will load the file and pass this function as the callback.
var play_now = function(sfile) {
  console.log('play now: ' + sfile.url);
  if (sfile.buffer) {
    sfile.source = sfile.p5s.audiocontext.createBufferSource();
    sfile.source.buffer = sfile.buffer;
    sfile.source.loop = sfile.looping;

    // set variables like playback rate, gain and panning
    sfile.source.playbackRate.value = sfile.playbackRate;
    sfile.source.gain.value = sfile.gain;

    // connect to panner, which is already connected to the destination.
    sfile.source.connect(sfile.panner); 

    // play the sound
    sfile.source.start(0, this.startTime);
    sfile.startSeconds = sfile.p5s.audiocontext.currentTime;
    sfile.playing = true;
  }

  else {
    console.log(sfile.url + ' not loaded yet');
  }
}



/**
 * The P5sound object contains audio context, master gain
 * @constructor
 * @class P5sound
 * @param {window} a reference to the document window ("this")
 */
var p5Sound = function(w) {
  this.input = audiocontext.createGain();
  this.output = audiocontext.createGain();
  this.audiocontext = audiocontext;

  // tell the window about the p5 object so that we can reference it in the future
  w.p5sound = this;


  // connect output to master
  this.output.connect(this.audiocontext.destination);
}


p5Sound.prototype.connect = function(unit){
  this.output.connect(unit);
}

p5Sound.prototype.disconnect = function(unit){
  this.output.disconnect(unit);
}

// set gain ("amplitude?")
p5Sound.prototype.setGain = function(vol){
  this.output.gain.value = vol;
}

// get gain ("amplitude?")
p5Sound.prototype.getGain = function(){
  return this.output.gain.value;
}



/**
 * The SoundFile object.
 * 
 * Because sound file formats such as mp3, ogg, wav and m4a/aac are not compatible across all web browsers, 
 * you have the option to include multiple paths to multiple file formats (i.e. sound.wav, sound.mp3, sound.ogg)
 *
 * @constructor
 * @class SoundFile
 * @param {path1} [path1]   path to a sound file 
 * @param {path2} [path2]   (optional) path to additional format of the sound file to ensure compatability across browsers
 * @param {path3} [path3]   (optional) path to additional format of the sound file to ensure compatability across browsers
 */
var SoundFile = function(path1, path2, path3) {

  var path = path1;

  // verify support for audio file(s)
  if (path1) {
    var extension = path1.split(".").pop();
    var supported = isFileSupported(extension);
    if (supported) {
      console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
      }
    else {
      console.log('.'+extension + ' is not a valid audio extension in this web browser');
      path = path2;
      path1 = false;
      }
  }
  if (path1 == false && path2) {
    var extension = path2.split(".").pop();
    var supported = isFileSupported(extension);
    if (supported) {
      console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
      }
    else {
      console.log('.'+extension + ' is not a valid audio extension in this web browser');
      path = path3;
      path2 = false;
      }
  }
  if (path2 == false && path3) {
    var extension = path3.split(".").pop();
    var supported = isFileSupported(extension);
    if (supported) {
      console.log('.'+extension + ' is ' + supported + ' supported by your browser.');
      }
    else {
      console.log('.'+extension + ' is not a valid audio extension in this web browser');
      path = path2;
      }
  }

  // store a local reference to the window's p5sound context
  this.p5s = window.p5sound;


  // player variables
  this.url = path;
  this.source = null;
  this.buffer = null;
  this.playbackRate = 1;
  this.gain = 1;

  // start and end of playback / loop
  this.startTime = 0;
  this.endTime = null;

  // loop on/off - defaults to false
  this.looping = false;

  // playing - defaults to false
  this.playing = false;

  // time that playback was started, in millis
  this.startMillis = null;

  // sterep panning
  this.panPosition = 0.0;
  this.panner = audiocontext.createPanner();
  this.panner.panningModel = 'equalpower';
  this.panner.distanceModel = 'linear';
  this.panner.setPosition(0,0,0);



  // the panner is always connected to the destination
  this.panner.connect(this.p5s.output);

  // calls load to load the AudioBuffer asyncronously
  this.load();
}

// Load the sound file (this happens automatically when the soundfile is instantiated)
SoundFile.prototype.load = function(callback){
  if (!this.buffer) {
    var request = new XMLHttpRequest();
    request.open('GET', this.url, true);
    request.responseType = 'arraybuffer';
    // decode asyncrohonously
    var self = this;
    request.onload = function() {
      audiocontext.decodeAudioData(request.response, function(buff) {
        self.buffer = buff;
        if (callback) {
          callback(self);
        }
      });
    }
    request.send();
  }
  else {
    if (callback){
      callback(this);
    }
  }
}

/**
 * Play the SoundFile
 *
 * @method play
 * @param {Number} [rate]             (optional) playback rate. 1.0 is normal, .5 plays the sound at half speed, 2.0 is twice as fast.
 * @param {Number} [amp]              (optional) amplitude (volume) of playback
 * @for SoundFile
 */
SoundFile.prototype.play = function(rate, amp) {
  this.looping = false;
  if (this.buffer) {
    // make the source
    this.source = this.p5s.audiocontext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = this.looping;

    // set rate and amp if provided
    if (rate) {
      this.playbackRate = rate;
    }
    if (amp) {
      this.gain = amp;
    }

    // set variables like playback rate, gain and panning
    this.source.playbackRate.value = this.playbackRate;
    this.source.gain.value = this.gain;

    // connect to panner, which is already connected to the destination.
    this.source.connect(this.panner); 

    // play the sound
    this.source.start(0, this.startTime);
    this.startSeconds = this.p5s.audiocontext.currentTime;
    this.playing = true;
  }
  // If soundFile hasn't loaded the buffer yet, load it then play it in the callback
  else {
    console.log('not ready to play');
    this.load(play_now);
  }
}

/**
 * Loop the SoundFile. 
 *
 * Will be able to accept the following parameters (not yet implemented):
 * rate
 * rate, amp
 * rate, pos, amp
 * rate, pos, amp, add
 * rate, pos, amp, add, cue
 *
 * @method loop
 * @for SoundFile
 */
SoundFile.prototype.loop = function(rate, amp) {
  this.play(rate, amp);
  this.looping = true;
}

/**
 * Toggle whether a soundfile is looping or not. Either loop the sound, or stop looping (and playing) the sound.
 *
 * @method toggleLoop
 * @for SoundFile
 */
SoundFile.prototype.toggleLoop = function() {
  this.looping = !this.looping;
  if (this.source) {
    this.source.loop = this.looping;
  }
}


// SoundFile.prototype.playPause = function() {
//   var keepLoop = this.looping;
//   if (this.playing) {
//     this.stop();
//     this.playing = false;
//   } else {
//     this.play();
//     this.playing = true;
//     this.looping = keepLoop;
//   }
// }

/**
 * Pause a file that is currently playing.
 * Save the start time & loop status (true/false) so that we can continue playback from the same spot
 */
SoundFile.prototype.pause = function() {
  // TO DO
  if (this.isPlaying() && this.buffer && this.source) {
    this.startTime = this.currentTime();
    this.stop();
  }
  else {
    if (this.looping) {
      this.loop();
    }
    else {
      this.play();
    }
  }
}

/**
 * Returns 'true' if a SoundFile is looping, 'false' if not.
 *
 * @method isLooping
 * @return {Boolean}
 * @for SoundFile
 */
SoundFile.prototype.isLooping = function() {
  if (!this.source) {
    return false;
  }
  return this.looping;
}

SoundFile.prototype.isPlaying = function() {
  return this.playing;
}

/**
 * Stop soundfile playback.
 *
 * @method stop
 * @for SoundFile
 */
SoundFile.prototype.stop = function() {
  if (this.buffer && this.source) {
    this.source.stop();
    this.playing = false;
  }
}


/**
 * Set the playback rate of a sound file. Will change the speed and the pitch.
 *
 * @method rate
 * @param {Number} [playbackRate]     Set the playback rate. 1.0 is normal, .5 is half-speed, 2.0 is twice as fast. Must be greater than zero.
 * @for SoundFile
 */
SoundFile.prototype.rate = function(playbackRate) {
  this.playbackRate = playbackRate;
}

SoundFile.prototype.sampleRate = function() {
  // TO DO

}

SoundFile.prototype.frames = function() {
  // TO DO
  // Return Samples
}

/**
 * Set the output gain of a sound file.
 *
 * @method setGain
 * @param {Number} [vol]     Set the gain. 1.0 is normal. 0.0 is silence.
 * @for SoundFile
 */
SoundFile.prototype.setGain = function(vol){
  this.gain = vol;
}

/**
 * Returns the output gain of a sound file.
 *
 * @method getGain
 * @returns {Number}        1.0 is normal. 0.0 is silence.
 * @for SoundFile
 */
SoundFile.prototype.getGain = function(){
  return this.gain;
}


/**
 * Set the stereo panning of a sound file.
 *
 * @method pan
 * @param {Number} [pval]     Set the stereo panner to a floating point number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
 * @for SoundFile
 */
SoundFile.prototype.pan = function(pval) {
  this.panPosition = pval;
  pval = pval * 90.0;
  var xDeg = parseInt(pval);
  var zDeg = xDeg + 90;
  if (zDeg > 90) {
    zDeg = 180 - zDeg;
  }
  var x = Math.sin(xDeg * (Math.PI / 180));
  var z = Math.sin(zDeg * (Math.PI / 180));
  this.panner.setPosition(x, 0, z);
}

/**
 * Returns the current stereo panning value of a sound file.
 *
 * @method getPan
 * @return {Number}     Returns the stereo pan setting of the soundFile as a number between -1.0 (left) and 1.0 (right). 0.0 is center and default.
 * @for SoundFile
 */
SoundFile.prototype.getPan = function() {
  return this.panPosition;
}

// Connect the SoundFile to an output
SoundFile.prototype.connect = function(to) {
  if (this.buffer && this.source) {
    this.source.connect(to);
  }
}


/**
 * Returns the duration of a sound file.
 *
 * @method duration
 * @return {Number}     The duration of the soundFile in seconds.
 * @for SoundFile
 */
SoundFile.prototype.duration = function() {
  // Return Duration
  if (this.buffer) {
    return this.buffer.duration;
  } else {
    return 0;
  }
}

SoundFile.prototype.fade = function() {
  // TO DO
}

/**
 * Return the current moment in the song, in seconds
 */
SoundFile.prototype.currentTime = function() {
  // TO DO --> make this work with paused audio
  if (this.isPlaying()) {
    var howLong = ( (this.p5s.audiocontext.currentTime - this.startSeconds + this.startTime) * this.playbackRate ) % this.duration();
    return howLong;
  }
  else {
    return this.startTime;
  }

}

  /**
  * Amplitude
  * 
  * Inspired by tone.js https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/component/Meter.js
  * The MIT License (MIT) Copyright (c) Yotam Mann 2014
  * Also inspired by https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
  * The MIT License (MIT) Copyright (c) 2014 Chris Wilson
  * 
  * @constructor
  * @class Amplitude
  * @param {Object} [w]          a reference to the document.window (usually 'this', i.e. new Amplitude(this); ) 
  */
var Amplitude = function(smoothing) {

  // store a local reference to the window's p5sound context
  this.p5s = window.p5sound;

  // set audio context
  this.audiocontext = this.p5s.audiocontext;
  this.processor = this.audiocontext.createScriptProcessor(this.bufferSize);


  // Set to 512 for now. In future iterations, this should be inherited or parsed from p5sound's default
  this.bufferSize = 2048;

  //smoothing (defaults to .8)
  this.smoothing = .99;

  if (smoothing) {
    this.smoothing = smoothing;
  }

  console.log('smoothing: ' + this.smoothing);
  // this may only be necessary because of a Chrome bug
  this.processor.connect(this.audiocontext.destination);

  // the variables to return
  this.volume = 0;
  this.average = 0;

  this.processor.onaudioprocess = this.volumeAudioProcess.bind(this);
}



/**
 * Connects to the p5sound instance (master output) by default.
 * Optionally, you can pass in a specific source (i.e. a soundfile).
 * If you give it a source, the source's buffer must already exist (i.e. be playing) before connecting.
 *
 * @method input
 * @param {soundObject|undefined} [snd]       set the sound source (optional, defaults to master output). If it is a soundFile, the buffer must have finished loading.
 * @param {Number|undefined} [smoothing]      a range between 0.0 and .999 to smooth amplitude readings. This is optional, defaults to .8)
 * @for Amplitude
 */

 // TO DO figure out how to connect to a buffer before it is loaded
Amplitude.prototype.input = function(snd, smoothing) {
  var thisAmp = this;

  // set smoothing if smoothing is provided
  if (smoothing) {
    this.smoothing = smoothing;
  }

  // connect to the master out of p5s instance if no snd is provided
  if (snd == null) {
    console.log('no s!');
    this.p5s.output.connect(this.processor);
  }

  // If buffer.source hassn't finished loading, ideally, input should wait for the buffer to load and then connect.
  // But for now, it just connects to master.
  else if (snd.source == null) {
    console.log('source is not ready to connect. Connecting to master output instead');
    // Not working: snd.load(thisAmp.input); // TO DO: figure out how to make it work!
    this.p5s.output.connect(this.processor);
  }

  // connect to the sound if it is available
  else if (typeof(snd.connect)) {
    snd.connect(this.processor);
    console.log('connecting Amplitude to ' + snd.url);
  }

  // otherwise, connect to the master out of p5s instance (default)
  else {
    this.p5s.output.connect(this.processor);
  }
}


// TO DO make this stereo / dependent on # of audio channels
Amplitude.prototype.volumeAudioProcess = function(event) {
  // return result
  var inputBuffer = event.inputBuffer.getChannelData(0);
  var bufLength = inputBuffer.length
  var total = 0;
  var sum = 0;
  var x;

  for (var i = 0; i < bufLength; i++) {
    x = inputBuffer[i];
    total += x;
  }
  sum += x * x;

  var average = total/ bufLength;

  // ... then take the square root of the sum.
  var rms = Math.sqrt(sum / bufLength);

  this.volume = Math.max(rms, this.volume*this.smoothing);
}

/**
 * Returns the volume read by an Amplitude reader.
 *
 * @method process
 * @return {Number}       Amplitude as a number between 0.0 and 1.0
 * @for Amplitude
 */
Amplitude.prototype.process = function() {
  // TO DO --> add more to volume
  return this.volume;
}


/**
 *  FFT Object extends AnalyserNode
 */


var FFT = function(w) {
  var a = w.p5sound.audiocontext.createAnalyser();

  p5sound.output.connect(a);

//  a.prototype = Object.create(AudioContext.prototype);
  a.input = function(sample, bands) {
    sample.connect(a);
  }

  a.freqDomain = new Float32Array(a.frequencyBinCount);

  a.getFrequencyValue = function(freq, freqRange) {
    var nyquist = w.p5sound.audiocontext.sampleRate/2;
    var index = Math.round(freq/nyquist * a.freqDomain.length);
    return a.freqDomain[index];
  }

  a.process = function(bands) {
    a.freqDomain = new Unit8Array(a.frequencyBinCount);
    a.getByteFrequencyData(a.freqDomain);
    return a.freqDomain;
  }
//  var a = Object.create(w.p5sound.audiocontext.createAnalyser);

  // w.p5sound.audiocontext.createAnalyser.call(this);
//  AnalyserNode.call(this);
//  AnalyserNode.apply(this, src, fftsize);
  // x = w.p5sound.audiocontext.createAnalyser();
//  x.apply(this);
  // AnalyserNode.call(this, src, fftsize); // this would be cool but it doesn't work
  // this.p5 = w.p5sound;
  // this.analyser = this.p5.audiocontext.createAnalyser();
  // src.connect(this); // connect the input
  // this.connect(this.p5.output); //output
  // a.p5 = w.p5sound;
  return a;
}

// extend AnalyserNode
FFT.prototype = Object.create(AudioContext.prototype);
//FFT.prototype.constructor = FFT;



FFT.prototype.process = function() {
  console.log('processing!');
}

// returns the value at a given frequency,
// or the average value between a range of two frequencies if two frequencies are provided.
FFT.prototype.getFrequencyValue = function(freq, freqRange) {
  var nyquist = context.sampleRate/2;
  var index = Math.round(frequency/nyquist * freqDomain.length);
  return freqDomain[index];
}

