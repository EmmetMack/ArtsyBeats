var sound, amplitude, frequency, fft;

//slider variables
var sliderLength = 355
var sliderStart = 20; sliderStop = 355; //maybe set this to a default size that fits mobile but then also doesn't look bad on bigger screens
    //ball on the slider
var panX = 20, panY = 75;
var frequencyX = 20, frequencyY = 200;
var reverbX = 20, reverbY = 350;
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
// var curveArray = [];




//determine manipulation method
var sliderButtonClicked = false;
var bounceCircleButtonClicked = false;
var drawCurveButtonClicked = true;

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
    redraw();
};

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
        drawQuad();
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
    translate(width / 2, 2*height / 3 + 50);
    for (var i = 0; i < drawLine / 2; i++) { //mouseX controls number of curves
        LimMouseX = constrain(drawLine*2, 0, width-20);
        var a = map(LimMouseX, 0, width-20, 10, 60); //relate to mouseX
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
        LimMouseX = constrain(parameter1, 0, width-20);
        var a = map(LimMouseX, 0, width-20, 0, 60); //relate to mouseX
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
    var startX = 0; startY = 20 + height/3;

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
    var startX = 0; startY = 20 + height/3;
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

  //TO DO: FIX THESE
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
        newCurve.draw();
        toggleSound();
        newCurve.clear();
    }
}

// function mouseDragged(){
//     console.log("hi")
//     newCurve.saveCoordinates();
// }

function mouseReleased(){
    if (bounceCircleButtonClicked == true){
        bar1.released();
        bar2.released();
    }
    if (drawCurveButtonClicked == true){
        newCurve.released();
        toggleSound();
    }
}

//drawCurve variables
var newCurve;
var newCurveExist = false;
class curve {
    constructor(){
        this.xAxis = [];
        this.yAxis = [];
        this.drawing = false;
        this.frameCount = 0;
        this.animating = false;
        this.volume = 0;
        this.freq = 0;
    }

    saveCoordinates(){
        append(this.xAxis, mouseX);
        append(this.yAxis, mouseY);
        //this.frameCount += 1;
    }

    display(sx, sy, sw, sh){
        for (var i = 0; i < this.xAxis.length; i++){
            strokeWeight(3);
            //line(this.xAxis[i-1], this.yAxis[i-1], this.xAxis[i], this.yAxis[i]);
            //line(this.xAxis[i-1], this.yAxis[i-1], this.xAxis[i-1], sh+sy);
            line(this.xAxis[i], this.yAxis[i], this.xAxis[i], sh+sy);
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

    animate(sx, sy, sw, sh){
        for (var i = 0; i < this.frameCount; i++) {
            stroke(0);
            line(this.xAxis[i], this.yAxis[i], this.xAxis[i], sy + sh);
        }
        this.frameCount += 1;

    }

    draw(){
        this.drawing = true;
    }

    released(){
        this.drawing = false;
        this.animating = true;
    }

    clear(){
        this.xAxis = [];
        this.volume = 0;
        this.yAxis = [];
        this.freq = 0;
        this.frameCount = 0;
    }

}

//draw a curve to manipulate sound
function drawCurve(){
    //draw canvas
    var rectW = displayHeight/3; rectH = displayHeight/3;   //canvas width & height
    var startX = 20; startY = 20;  //canvas upper left corner   //canvas upper left corner
    rectMode(CORNER);
    fill(255);
    stroke(255);
    rect(startX, startY, rectW, rectH);

    if (newCurveExist == true){
        if (newCurve.drawing) {
            //as mouse is dragging to draw, add x and y coordinates to list
            if (mouseX > startX && mouseX < startX+rectH && mouseY > startY && mouseY < startY+rectH){
                newCurve.saveCoordinates();
            }
            stroke(0);
        } else{
            stroke(125);
        }
        newCurve.display(startX, startY, rectW, rectH);

        if (newCurve.animating){
            newCurve.animate(startX, startY, rectW, rectH);
        }

        //calculate sum of x and y coordinates in the list
        for (var i = 0; i <newCurve.xAxis.length ; i++){
            newCurve.volume += newCurve.xAxis[i];
            newCurve.freq += newCurve.yAxis[i];
        }

        /*
        //change direction
        for (var i = 0; i <newCurve.xAxis.length ; i++){
            let level = map(newCurve.xAxis[i], startX, startX + rectW, -1.0,1.0);
            sound.pan(level);
        }
        //change frequency
        newCurve.freq = map(newCurve.freq, 0, 20000, 20,20000);
        newCurve.freq = constrain(newCurve.freq,20,20000);
        filter.freq(newCurve.freq);
         */
    }


}

//bounce circle to manipulate sound
function drawBounceCircle(){
    //draw canvas
    var rectW = displayHeight/3; rectH = displayHeight/3;   //canvas width & height
    var startX = 20; startY = 20;  //canvas upper left corner
    rectMode(CORNER);
    fill(255);
    stroke(255);
    rect(startX, startY, rectW, rectH);
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
        let dryWet = constrain(map(ellipseX, startX, startX+rectW, 0, 1), 0, 1);
        reverb.drywet(dryWet);
    }
 */

    //draw bar
    if (bar1.haveBeenDragged == false){
        bar1.x = startX + 50;
        bar1.y = startY + 50;
    }
    if (bar2.haveBeenDragged == false){
        bar2.x = startX + rectW - bar2.width - 50;
        bar2.y = startY + rectH - bar2.height - 50;
    }
    bar1.display(mouseX, mouseY, startX, startY, rectW, rectH);
    bar2.display(mouseX, mouseY, startX, startY, rectW, rectH);
    bar1.bounce();
    bar2.bounce();

    //draw circle
    fill(0);
    stroke(0);
    ellipse(ellipseX,ellipseY,ellipseR*2);

    //circle bounce off boundary
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

//audio direction changes as direction slider changes
function changeDirection(){
    if (mouseY > (panY - sliderBallRadius) && mouseY < (panY + sliderBallRadius)) {
        panX = constrain(mouseX, sliderStart, sliderStop);
        let level = map(panX, sliderStart, sliderStop, -1.0,1.0);
        sound.pan(level);
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
        ellipseDeltaX = 0;
        ellipseDeltaY = 0;
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