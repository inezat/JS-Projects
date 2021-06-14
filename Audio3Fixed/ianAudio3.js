var ampEnvelope;
var noise;
let setValueAtTime;
let rampTo;
let bg1;
let bg2;
let clicked = false;
let canv;
let ampLfo;

function setup() {
  canv = createCanvas(400, 200);

  bg1 = loadImage('man_in_rain.jpg');
  bg2 = loadImage('man_in_rain_struck.jpg');
  
  ampEnvelope = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.2,
    sustain: 1.0,
    release: 0.8
  }).toDestination();

  filter = new Tone.Filter({
    frequency: 200,
    type: "lowpass"
  }).connect(ampEnvelope);

  osc = new Tone.AMOscillator({
		frequency: '260',
		type: "sawtooth",
    modulationType: "square"
	}).start();

  noise = new Tone.Noise().connect(filter).start();

  filter.frequency.value = 3000;
  noise.type = "brown"; 
  
  ampLfo = new Tone.LFO('8n', -60, -10).start();
  
  osc.connect(filter);
  ampLfo.connect(noise.volume);
  

  canv.mousePressed(() => {
    noise.start();
    osc.start("+1");
    ampEnvelope.triggerAttackRelease(4);
    noise.volume.rampTo(30, 0);
    noise.volume.rampTo(-10, 1.5);
    noise.volume.setValueAtTime(0, "+5");
    osc.volume.rampTo(-20,2);
    osc.volume.setValueAtTime(0, "+5");
    clicked = true;
  });
}
function mouseReleased(){
    clicked = false;
    noise.stop();
    osc.stop();
}
function draw() {
  if(clicked == false){
      background(bg1);
  }else{
    background(bg2);
  }
}