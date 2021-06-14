//Ian Nezat
//CSC 2463
//Audio 2

let ampEnvelope;
let noise;
let filterCutoff; 
let playing = false;
let filter;
let filter2;
let filter3;
let osc = new Tone.Oscillator();
let osc2 = new Tone.Oscillator();
let osc3 = new Tone.Oscillator();
let osc4 = new Tone.Oscillator();
let lfo;

function setup() {
  createCanvas(1000, 1000)

  ampEnvelope = new Tone.AmplitudeEnvelope({
    "attack": 0.1,
    "decay": 0.2,
    "sustain": 1.0,
    "release": 0.8
  }).toDestination(); 
  
  filter = new Tone.Filter({
    "type" : "lowpass", 
    "Q" : 3
  }).connect(ampEnvelope)

  filter2 = new Tone.Filter({
    "type" : "highpass", 
    "Q" : 1
  })
  
  filter3 = new Tone.Filter({
    "type" : "bandpass", 
    "Q" : 2
  })

  noise = new Tone.Noise()
    .connect(filter)
    .start();
  lfo = new Tone.LFO("4n", 400, 1000).start().connect(filter2.frequency);

  filter.frequency.value = 200
  noise.type = 'white' 

  button = createButton("start/stop sin oscillator");
  button.position(19, 19);
  button.mousePressed(toggleOsc1);

  button2 = createButton("start/stop triangle oscillator");
  button2.position(19, 75);
  button2.mousePressed(toggleOsc2);

  button3 = createButton("start/stop white noise");
  button3.position(19, 130);
  button3.mousePressed(toggleWN);

  button4 = createButton("start/stop square oscillator");
  button4.position(19, 190);
  button4.mousePressed(toggleOsc3);

  button5 = createButton("start/stop sawtooth oscillator");
  button5.position(19, 240);
  button5.mousePressed(toggleOsc4);

  slider = createSlider(100, 1200, 440, 0.1);
  slider.position(19,55);

  slider2 = createSlider(100, 1200, 300, 0.1);
  slider2.position(19,110);

  filterCutoff = createSlider(200, 10000, 1000, 0.1); 
  filterCutoff.position(19, 165);

  slider3 = createSlider(100, 1200, 200, 0.1);
  slider3.position(19,212);

  slider4 = createSlider(100, 1200, 500, 0.1);
  slider4.position(19,265);
}

function draw() {
  background(150)

  osc.frequency.value = slider.value();
  osc.connect(filter2);

  osc2.frequency.value = slider2.value();
  osc2.connect(filter3);

  osc3.frequency.value = slider3.value();
  osc4.frequency.value = slider4.value();
  text(`Cutoff value: ${filterCutoff.value().toFixed(0)} Hz`, 19, 162)
  text(`Filter type: ${filter2.type}`, 19, 52)
  text(`Filter type: ${filter3.type}`, 19, 108)
  text(`Filter type: ${filter.type}`, 150, 162)

  filter.frequency.value = filterCutoff.value()
}

function toggleOsc1(){
    if(!playing){
        osc.type = "sine";
        osc.amp = 1;
        osc.freq = 440;
        playing = true;
        osc.toDestination().start();
    }else{
        playing = false;
        osc.stop();
    }
}
function toggleOsc2(){
    if(!playing){
        osc2.type = "triangle";
        osc2.amp = 1;
        osc2.freq = 300;
        playing = true;
        osc2.toDestination().start();
    }else{
        playing = false;
        osc2.stop();
    }
}
function toggleOsc3(){
    if(!playing){
        osc3.type = "square";
        osc3.amp = 1;
        osc3.freq = 200;
        playing = true;
        osc3.toDestination().start();
    }else{
        playing = false;
        osc3.stop();
    }
}
function toggleOsc4(){
    if(!playing){
        osc4.type = "sawtooth";
        osc4.amp = 1;
        osc4.freq = 500;
        playing = true;
        osc4.toDestination().start();
    }else{
        playing = false;
        osc4.stop();
    }
}
function toggleWN(){
    if(!playing){
        playing = true;
        ampEnvelope.triggerAttackRelease('2n');
    }else{
        playing = false;
    }
}