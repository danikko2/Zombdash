//# world/kit-decals.js — Building kit decals: flat, non-solid pictures painted on the ground that turn and scale (cracks, stains, oil, blood, skid marks, scorch, glass, debris, puddles, potholes, manholes, leaves, moss, shadows, light patches, painted words and arrows, hazard stripes, graffiti, chalk circles, cobwebs...)
// ---------- decals ----------
// A decal is drawn centred on (0,0) at its own size w×h (scale 1), then the map turns it (rot) and scales it (scale 0.25–4).
// f(g,v,K,t,O): v is the piece's own random number (0..1, so two cracks never look the same), K the chosen colour in shades
// (only for decals with a pal), t the text (only for decals with txt), O the options (defaults filled in; decals with opts). Decals are painted into the ground picture: no collision.
const CMDCAT=[['wear','Wear & tear'],['crash','Crash & fire'],['gore','Blood'],['body','Bodies & body parts'],['nature','Nature'],['paint','Paint & markings'],['light','Shadows & light'],['spooky','Spooky'],['misc','Litter & other']];
function dcH(v,i,k){const q=Math.sin(v*913.7+i*12.9898+k*78.233)*43758.5453;return q-Math.floor(q)}
function dcCrack(g,v,len,n,col,w){g.strokeStyle=col;g.lineWidth=w||1;g.lineCap='round';g.beginPath();let x=-len/2,y=(dcH(v,0,1)-.5)*8,a=(dcH(v,0,2)-.5)*.6;g.moveTo(x,y);const st=len/n;
for(let i=0;i<n;i++){a+=(dcH(v,i,3)-.5)*1.1;x+=Math.cos(a)*st;y+=Math.sin(a)*st;g.lineTo(x,y);if(dcH(v,i,4)<.35){const b=a+(dcH(v,i,5)<.5?-1:1)*(.8+dcH(v,i,6)*.6);g.moveTo(x,y);g.lineTo(x+Math.cos(b)*st*.8,y+Math.sin(b)*st*.8);g.moveTo(x,y)}}g.stroke();g.lineCap='butt'}
function dcBlob(g,cx,cy,r,col,v,k){g.fillStyle=col;g.beginPath();const n=10;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,rr=r*(.72+dcH(v,i,k)*.4);i?g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.7):g.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.7)}g.closePath();g.fill()}
function dcEll(g,x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.max(.5,rx),Math.max(.5,ry),0,0,7);g.fill()}
function dcFit(g,t,max,px,font){let s=px;g.font='bold '+s+'px '+(font||'Arial, Helvetica, sans-serif');while(s>7&&g.measureText(t).width>max){s--;g.font='bold '+s+'px '+(font||'Arial, Helvetica, sans-serif')}return s}
const PDPAINT=[['#e8e8e0','White'],['#e3b92b','Yellow'],['#d8403a','Red'],['#2f6fd0','Blue'],['#3aaa5a','Green'],['#16161a','Black']];
const PDGRAF=[['#ff3a8a','Pink'],['#3ae8ff','Cyan'],['#ffe03a','Yellow'],['#8aff3a','Lime'],['#c83aff','Purple'],['#ff7a1a','Orange'],['#e8e8e0','White'],['#16161a','Black']];
const PDLEAF=[['#c8762a','Autumn'],['#a8462a','Red'],['#d8a43a','Gold'],['#5a8a3a','Green'],['#7a5a32','Brown']];
const PDMAT=[['#7a3b3b','Red'],['#4a5a7a','Blue'],['#5a6a4a','Green'],['#6b4a2a','Brown'],['#3a3a40','Black']];
// blood: fresh, dark, dried, zombie green, black ooze (kit-gore.js adds more blood and the bodies)
const PDBLOOD=[['#7a1414','Fresh red'],['#560c12','Dark red'],['#4e2e1c','Dried brown'],['#4e6a1e','Zombie green'],['#26201c','Black ooze']];
const PDLIGHT=[['#ffd27a','Warm'],['#c8e0ff','Cool'],['#ff9a4a','Fire'],['#b6ffd8','Ghost'],['#ff5a5a','Red']];
const CMDK=[
// wear & tear
{id:'crack',n:'Crack',cat:'wear',w:70,h:30,f(g,v){dcCrack(g,v,60,7,'rgba(20,18,16,.6)')}},
{id:'crack_big',n:'Crack web',cat:'wear',w:90,h:70,f(g,v){for(let k=0;k<4;k++){g.save();g.rotate(k*1.6+dcH(v,k,7));dcCrack(g,v+k,40+dcH(v,k,8)*30,6,'rgba(20,18,16,.6)');g.restore()}dcEll(g,0,0,4,3,'rgba(20,18,16,.35)')}},
{id:'crack_grass',n:'Crack with weeds',cat:'wear',w:70,h:34,f(g,v){dcCrack(g,v,60,7,'rgba(20,18,16,.6)');for(let i=0;i<5;i++){const x=-24+i*12+dcH(v,i,9)*6,y=(dcH(v,i,10)-.5)*10;g.fillStyle=i%2?'#4a7a2a':'#5a8a32';g.fillRect(x,y-3,2,4);g.fillRect(x+3,y-2,2,3)}}},
{id:'oil',n:'Oil stain',cat:'wear',w:60,h:34,f(g,v){dcBlob(g,0,0,26,'rgba(12,10,8,.38)',v,11);dcBlob(g,-4,-2,14,'rgba(12,10,8,.25)',v,12);dcEll(g,-6,-4,8,3,'rgba(80,70,120,.16)')}},
{id:'stain',n:'Stain',cat:'wear',w:50,h:30,f(g,v){dcBlob(g,0,0,22,'rgba(40,30,20,.32)',v,13);dcBlob(g,5,2,10,'rgba(40,30,20,.2)',v,14)}},
{id:'patch',n:'Patched asphalt',cat:'wear',w:60,h:40,f(g,v){g.fillStyle='#4a4d52';g.fillRect(-26,-16,52,32);g.fillStyle='#55585e';g.fillRect(-26,-16,52,2);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-26,14,52,2);for(let i=0;i<8;i++){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-22+dcH(v,i,15)*44,-12+dcH(v,i,16)*24,2,2)}}},
{id:'pothole',n:'Pothole',cat:'wear',w:46,h:30,f(g,v){dcBlob(g,0,0,20,'#16141a',v,17);dcBlob(g,0,0,17,'#3a4038',v,17);g.fillStyle='rgba(120,140,150,.4)';g.fillRect(-7,-2,10,2);g.fillStyle='rgba(20,20,20,.5)';for(let i=0;i<6;i++){const a=i*1.05+dcH(v,i,18);g.fillRect(Math.cos(a)*22,Math.sin(a)*14,2,2)}}},
{id:'manhole',n:'Manhole cover',cat:'wear',w:26,h:26,f(g){dcEll(g,0,0,12,12,'#16141a');dcEll(g,0,0,10,10,'#4a4a4e');g.fillStyle='#3a3a3e';for(let k=-7;k<=7;k+=3)g.fillRect(-8,k,16,1);dcEll(g,-3,-3,2,2,'rgba(255,255,255,.1)')}},
{id:'drain',n:'Storm drain',cat:'wear',w:30,h:14,f(g){g.fillStyle='#16141a';g.fillRect(-14,-6,28,12);g.fillStyle='#3a3c40';g.fillRect(-13,-5,26,10);g.fillStyle='#16141a';for(let x=-11;x<12;x+=4)g.fillRect(x,-4,2,8)}},
{id:'puddle',n:'Puddle',cat:'wear',w:64,h:32,f(g,v){dcBlob(g,0,0,28,'rgba(40,70,100,.45)',v,19);dcBlob(g,-3,-1,22,'rgba(70,110,150,.45)',v,20);g.fillStyle='rgba(220,240,255,.5)';g.fillRect(-12,-5,12,2);g.fillRect(4,3,7,1)}},
// crash & fire
{id:'skid',n:'Skid marks',cat:'crash',w:120,h:26,f(g,v){for(const o of[-8,8]){g.strokeStyle='rgba(16,14,12,.55)';g.lineWidth=4;g.beginPath();g.moveTo(-58,o);g.quadraticCurveTo(0,o+(dcH(v,o,21)-.5)*12,58,o+(dcH(v,o,22)-.5)*8);g.stroke()}}},
{id:'scorch',n:'Scorch mark',cat:'crash',w:100,h:60,f(g,v){for(let k=46;k>4;k-=4)dcEll(g,0,0,k,k*.6,'rgba(18,14,10,'+(.06+(46-k)/46*.12)+')');for(let i=0;i<8;i++){const a=i*.8+dcH(v,i,23);g.fillStyle='rgba(10,8,6,.4)';g.fillRect(Math.cos(a)*40,Math.sin(a)*24,3,2)}}},
{id:'glass',n:'Broken glass',cat:'crash',w:54,h:40,f(g,v){for(let i=0;i<26;i++){const a=dcH(v,i,24)*6.283,r=dcH(v,i,25)*22;g.fillStyle=i%3==0?'#bfe6ff':i%3==1?'#8fc3e8':'#e8f6ff';g.fillRect(Math.cos(a)*r,Math.sin(a)*r*.7,2+i%2,i%4?1:2)}}},
{id:'debris',n:'Debris',cat:'crash',w:80,h:50,f(g,v){for(let i=0;i<30;i++){const a=dcH(v,i,26)*6.283,r=dcH(v,i,27)*34,c=['#5a5a62','#8a8f96','#3a3a40','#7a6a5a','#bfe6ff','#a8a49a'][i%6];g.fillStyle=c;g.fillRect(Math.cos(a)*r,Math.sin(a)*r*.6,2+(i%3),2+(i%2))}}},
{id:'tiremarks',n:'Tire tracks',cat:'crash',w:110,h:20,f(g,v){g.fillStyle='rgba(20,16,12,.35)';for(const o of[-6,5])for(let x=-52;x<52;x+=3)g.fillRect(x,o+Math.sin(x/18+v*6)*2,2,3)}},
{id:'ash',n:'Ash & soot',cat:'crash',w:70,h:44,f(g,v){dcBlob(g,0,0,30,'rgba(30,28,26,.4)',v,28);for(let i=0;i<20;i++){g.fillStyle=i%2?'rgba(120,116,110,.5)':'rgba(10,8,6,.5)';g.fillRect(-28+dcH(v,i,29)*56,-14+dcH(v,i,30)*28,2,1)}}},
// blood
{id:'blood',n:'Blood splat',cat:'gore',w:44,h:34,pal:PDBLOOD,f(g,v,K){dcBlob(g,0,0,16,K.d,v,31);dcBlob(g,-2,-1,10,K.l,v,32);for(let i=0;i<7;i++){const a=dcH(v,i,33)*6.283,r=16+dcH(v,i,34)*6;dcEll(g,Math.cos(a)*r,Math.sin(a)*r*.7,1.5+dcH(v,i,35)*2,1.2,K.b)}}},
{id:'bloodpool',n:'Blood pool',cat:'gore',w:70,h:40,pal:PDBLOOD,f(g,v,K){dcBlob(g,0,0,30,K.dd,v,36);dcBlob(g,-3,-2,22,K.b,v,37);dcEll(g,-8,-6,8,2,'rgba(255,200,200,.22)')}},
{id:'bloodtrail',n:'Blood trail',cat:'gore',w:120,h:24,pal:PDBLOOD,f(g,v,K){for(let i=0;i<14;i++){const x=-56+i*8+dcH(v,i,38)*4,y=Math.sin(i*.7+v*5)*5;dcEll(g,x,y,2+dcH(v,i,39)*3,1.5+dcH(v,i,40)*1.5,i%3?K.b:K.dd)}g.globalAlpha*=.5;g.strokeStyle=K.d;g.lineWidth=3;g.beginPath();g.moveTo(-56,0);for(let x=-56;x<=56;x+=8)g.lineTo(x,Math.sin((x+56)/8*.7+v*5)*5);g.stroke()}},
{id:'handprint',n:'Bloody handprints',cat:'gore',w:44,h:30,pal:PDBLOOD,f(g,v,K){for(let k=0;k<2;k++){const ox=k?10:-10,oy=k?4:-4;dcEll(g,ox,oy,5,6,K.b);for(let i=0;i<4;i++)g.fillRect(ox-5+i*3,oy-11+(i%3==1?-1:0),2,5);g.fillRect(ox+5,oy-3,4,2)}}},
// nature
{id:'leaves',n:'Leaf litter',cat:'nature',w:70,h:50,pal:PDLEAF,f(g,v,K){for(let i=0;i<34;i++){const a=dcH(v,i,41)*6.283,r=Math.sqrt(dcH(v,i,42))*30;const c=[K.b,K.d,K.l,'#7a5a32'][i%4];g.fillStyle=c;const x=Math.cos(a)*r,y=Math.sin(a)*r*.7;g.fillRect(x,y,3,2);if(i%3==0)g.fillRect(x+1,y-1,1,1)}}},
{id:'twigs',n:'Twigs',cat:'nature',w:56,h:36,f(g,v){g.strokeStyle='#3a2a1a';g.lineWidth=1;g.beginPath();for(let i=0;i<9;i++){const x=-24+dcH(v,i,43)*48,y=-14+dcH(v,i,44)*28,a=dcH(v,i,45)*6.283,l=5+dcH(v,i,46)*9;g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l)}g.stroke()}},
{id:'moss',n:'Moss patch',cat:'nature',w:60,h:40,f(g,v){dcBlob(g,0,0,24,'rgba(60,90,40,.55)',v,47);for(let i=0;i<18;i++){g.fillStyle=i%2?'#5a7a3a':'#3a5a2a';g.fillRect(-22+dcH(v,i,48)*44,-14+dcH(v,i,49)*28,2,2)}}},
{id:'wildflowers',n:'Wildflowers',cat:'nature',w:54,h:34,f(g,v){for(let i=0;i<16;i++){const x=-24+dcH(v,i,50)*48,y=-14+dcH(v,i,51)*28;g.fillStyle='#3a7a2a';g.fillRect(x,y,1,4);g.fillStyle=['#ff6a8a','#ffd84a','#ffffff','#9a7aff','#ff9a3a'][i%5];g.fillRect(x-1,y-2,3,3)}}},
{id:'grasspatch',n:'Grass tufts',cat:'nature',w:44,h:26,f(g,v){for(let i=0;i<7;i++){const x=-18+dcH(v,i,52)*36,y=-8+dcH(v,i,53)*16;g.fillStyle=i%2?'#3f8a32':'#4f9a3a';g.fillRect(x,y-4,2,5);g.fillRect(x+3,y-6,2,7);g.fillRect(x+6,y-3,2,4)}}},
{id:'mud',n:'Mud splat',cat:'nature',w:60,h:36,f(g,v){dcBlob(g,0,0,26,'#4a3a28',v,54);dcBlob(g,-4,-2,16,'#5a4632',v,55);dcEll(g,-8,-5,6,2,'rgba(160,140,110,.3)')}},
{id:'dirtpatch',n:'Bare dirt patch',cat:'nature',w:80,h:44,f(g,v){dcBlob(g,0,0,34,'rgba(90,74,50,.5)',v,56);for(let i=0;i<10;i++){g.fillStyle='rgba(60,46,30,.4)';g.fillRect(-28+dcH(v,i,57)*56,-14+dcH(v,i,58)*28,3,2)}}},
{id:'lily',n:'Lily pads',cat:'nature',w:50,h:34,f(g,v){for(let i=0;i<4;i++){const x=-16+dcH(v,i,59)*32,y=-10+dcH(v,i,60)*20,r=5+dcH(v,i,61)*3;dcEll(g,x,y,r+1,r+1,'#16111c');g.fillStyle='#4a9a3a';g.beginPath();g.arc(x,y,r,.4,6.6);g.lineTo(x,y);g.fill();if(i==1){g.fillStyle='#ffb0d0';g.fillRect(x-1,y-2,3,3)}}}},
{id:'rocks',n:'Pebbles',cat:'nature',w:50,h:30,f(g,v){for(let i=0;i<12;i++){const x=-20+dcH(v,i,62)*40,y=-10+dcH(v,i,63)*20,s=2+Math.floor(dcH(v,i,64)*3);g.fillStyle='#16111c';g.fillRect(x-1,y-1,s+2,s+1);g.fillStyle=i%2?'#8a857a':'#a8a296';g.fillRect(x,y,s,s-1)}}},
// paint & markings
{id:'text',n:'Painted words',cat:'paint',w:160,h:28,pal:PDPAINT,txt:24,f(g,v,K,t){t=(t||'STOP').toUpperCase();const s=dcFit(g,t,152,22);g.textAlign='center';g.textBaseline='middle';g.fillStyle=K.b;g.globalAlpha*=.9;g.fillText(t,0,1);g.textAlign='left';g.textBaseline='alphabetic'}},
{id:'arrow',n:'Painted arrow',cat:'paint',w:70,h:26,pal:PDPAINT,f(g,v,K){g.fillStyle=K.b;g.fillRect(-32,-3,44,6);g.beginPath();g.moveTo(12,-11);g.lineTo(32,0);g.lineTo(12,11);g.fill()}},
{id:'arrow_turn',n:'Turn arrow',cat:'paint',w:50,h:60,pal:PDPAINT,f(g,v,K){g.fillStyle=K.b;g.fillRect(-4,-4,8,32);g.fillRect(-4,-8,22,8);g.beginPath();g.moveTo(14,-18);g.lineTo(24,-4);g.lineTo(14,10);g.fill()}},
{id:'stopline',n:'Stop line',cat:'paint',w:80,h:8,pal:PDPAINT,f(g,v,K){g.fillStyle=K.b;g.fillRect(-38,-3,76,6)}},
{id:'handicap',n:'Accessible parking',cat:'paint',w:46,h:88,f(g){g.fillStyle='rgba(47,111,208,.75)';g.fillRect(-22,-43,44,86);g.fillStyle='#f4f4f0';g.beginPath();g.arc(0,-6,7,0,7);g.fill();g.fillRect(-1,-18,3,6);g.fillStyle='rgba(47,111,208,.75)';g.beginPath();g.arc(0,-6,4,0,7);g.fill()}},
{id:'hazard',n:'Hazard stripes',cat:'paint',w:100,h:12,f(g){g.save();g.beginPath();g.rect(-50,-6,100,12);g.clip();for(let k=-60;k<60;k+=22){g.fillStyle='#f0c020';g.fillRect(k,-6,11,12);g.fillStyle='#16111c';g.fillRect(k+11,-6,11,12)}g.restore()}},
{id:'safety',n:'Safety line',cat:'paint',w:120,h:6,pal:[['#f0c840','Yellow'],['#e8e8e0','White'],['#d8403a','Red']],f(g,v,K){g.fillStyle=K.b;for(let x=-60;x<60;x+=30)g.fillRect(x,-2,16,4)}},
{id:'number',n:'Painted number',cat:'paint',w:30,h:30,pal:PDPAINT,txt:4,f(g,v,K,t){t=(t||'1').toUpperCase();dcFit(g,t,28,20);g.textAlign='center';g.textBaseline='middle';g.fillStyle=K.b;g.fillText(t,0,1);g.textAlign='left';g.textBaseline='alphabetic'}},
{id:'graffiti',n:'Graffiti',cat:'paint',w:70,h:30,pal:PDGRAF,txt:12,f(g,v,K,t){if(t){dcFit(g,t,66,18,'"Comic Sans MS", cursive');g.textAlign='center';g.textBaseline='middle';g.lineWidth=3;g.strokeStyle='#16111c';g.strokeText(t,0,1);g.fillStyle=K.b;g.fillText(t,0,1);g.textAlign='left';g.textBaseline='alphabetic';return}
g.lineWidth=3;g.strokeStyle=K.b;g.beginPath();g.moveTo(-30,0);for(let k=0;k<7;k++)g.lineTo(-22+k*9,((k*5+Math.floor(v*7))%3)*5-6);g.stroke();g.lineWidth=1.5;g.strokeStyle=K.l;g.beginPath();g.moveTo(-26,8);g.lineTo(24,6);g.stroke()}},
// shadows & light
{id:'shadow',n:'Shadow',cat:'light',w:70,h:34,f(g){dcEll(g,0,0,32,15,'rgba(0,0,0,.28)');dcEll(g,0,0,22,10,'rgba(0,0,0,.12)')}},
{id:'treeshadow',n:'Tree shadow',cat:'light',w:90,h:50,f(g,v){for(let i=0;i<9;i++){const a=dcH(v,i,65)*6.283,r=dcH(v,i,66)*22;dcEll(g,Math.cos(a)*r,Math.sin(a)*r*.6,12+dcH(v,i,67)*8,8+dcH(v,i,68)*5,'rgba(0,0,0,.09)')}}},
{id:'lightpatch',n:'Window light',cat:'light',w:60,h:44,pal:PDLIGHT,f(g,v,K){g.globalAlpha*=.22;g.fillStyle=K.b;g.beginPath();g.moveTo(-18,-20);g.lineTo(18,-20);g.lineTo(28,20);g.lineTo(-28,20);g.closePath();g.fill();g.globalAlpha*=1.6;g.fillStyle=K.ll;g.fillRect(-2,-20,4,40);g.fillRect(-24,-1,48,3)}},
{id:'stainedglass',n:'Stained-glass light',cat:'light',w:50,h:40,f(g,v){const C=['#ff5a5a','#5a8aff','#ffd84a','#5aff8a','#c85aff'];g.globalAlpha*=.28;for(let j=0;j<3;j++)for(let i=0;i<4;i++){g.fillStyle=C[(i+j*2+Math.floor(v*5))%5];g.fillRect(-20+i*10,-15+j*10,9,9)}}},
// spooky
{id:'chalk',n:'Chalk circle',cat:'spooky',w:124,h:124,f(g){g.strokeStyle='rgba(230,230,230,.45)';g.lineWidth=2;g.beginPath();g.arc(0,0,58,0,7);g.stroke();g.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*4*Math.PI/5;i?g.lineTo(Math.cos(a)*56,Math.sin(a)*56):g.moveTo(Math.cos(a)*56,Math.sin(a)*56)}g.closePath();g.stroke()}},
{id:'scrawl',n:'Scrawled words',cat:'spooky',w:140,h:24,pal:[['#961414','Blood'],['#e6e6e6','Chalk'],['#16161a','Charcoal']],txt:20,f(g,v,K,t){t=(t||'PLAY WITH ME').toUpperCase();dcFit(g,t,134,15);g.textAlign='center';g.textBaseline='middle';g.globalAlpha*=.8;g.fillStyle=K.b;g.fillText(t,0,1);g.textAlign='left';g.textBaseline='alphabetic'}},
{id:'cobweb',n:'Cobweb',cat:'spooky',w:32,h:32,f(g){g.strokeStyle='rgba(220,220,220,.4)';g.lineWidth=1;g.beginPath();const x=-15,y=-15;for(let i=0;i<5;i++){const a=i/4*Math.PI/2;g.moveTo(x,y);g.lineTo(x+Math.cos(a)*28,y+Math.sin(a)*28)}for(const r of[8,15,22]){g.moveTo(x+r,y);for(let i=1;i<=4;i++){const a=i/4*Math.PI/2;g.lineTo(x+Math.cos(a)*r*(i%2?.92:1),y+Math.sin(a)*r*(i%2?.92:1))}}g.stroke()}},
{id:'footprints',n:'Footprints',cat:'spooky',w:90,h:22,pal:[['#3a2a1a','Muddy'],['#7a1414','Bloody'],['#d8d4c8','Dusty']],f(g,v,K){g.fillStyle=K.b;for(let i=0;i<6;i++){const x=-40+i*15,y=i%2?-5:5;dcEll(g,x,y,4,2.5,K.b);dcEll(g,x+5,y,2,2,K.b)}}},
// litter & other
{id:'paper',n:'Paper litter',cat:'misc',w:50,h:34,f(g,v){for(let i=0;i<6;i++){const x=-20+dcH(v,i,69)*40,y=-12+dcH(v,i,70)*24;g.fillStyle=i%2?'#f2efe4':'#e8e4d8';g.fillRect(x,y,8,6);g.fillStyle='#9ab0d8';g.fillRect(x+1,y+2,6,1)}}},
{id:'bullets',n:'Bullet holes',cat:'misc',w:40,h:30,f(g,v){for(let i=0;i<7;i++){const x=-16+dcH(v,i,71)*32,y=-12+dcH(v,i,72)*24;dcEll(g,x,y,2,2,'#16111c');g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x-3,y-1,1,1);g.fillRect(x+2,y+2,1,1)}}},
{id:'drag',n:'Drag marks',cat:'misc',w:110,h:20,f(g,v){g.strokeStyle='rgba(40,30,20,.35)';g.lineWidth=2;for(const o of[-4,4]){g.beginPath();g.moveTo(-52,o);for(let x=-52;x<=52;x+=8)g.lineTo(x,o+Math.sin(x/14+v*4)*2);g.stroke()}}},
{id:'mat',n:'Door mat',cat:'misc',w:36,h:16,pal:PDMAT,txt:8,f(g,v,K,t){g.fillStyle='#16111c';g.fillRect(-17,-7,34,14);g.fillStyle=K.b;g.fillRect(-16,-6,32,12);g.fillStyle=K.d;for(let x=-15;x<16;x+=3)g.fillRect(x,-6,1,12);if(t){dcFit(g,t.toUpperCase(),30,7);g.fillStyle=K.ll;g.textAlign='center';g.textBaseline='middle';g.fillText(t.toUpperCase(),0,1);g.textAlign='left';g.textBaseline='alphabetic'}}},
{id:'threshold',n:'Door threshold',cat:'misc',w:52,h:8,f(g){g.fillStyle='#c9a36a';g.fillRect(-26,-3,52,6);g.fillStyle='#a8804a';g.fillRect(-26,2,52,1)}}];
for(const t of CMDK)cmAddDec(t);
// the Suburb's grass bits (var < .4 a flower: its colour from the first decimal; < .7 a tuft; otherwise a pebble) and the round scorch around its crash
cmAddDec({id:'speck',n:'Grass bit (flower, tuft or pebble)',cat:'nature',w:10,h:10,f(g,v){if(v<.4){g.fillStyle=['#ff6a8a','#ffd84a','#ffffff','#9a7aff'][Math.floor(v*10)%4];g.fillRect(0,-3,3,3);g.fillStyle='#2f6b34';g.fillRect(1,0,1,3)}else if(v<.7){g.fillStyle='#2f6b34';g.fillRect(0,0,7,3);g.fillRect(2,-2,3,2)}else{g.fillStyle='#8f949e';g.fillRect(0,0,4,2);g.fillStyle='#6a6e78';g.fillRect(0,2,4,1)}}});
cmAddDec({id:'lotspeck',n:'Lot bit (streak, pebble or paint chip)',cat:'wear',w:52,h:6,f(g,v){if(v<.35){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(0,0,20+v/.35*30,2)}else{g.fillStyle=v<.7?'#6a6e73':'#d8b92e';g.fillRect(0,0,4,3)}}});
cmAddDec({id:'scorchround',n:'Scorched ground (round)',cat:'crash',w:300,h:300,f(g){for(let r=150;r>10;r-=14)dcEll(g,0,0,r,r,'rgba(20,14,10,.07)')}});
// draw a decal of a map (o: dc, x, y, r, sc, c, op, tx) into g
function cmDecDraw(g,o){const T=cmDec(o.dc);if(!T)return;const v=o.vr!=null?o.vr:cmH(o.x,o.y,5),K=T.pal?pcK(cmCol(o.c,T.pal[0][0])):null,sc=cl(+o.sc||1,.25,4),O=T.opts?Object.assign({},T.def&&T.def.o,o.o):null;
g.save();g.translate(o.x,o.y);if(o.r)g.rotate(o.r*Math.PI/180);if(sc!==1)g.scale(sc,sc);g.globalAlpha=cl(o.op==null?1:+o.op,.05,1);try{T.f(g,v,K,T.txt?cmTxt(o.tx,T.txt):'',O)}finally{g.restore()}}
