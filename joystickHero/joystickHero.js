var bgColor = "rgb(64, 0, 128)";
var paddleColor = ("rgb(255, 255, 255)");
var currentX = 0;
var cSpeed = 20;
var posBool = false;
var mode;
var x = 0;
var y = 0;
var paddle;
let gameover = false;
let serial;
let funk;
let bg;
let easy;
let hard;
let noteCounter = 0;
let timer;
let seqDone = false;
let noteArr = [];
let noteSheet = [1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,3,4,2,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,3,4,2,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,3,4,2,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,3,4,2,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,3,4,2,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,2,4,2,9,
                 1,2,3,4,2,2,9];

let noteSheet2 = [1,9,3,4,9,
                  1,9,3,9,
                  1,9,1,9,2,3,9,
                  1,9,3,9,
                  1,9,3,4,9,
                  1,9,1,2,3,9
                ];
let width = 405;
let height = 660;

var drum = new Tone.MembraneSynth({
    pitchDecay:0.05,
    octaves: 4,
    oscillator : {
      type :"fmsine",
      phase: 140,
      modulationType: "sine",
      modulationIndex:0.8,
      partials: [1]
    }
  });
  
  var compressor = new Tone.Compressor({
    ratio  : 12 ,
    threshold  : -24 ,
    release  : 0.25 ,
    attack  : 0.003 ,
    knee  : 10
    });
    var reverb = new Tone.Freeverb(0.25,3000); 

var gain = new Tone.Gain(0.5);
gain.chain(reverb, compressor,  Tone.Master)
drum.chain( gain)

function setup(){
    serial = new p5.SerialPort();
    serial.open("COM3");
    serial.on('data',gotData);
    createCanvas(width,height);
    mode = 0;
    bg = loadImage('arcade.jpg');
    easy = createButton("Easy Mode");
    easy.position(270,370);
    easy.mousePressed(pregameEasy);
    hard = createButton("Hard Mode");
    hard.position(270,400);
    hard.mousePressed(pregameHard);
    funk = new Audio("funk.mp3");
    funk.volume = 0.5;
}

function gotData(){
    var currentString = trim(serial.readStringUntil("\r\n"));
    if(!currentString){
        return;
    }
    var data = split(trim (currentString), ',');
    if(data.length < 3){
        return;
    }
    x = parseInt(map(data[0], 0, 1023, 0, width));
    y = parseInt(map(data[1], 0, 1023, 0, height));
    // console.log(data[0]);
    // console.log(data[1]);
    // console.log(data[2]);
    if(data[2] == 1){
        buttonCheck = true;
    }else{
        buttonCheck = false;
    }
}

function pregameEasy(){
    easy.hide();
    hard.hide();
    mode = 1;    
    noteAdder(noteSheet2);
    timer = 20;
    funk.loop = true;
    funk.play();
}

function pregameHard(){
    easy.hide();
    hard.hide();
    mode = 1;    
    noteAdder(noteSheet);
    timer = 40;
    funk.loop = true;
    funk.play();
}

function draw(){
    if(mode==0){
        background(bg);
        textAlign(RIGHT, CENTER);
        textSize(50);
        fill(255,255,255);
        text("Joystick",290,210);
        text("Hero",255,270);
        textSize(14);
        text("A,S,D,F changes the color of your paddle.",340,25);
        text("When the paddle color matches the note color, press spacebar!",400,50);
    }
    if(mode == 1){
        if(frameCount % 60 == 0 && timer > 0) {
            timer--;
            }
            if (timer == 0) {
              background(bgColor);
              funk.loop = false;
              funk.pause();
              textAlign(CENTER, CENTER);
              textSize(50);   
              text("GAME OVER", 200, 250);
              textSize(30);
              text("YOUR SCORE:", 200, 350);
              text(noteCounter, 200, 400);
              gameover = true;
              return;
            }
        background(bgColor);
        fill(0, 0, 0, 63);
        rect(30,0,75,height);
        rect(120,0,75,height);
        rect(210,0,75,height);
        rect(300,0,75,height);
        rect(30,height-30,75,30);
        rect(120,height-30,75,30);
        rect(210,height-30,75,30);
        rect(300,height-30,75,30);
        vec = vectorDir(x, currentX);
        moveCurs(vec, cSpeed); 
        noteArr.forEach((x) => {
            x.draw();
        });
        fill(paddleColor);
        paddle = rect(currentX,height-30,75,30);
        fill(0,0,0);
        rect(0,0,width,60);
        textAlign(RIGHT, CENTER);
        textSize(50);
        fill(255,255,255);
        text("Score: ", 180, 35);
        text(noteCounter,230,35);
        text(timer,400,35);
        posChecker();
    }
}

function vectorDir(jx, cx){
    return createVector((jx-cx),(0));
}

function moveCurs(v, s){
    if(posBool){
        return;
    }
    currentX +=  (v.x * 2/s);
}

function notePusher(color, xVal,yVal){
    noteArr.push(new Note(color,xVal,yVal));
}

function noteAdder(noteSheet) {
    let sequencer = -50;
    for (let i = 0; i < noteSheet.length; i++) {
      if(noteSheet[i]==1){
        notePusher("rgb(255, 0, 0)",30,sequencer);
        sequencer-=50;
      }
      if(noteSheet[i]==2){
        notePusher("rgb(0, 0, 255)",120,sequencer);
        sequencer-=50;
      }
      if(noteSheet[i]==3){
        notePusher("rgb(255, 204, 0)",210,sequencer);
        sequencer-=50;
      }
      if(noteSheet[i]==4){
        notePusher("rgb(102, 255, 51)",300,sequencer);
        sequencer-=50;
      }
      if(noteSheet[i]==9){
        sequencer-=150;
      }
    }
}

function posChecker(){
    if (Math.trunc(x)<30 
    || (Math.trunc(x)>=30 && Math.trunc(x)<=50)){
        currentX = 30;
        posBool = true;
        return;
    }
    if ((Math.trunc(x)<=120 && Math.trunc(x)>=100) 
    || (Math.trunc(x)>=120 && Math.trunc(x)<=140)){
        currentX = 120;
        posBool = true;
        return;
    }
    if ((Math.trunc(x)<=210 && Math.trunc(x)>=190) 
    || (Math.trunc(x)>=210 && Math.trunc(x)<=230)){
        currentX = 210;
        posBool = true;
        return;
    }
    if ((Math.trunc(x)<=300 && Math.trunc(x)>=280) 
    || Math.trunc(x)>300){
        currentX = 300;
        posBool = true;
        return;
    }
    posBool = false;
}

function keyPressed() {
    if (keyCode === 32){
        for (let i = noteArr.length - 1; i >= 0; i--)
            if (noteArr[i].mouseClicked()) {
            break;
        }
    }
    if (keyCode === 65){
        paddleColor = "rgb(255, 0, 0)";
    }
    if (keyCode === 83){
        paddleColor = "rgb(0, 0, 255)";
    }
    if (keyCode === 68){
        paddleColor = "rgb(255, 204, 0)";
    }
    if (keyCode === 70){
        paddleColor = "rgb(102, 255, 51)";
    }
}

class Note{
    constructor(noteColor, xVal, yVal){
        this.color = noteColor;
        this.x = xVal;
        this.y = yVal;
    }mouseClicked(){
        if(gameover == false){
            let top = this.y - 30;
            let bottom = this.y + 30;
            if (top <= 640 && 640 <= bottom && paddleColor == this.color) {
                noteCounter++;
                if(this.color == "rgb(255, 0, 0)")
                    drum.triggerAttackRelease("C1","8n");
                    serial.write('Q');
                if(this.color == "rgb(0, 0, 255)"){
                    drum.triggerAttackRelease("C2","8n");
                    serial.write('W');
                }
                if(this.color == "rgb(255, 204, 0)"){
                    drum.triggerAttackRelease("C3","8n");
                    serial.write('R');
                }
                if(this.color == "rgb(102, 255, 51)"){
                    drum.triggerAttackRelease("C4","8n");
                    serial.write('T');
                }
            }
        }
    }
    draw(){
        push();
        fill(this.color);
        rect(this.x,this.y,75,30);
        if(this.y<height+100){
            this.y+=3;
        }
        pop();
    }
}
