//# audio/sound.js — Web Audio: music sequencer, every sound effect (SF), zombie voices, footstep surfaces
const AU={c:null,trk:null,want:null,step:0,nt:0,tl:{},php:0,gv:0,vo:0};
const mf=n=>440*Math.pow(2,(n-69)/12),rnd=(a,b)=>a+Math.random()*(b-a);
function midi(n){const m=/^([A-G])(#|b)?(\d)$/.exec(n);return 12*(+m[3]+1)+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]=='#'?1:m[2]=='b'?-1:0)}
function pn(s){const tk=s.trim().split(/\s+/),ev={};for(let i=0;i<tk.length;i++){const x=tk[i];if(x=='.'||x=='-')continue;let l=1;while(tk[i+l]=='-')l++;(ev[i]=ev[i]||[]).push([x,l])}return{len:tk.length,ev}}
const MUS={
menu:{bpm:78,ch:[
{i:'bass',v:.3,s:'A2 - - - - - - - E3 - - - - - - - F2 - - - - - - - C3 - - - - - - - D2 - - - - - - - A2 - - - - - - - E2 - - - - - - - B2 - - - - - - -'},
{i:'arp',v:.07,s:'A4 . C5 . E5 . A5 . E5 . C5 . A4 . C5 . F4 . A4 . C5 . F5 . C5 . A4 . F4 . A4 . D4 . F4 . A4 . D5 . A4 . F4 . D4 . F4 . E4 . G#4 . B4 . E5 . B4 . G#4 . E4 . G#4 .'},
{i:'ghost',v:.13,s:'. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . E5 - - - - - D5 - C5 - - - B4 - A4 - C5 - - - - - - - . . A4 - C5 - F5 - E5 - - - D5 - - - C5 - - - A4 - - - B4 - - - - - - - G#4 - - - - - - -'},
{i:'d',v:.5,s:'k . . . h . . . . . . . h . . . k . . . h . . . . . . . h . . . k . . . h . . . . . . . h . . . k . . . h . . . t . . . h . t .'}]},
game:{bpm:150,ch:[
{i:'bass',v:.32,s:'A2 . A2 . A3 . A2 . A2 . A2 . A3 . G2 . F2 . F2 . F3 . F2 . F2 . F2 . F3 . E2 . G2 . G2 . G3 . G2 . G2 . G2 . G3 . D3 . E2 . E2 . E3 . E2 . E2 . E3 . G#2 . B2 .'},
{i:'lead',v:.13,s:'A4 - C5 - E5 - - - D5 - C5 - B4 - C5 - A4 - - - - - - - F4 - A4 - C5 - - - B4 - D5 - G5 - - - F5 - E5 - D5 - B4 - G#4 - - - B4 - - - E5 - - - - - . . E5 - E5 - . . A5 - G5 - E5 - C5 - D5 - C5 - - - A4 - - - F5 - E5 - C5 - A4 - D5 - - - B4 - - - G4 - B4 - D5 - F5 - E5 - - - - - - - D5 - C5 - B4 - G#4 -'},
{i:'arp',v:.045,s:'. . E5 . . . E5 . . . E5 . . . E5 . . . F5 . . . F5 . . . F5 . . . F5 . . . G5 . . . G5 . . . G5 . . . G5 . . . G#5 . . . G#5 . . . B5 . . . B5 .'},
{i:'d',v:.6,s:'k . h . s . h . k . k . s . h h k . h . s . h . k . k . s . h h k . h . s . h . k . k . s . h h k . h . s . h . k . s . s s s s'}]},
boss:{bpm:166,ch:[
{i:'bass',v:.3,s:'A2 A2 A3 A2 A2 A2 A3 A2 A2 A2 A3 A2 C3 . B2 . A#2 A#2 A#3 A#2 A#2 A#2 A#3 A#2 A#2 A#2 A#3 A#2 D3 . C3 . A2 A2 A3 A2 A2 A2 A3 A2 A2 A2 A3 A2 C3 . B2 . E2 E2 E3 E2 E2 E2 E3 E2 G#2 G#2 G#3 G#2 B2 . D3 .'},
{i:'lead',v:.12,s:'A5 - - - E5 - - - A5 - G5 - F5 - E5 - F5 - - - D5 - - - A#4 - - - D5 - F5 - E5 - A5 - C6 - - - B5 - A5 - G5 - E5 - G#5 - - - - - - - E5 - - - B4 - D5 -'},
{i:'arp',v:.05,s:'A4 C5 E5 A4 C5 E5 A4 C5 E5 A4 C5 E5 A4 C5 E5 C5 A#4 D5 F5 A#4 D5 F5 A#4 D5 F5 A#4 D5 F5 A#4 D5 F5 D5 A4 C5 E5 A4 C5 E5 A4 C5 E5 A4 C5 E5 A4 C5 E5 C5 E4 G#4 B4 E4 G#4 B4 E4 G#4 B4 E4 G#4 B4 E4 G#4 B4 D5'},
{i:'d',v:.62,s:'k . h k s . h . k k h . s . h s k . h k s . h . k k h . s . h s k . h k s . h . k k h . s . h s k . s . k . s . k s k s s s s s'}]}};
for(const k in MUS)for(const ch of MUS[k].ch)Object.assign(ch,pn(ch.s));
function pwave(d){const N=24,re=new Float32Array(N),im=new Float32Array(N);for(let n=1;n<N;n++)re[n]=2*Math.sin(n*Math.PI*d)/(n*Math.PI);return AU.c.createPeriodicWave(re,im)}
function unlock(){const c=AU.c;if(c&&c.state=='running'&&AU.el&&!AU.el.paused&&AU.as){sndStat();return}try{if(!AU.as&&typeof navigator!='undefined'&&navigator.audioSession){navigator.audioSession.type='playback'}AU.as=1}catch(e){}
if(!AU.el){try{const n=4000,b=new Uint8Array(44+n),v=new DataView(b.buffer),w=(o,t)=>{for(let i=0;i<t.length;i++)b[o+i]=t.charCodeAt(i)};w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);b.fill(128,44);
const a=new Audio();a.src=URL.createObjectURL(new Blob([b],{type:'audio/wav'}));a.loop=true;a.setAttribute('playsinline','');a.volume=.01;AU.el=a}catch(e){AU.el=0}}
try{if(AU.el&&AU.el.paused){const p=AU.el.play();if(p&&p.catch)p.catch(()=>{})}}catch(e){}
if(c){try{if(c.state!='running'){const p=c.resume();if(p&&p.then)p.then(sndStat,()=>{})}const sb=c.createBufferSource();sb.buffer=c.createBuffer(1,1,22050);sb.connect(c.destination);sb.start(0)}catch(e){}}sndStat()}
function sndStat(){const e=document.getElementById('sst');if(e)e.textContent=sndTxt();const h=document.getElementById('sndh');if(h&&AU.c&&AU.c.state=='running')h.remove()}
function sndTxt(){return !AU.c?'Sound: tap the screen to turn on':AU.c.state=='running'?'Sound: ON':'Sound: blocked, tap the screen to turn on'}
function auInit(){if(AU.c){unlock();return}const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return;
try{const c=new AC();AU.c=c;AU.m=c.createGain();AU.m.gain.value=.9;const cp=c.createDynamicsCompressor();cp.threshold.value=-14;cp.ratio.value=4;AU.m.connect(cp);cp.connect(c.destination);
AU.mu=c.createGain();AU.mu.connect(AU.m);AU.duck=c.createGain();AU.duck.connect(AU.mu);AU.sf=c.createGain();AU.sf.connect(AU.m);
const nb=c.createBuffer(1,c.sampleRate,c.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.nb=nb;AU.p25=pwave(.25);AU.p12=pwave(.125);
auVol();setInterval(seq,25);c.onstatechange=sndStat;unlock();if(AU.want){const w=AU.want;AU.want=null;music(w)}}catch(e){AU.c=null}}
function auVol(){if(!AU.c)return;const t=AU.c.currentTime;AU.mu.gain.setTargetAtTime(Math.pow(S.mv,1.5)*1.35,t,.03);AU.sf.gain.setTargetAtTime(Math.pow(S.sv,1.5),t,.03)}
function duck(v){if(AU.c)AU.duck.gain.setTargetAtTime(v,AU.c.currentTime,.12)}
function music(n){if(!AU.c){AU.want=n;return}if(!n){AU.trk=null;return}if(AU.trk==n)return;AU.trk=n;AU.step=0;AU.nt=AU.c.currentTime+.1}
function env(g,t,v,a,dur,rel){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setValueAtTime(v,t+Math.max(a,dur-rel));g.gain.linearRampToValueAtTime(0,t+dur)}
function note(ins,n,t,dur,v){const c=AU.c,f=mf(midi(n)),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(AU.duck);
if(ins=='lead'){o.setPeriodicWave(AU.p25);o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.006);g.gain.linearRampToValueAtTime(v*.62,t+.09);g.gain.setValueAtTime(v*.62,t+Math.max(.09,dur-.05));g.gain.linearRampToValueAtTime(0,t+dur);
if(dur>.25){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(14,t+dur);l.connect(lg);lg.connect(o.detune);l.start(t);l.stop(t+dur+.02)}}
else if(ins=='bass'){o.type='triangle';o.frequency.value=f;env(g,t,v,.005,dur*.92,.03)}
else if(ins=='arp'){o.setPeriodicWave(AU.p12);o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+Math.min(.22,dur+.12));dur=.25}
else{o.type='triangle';o.frequency.value=f;const o2=c.createOscillator();o2.type='sine';o2.frequency.value=f*2.003;const g2=c.createGain();g2.gain.value=.35;o2.connect(g2);g2.connect(g);
const l=c.createOscillator(),lg=c.createGain();l.frequency.value=4.2;lg.gain.value=18;l.connect(lg);lg.connect(o.detune);lg.connect(o2.detune);l.start(t);l.stop(t+dur+.4);o2.start(t);o2.stop(t+dur+.4);env(g,t,v,.12,dur+.3,.35);dur+=.3}
o.start(t);o.stop(t+dur+.05)}
function drum(k,t,v,d){if(k=='k'){osc('sine',150,42,t,.16,.9*v,d,.002)}else if(k=='s'){noise(t,.14,.5*v,d,'bandpass',1900,900,.7);osc('triangle',200,150,t,.08,.28*v,d,.002)}else if(k=='h')noise(t,.035,.16*v,d,'highpass',7000);else if(k=='o')noise(t,.14,.14*v,d,'highpass',6000);else if(k=='t')osc('sine',190,95,t,.2,.5*v,d,.003)}
function seq(){const c=AU.c;if(!c||!AU.trk||c.state!='running')return;if(AU.nt<c.currentTime-.2)AU.nt=c.currentTime+.05;const T=MUS[AU.trk],sd=60/T.bpm/4;
while(AU.nt<c.currentTime+.15){for(const ch of T.ch){const e=ch.ev[AU.step%ch.len];if(e)for(const[n,l]of e){if(ch.i=='d')drum(n,AU.nt,ch.v,AU.duck);else note(ch.i,n,AU.nt,l*sd,ch.v)}}AU.step++;AU.nt+=sd}}
function osc(type,f0,f1,t,dur,v,d,att=.004,det=0){const c=AU.c,o=c.createOscillator(),g=c.createGain();if(type.length>8)o.setPeriodicWave(type=='pulse25wave'?AU.p25:AU.p12);else o.type=type;o.frequency.setValueAtTime(f0,t);if(f1&&f1!=f0)o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);o.detune.value=det;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g);g.connect(d);o.start(t);o.stop(t+dur+.05)}
function noise(t,dur,v,d,ft='lowpass',f0=2000,f1=0,q=.8,att=.002){const c=AU.c,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.nb;s.loop=true;fl.type=ft;fl.frequency.setValueAtTime(f0,t);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+dur);fl.Q.value=q;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(fl);fl.connect(g);g.connect(d);s.start(t,Math.random()*.6);s.stop(t+dur+.05)}
function vox(type,f0,f1,t,dur,v,d,cut=900,vib=6,vd=6,att=.08){const c=AU.c,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);l.frequency.value=vib;lg.gain.value=vd;l.connect(lg);lg.connect(o.frequency);f.type='lowpass';f.frequency.value=cut;f.Q.value=4;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.setValueAtTime(v,t+dur*.55);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(f);f.connect(g);g.connect(d);o.start(t);l.start(t);o.stop(t+dur+.05);l.stop(t+dur+.05)}
const P25='pulse25wave',P12='pulse12wave';
function moan(t,d){const c=AU.c,f=rnd(68,86),L=rnd(1.5,2.1),o1=c.createOscillator(),o2=c.createOscillator(),mx=c.createGain(),f1=c.createBiquadFilter(),f2=c.createBiquadFilter(),lp=c.createBiquadFilter(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain(),tr=c.createOscillator(),tg=c.createGain(),g2=c.createGain();
o1.type='sawtooth';o2.type='sawtooth';o2.detune.value=14;
for(const o of[o1,o2]){o.frequency.setValueAtTime(f*.86,t);o.frequency.linearRampToValueAtTime(f*1.12,t+L*.32);o.frequency.linearRampToValueAtTime(f*1.02,t+L*.6);o.frequency.exponentialRampToValueAtTime(f*.66,t+L)}
l.frequency.value=rnd(4,5.5);lg.gain.value=f*.035;l.connect(lg);lg.connect(o1.frequency);lg.connect(o2.frequency);
o1.connect(mx);o2.connect(mx);mx.gain.value=.5;
f1.type='bandpass';f1.Q.value=5;f1.frequency.setValueAtTime(330,t);f1.frequency.linearRampToValueAtTime(470,t+L*.4);f1.frequency.linearRampToValueAtTime(300,t+L);
f2.type='bandpass';f2.Q.value=7;f2.frequency.setValueAtTime(820,t);f2.frequency.linearRampToValueAtTime(960,t+L*.4);f2.frequency.linearRampToValueAtTime(700,t+L);
lp.type='lowpass';lp.frequency.value=480;lp.Q.value=1;
mx.connect(f1);mx.connect(f2);mx.connect(lp);const fg=c.createGain();fg.gain.value=.55;f2.connect(fg);
tr.frequency.value=rnd(8,11);tg.gain.value=.22;tr.connect(tg);tg.connect(g2.gain);g2.gain.value=.78;
f1.connect(g2);fg.connect(g2);lp.connect(g2);g2.connect(g);g.connect(d);
const v=.55;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.28);g.gain.setValueAtTime(v,t+L*.55);g.gain.linearRampToValueAtTime(v*.7,t+L*.8);g.gain.exponentialRampToValueAtTime(.0008,t+L);
for(const o of[o1,o2,l,tr]){o.start(t);o.stop(t+L+.05)}
noise(t+.05,L*.9,.045,d,'bandpass',620,420,2,.3);return L}
const SF={
pistol:(t,d)=>{osc(P25,560,100,t,.1,.24,d);noise(t,.08,.35,d,'bandpass',1100,500,.8);osc('sine',110,42,t,.09,.32,d);return .11},
smg:(t,d)=>{osc(P25,680,170,t,.07,.17,d);noise(t,.06,.28,d,'bandpass',1400,600,.8);osc('sine',100,45,t,.06,.2,d);return .08},
shotgun:(t,d)=>{noise(t,.34,.65,d,'lowpass',1900,170);osc('sine',100,30,t,.26,.6,d);osc(P25,320,60,t,.11,.14,d);noise(t+.18,.06,.12,d,'bandpass',900,0,3);noise(t+.27,.05,.1,d,'bandpass',700,0,3);return .4},
rifle:(t,d)=>{noise(t,.16,.48,d,'bandpass',1000,300,.7);osc('sawtooth',260,45,t,.13,.15,d);osc('sine',85,34,t,.15,.42,d);return .17},
rocket:(t,d)=>{noise(t,.55,.38,d,'bandpass',260,1700,1.3,.04);osc('sawtooth',55,150,t,.4,.08,d,.03);osc('sine',65,28,t,.16,.42,d);return .55},
hshotgun:(t,d)=>{noise(t,.42,.75,d,'lowpass',1500,110);osc('sine',80,24,t,.34,.75,d);osc('sawtooth',200,40,t,.14,.16,d);noise(t+.22,.07,.14,d,'bandpass',700,0,3);noise(t+.32,.06,.12,d,'bandpass',550,0,3);return .5},
hrifle:(t,d)=>{noise(t,.22,.55,d,'bandpass',800,220,.7);osc('sawtooth',190,32,t,.16,.16,d);osc('sine',66,24,t,.24,.6,d);noise(t+.06,.3,.12,d,'lowpass',500,120);return .32},
minigun:(t,d)=>{noise(t,.05,.3,d,'bandpass',900,400,.8);osc(P25,300,90,t,.05,.12,d);osc('sine',90,40,t,.05,.2,d);return .06},
lshotgun:(t,d)=>{osc(P25,700,120,t,.22,.2,d,.002);osc('sawtooth',350,70,t,.22,.12,d,.002,14);noise(t,.18,.3,d,'bandpass',1200,300,1);osc('sine',90,30,t,.2,.35,d);return .25},
lminigun:(t,d)=>{osc(P25,820,300,t,.06,.14,d,.002);osc('sine',160,80,t,.05,.15,d);return .07},
armor:(t,d)=>{osc('square',620,600,t,.08,.1,d);osc('triangle',1240,1200,t,.12,.08,d);noise(t,.04,.15,d,'highpass',3000);return .14},
laser:(t,d)=>{osc(P25,900,180,t,.16,.2,d,.002);osc('sawtooth',450,90,t,.16,.1,d,.002,12);osc('sine',140,60,t,.1,.25,d);noise(t,.05,.12,d,'highpass',2600);return .18},
boom:(t,d)=>{noise(t,1.1,.85,d,'lowpass',2200,110);osc('sine',100,26,t,.8,.75,d);osc(P25,70,30,t,.45,.12,d);noise(t+.05,.5,.2,d,'highpass',3000,800);return 1.1},
hit:(t,d)=>{noise(t,.05,.26,d,'lowpass',950);osc(P25,210,120,t,.045,.06,d);return .06},
splat:(t,d)=>{noise(t,.2,.38,d,'lowpass',1500,180);osc('sine',240,55,t,.17,.26,d);noise(t+.04,.1,.15,d,'bandpass',600,0,5);return .22},
hurt:(t,d)=>{osc(P25,560,150,t,.24,.2,d);osc(P12,280,75,t,.24,.13,d,.004,18);noise(t,.08,.22,d,'lowpass',1300);return .26},
groan:(t,d)=>moan(t,d),
shriek:(t,d)=>{vox('sawtooth',rnd(320,380),rnd(170,210),t,.42,.2,d,1900,15,26,.02);return .45},
roar:(t,d)=>{vox('sawtooth',62,40,t,1.15,.42,d,480,4,5,.12);noise(t,.9,.12,d,'lowpass',320,160,1,.15);return 1.2},
hiss:(t,d)=>{noise(t,.5,.14,d,'bandpass',3500,5200,6,.12);return .5},
dashwarn:(t,d)=>{vox('square',620,1500,t,.42,.12,d,3200,22,40,.02);return .45},
swoosh:(t,d)=>{noise(t,.32,.4,d,'bandpass',500,3200,2.2,.03);return .35},
gurgle:(t,d)=>{vox('sawtooth',125,72,t,.75,.28,d,620,18,34,.06);return .8},
split:(t,d)=>{noise(t,.28,.45,d,'lowpass',1800,220);osc('sine',420,90,t,.25,.35,d);[0,.07,.13].forEach(o=>osc('sine',rnd(500,700),rnd(900,1200),t+o,.06,.18,d));return .35},
squeak:(t,d)=>{vox('square',rnd(480,560),rnd(360,420),t,.2,.08,d,2200,22,30,.01);return .22},
clank:(t,d)=>{osc('square',182,175,t,.3,.16,d);osc('square',291,285,t,.24,.12,d);osc('triangle',647,640,t,.4,.12,d);noise(t,.06,.3,d,'highpass',3000);return .4},
horn:(t,d)=>{osc('sawtooth',110,104,t,1.4,.2,d,.08);osc('sawtooth',116.5,110,t,1.4,.17,d,.08);osc(P25,55,52,t,1.4,.2,d,.1);noise(t,1.2,.06,d,'lowpass',500,0,1,.3);return 1.5},
kong:(t,d)=>{vox('sawtooth',150,85,t,.95,.42,d,700,9,22,.05);noise(t,.7,.14,d,'bandpass',600,300,1.5,.06);return 1},
throw:(t,d)=>{noise(t,.22,.3,d,'bandpass',900,300,2,.02);osc('sine',200,90,t,.12,.18,d);return .25},
bow:(t,d)=>{osc('triangle',230,205,t,.35,.3,d,.002);osc(P12,460,430,t,.12,.08,d);noise(t,.05,.18,d,'highpass',2500);return .36},
rattle:(t,d)=>{for(let i=0;i<7;i++)noise(t+i*.045+Math.random()*.02,.03,.28,d,'bandpass',rnd(2200,3800),0,5);return .4},
rattleBig:(t,d)=>{for(let i=0;i<10;i++)noise(t+i*.055+Math.random()*.02,.045,.35,d,'bandpass',rnd(900,1800),0,4);vox('sawtooth',70,50,t,.8,.2,d,400,3,4,.1);return .8},
swipe:(t,d)=>{noise(t,.22,.32,d,'bandpass',700,2400,2,.03);return .25},
breath:(t,d)=>{noise(t,.55,.12,d,'bandpass',900,600,3,.25);noise(t+.7,.45,.08,d,'bandpass',1200,800,3,.2);return 1.2},
acid:(t,d)=>{noise(t,.9,.5,d,'highpass',1800,5000,.7,.01);noise(t,.3,.4,d,'lowpass',1200,200);for(let i=0;i<6;i++)osc('sine',rnd(300,700),rnd(900,1500),t+.1+i*.08,.05,.15,d);return 1},
gob:(t,d)=>{vox('square',rnd(380,440),rnd(260,300),t,.35,.1,d,1400,26,40,.02);return .4},
spit:(t,d)=>{noise(t,.09,.4,d,'bandpass',1300,600,2);osc('sine',420,110,t,.12,.25,d);return .15},
flap:(t,d)=>{noise(t,.07,.2,d,'lowpass',650);noise(t+.13,.07,.16,d,'lowpass',600);return .22},
chomp:(t,d)=>{osc('square',190,85,t,.1,.2,d);noise(t,.07,.32,d,'lowpass',1600);noise(t+.12,.05,.2,d,'lowpass',1400);return .2},
fire:(t,d)=>{noise(t,.75,.5,d,'bandpass',500,2200,.9,.05);noise(t,.6,.2,d,'lowpass',400,0,1,.05);return .8},
dragon:(t,d)=>{vox('sawtooth',230,78,t,1.2,.4,d,1300,7,30,.04);noise(t,1,.18,d,'bandpass',900,400,1.2,.05);return 1.25},
ogre:(t,d)=>{vox('sawtooth',96,62,t,.55,.42,d,520,5,8,.04);return .6},
club:(t,d)=>{noise(t,.28,.45,d,'bandpass',300,1800,2,.06);osc('sine',90,45,t+.2,.2,.45,d);return .45},
slam:(t,d)=>{noise(t,.9,.85,d,'lowpass',900,70);osc('sine',70,22,t,.75,.85,d);noise(t,.15,.3,d,'highpass',2000);return .9},
grass:(t,d)=>{noise(t,.07,.2,d,'lowpass',rnd(800,1000),380);noise(t,.03,.05,d,'highpass',3200);return .08},
dirt:(t,d)=>{noise(t,.07,.22,d,'bandpass',rnd(1100,1400),0,1.2);for(let i=0;i<3;i++)noise(t+Math.random()*.05,.012,.12,d,'highpass',4000);return .09},
wood:(t,d)=>{osc('sine',rnd(130,150),80,t,.07,.32,d);noise(t,.04,.12,d,'lowpass',1600);return .08},
hard:(t,d)=>{noise(t,.035,.2,d,'highpass',rnd(1400,1800));osc('sine',900,500,t,.02,.04,d);return .05},
soft:(t,d)=>{noise(t,.06,.16,d,'lowpass',520);return .07},
click:(t,d)=>{osc(P25,880,880,t,.04,.1,d);return .05},
coin:(t,d)=>{osc(P25,1319,1319,t,.05,.14,d);osc(P25,1760,1760,t+.05,.12,.14,d);return .18},
power:(t,d)=>{[60,64,67,72,76].forEach((n,i)=>osc(P25,mf(n),0,t+i*.05,.12,.12,d));osc('sawtooth',mf(48),mf(60),t,.3,.08,d);return .4},
heal:(t,d)=>{[72,76,79].forEach((n,i)=>osc('triangle',mf(n),0,t+i*.07,.25,.18,d));return .45},
buy:(t,d)=>{osc(P25,988,988,t,.07,.16,d);osc(P25,1319,1319,t+.07,.16,.16,d);return .25},
deny:(t,d)=>{osc(P25,220,200,t,.09,.15,d);osc(P25,165,150,t+.1,.14,.15,d);return .25},
wave:(t,d)=>{[57,60,64,69].forEach((n,i)=>osc(P25,mf(n),0,t+i*.08,.16,.14,d));osc('triangle',mf(45),0,t,.5,.25,d);return .6},
newz:(t,d)=>{[76,75,74,73].forEach((n,i)=>osc(P12,mf(n),0,t+.45+i*.07,.1,.09,d));return .8},
clear:(t,d)=>{[[69,0],[72,.1],[76,.2],[81,.3]].forEach(([n,o])=>osc(P25,mf(n),0,t+o,.25,.14,d));osc('triangle',mf(57),0,t+.3,.6,.22,d);osc('triangle',mf(64),0,t+.3,.6,.15,d);return .9},
over:(t,d)=>{[[69,0],[68,.22],[67,.44],[66,.66]].forEach(([n,o])=>osc(P25,mf(n),mf(n-1),t+o,.24,.15,d));osc('triangle',mf(42),mf(30),t+.88,1.2,.3,d,.01);return 2.1},
pause:(t,d)=>{osc(P25,660,660,t,.06,.12,d);osc(P25,440,440,t+.07,.09,.12,d);return .17}};
const ZV={0:'groan',1:'shriek',2:'roar',3:'hiss',4:'gurgle',5:'squeak',6:'clank',7:'kong',8:'rattleBig',9:'rattle',10:'breath',11:'gob',12:'dragon',13:'ogre',14:'flap',18:'gurgle',19:'groan',20:'roar'};
function sfx(n,x,y,v=1,cd=0){const c=AU.c;if(!c||c.state!='running'||S.sv<=0)return;if(cd){if(c.currentTime-(AU.tl[n]||0)<cd)return;AU.tl[n]=c.currentTime}
let pan=0;if(x!=null&&P){let Q=P;if(MPn){let bd=1e9;for(const p of PL){if(p.dead)continue;const d=Math.hypot(x-p.x,y-p.y);if(d<bd){bd=d;Q=p}}}const dd=Math.hypot(x-Q.x,y-Q.y);v*=Math.max(0,1-dd/700);if(v<.04)return;pan=MPn?0:cl((x-P.x)/380,-.85,.85)}if(AU.vo>28||!SF[n])return;
const g=c.createGain();g.gain.value=v;if(pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(AU.sf)}else g.connect(AU.sf);
const dur=SF[n](c.currentTime+.005,g)||.3;AU.vo++;setTimeout(()=>{AU.vo--;try{g.disconnect()}catch(e){}},(dur+.25)*1000)}
function zvoice(z){if(!AU.c||!P)return;const d=Math.hypot(z.x-P.x,z.y-P.y);if(d>620)return;if(z.t!=14){if(AU.c.currentTime-AU.gv<.35)return;AU.gv=AU.c.currentTime}sfx(ZV[z.t],z.x,z.y,z.t==14?.7:1)}
let SURF=null,SGW=0;const SN=['grass','soft','dirt','wood','hard'];
function mkSurf(){SURF=null;try{const w=Math.ceil(WW/16),h=Math.ceil(WH/16),c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(BG,0,0,WW,WH,0,0,w,h);const d=q.getImageData(0,0,w,h).data,o=new Uint8Array(w*h);for(let i=0;i<w*h;i++){const r=d[i*4],g=d[i*4+1],b=d[i*4+2];o[i]=g>r+12&&g>b+4?0:b>r+12?1:r>g+10&&g>b+8?(mapId==2||(mapId==4&&r+g+b>360)?2:3):4}c.width=c.height=0;SURF=o;SGW=w}catch(e){SURF=null}}
function surf(){if(!SURF)return'grass';const i=cl((P.x/16)|0,0,SGW-1),j=Math.max(0,((P.y+10)/16)|0);return SN[SURF[j*SGW+i]??0]}
['pointerdown','pointerup','touchstart','touchend','mousedown','click','keydown'].forEach(e=>document.addEventListener(e,auInit,true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AU.c&&AU.c.state!='running')AU.c.resume()});
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('button');if(b&&!b.dataset.q)sfx('click')});

