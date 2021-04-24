let sound, amplitude, frequency, fft, speed;
let sliderLength = 500;
let sliderStart = 100; sliderStop = 500;
let amplitudeX = 100, amplitudeY = 200;
let frequencyX = 100, frequencyY = 350;
let reverbX = 100, reverbY = 500;
let controlRadius = 10;
let ampLevel;

//drawMoveCircle
var ellipseR = 25;
var ellipseX = 300, ellipseY = 400;
var rectHOffset = 0; rectWOffset = 0;
var ellipseDeltaX = 0; ellipseDeltaY = 0;

var sliderButtonClicked = false;
var mouseActionButtonClicked = false;
var moveCircleButtonClicked = false;
var bounceCircleButtonClicked = false;
var drawCurveButtonClicked = true;


function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    sound = loadSound('assets/toilet.wav');
}

function setup() {
    createCanvas(1500,700);
    angleMode(DEGREES);
    amplitude = new p5.Amplitude();
    filter = new p5.BandPass();
    reverb = new p5.Reverb();
    sound.disconnect();
    sound.connect(filter);
    reverb.process(sound, 3, 2);
    img = loadImage('assets/button.png');

}

function draw() {

    background(0);

    drawSoundButton();

    document.getElementById('sliderButton').onclick = function() {
        sliderButtonClicked = true;
        mouseActionButtonClicked = false;
        moveCircleButtonClicked = false;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = false;
    }

    document.getElementById('mouseActionButton').onclick = function() {
        sliderButtonClicked = false;
        mouseActionButtonClicked = true;
        moveCircleButtonClicked = false;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = false;
    }

    document.getElementById('moveCircle').onclick = function() {
        sliderButtonClicked = false;
        mouseActionButtonClicked = false;
        moveCircleButtonClicked = true;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = false;
    }

    document.getElementById('bounceCircle').onclick = function() {
        sliderButtonClicked = false;
        mouseActionButtonClicked = false;
        moveCircleButtonClicked = false;
        bounceCircleButtonClicked = true;
        drawCurveButtonClicked = false;
    }

    document.getElementById('drawCurve').onclick = function() {
        sliderButtonClicked = false;
        mouseActionButtonClicked = false;
        moveCircleButtonClicked = false;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = true;
    }

    if (sliderButtonClicked == true){
        drawSliders();
        sound.rate(1);
    }

    if (mouseActionButtonClicked == true){
        drawMouseAction();
    }

    if (moveCircleButtonClicked == true){
        drawMoveCircle();
    }

    if(bounceCircleButtonClicked == true){
        drawBounceCircle();
    }

    if (drawCurveButtonClicked == true){
        drawCurve();
    }

}

function drawCurve(){
    //draw canvas
    var rectW = 500; rectH = 500;
    var startX = 50; startY = 150;
    var centerX = rectW/2 + startX; centerY = rectH/2 + startY;
    fill(255);
    quad(startX, startY,
        startX + rectW, startY,
        startX + rectW, startY + rectH,
        startX, startY + rectH);

    stroke(0);
    if (mouseIsPressed === true) {
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

function drawBounceCircle(){
    //draw canvas
    var rectW = 500; rectH = 500;
    var startX = 50; startY = 150;
    var centerX = rectW/2 + startX; centerY = rectH/2 + startY;
    fill(255);
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

function drawMoveCircle(){
    //draw canvas
    var rectW = 500; rectH = 500;
    var startX = 50; startY = 150;
    var centerX = rectW/2 + startX; centerY = rectH/2 + startY;
    fill(255);
    quad(startX - rectWOffset, startY - rectHOffset,
        startX + rectW + rectWOffset, startY - rectHOffset,
        startX + rectW + rectWOffset, startY + rectH + rectHOffset,
        startX - rectWOffset, startY + rectH + rectHOffset);

    //draw circle
    fill(0);
    ellipse(ellipseX,ellipseY,ellipseR*2);
    //drag to move circle
    if (mouseIsPressed && mouseX > ellipseX - ellipseR && mouseX < ellipseX + ellipseR && mouseY > ellipseY - ellipseR && mouseY < ellipseY + ellipseR){
        ellipseX = mouseX;
        ellipseY = mouseY;
    }
    //change volume
    var volume = map(ellipseX, startX, startX + rectW, 0, 1);
    volume = constrain(volume, 0, 1);
    sound.amp(volume);
    //change frequency
    var freq = map (ellipseY, startY, startY + rectH, 20,20000);
    freq = constrain(freq,20,20000);
    filter.freq(freq);
    //change quad shape
    rectWOffset = map(abs(ellipseX - centerX), 0, rectW/2, 0, 50);
    rectHOffset = map(abs(ellipseY - centerY), 0, rectH/2, 0, 50);
}

function mousePressed(){
    if (mouseX > 20 && mouseX < 105 && mouseY > 20 && mouseY < 75){
        toggleSound();
    }
}

function drawVisualization1() {
    //get&map sound amplitude
    ampLevel = amplitude.getLevel();
    drawLine = map(ampLevel, 0, 0.1, 100, 800);
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

function drawVisualization2(controlFactor1, controlFactor2){

    //Epicycloid Involute
    beginShape();
    stroke(242, 194, 203);
    strokeWeight(0.5);
    noFill();
    for (var i = 0; i < controlFactor1; i ++){ //mouseX controls number of curves
        LimMouseX = constrain(controlFactor1, 0, width);
        var a = map(LimMouseX, 0, width, 0, 80); //relate to mouseX
        var theta = map(i, 0, controlFactor1/5, 20, 360);
        var b = map(controlFactor2, 0, height, 0, 50);
        var x2 = (a+b)*cos(theta) - b*cos(((a+b)/b)*theta);
        var y2 = (a+b)*sin(theta) - b*sin(((a+b)/b)*theta);
        vertex(x2, y2);
        endShape();
    }
}

function drawMouseAction(){

    var volume = map(mouseX, 0, width, 0, 1);
    volume = constrain(volume, 0, 1);
    sound.amp(volume);

    // Set the rate to a range between 0.1 and 4
    // Changing the rate alters the pitch
    speed = map(mouseY, 0.1, height, 0, 2);
    speed = constrain(speed, 0.01, 4);
    sound.rate(speed);

    // Draw some circles to show what is going on
    stroke(0);
    fill(255);
    ellipse(mouseX, 100, 48, 48);
    stroke(0);
    fill(255);
    ellipse(100, mouseY, 48, 48);

    //visualize
    visualizeMouseAction();

}

function visualizeMouseAction(){
    //draw visualization
    var level1 = map(speed, 0.01, 4, 100, 500);
    var level2 = map(speed, 0.01, 4, 200, 400);
    drawVisualization1();
    drawVisualization2(level1, level2);
}

function drawSliders(){
    //draw sliders
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
    visualizeSliders();
}

function visualizeSliders(){
    //draw visualization
    drawVisualization1();
    drawVisualization2(frequencyX, reverbX);
}

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
    ellipse(amplitudeX, amplitudeY, controlRadius*2);
}

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
    ellipse(frequencyX, frequencyY, controlRadius*2);
}

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
    ellipse(reverbX, reverbY, controlRadius*2);
}

function drawSoundButton(){
    //sound button
    fill(255);
    stroke(255);
    rect(20, 20, 85, 55, 10);
    fill(0);
    triangle(86,47, 48, 28, 48, 68);
}

function changeFrequency(){
    if (mouseY > (frequencyY - controlRadius) && mouseY < (frequencyY + controlRadius)) {
        frequencyX = constrain(mouseX, sliderStart, sliderStop);
        let level = map(frequencyX, sliderStart, sliderStop, 20,20000);
        filter.freq(level);
        //Cannot directly change frequency by "Sound.freq(level);https://p5js.org/reference/#/p5.Oscillator/freq
        //So used a frequency filter instead; https://p5js.org/reference/#/p5.Filter
    }
}

function changeReverb(){
    if (mouseY > (reverbY - controlRadius) && mouseY < (reverbY + controlRadius)) {
        reverbX = constrain(mouseX, sliderStart, sliderStop);
        let dryWet = constrain(map(reverbX, sliderStart, sliderStop, 0, 1), 0, 1);
        reverb.drywet(dryWet);
    }
}

function changeAmplitude(){
    if (mouseY > (amplitudeY - controlRadius) && mouseY < (amplitudeY + controlRadius)) {
        amplitudeX = constrain(mouseX, sliderStart, sliderStop);
        let level = map(amplitudeX, sliderStart, sliderStop, 0,1);
        sound.amp(level);
    }
}

function toggleSound() {
    if (sound.isPlaying() ){
        sound.stop();
        ellipseDeltaX = 0;
        ellipseDeltaY = 0;
    } else {
        sound.play();
        sound.loop();
        ellipseDeltaX = random(-5, 5);
        ellipseDeltaY = random(-5, 5);
    }
}
