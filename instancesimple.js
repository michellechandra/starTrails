// need to namespace p5 functions like ellipse, random, etc.
// if don't need to access the variable outside of the sketch, don't need to namespace (think of it
	// as public variables versus private variables)
// take out jquery stuff for now, will need to redo how that works later
// good idea to give the sketches divs and z-indexes in index.html file


var s0 = function(sketch) {

var soundFile;
var fft;
var amplitude;
var volume = 0;
var numBands = 512;

var offset = 100;
var rootn;
var xstep = 5;
var ystep = 5;
var windowScreen;
var dvec;

	sketch.preload = function() {
       soundFile = sketch.loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3');
    }

	/* EXAMPLE CODE

	sketch.sound = sketch.loadSound('blah.mp3');
	sketch.volume = 0;
    
    This variable cannot be accessed anywhere except inside this s0 thing
	var x = 0;

	This variable can be accessed outside of s0
	sketch.y = 0;

	sketch.volume = sketch.sound.getLevel(); */

	sketch.setup = function() {

	 var thisCanvas = sketch.createCanvas(windowWidth, windowHeight);
	 windowScreen = sketch.createVector(0,0);
	 rootn = sketch.createVector(0, 0); 
	 dvec = sketch.createVector(0,0);
     
     // play the soundfile
	 sketch.soundFile.play();

   fft = sketch.FFT(.01, numBands);
   amplitude = sketch.Amplitude(.985); 

	}

	sketch.draw = function() {
 
     // ellipse(x, sketch.y, 100, 100);
 	 sketch.clear(); // transparent background

 	 // don't need these variables outside of this sketch, so no need to namespace

 	 var dx = 5;       
     var dy = 3;       

      if (abs(dx) < .3) {
        return dx = 0;
      }

      if (abs(dy) < .3) {
        return dy = 0;
      } 

      dvec.x = dx;
      dvec.y = dy;
      windowScreen.sub(dvec);
      rootn.add(createVector(.0019*dx, .02*dy));  

      // using the vector to store x and y values
      for (var j = 0; j < height/2; j += ystep) {

    	noFill();
		  beginShape();

    	for (var i = 0; i < width; i += xstep) {
      
     	volume = sketch.amplitude.getLevel();
        var n = noise(rootn.x + .019*i, rootn.y + .02*j)*volume; 

        var tmpy = (offset + volume) * (n - 1) + j; 
        stroke(map(n, 0, .6, 180, 250))*volume;
        vertex(i, height - tmpy);
    	}
 
    endShape();

  }
}
}; // end of sketch0 setup

var s1 = function(sketch) {

var volume = 0;
var offset = 200;
var rootn;
var xstep = 5;
var ystep = 5;
var windowScreen;
var dvec;

	sketch.setup = function() {
   var thisCanvas = sketch.createCanvas(windowWidth, windowHeight);
   windowScreen = sketch.createVector(0,0);
   rootn = sketch.createVector(0, 0); 
   dvec = sketch.createVector(0,0);

   fft = p5withsound.fft;
   amplitude = p5withsound.amplitude;   
	}

	sketch.draw = function() {


   var dx = 5;       
     var dy = 3;       

      if (abs(dx) < .3) {
        return dx = 0;
      }

      if (abs(dy) < .3) {
        return dy = 0;
      } 

      dvec.x = dx;
      dvec.y = dy;
      windowScreen.sub(dvec);
      rootn.add(createVector(.0019*dx, .02*dy));  

      // using the vector to store x and y values
      for (var j = 0; j < height/2; j += ystep) {

      noFill();
      beginShape();

      for (var i = 0; i < width; i += xstep) {
      
      volume = p5withsound.volume;
        var n = noise(rootn.x + .019*i, rootn.y + .02*j)*volume; 

        var tmpy = (offset + volume) * (n - 1) + j; 
        stroke(map(n, 0, .6, 180, 250))*volume;
        vertex(i, height - tmpy);
      }
 
    endShape();

  }
}
   //var volume = p5withsound.volume;
	
	}

};

var p5withsound = new p5(s0); // this stores a reference to s0 sketch and initializes an instance of p5
var p5nosound = new p5(s1);
