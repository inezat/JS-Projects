let bugCounter = 0;
let bugSquished = 0;
let speed = 1;
let bugsArr = [];
let timer = 30;
let spriteW = 80;
let spriteH = 80;
let reverb;
let starter = false;
let event;
let synth = new Tone.PolySynth().toDestination();
let synth2;
let synth3 = new Tone.AMSynth().toDestination();
let difficulty;
let victory;
bg = "hsb(45, 70%, 70%)";

reverb = new Tone.JCReverb({
  roomSize: 0.01,
  wet: 0.1
}).toDestination();

victory = new Tone.Player("victory.mp3").toDestination();

squish = new Tone.Player(
  "splat.mp3"
).connect(reverb);

function playSplat() {
  squish.start();
}

function playVictory(){
  victory.start();
}

function bugPusher() {
  bugsArr.push(new Bug("bugTest.png"));
  bugCounter++;
}

function adder(count) {
  if (count == null) {
    count = 8;
  }

  for (let i = 0; i < count; i++) {
    bugPusher();
  }
}

function preload() {
  adder();
}

function setup() {
  createCanvas(700, 700);
  imageMode(CENTER);
  difficulty = 0;
  synth.set({ detune: -1200 });
  synth2 = new Tone.MonoSynth({
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.1
    }
  }).toDestination();

  event = new Tone.Loop((time) => {
    synth.triggerAttackRelease(["C3", "E2", "A3"], 1);
  }, "3n").start(0);
  Tone.Transport.start();
  event.humanize = 0.2
  event.probability = 1

  event2 = new Tone.Loop((time) => {
    synth2.triggerAttackRelease("A6", "8n");
    synth3.triggerAttackRelease("C3", "5n");
  }, "1n").start(1);
  Tone.Transport.start();
  event2.probability = 1

  event3 = new Tone.Loop((time) => {
    synth2.triggerAttackRelease("E6", "8n");
  }, "1n").start(2);
  Tone.Transport.start();
  event3.probability = 1

  event4 = new Tone.Loop((time) => {
    synth2.triggerAttackRelease("A5", "8n");
  }, "1n").start(3);
  Tone.Transport.start();
  event4.probability = 1
}


function draw() {
  background(bg);
  textAlign(RIGHT, CENTER);
  textSize(100);
  text(bugSquished, 650, 50);
  text(timer, 110, 50);

  if(frameCount % 60 == 0 && timer > 0) {
  timer--;
  }
  if (timer == 0) {
    textAlign(CENTER, CENTER);
    text("GAME OVER", 350, 350);
    event.stop();
    event2.stop();
    event3.stop();
    event4.stop();
    //playVictory();
    return;
  }
  bugsArr.forEach((x) => {
    x.draw();
  });
}

function mouseClicked() {
  for (let i = bugsArr.length - 1; i >= 0; i--)
    if (bugsArr[i].mouseClicked()) {
      break;
    }
}

class Bug {
  constructor(spriteSheet) {
    this.spriteSheet = loadImage(spriteSheet);

    this.alive = true;
    this.accuracy = speed * 1.1;
    this.frame = 0;
    this.x = random(700);
    this.y = random(700);
    
    this.updateFinalPoint();
  }

  mouseClicked() {
    if(timer == 0){
      return;
    }
    let top = this.y - 40;
    let bottom = this.y + 40;
    let left = this.x - 40;
    let right = this.x + 40;

    if (left <= mouseX && mouseX <= right && top <= mouseY && mouseY <= bottom) {
      if(this.alive== true){
        this.alive = false;
        bugCounter--;
        bugSquished++;
        playSplat();
        speed +=.25;
        console.log(bugCounter);
        if(bugCounter == 4){
          difficulty++;
          if(difficulty == 2){
            event.interval = '4n';
          }if(difficulty == 3){
            event.interval = '5n';
          }if(difficulty == 4){
            event.interval = '6n';
          }
           for(let j = 0; j < 4; j++){
            bugPusher();
           }
        }
      }
      return true;
    }
  }

  updateFinalPoint() {
    let shouldCountinue = true;
    while (shouldCountinue) {
      let dist = random(30, 100);
      this.angle = random(360);

      this.finalX = this.x + dist * cos(radians(this.angle));
      this.finalY = this.y + dist * sin(radians(-this.angle));

      this.dirX = speed * cos(radians(this.angle));
      this.dirY = speed * sin(radians(-this.angle));

       if (this.finalX > 0 && this.finalY > 0 && this.finalX < 700  && this.finalY < 700) {
         shouldCountinue = false;
       }
    }
  }

  draw() {
    let distance = dist(this.x, this.y, this.finalX, this.finalY);
    if (this.alive) {
      this.x += this.dirX;
      this.y += this.dirY;
      if (distance <= this.accuracy) {
        this.updateFinalPoint();
      }
    }


    let angle;
    let facing;
    if (this.angle >= 0 && this.angle <= 90 || this.angle > 180 && this.angle < 360) {
      angle = -this.angle;
      facing = 1;
    } else {
      angle = -(this.angle - 180);
      facing = -1;
    }

    push();
    translate(this.x, this.y);
    rotate(radians(angle));
    scale(facing, 1);
    if(this.alive){
      if(this.frame ==0){
        image(this.spriteSheet, 0, 0, 80, 80, 0, 0, 80, 80);
      }
      if(this.frame ==1){
        image(this.spriteSheet, 0, 0, 80, 80, 80, 0, 80, 80);
      }
      if(this.frame ==2){
        image(this.spriteSheet, 0, 0, 80, 80, 160, 0, 80, 80);
      }
      if(this.frame ==3){
        image(this.spriteSheet, 0, 0, 80, 80, 240, 0, 80, 80);
      }
      if(this.frame ==4){
        image(this.spriteSheet, 0, 0, 80, 80, 320, 0, 80, 80);
      }
      
      if(frameCount %20 ==0){
        this.frame = (this.frame+1)%5;
      }
    }else{
      image(this.spriteSheet, 0, 0, 85, 80, 400, 0, 85, 80);
    }
    pop();
  }
}