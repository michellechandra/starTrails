var s0 = function( sketch ) {

  var gray = 0; 
  var soundFile;

  // sketch.preload = function() {
  //    soundFile = sketch.loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3');
  //  }

  sketch.setup = function() {
    var myCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
  //  soundFile = sketch.loadSound('Lee_Rosevere_-_02_-_Waltz_of_the_Stars_valse_des_toiles.mp3');
    myCanvas.position(0,0);
    myCanvas.id("canvas0");
   // soundFile.play();
  };

  sketch.draw = function() {
    sketch.background(gray);
    //sketch.clear();
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }

};

var myp5_0 = new p5(s0);



var s1 = function( sketch ) {

  var gray = 0; 

  sketch.setup = function() {
    var thisCanvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    thisCanvas.position(0,0);
    thisCanvas.id("canvas1");
  }

  sketch.draw = function() {
    sketch.background(255, 0, 100);
    //sketch.clear();
    sketch.fill(gray);
    sketch.noStroke();
    sketch.rect(sketch.width/2, sketch.height/2, 50, 50);
  }

  sketch.mousePressed = function() {
    gray += 10;
  }
};


var myp5_1 = new p5(s1);

