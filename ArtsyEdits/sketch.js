var sound, amplitude, frequency, fft;

//slider variables
var sliderLength = window.innerWidth - 20;
var sliderStart = 20; sliderStop = window.innerWidth - 20;
    //ball on the slider
var panX = 20, panY = 200; //check with Kathy what changing this does/how it affects the editing
var frequencyX = 20, frequencyY = 350;
var reverbX = 20, reverbY = 500;
var sliderBallRadius = 10;

//scale everything off displayheight + width

var visualizationColor;

//angle for rotating the shape
var angle = 0;

//BounceCircle variables
var ellipseR = 25;
var ellipseX = (window.innerHeight/6) + 20, ellipseY = (window.innerHeight/6) + 20;
    //ellipse velocity
var ellipseDeltaX = 0; ellipseDeltaY = 0;

//drawCurve variables
var lines = {
    xAxis : [],
    yAxis : [],
};

//determine manipulation method
var sliderButtonClicked = true;
var bounceCircleButtonClicked = false;
var drawCurveButtonClicked = false;

//determine visualization
var drawRectClicked = true;
var drawEllipseClicked = false;
var drawTriangleClicked = false;
var drawVisualizationClicked = false;
var drawQuadClicked = false;

var canvas;


function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    sound = loadSound('assets/toilet.wav');
}

function windowResize() {
    resizeCanvas(displayWidth, displayHeight);
};
  
window.addEventListener('resize', windowResize);

function setup() {

    angleMode(DEGREES);
    // createCanvas(1500,700);
    createCanvas(displayWidth, displayHeight);


    angleMode(DEGREES);
    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    filter = new p5.BandPass();
    reverb = new p5.Reverb();
    sound.disconnect();
    sound.connect(filter);
    reverb.process(sound, 3, 2);

    //load image of diff visualization buttons
    // img = loadImage('assets/button.png');
    visualizationColor = document.getElementById('lineColor').value

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
        drawQuadClicked = false;
    }

    document.getElementById('ellipseButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = true;
        drawVisualizationClicked = false;
        drawQuadClicked = false;
    }

    document.getElementById('triangleButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = true;
        drawEllipseClicked = false;
        drawVisualizationClicked = false;
        drawQuadClicked = false;
    }

    document.getElementById('quadirlateralButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = false;
        drawVisualizationClicked = false;
        drawQuadClicked = true;
    }

    document.getElementById('visualizationButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = false;
        drawVisualizationClicked = true;
        drawQuadClicked = false;
    }

    document.getElementById('lineColor').onchange = function() {
        visualizationColor = document.getElementById('lineColor').value
    }

    document.getElementById('lineColor').onselect = function() {
        visualizationColor = document.getElementById('lineColor').value
    }

    if (sliderButtonClicked == true){
        drawSliders();
        sound.rate(1);
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
    } else if (bounceCircleButtonClicked == true){
        drawBounceCircle();
    } else if (drawCurveButtonClicked == true){
        drawCurve();
    }

    if (drawRectClicked == true) {
        drawRect()
    } else if (drawTriangleClicked == true) {
        drawTriangle()
    } else if (drawVisualizationClicked == true) {
        visualizeSliders()
    } else if (drawEllipseClicked == true) {
        drawEllipse()
    } else {
        drawQuad()
    }
}

//math equations to draw one visualization
function drawVisualization1() {
    //get&map amplitude
    var ampLevel = amplitude.getLevel();
    var drawLine = map(ampLevel, 0, 0.1, 100, 800);
    //astroid
    beginShape();
    // stroke(163, 214, 245);
    stroke(visualizationColor)
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
    // stroke(242, 194, 203);
    stroke(visualizationColor)
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

    var rectW = width; rectH = width;     //canvas width & height
    var startX = 20 ; startY = 20 + height/3; 

    translate(startX + (rectW/2), startY + (rectH/2)); //set the new origin/point of rotation
    rotate(angle);
    angle = angle + 1; 
    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(visualizationColor)
    strokeWeight(5)
    ellipse(0, 0 , size, widthFreq)
    
  }
  function drawRect() {
    
    var rectW = width; rectH = width;     //canvas width & height
    var startX = 20 ; startY = 20 + height/3; 
    rectMode(CENTER)
    
    translate(startX + (rectW/2), startY + (rectH/2)); //set the new origin/point of rotation
    rotate(angle);
    angle = angle + 1; //can vary the speed of rotation based on some aspect of the sound
    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(visualizationColor)
    strokeWeight(5)
    rect(0,0, size, widthFreq)
    
  }
  
  function drawTriangle() {
    var rectW = width; rectH = width;  
    var startX = 20 ; startY = 20 + height/3; 

    translate(startX + (rectW/2), startY + (rectH/2)); //set the new origin/point of rotation
    rotate(angle);
    angle = angle + 1; 

    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(visualizationColor)
    strokeWeight(5)
    if (widthFreq != 0) {
        triangle(.75*rectW, rectH/2, rectW/2, size,  rectW/4,  rectH/2)
    } else {
        triangle(.75*rectW, rectH/2, rectW/2, size,  rectW/4,  rectH/2)
    }
  }

  function drawQuad() {
    var rectW = width; rectH = width;    
    var startX = 20 ; startY = 20 + height/3; 

    // translate(startX + (rectW/2), startY + (rectH/2)); //set the new origin/point of rotation
    // rotate(angle);
    // angle = angle + 1; 

    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, rectH);
    noFill()
    stroke(visualizationColor)
    strokeWeight(5)
    if (widthFreq != 0) {
        quad(startX + rectW/4 , startY + size, startX + (.75 * rectW), startY + size,  startX + (rectW * .9),  .75*rectH,startX + rectW/3, .75*rectH )
    } else {
        quad(startX + rectW/4 , startY + size, startX + (.75 * rectW), startY + size,  startX + (rectW * .9),  .75*rectH,startX + rectW/3, .75*rectH )    
    }
  }

//draw a curve to manipulate sound
function drawCurve(){
    //draw canvas
    var rectW = displayHeight/3; rectH = displayHeight/3;   //canvas width & height
    var startX = 20; startY = 20;  //canvas upper left corner   //canvas upper left corner

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
    for (var i = 0; i <lines.xAxis.length ; i++){
        volume += lines.xAxis[i];
        freq += lines.yAxis[i];
    }
    /*
    //change volume
    volume = map(volume, 0, 20000, 0, 1);
    volume = constrain(volume, 0, 1);
    sound.amp(volume);
     */

    //change direction
    for (var i = 0; i <lines.xAxis.length ; i++){
        let level = map(lines.xAxis[i], startX, startX + rectW, -1.0,1.0);
        sound.pan(level);
    }
    //change frequency
    freq = map(freq, 0, 20000, 20,20000);
    freq = constrain(freq,20,20000);
    filter.freq(freq);
}

//action when user is drawing a curve
function IsDrawingCurve(){
    if (mouseIsPressed === true) {
        //as mouse is dragging to draw, add x and y coordinates to list
        append(lines.xAxis, mouseX);
        append(lines.yAxis, mouseY);
    }
    stroke(255);
    strokeWeight(3);
    for (var i = 0; i < lines.xAxis.length; i++){
        line(lines.xAxis[i-1], lines.yAxis[i-1], lines.xAxis[i], lines.yAxis[i]);
    }
}

//reset drawCurve variables
function mousePressed(){
    lines.xAxis = [];
    volume = 0;
    lines.yAxis = [];
    freq = 0;
}

//bounce circle to manipulate sound
function drawBounceCircle(){
    //draw canvas
    var rectW = displayHeight/3; rectH = displayHeight/3;   //canvas width & height
    var startX = 20; startY = 20;  //canvas upper left corner

    fill(255);
    stroke(255);
    //used quad for potentially move four corners as ball moving
    //inspired by https://learningsynths.ableton.com/
    quad(startX, startY,
        startX + rectW, startY,
        startX + rectW, startY + rectH,
        startX, startY + rectH);

    //draw circle
    fill(0);
    stroke(0);
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
    //change direction
    let level = map(ellipseX, startX, startX+rectW, -1.0,1.0);
    sound.pan(level);

    //change frequency
    var freq = map (ellipseY, startY, startY + rectH, 20,20000);
    freq = constrain(freq,20,20000);
    filter.freq(freq);

}

//use slider to manipulate sound
function drawSliders(){
    //draw sliders
    stroke(255);
    drawDirection();
    drawFrequency();
    drawReverb();

    //drag slider action
    if (mouseIsPressed) {
        changeDirection();
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

//draw direction slider
function drawDirection(){
    //direction text
    textSize(22);
    textStyle(ITALIC);
    strokeWeight(0);
    fill(255);
    text("Direction", sliderStart, panY - 40);

    //direction slider
    strokeWeight(5);
    line(sliderStart, panY, sliderStop, panY);
    ellipse(panX, panY, sliderBallRadius*2);
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

//audio direction changes as direction slider changes
function changeDirection(){
    if (mouseY > (panY - sliderBallRadius) && mouseY < (panY + sliderBallRadius)) {
        panX = constrain(mouseX, sliderStart, sliderStop);
        let level = map(panX, sliderStart, sliderStop, -1.0,1.0);
        sound.pan(level);
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


