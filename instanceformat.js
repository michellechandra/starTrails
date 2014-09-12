

var s0 = function(sketch) {
	sketch.sound = sketch.loadSound('blah.mp3');

	sketch.volume = 0;
    
    // This variable cannot be accessed anywhere except inside this s0 thing
	var x = 0;

	// This variable can be accessed outside of s0
	sketch.y = 0;

	sketch.setup = function() {

	}

	sketch.draw = function() {

	  sketch.volume = sketch.sound.getLevel();

	  ellipse(x, sketch.y, 100, 100);

	}

}

var s1 = function(sketch) {

	sketch.setup = function() {

	}

	sketch.draw = function() {

	   var volume = p5withsound.volume;
	
	}

}

var p5withsound = new p5(s0);
var p5nosound = new p5(s1);
