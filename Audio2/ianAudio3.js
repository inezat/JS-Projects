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
     type: "lowpass"
   }).connect(ampEnvelope);

   noise = new Tone.Noise().connect(filter).start();

   filter.frequency.value = 3000;
  noise.type = "brown"; 

  //  ampLfo = new Tone.LFO('8n', -60, -10).start();
  //  ampLfo.connect(filter.volume);

   canv.mousePressed(() => {
     noise.start();
     ampEnvelope.triggerAttackRelease(4);
     noise.volume.rampTo(30, 0);
     noise.volume.rampTo(-10, 1.5);
     noise.volume.setValueAtTime(-6, "+7");
     clicked = true;
   });
}
 function mouseReleased(){
     clicked = false;
     noise.stop(); 
    }
function draw() {
   if(clicked == false){
      background(bg1);
   }else{
     background(bg2);
   }
}