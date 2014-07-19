
var numbers = [5, 6, 9, 10, 15, 20];

// code for setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
 }

//function drawGraph(int[] numbers) {

function draw() {
  for(var i = 0; i < numbers.length; i++) {
     var n = numbers[i];
     var x = map(i,0,numbers.length,100,windowWidth - 100);
     var y = windowHeight - 100;
     var w = 5;
     var h = -map(n,0,max(numbers),0,windowHeight - 100);
     fill(0);
     rect(x,y,w,h);
  }
}