var sound, amplitude, frequency, fft, speed;

//slider variables
var sliderLength = 500;
var sliderStart = 100; sliderStop = 500;
    //ball on the slider
var amplitudeX = 100, amplitudeY = 200;
var frequencyX = 100, frequencyY = 350;
var reverbX = 100, reverbY = 500;
var sliderBallRadius = 10;

//angle for rotating the shape
var angle = 0;

//BounceCircle variables
var ellipseR = 25;
var ellipseX = 300, ellipseY = 400;
    //ellipse velocity
var ellipseDeltaX = 0; ellipseDeltaY = 0;

//drawCurve variables
var xAxis = [];
var yAxis = [];

//determine manipulation method
var sliderButtonClicked = true;
var bounceCircleButtonClicked = false;
var drawCurveButtonClicked = false;

//determine visualization
var drawRectClicked = true;
var drawEllipseClicked = false;
var drawTriangleClicked = false;
var drawVisualizationClicked = false;


function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    sound = loadSound('assets/toilet.wav');
}

function setup() {
    angleMode(DEGREES);
    createCanvas(1500,700);
    angleMode(DEGREES);
    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    filter = new p5.BandPass();
    reverb = new p5.Reverb();
    sound.disconnect();
    sound.connect(filter);
    reverb.process(sound, 3, 2);

    //load image of diff visualization buttons
    img = loadImage('assets/button.png');

}

function draw() {
    //to make drawCurve work, move "background(0)" to function "setup()";
    //otherwise background will cover the line we draw
    //but if we move "background(0)" to function "setup()", the other functions won't work
    //might have to write "drawCurve in another js doc
    background(0);

    //click "PlaySound" to play/pause audio
    document.getElementById('soundButton').onclick = function() {
        toggleSound();
    }
    //switch manipulation method to slider
    document.getElementById('sliderButton').onclick = function() {
        sliderButtonClicked = true;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = false;
    }
    //switch manipulation method to bounce circle
    document.getElementById('bounceCircle').onclick = function() {
        sliderButtonClicked = false;
        bounceCircleButtonClicked = true;
        drawCurveButtonClicked = false;
    }
    //switch manipulation method to draw curve
    document.getElementById('drawCurve').onclick = function() {
        sliderButtonClicked = false;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = true;
    }

    document.getElementById('rectangleButton').onclick = function() {
        drawRectClicked = true;
        drawTriangleClicked = false;
        drawEllipseClicked = false;
        drawVisualizationClicked = false;
    }

    document.getElementById('ellipseButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = true;
        drawVisualizationClicked = false;
    }

    document.getElementById('triangleButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = true;
        drawEllipseClicked = false;
        drawVisualizationClicked = false;
    }

    document.getElementById('visualizationButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = false;
        drawVisualizationClicked = true;
    }

    if (sliderButtonClicked == true){
        drawSliders();
        sound.rate(1);
    }

    if(bounceCircleButtonClicked == true){
        drawBounceCircle();
    }

    if (drawCurveButtonClicked == true){
        drawCurve();
    }

    if (drawRectClicked == true) {
        drawRect()
    } else if (drawTriangleClicked == true) {
        drawTriangle()
    } else if (drawVisualizationClicked == true) {
        visualizeSliders()
    } else {
        drawEllipse()
    }
}

//math equations to draw one visualization
function drawVisualization1() {
    //get&map amplitude
    var ampLevel = amplitude.getLevel();
    var drawLine = map(ampLevel, 0, 0.1, 100, 800);
    //astroid
    beginShape();
    stroke(163, 214, 245);
    strokeWeight(0.5);
    noFill();
    translate(width / 2, height / 2);
    for (var i = 0; i < drawLine / 2; i++) { //mouseX controls number of curves
        LimMouseX = constrain(drawLine*2, 0, width);
        var a = map(LimMouseX, 0, width, 10, 80); //relate to mouseX
        var theta = map(i, 0, drawLine*2, 20, 360);
        var x = 2 * a * cos(theta) + a * cos(2 * theta);
        var y = 2 * a * sin(theta) - a * sin(2 * theta);
        vertex(x, y);
        endShape();
        rotate(drawLine*2); //rotate according to position of mouseX
    }
}

//math equations to draw one visualization
function drawVisualization2(parameter1, parameter2){

    //Epicycloid Involute
    beginShape();
    stroke(242, 194, 203);
    strokeWeight(0.5);
    noFill();
    for (var i = 0; i < parameter1; i ++){ //mouseX controls number of curves
        LimMouseX = constrain(parameter1, 0, width);
        var a = map(LimMouseX, 0, width, 0, 80); //relate to mouseX
        var theta = map(i, 0, parameter1/5, 20, 360);
        var b = map(parameter2, 0, height, 0, 50);
        var x2 = (a+b)*cos(theta) - b*cos(((a+b)/b)*theta);
        var y2 = (a+b)*sin(theta) - b*sin(((a+b)/b)*theta);
        vertex(x2, y2);
        endShape();
    }
}

function drawEllipse() {

    var rectW = 500; rectH = 500;     //canvas width & height
    var startX = 700; startY = 150; 

    translate(startX + (rectW/2), startY + (rectH/2)); //set the new origin/point of rotation
    rotate(angle);
    angle = angle + 1; 
    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(255,0,0)
    strokeWeight(5)
    ellipse(0, 0 , size, widthFreq)
    
  }
  function drawRect() {
    
    var rectW = 500; rectH = 500;     //canvas width & height
    var startX = 700; startY = 150; 

    rectMode(CENTER)
    
    translate(startX + (rectW/2), startY + (rectH/2)); //set the new origin/point of rotation
    rotate(angle);
    angle = angle + 1; //can vary the speed of rotation based on some aspect of the sound
    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(255,0,0)
    strokeWeight(5)
    rect(0,0, size, widthFreq)
    
  }
  
  function drawTriangle() {
    // translate(width/2, height/2); //set the new origin/point of rotation
    // rotate(angle);
    // angle = angle + 1; //can va
    //can keep the height constant, but then triangle isn't super fun

    var rectW = 500; rectH = 500;     //canvas width & height
    var startX = 700; startY = 150; 
    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(255,0,0)
    strokeWeight(5)
    if (widthFreq != 0) {
        triangle(startX + 300, startY+ (rectH/2), startX + (rectW/2), size,  startX + (rectW/4),  startY + (rectH/2))
    } else {
        triangle(startX + 300,startY + (rectH/2), startX + (rectW/2), size, startX + (rectW/4),  startY + (rectH/2))
    }
  }

//draw a curve to manipulate sound
function drawCurve(){
    //draw canvas
    var rectW = 500; rectH = 500;     //canvas width & height
    var startX = 50; startY = 150;    //canvas upper left corner

    noFill();
    stroke(255);
    //used quad for potentially move four corners as ball moving
    //inspired by https://learningsynths.ableton.com/
    quad(startX, startY,
        startX + rectW, startY,
        startX + rectW, startY + rectH,
        startX, startY + rectH);
    //
    var volume = 0; freq = 0;

    IsDrawingCurve()
    //calculate sum of x and y coordinates in the list
    for (var i = 0; i <xAxis.length ; i++){
        volume += xAxis[i];
        freq += yAxis[i];
    }

    //change volume
    volume = map(volume, 0, 20000, 0, 1);
    volume = constrain(volume, 0, 1);
    sound.amp(volume);
    //change frequency
    freq = map(freq, 0, 20000, 20,20000);
    freq = constrain(freq,20,20000);
    filter.freq(freq);
}

//action when user is drawing a curve
function IsDrawingCurve(){
    stroke(255);
    if (mouseIsPressed === true) {
        line(mouseX, mouseY, pmouseX, pmouseY);
        //as mouse is draggin to draw, add x and y coordinates to list
        append(xAxis, mouseX);
        append(yAxis, mouseY);
    }
}

//reset drawCurve variables
function mousePressed(){
    xAxis = [];
    volume = 0;
    yAxis = [];
    freq = 0;
}

//bounce circle to manipulate sound
function drawBounceCircle(){
    //draw canvas
    var rectW = 500; rectH = 500;   //canvas width & height
    var startX = 50; startY = 150;  //canvas upper left corner

    fill(255);
    //used quad for potentially move four corners as ball moving
    //inspired by https://learningsynths.ableton.com/
    quad(startX, startY,
        startX + rectW, startY,
        startX + rectW, startY + rectH,
        startX, startY + rectH);

    //draw circle
    fill(0);
    ellipse(ellipseX,ellipseY,ellipseR*2);

    //circle bounce
    ellipseX += ellipseDeltaX;
    ellipseY += ellipseDeltaY;

    if (ellipseX > startX + rectW - ellipseR){
        ellipseDeltaX = -ellipseDeltaX;
    } else if (ellipseX < startX + ellipseR){
        ellipseDeltaX = -ellipseDeltaX;
    }

    if (ellipseY > startY + rectH - ellipseR){
        ellipseDeltaY = -ellipseDeltaY;
    } else if (ellipseY < startY + ellipseR){
        ellipseDeltaY = -ellipseDeltaY;
    }

    //change volume
    var volume = map(ellipseX, startX, startX + rectW, 0, 1);
    volume = constrain(volume, 0, 1);
    sound.amp(volume);
    //change frequency
    var freq = map (ellipseY, startY, startY + rectH, 20,20000);
    freq = constrain(freq,20,20000);
    filter.freq(freq);

}

//use slider to manipulate sound
function drawSliders(){
    //draw sliders
    stroke(255);
    drawAmplitude();
    drawFrequency();
    drawReverb();

    //drag slider action
    if (mouseIsPressed) {
        changeAmplitude();
        changeFrequency();
        changeReverb();
    }
    //visualize
    // visualizeSliders();
}

//draw visualization corresponding to slider values
function visualizeSliders(){
    drawVisualization1();
    drawVisualization2(frequencyX, reverbX);
}

//draw amplitude slider
function drawAmplitude(){
    //amplitude text
    textSize(22);
    textStyle(ITALIC);
    strokeWeight(0);
    fill(255);
    text("Volume", sliderStart, amplitudeY - 40);

    //amplitude slider
    strokeWeight(5);
    line(sliderStart, amplitudeY, sliderStop, amplitudeY);
    ellipse(amplitudeX, amplitudeY, sliderBallRadius*2);
}

//draw frequency slider
function drawFrequency(){
    //frequency text
    textSize(22);
    textStyle(ITALIC);
    strokeWeight(0);
    fill(255);
    text("Pitch", sliderStart, frequencyY - 40);

    //frequency slider
    strokeWeight(5);
    line(sliderStart, frequencyY, sliderStop, frequencyY);
    ellipse(frequencyX, frequencyY, sliderBallRadius*2);
}

//draw reverb slider
function drawReverb(){
    //reverb text
    textSize(22);
    textStyle(ITALIC);
    strokeWeight(0);
    fill(255);
    text("Reverb", sliderStart, reverbY - 40);

    //reverb slider
    strokeWeight(5);
    line(sliderStart, reverbY, sliderStop, reverbY);
    ellipse(reverbX, reverbY, sliderBallRadius*2);
}

//frequency changes as frequency slider changes
function changeFrequency(){
    if (mouseY > (frequencyY - sliderBallRadius) && mouseY < (frequencyY + sliderBallRadius)) {
        frequencyX = constrain(mouseX, sliderStart, sliderStop);
        let level = map(frequencyX, sliderStart, sliderStop, 20,20000);
        filter.freq(level);
        //Cannot directly change frequency by "Sound.freq(level);https://p5js.org/reference/#/p5.Oscillator/freq
        //So used a frequency filter instead; https://p5js.org/reference/#/p5.Filter
    }
}

//reverb changes as reverb slider changes
function changeReverb(){
    if (mouseY > (reverbY - sliderBallRadius) && mouseY < (reverbY + sliderBallRadius)) {
        reverbX = constrain(mouseX, sliderStart, sliderStop);
        let dryWet = constrain(map(reverbX, sliderStart, sliderStop, 0, 1), 0, 1);
        reverb.drywet(dryWet);
    }
}

//amplitude changes as amplitude slider changes
function changeAmplitude(){
    if (mouseY > (amplitudeY - sliderBallRadius) && mouseY < (amplitudeY + sliderBallRadius)) {
        amplitudeX = constrain(mouseX, sliderStart, sliderStop);
        let level = map(amplitudeX, sliderStart, sliderStop, 0,1);
        sound.amp(level);
    }
}

//play/pause sound
function toggleSound() {
    if (sound.isPlaying() ){
        //stop sound
        sound.stop();
        //bounce circle - stop circle
        ellipseDeltaX = 0;
        ellipseDeltaY = 0;
    } else {
        //play sound
        sound.play();
        sound.loop();
        //bounce circle - move circle with a random direction & velocity
        ellipseDeltaX = random(-5, 5);
        ellipseDeltaY = random(-5, 5);
    }
}


