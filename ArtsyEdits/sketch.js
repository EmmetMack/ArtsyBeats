var sound, amplitude, frequency, fft;

//slider variables
var sliderLength = 355
var sliderStart = 20; sliderStop = 355; //maybe set this to a default size that fits mobile but then also doesn't look bad on bigger screens
//ball on the slider
var panX = 20, panY = 75;
var frequencyX = 20, frequencyY = 175;
var reverbX = 20, reverbY = 275;
var sliderBallRadius = 10;

//TO-DO:
// set global rectW and rectH for visualizations and start x and y based on the screen size - UPDATE seems to work
// change style, add in visualization images as the buttons for them
// add faux submit button, maybe a screen that pops up saying submitted - easy change, think added

var rectW = 550;
var rectH = 375;
var rectX = 20;
var rectY = 20; //= 20 20 + rectH

var vizX = 0;
var vizY = 20;
var vizW = 375;
var vizH = 375;

var panLevel = 1;

//scale everything off displayheight + width

var visualizationColor;

//angle for rotating the shape
var angle = 0;

//BounceCircle variables
var ellipseR = 25;
var ellipseX, ellipseY;
//ellipse velocity
var ellipseDeltaX = 0; ellipseDeltaY = 0;

// var curveArray = [];

//drawCurve variables
var newCurve;
var newCurveExist = false;
class curve {
    constructor(){
        this.xAxis = [];
        this.yAxis = [];
        this.drawing = false;
        this.animating = false;
        this.frameCount = 0;
        this.color = "lightblue"
    }

    saveCoordinates(){
        if (this.clickedWithinCanvas(rectX, rectY, rectW, rectH)){
            append(this.xAxis, mouseX);
            append(this.yAxis, mouseY);
        }
    }

    display(sx, sy, sw, sh){
        for (var i = 0; i < this.xAxis.length; i++){
            quad(this.xAxis[i-1], this.yAxis[i-1],
                this.xAxis[i], this.yAxis[i],
                this.xAxis[i], sh+sy,
                this.xAxis[i-1], sh+sy)
        }
    }

    bounce(){
        for (var i = 0; i < this.xAxis.length; i++){
            if (dist(ellipseX, ellipseY, this.xAxis[i], this.yAxis[i]) <= ellipseR){
                ellipseDeltaX = -ellipseDeltaX;
                ellipseDeltaY = -ellipseDeltaY;
            }
        }
    }

    clickedWithinCanvas(sx, sy, sw, sh){
        if (mouseX > sx && mouseX < sx+sw && mouseY > sy && mouseY < sy+sh){
            return true;
        }
    }

    animate(sx, sy, sw, sh){
        for (var i = 0; i < this.frameCount; i++) {
            fill(this.color);
            quad(this.xAxis[i-1], this.yAxis[i-1],
                this.xAxis[i], this.yAxis[i],
                this.xAxis[i], sh+sy,
                this.xAxis[i-1], sh+sy)
            //change sound direction
            var dir = map(this.xAxis[i], sx, sx+sw, -1.0,1.0);
            panLevel = dir;
            sound.pan(dir);
            //change sound frequency
            var freq = map(this.yAxis[i], sy, sy+sh, 20, 20000);
            freq = constrain(freq, 20, 20000);
            filter.freq(freq);
        }
        //draw ball on animation
        fill("skyblue");
        ellipse(this.xAxis[this.frameCount], this.yAxis[this.frameCount], 10);
        this.frameCount += 1;
        if (this.frameCount == this.xAxis.length) {
            this.animating = false;
        }

    }

    draw(){
        this.drawing = true;
        if (sound.isPlaying() ){
            sound.stop();
        }
    }

    released(){
        this.drawing = false;
        this.animating = true;
        sound.play();
        sound.loop();
    }
}

//determine manipulation method
var sliderButtonClicked = false;
var bounceCircleButtonClicked = false;
var drawCurveButtonClicked = true;

//determine visualization
var drawRectClicked = true;
var drawEllipseClicked = false;
var drawTriangleClicked = false;
var drawVisualizationClicked = false;
var drawRandomClicked = false;

var canvas;


function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    sound = loadSound('assets/toilet.wav');
}

function windowResize() {
    // resizeCanvas(displayWidth, displayHeight, true);

    setVisualizationPosition()
}

function setVisualizationPosition() {
    if (displayWidth < 500) {
        rectX = 0;
        rectY = 20 + rectH;
    } else {
        rectX = 1200;
        rectY = 20;
        ellipseX = rectX + rectW/2;
        ellipseY = rectY + rectH/2;
        vizX = 300;
        vizY = 20;
    }
}

window.addEventListener('load', setVisualizationPosition);
window.addEventListener('resize', windowResize);

function setup() {

    angleMode(DEGREES);
    createCanvas(displayWidth, displayHeight);
    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    filter = new p5.BandPass();
    reverb = new p5.Reverb();
    sound.disconnect();
    sound.connect(filter);
    reverb.process(sound, 3, 2);
    visualizationColor = document.getElementById('lineColor').value

}

function draw() {
    background(0);

    //click "PlaySound" to play/pause audio
    document.getElementById('playSoundButton').onclick = function() {
        toggleSound();
    }
    //switch manipulation method to slider
    document.getElementById('sliderButton').onclick = function() {
        sliderButtonClicked = true;
        bounceCircleButtonClicked = false;
        drawCurveButtonClicked = false;
        changeIconColor('sliderIcon');
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
        drawRandomClicked = false;
    }

    document.getElementById('ellipseButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = true;
        drawVisualizationClicked = false;
        drawRandomClicked = false;
    }

    document.getElementById('triangleButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = true;
        drawEllipseClicked = false;
        drawVisualizationClicked = false;
        drawRandomClicked = false;
    }

    document.getElementById('randomButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = false;
        drawVisualizationClicked = false;
        drawRandomClicked = true;
    }

    document.getElementById('visualizationButton').onclick = function() {
        drawRectClicked = false;
        drawTriangleClicked = false;
        drawEllipseClicked = false;
        drawVisualizationClicked = true;
        drawRandomClicked = false;
    }

    document.getElementById('lineColor').onchange = function() {
        visualizationColor = document.getElementById('lineColor').value
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
        drawRect();
    } else if (drawTriangleClicked == true) {
        drawTriangle();
    } else if (drawVisualizationClicked == true) {
        visualizeSliders();
    } else if (drawEllipseClicked == true) {
        drawEllipse();
    } else {
        drawRandom();
    }
}

//click to change color of visualization button border
//doesn't work yet
function fnChangeBorder(imageId){
    document.getElementById(imageId).style.borderColor="#6F4EAB";
    print("clicked");
}

function changeIconColor(iconId){
    document.getElementById(iconId).style.borderColor="#6F4EAB";
    print("change");
}

//math equations to draw one visualization
function drawVisualization1() {
    angleMode(DEGREES)
    //get&map amplitude
    var ampLevel = amplitude.getLevel();
    var drawLine = map(ampLevel, 0, 0.1, 100, 800);
    //astroid
    beginShape();
    // stroke(163, 214, 245);
    stroke(visualizationColor)
    strokeWeight(0.5);
    noFill();
    translate(vizX + (vizW/2), vizY + (vizH/2));
    for (var i = 0; i < drawLine / 2; i++) { //mouseX controls number of curves
        if (width > 500) {
            LimMouseX = constrain(drawLine*2, 0, vizX + vizW);
            var a = map(LimMouseX, 0, vizX + vizW, 0, 60); //relate to mouseX
        } else {
            LimMouseX = constrain(drawLine*2, 0, width-20);
            var a = map(LimMouseX, 0, width-20, 0, 60);
        }
        // LimMouseX = constrain(drawLine*2, 0, width-20);
        // var a = map(LimMouseX, 0, width-20, 10, 60); //relate to mouseX
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
    angleMode(DEGREES)
    //Epicycloid Involute
    beginShape();
    // stroke(242, 194, 203);
    stroke(visualizationColor)
    strokeWeight(0.5);
    noFill();
    for (var i = 0; i < parameter1; i ++){ //mouseX controls number of curves
        if (width > 500) {
            LimMouseX = constrain(parameter1, 0, vizX + vizW);
            var a = map(LimMouseX, 0, vizX + vizW, 0, 60); //relate to mouseX
        } else {
            LimMouseX = constrain(parameter1, 0, width-20);
            var a = map(LimMouseX, 0, width-20, 0, 60);
        }

        var theta = map(i, 0, parameter1/5, 20, 360);
        var b = map(parameter2, 0, height, 0, 50);
        var x2 = (a+b)*cos(theta) - b*cos(((a+b)/b)*theta);
        var y2 = (a+b)*sin(theta) - b*sin(((a+b)/b)*theta);
        vertex(x2, y2);
        endShape();
    }
}

var widthArray = []
var sizeArray = []

function drawEllipse() {
    angleMode(DEGREES)

    translate(vizX + (vizW/2), vizY + (vizH/2)); //set the new origin/point of rotation


    let spectrum = fft.analyze()

    widthFreq = spectrum[0]
    if (widthArray.length == 5) {
        let widthIndex = Math.floor(Math.random() * 5)
        widthArray[widthIndex] = widthFreq
    } else {
        widthArray.push(widthFreq)
    }
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, vizH);
    if (sizeArray.length == 5) {
        let sizeIndex = Math.floor(Math.random() * 5)
        sizeArray[sizeIndex] = size
    } else {
        sizeArray.push(size)
    }
    noFill()
    stroke(visualizationColor)
    strokeWeight(5)
    if (sizeArray.length == 5) {

        angle = angle + (panLevel*2.5);
        ellipse(0, 0 , sizeArray[sizeArray.length - 1], widthArray[widthArray.length - 1])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 2], widthArray[widthArray.length - 2])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 3], widthArray[widthArray.length - 3])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 4], widthArray[widthArray.length - 4])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 5], widthArray[widthArray.length - 5])
        rotate(angle);
    } else if (sizeArray.length == 4) {
        angle = angle + (panLevel*2.5);
        ellipse(0, 0 , sizeArray[sizeArray.length - 1], widthArray[widthArray.length - 1])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 2], widthArray[widthArray.length - 2])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 3], widthArray[widthArray.length - 3])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 4], widthArray[widthArray.length - 4])
        rotate(angle);
    } else
    if (sizeArray.length == 3) {
        angle = angle + (panLevel*2.5);
        ellipse(0, 0 , sizeArray[sizeArray.length - 1], widthArray[widthArray.length - 1])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 2], widthArray[widthArray.length - 2])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 3], widthArray[widthArray.length - 3])
        rotate(angle);
    } else if (sizeArray.length == 2) {
        angle = angle + (panLevel*2.5);
        ellipse(0, 0 , sizeArray[sizeArray.length - 1], widthArray[widthArray.length - 1])
        rotate(angle);
        ellipse(0, 0 , sizeArray[sizeArray.length - 2], widthArray[widthArray.length - 2])
        rotate(angle);
    } else {
        angle = angle + (panLevel*2.5);
        ellipse(0, 0 , sizeArray[sizeArray.length - 1], widthArray[widthArray.length - 1])
        rotate(angle);
    }

}

function drawRect() {
    angleMode(DEGREES)
    rectMode(CENTER)
    translate(vizX + (vizW/2), vizY + (vizH/2)); //set the new origin/point of rotation
    rotate(angle);
    angle = angle + (panLevel * 3); //can vary the speed of rotation based on some aspect of the sound
    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, vizH);
    noFill()
    stroke(visualizationColor)
    strokeWeight(5)
    rect(0,0, size, widthFreq)

}

function polygon(x, y, radius, npoints) {
    angleMode(RADIANS);

    var angle = TWO_PI / npoints;

    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = x + cos(a) * radius;
        var sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawTriangle() {
    angleMode(RADIANS);

    translate(vizX + (vizW/2), vizY + (vizH/2)); //set the new origin/point of rotation
    // rotate(angle);
    // angle = angle + 1;

    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, vizH);

    pieces = 20;

    for (i = 0; i < pieces; i += 0.1) {

        rotate(TWO_PI / (pieces / 2));

        push();
        strokeWeight(2)
        stroke(visualizationColor)
        fill(visualizationColor)
        polygon((75 * panLevel), (widthFreq), size, 3)
        pop();
    }
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let sides = randomNumber(4, 15);


function drawRandom() {
    angleMode(RADIANS);

    translate(vizX + (vizW/2), vizY + (vizH/2)+ 50); //set the new origin/point of rotation
    // translate(vizX + (vizW/2), vizY + (vizH/2)); //set the new origin/point of rotation
    // rotate(angle);
    // angle = angle + 1;

    let spectrum = fft.analyze()
    widthFreq = spectrum[0]
    level = amplitude.getLevel()
    let size = map(level, 0, 1, 0, vizH);

    pieces = panLevel + 1;

    for (i = 0; i < pieces; i += .5) {

        rotate(TWO_PI / (pieces/2));

        push();
        strokeWeight(2)
        stroke(visualizationColor)
        noFill()
        polygon(70 * panLevel, (size), widthFreq * .75, sides)
        pop();
    }
}

function mousePressed(){
    //create a new curve and append to curveArray
    if (bounceCircleButtonClicked == true){
        bar1.drag(mouseX, mouseY);
        bar2.drag(mouseX, mouseY);
        //var singleCurve = new curve();
        //append(curveArray, singleCurve);
    }
    //create a new curve and reset curve
    if (drawCurveButtonClicked == true){
        newCurve = new curve();
        newCurveExist = true;
        if (newCurve.clickedWithinCanvas(rectX, rectY, rectW, rectH)){
            newCurve.draw();
        }

    }
}

function mouseReleased(){
    if (bounceCircleButtonClicked == true){
        bar1.released();
        bar2.released();
    }
    if (drawCurveButtonClicked == true){
        if (newCurve.drawing){
            newCurve.released();
        }
    }
}

//draw a curve to manipulate sound
function drawCurve(){
    //draw canvas
    rectMode(CORNER);
    fill(255);
    noStroke();
    rect(rectX, rectY, rectW, rectH);

    if (newCurveExist == true){
        if (newCurve.drawing) {
            //as mouse is dragging to draw, add x and y coordinates to list
            newCurve.saveCoordinates();
            fill(newCurve.color);
        } else if (!(newCurve.animating)){
            fill(newCurve.color);
        } else {
            fill("lightgrey");
        }
        newCurve.display(rectX, rectY, rectW, rectH);

        if (newCurve.animating){
            newCurve.animate(rectX, rectY, rectW, rectH);
        }

    }


}

//two bars to bounce off with
class bar {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 120;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragging = false;
        this.haveBeenDragged = false;
    }

    display(px, py, sx, sy, sw, sh){
        if (this.dragging){
            //move bar when dragging
            this.x = this.offsetX + px;
            this.y = this.offsetY + py;
        }
        fill(125);
        noStroke();
        //constrain bar within canvas
        this.x = constrain(this.x, sx, sx+sw-this.width);
        this.y = constrain(this.y, sy, sy+sh-this.height);
        //draw bar
        rect(this.x, this.y, this.width, this.height);
    }

    bounce(){
        //determine which side of the bar to test
        let testX = ellipseX, testY = ellipseY;
        let testingX = false, testingY = false;
        //test left bar
        if (ellipseX < this.x){
            testX = this.x;
            testingX = true;
            //test right bar
        } else if(ellipseX > this.x + this.width){
            testX = this.x + this.width;
            testingX = true;
        }
        //test top bar
        if (ellipseY < this.y){
            testY = this.y;
            testingY = true;
            //test bottom bar
        } else if (ellipseY > this.y + this.height){
            testY = this.y + this.height;
            testingY = true;
        }
        //calculate distance between testing side and circle center
        let d = dist(ellipseX, ellipseY, testX, testY)
        //collide at left / right side
        if (d <= ellipseR && testingX == true){
            ellipseDeltaX = -ellipseDeltaX;
        }
        //collide at top / bottom side
        if (d <= ellipseR && testingY == true){
            ellipseDeltaY = -ellipseDeltaY;
        }
    }

    drag(px, py){
        //check if clicked within bar
        if (px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height){
            this.dragging = true;
            this.haveBeenDragged = true;
            //calculate distance between mouse and rect left corner
            this.offsetX = this.x - px;
            this.offsetY = this.y - py;
        }
    }
    released(){
        this.dragging = false;
    }
}
var bar1 = new bar(0,0);
var bar2 = new bar(0, 0);

//bounce circle to manipulate sound
function drawBounceCircle(){
    rectMode(CORNER);
    fill(255);
    stroke(255);
    rect(rectX, rectY, rectW, rectH);

    //draw bar
    if (bar1.haveBeenDragged == false){
        bar1.x = rectX + 50;
        bar1.y = rectY + 50;
    }
    if (bar2.haveBeenDragged == false){
        bar2.x = rectX + rectW - bar2.width - 50;
        bar2.y = rectY + rectH - bar2.height - 50;
    }
    bar1.display(mouseX, mouseY, rectX, rectY, rectW, rectH);
    bar2.display(mouseX, mouseY, rectX, rectY, rectW, rectH);
    bar1.bounce();
    bar2.bounce();

    //draw circle
    fill(0);
    stroke(0);
    ellipse(ellipseX,ellipseY,ellipseR*2);

    //circle bounce off boundary
    ellipseX += ellipseDeltaX;
    ellipseY += ellipseDeltaY;

    if (ellipseX > rectX + rectW - ellipseR){
        ellipseDeltaX = -ellipseDeltaX;
    } else if (ellipseX < rectX + ellipseR){
        ellipseDeltaX = -ellipseDeltaX;
    }

    if (ellipseY > rectY + rectH - ellipseR){
        ellipseDeltaY = -ellipseDeltaY;
    } else if (ellipseY < rectY + ellipseR){
        ellipseDeltaY = -ellipseDeltaY;
    }
    //change direction
    var dir = map(ellipseX, rectX, rectX+rectW, -1.0,1.0);
    panLevel = dir;
    sound.pan(dir);

    //change frequency
    var freq = map (ellipseY, rectY, rectY + rectH, 20,20000);
    freq = constrain(freq,20,20000);
    filter.freq(freq);

    /*
    //draw curve
    if (mouseIsPressed === true) {
        //as mouse is dragging to draw, add x and y coordinates to array
        curveArray[curveArray.length-1].saveCoordinates();
    }
    stroke(0);
    strokeWeight(3);
    for (var i = 0; i < curveArray.length; i++){
        curveArray[i].display();
        curveArray[i].bounce();
        let dryWet = constrain(map(ellipseX, rectX, rectX+rectW, 0, 1), 0, 1);
        reverb.drywet(dryWet);
    }
 */

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

//audio direction changes as direction slider changes
function changeDirection(){
    if (mouseY > (panY - sliderBallRadius) && mouseY < (panY + sliderBallRadius)) {
        panX = constrain(mouseX, sliderStart, sliderStop);
        var dir = map(panX, sliderStart, sliderStop, -1.0,1.0);
        panLevel = dir;
        sound.pan(dir);
    }
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

//play/pause sound
function toggleSound() {
    if (sound.isPlaying() ){
        //stop sound
        sound.stop();
        //bounce circle - stop circle
        if (bounceCircleButtonClicked == true){
            ellipseDeltaX = 0;
            ellipseDeltaY = 0;
        }
    } else {
        //play sound
        sound.play();
        sound.loop();
        //bounce circle - move circle with a random direction & velocity
        if (bounceCircleButtonClicked == true){
            ellipseDeltaX = random(-5, 5);
            ellipseDeltaY = random(-5, 5);
        }
    }
}