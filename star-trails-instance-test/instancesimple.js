// need to namespace p5 functions like ellipse, random, etc.
// if don't need to access the variable outside of the sketch, don't need to namespace (think of it
	// as public variables versus private variables)
// take out jquery stuff for now, will need to redo how that works later
// good idea to give the sketches divs and z-indexes in index.html file

var volume = 0.01;

var s0 = function(sketch) {

var soundFile;
var fft;
var amplitude;
var numBands = 512;
var rootn;
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

	 var thisCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
   thiscanvas.position(0,0);
   //var thisCanvas = sketch.createCanvas(1000, 800);
	 windowScreen = sketch.createVector(0,0);
	 rootn = sketch.createVector(0, 0); 
	 dvec = sketch.createVector(0,0);
     
     // play the soundfile
	 soundFile.play();

  // fft = new p5.FFT(.01, numBands);
   amplitude = new p5.Amplitude(.985); 

	}

	sketch.draw = function() {
 
     // ellipse(x, sketch.y, 100, 100);
 	 sketch.clear(); // transparent background
   var offset = 100;

   var xstep = 5;
   var ystep = 5;


 	 // don't need these variables outside of this sketch, so no need to namespace

 	 var dx = 5;       
     var dy = 3;       

      if (sketch.abs(dx) < .3) {
        return dx = 0;
      }

      if (sketch.abs(dy) < .3) {
        return dy = 0;
      } 

      dvec.x = dx;
      dvec.y = dy;
      windowScreen.sub(dvec);
      rootn.add(sketch.createVector(.0019*dx, .02*dy));  

      // using the vector to store x and y values
      for (var j = 0; j < sketch.height/2; j += ystep) {

    	sketch.noFill();
		  sketch.beginShape();

    	for (var i = 0; i < sketch.width; i += xstep) {
      
     	volume = amplitude.getLevel();
        var n = sketch.noise(rootn.x + .019*i, rootn.y + .02*j)*volume; 

        var tmpy = (offset + volume) * (n - 1) + j; 
        sketch.stroke(sketch.map(n, 0, .6, 0, 100))*volume;
        sketch.vertex(i, sketch.height - tmpy);
    	}
 
    sketch.endShape();

  }
}
}; // end of sketch0 setup

var s1 = function(sketch) {

var song, analyzer;

sketch.setup = function() {
  // /console.log(sketch.windowWidth)
  var myCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
  myCanvas.position(0,0);

  // create a new Amplitude analyzer
  //analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
 // analyzer.setInput(song);
}

sketch.draw = function() {
  sketch.clear();
  // Get the overall volume (between 0 and 1.0)

  sketch.fill(127);
  sketch.stroke(0);

  // Draw an ellipse with size based on volume
  sketch.ellipse(width/2, height/2, 10+volume*200, 10+volume*200);
}




/* //var volume = 0;
var rootn;

var windowScreen;
var dvec;

	sketch.setup = function() {
   //var thisCanvas = sketch.createCanvas(1000, 800);
   var thisCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
   windowScreen = sketch.createVector(0,0);
   rootn = sketch.createVector(0, 0); 
   dvec = sketch.createVector(0,0);
	}

	sketch.draw = function() {
    sketch.clear();

   var offset = 20;
   var xstep = 10;
   var ystep = 10;

   var dx = 5;       
     var dy = 3;       

      if (sketch.abs(dx) < .3) {
        return dx = 0;
      }

      if (sketch.abs(dy) < .3) {
        return dy = 0;
      } 

      dvec.x = dx;
      dvec.y = dy;
      windowScreen.sub(dvec);
      rootn.add(sketch.createVector(.0019*dx, .02*dy));  

      // using the vector to store x and y values
      for (var j = 0; j < sketch.height/2; j += ystep) {

      sketch.noFill();
      sketch.beginShape();

      for (var i = 0; i < sketch.width; i += xstep) {
      
      // volume = p5withsound.volume;
      console.log(volume);
        var n = sketch.noise(rootn.x + .019*i, rootn.y + .02*j)*volume; 

        var tmpy = (offset + volume) * (n - 1) + j; 
        sketch.stroke(sketch.map(n, 0, .6, 0, 100))*volume;
        sketch.vertex(i, sketch.height - tmpy);
      }
 
    sketch.endShape();

  }
} */
  
	}


var p5withsound = new p5(s0); // this stores a reference to s0 sketch and initializes an instance of p5
var p5nosound = new p5(s1);
