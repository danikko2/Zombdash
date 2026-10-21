//# intro/cutscene.js — Opening cutscene
const CB=document.createElement('canvas');CB.width=320;CB.height=180;const CX=CB.getContext('2d');
let CT=0,IA={},DM=[];
function startIntro(){mode='splash';CT=0;ui.innerHTML='';DM=[];for(let i=0;i<26;i++)DM.push({x:150+Math.random()*40,y:60+Math.random()*90,v:2+Math.random()*4,p:Math.random()*6})}
function endIntro(){for(const k in IA){try{IA[k].stop()}catch(e){}}IA={};mode='menu';X.setTransform(1,0,0,1,0,0);menu()}
function introTap(){if(mode=='splash'){if(CT<1.6)return;mode='intro';CT=0;IA={};return}if(mode=='intro'&&CT>.8)endIntro()}
function iLoop(n,f,q,v){if(!AU.c||IA[n])return;const c=AU.c,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.nb;s.loop=true;fl.type='bandpass';fl.frequency.value=f;fl.Q.value=q;g.gain.value=0;g.gain.setTargetAtTime(v,c.currentTime,.3);s.connect(fl);fl.connect(g);g.connect(AU.sf);s.start();IA[n]={stop(){g.gain.setTargetAtTime(0,c.currentTime,.15);setTimeout(()=>{try{s.stop()}catch(e){}},600)},g}}
function iCue(t0,fn){if(CT>=t0&&!IA['c'+t0]){IA['c'+t0]={stop(){}};fn()}}
const CR=(c,x,y,w,h)=>{CX.fillStyle=c;CX.fillRect(x|0,y|0,w|0,h|0)};
function door(gap,glow){CR('#07060a',0,0,320,180);CR('#0d0b12',0,130,320,50);
const dx=136,dy=40,dw=48,dh=92;
CX.save();CX.globalAlpha=glow;const lg=CX.createLinearGradient(0,dy+dh,0,180);lg.addColorStop(0,'rgba(255,214,130,.55)');lg.addColorStop(1,'rgba(255,214,130,0)');CX.fillStyle=lg;CX.beginPath();CX.moveTo(dx+dw-gap,dy+dh);CX.lineTo(dx+dw,dy+dh);CX.lineTo(dx+dw+gap*7+40,180);CX.lineTo(dx+dw-gap*3-10,180);CX.fill();
for(let i=0;i<5;i++){const a=.12+.06*Math.sin(CT*3+i*1.7);CX.fillStyle=`rgba(255,226,150,${a})`;CX.beginPath();CX.moveTo(dx+dw-gap,dy+6+i*16);CX.lineTo(dx+dw,dy+10+i*16);CX.lineTo(320,dy-30+i*44+gap*2);CX.lineTo(320,dy-40+i*44);CX.fill()}CX.restore();
CR('#2a1a10',dx-6,dy-6,dw+12,dh+6);CR('#140c08',dx-3,dy-3,dw+6,dh+3);CR('#ffe9b0',dx+dw-gap,dy,gap,dh);CR('#fff6d8',dx+dw-gap+1,dy+2,Math.max(0,gap-2),dh-4);
CR('#5a3a22',dx,dy,dw-gap,dh);CR('#4a3018',dx+4,dy+6,dw-gap-8,36);CR('#4a3018',dx+4,dy+48,dw-gap-8,38);CR('#6b4a2a',dx,dy,3,dh);CR('#d8b048',dx+dw-gap-8,dy+48,4,4);
for(const m of DM){m.y-=m.v*.016;m.x+=Math.sin(CT+m.p)*.1;if(m.y<dy)m.y=dy+dh;const inL=m.x>dx+dw-gap-4;if(inL&&glow>.3){CR(`rgba(255,240,200,${.5*glow})`,m.x+gap*1.5,m.y,1,1)}}
CR('#000',0,0,320,4)}
function room(lt){CR('#2a2438',0,0,320,140);for(let x=0;x<320;x+=16)CR('#2f2840',x,0,8,140);CR('#1e1a2a',0,128,320,12);CR('#4a3424',0,140,320,40);for(let x=0;x<320;x+=24)CR('#3e2c1e',x,140,2,40);
CR('#16111c',18,26,66,58);CR('#0d1430',21,29,60,52);CR('#e8e4c8',66,36,8,8);CR('#0d1430',69,36,4,4);for(let i=0;i<9;i++)CR('#c8d0ff',24+(i*23)%54,32+(i*11)%40,1,1);zwin(CT);CR('#16111c',50,29,2,52);CR('#16111c',21,54,60,2);CX.fillStyle='rgba(200,220,255,.07)';CX.fillRect(21,29,60,52);CR('#4a2a3a',14,24,10,64);CR('#4a2a3a',78,24,10,64);CR('#3a2030',14,24,10,4);CR('#3a2030',78,24,10,4);
CR('#16111c',38,110,96,32);CR('#5a3a22',40,112,92,28);CR('#4a3018',44,118,40,18);CR('#4a3018',88,118,40,18);
CR('#16111c',44,60,84,52);CR('#2a2c32',46,62,80,48);CR('#16111c',82,108,8,4);
CR('#16111c',150,124,40,4);CR('#7a5232',151,125,38,3);CR('#5a3a22',154,128,3,12);CR('#5a3a22',183,128,3,12);CR('#e8e4d8',158,118,14,6);CR('#f0d070',160,116,10,3);CR('#c0392b',176,117,5,7);
CR('#16111c',188,96,114,40);CR('#5a4a7a',190,118,98,14);CR('#6a5a8a',190,118,98,3);CR('#4a3a6a',270,96,30,36);CR('#5a4a7a',272,98,26,8);CR('#4a3a6a',190,108,14,24);CR('#5a4a7a',192,110,10,4);CR('#2a1d14',196,132,4,6);CR('#2a1d14',286,132,4,6);
CR('#16111c',296,70,20,70);CR('#3a3d46',304,78,4,62);CR('#e8c870',296,64,20,14);CR('#f0d890',298,66,16,6);
if(lt>0){CX.fillStyle=`rgba(255,220,140,${.08*lt})`;CX.beginPath();CX.moveTo(296,70);CX.lineTo(316,70);CX.lineTo(330,140);CX.lineTo(270,140);CX.fill()}}
function guy(stand,react,arm){const o='#16111c',sk='#e9b98f',hr='#f0cf5a',sh='#7a4a26',pn='#3a5fb0';
if(!stand){CR(o,211,113,28,10);CR(pn,212,114,26,8);CR(o,207,120,10,16);CR(pn,208,121,8,14);CR(o,205,134,13,5);CR('#222',206,135,11,3);
CR(o,225,99,16,17);CR(sh,226,100,14,15);CR('#5a3418',226,112,14,3);
CR(o,224,86,14,15);CR(sk,225,87,12,13);CR(hr,224,85,14,5);CR(hr,234,86,4,9);CR('#222',226,92,2,2);CR('#c98f66',225,96,3,1);
if(arm){CR(o,213,96,14,5);CR(sh,214,97,12,3);CR(sk,211,95,4,4)}else{CR(o,216,102,12,5);CR(sh,217,103,10,3);CR(sk,213,102,4,4);CR('#c0392b',211,99,4,6)}}
else{CR(o,221,104,18,36);CR(pn,224,118,5,20);CR(pn,231,118,5,20);CR('#222',223,136,7,4);CR('#222',230,136,7,4);CR(sh,222,104,16,15);CR(o,224,100,8,5);CR('#c98f66',225,100,6,5);CR(o,220,87,16,16);CR(sk,221,88,14,14);CR(hr,220,86,16,5);CR(hr,232,87,4,10);CR('#222',223,93,2,2);CR('#222',223,98,4,1);CR(o,212,104,10,5);CR(sh,213,105,9,3);CR(sk,210,104,4,4)}
if(react){const b=Math.sin(CT*12)*1;CR('#16111c',228,stand?68+b:70+b,6,14);CR('#ff5a4a',229,stand?69+b:71+b,4,8);CR('#ff5a4a',229,stand?79+b:81+b,4,3)}}
function tv(){const sx=46,sy=62,w=80,h=48,t=CT;CX.save();CX.beginPath();CX.rect(sx,sy,w,h);CX.clip();
if(t<6){CR('#2f8a3a',sx,sy,w,h);for(let i=0;i<w;i+=10)CR('#358f40',sx+i,sy,5,h);CR('#e8f0e0',sx+w/2,sy,1,h);CX.strokeStyle='#e8f0e0';CX.lineWidth=1;CX.beginPath();CX.arc(sx+w/2,sy+h/2,8,0,7);CX.stroke();CR('#e8f0e0',sx+2,sy+16,1,16);CR('#e8f0e0',sx+w-3,sy+16,1,16);
const bx=sx+w/2+Math.sin(t*1.7)*30*(t<3.6?1:0)+(t>=3.6?Math.min(36,(t-3.6)*80):0),by=sy+h/2+Math.sin(t*2.3)*10;
for(let i=0;i<5;i++){CR('#c0392b',sx+12+i*12+Math.sin(t*2+i)*6,sy+8+i*7+Math.cos(t*1.5+i)*4,2,3);CR('#2f6fd0',sx+18+i*11+Math.cos(t*2.2+i)*6,sy+12+i*6+Math.sin(t*1.3+i)*4,2,3)}CR('#fff',bx,by,2,2);
CR('rgba(0,0,0,.6)',sx+2,sy+2,24,7);CR('#c0392b',sx+3,sy+3,4,5);CR('#e8e4d8',sx+9,sy+4,6,3);CR('#2f6fd0',sx+17,sy+3,4,5);
if(t>3.6&&t<5.2&&Math.floor(t*6)%2){CR('#ffd84a',sx+20,sy+18,40,12);CR('#c0392b',sx+22,sy+20,36,8)}}
else if(t<7){for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){const v=Math.random()*200|0;CR(`rgb(${v},${v},${v})`,sx+x,sy+y,2,2)}}
else{CR('#1a2a5a',sx,sy,w,h);CR('#2a3a6a',sx,sy+30,w,18);
const mx=sx+48,my=sy+12;CR('#16203a',mx,my,28,20);CR('#3a6a4a',mx+3,my+4,10,8);CR('#3a6a4a',mx+14,my+3,10,12);for(let i=0;i<4;i++){const r=Math.min(6,(t-7)*1.2+i);CX.fillStyle='rgba(220,40,40,.75)';CX.beginPath();CX.arc(mx+6+i*6,my+8+(i%2)*6,Math.max(0,r*.6),0,7);CX.fill()}
CR('#16111c',sx+14,sy+16,22,24);CR('#2a2c34',sx+15,sy+26,20,16);CR('#e8e4d8',sx+22,sy+26,6,8);CR('#c0392b',sx+24,sy+27,2,7);CR('#e9b98f',sx+19,sy+15,12,12);CR('#3a2416',sx+18,sy+13,14,5);CR('#222',sx+22,sy+20,2,2);CR('#222',sx+27,sy+20,2,2);CR('#7a3a2a',sx+23,sy+24,4,1+(Math.floor(t*8)%2));
CR('#5a3a22',sx,sy+38,w,4);CR('#c0392b',sx,sy,w,10);CR('#8a1a1a',sx,sy+9,w,1);CX.fillStyle='#fff';CX.font='7px "Press Start 2P", monospace';CX.textBaseline='top';if(Math.floor(t*2)%2||t>8)CX.fillText('BREAKING',sx+3,sy+2);
CR('#ffd84a',sx,sy+h-7,w,7);for(let i=0;i<12;i++){const x=((i*19-(t*30))%(w+20)+w+20)%(w+20)-10;CR('#16111c',sx+x,sy+h-5,i%3?10:6,3)}}
CR('rgba(255,255,255,.06)',sx,sy,w,h/2);CX.restore();
const gc=t<6?'rgba(80,200,90,.10)':t<7?'rgba(220,220,220,.12)':'rgba(220,60,60,.10)';CX.fillStyle=gc;CX.beginPath();CX.moveTo(126,62);CX.lineTo(126,110);CX.lineTo(300,150);CX.lineTo(300,40);CX.fill()}
function zwin(t){if(t<12||t>14.4)return;const k=(t-12)/2.4,x=10+k*74,b=Math.sin(t*8)*1;CX.save();CX.beginPath();CX.rect(21,29,60,52);CX.clip();CR('#2a3a2a',x,46+b,10,30);CR('#2a3a2a',x+1,36+b,8,10);CR('#2a3a2a',x+8,48+b,10,3);CR('#ff3a2a',x+6,40+b,2,1);CX.restore()}
const CAP=[[.4,3.4,'Saturday night. The big game is on.'],[3.6,5.6,'GOAL!! Yes!'],[7.3,9.6,'"We interrupt this broadcast with breaking news..."'],[9.6,12,'"...the dead are rising all across the city."'],[12,14.6,'"Stay inside. Lock your doors. Do not let them in."']];
function drawCut(dt){const sc=Math.min(W/320,H/180),dw=320*sc,dh=180*sc,ox=(W-dw)/2,oy=Math.max(0,(H-dh)/2-(H>W?60:0));X.setTransform(1,0,0,1,0,0);X.fillStyle='#000';X.fillRect(0,0,W,H);
const F='VT323, ui-monospace, monospace',PX='"Press Start 2P", ui-monospace, monospace';
if(mode=='splash'){const gap=Math.min(14,2+CT*8),glow=Math.min(1,CT/1.2);door(gap,glow);X.imageSmoothingEnabled=false;X.drawImage(CB,ox,oy,dw,dh);
const a=Math.max(0,Math.min(1,(CT-1)/.8));X.globalAlpha=a;X.textAlign='center';X.font=Math.round(Math.max(14,sc*9))+'px '+PX;X.fillStyle='#ffe2a0';X.shadowColor='rgba(255,200,120,.55)';X.shadowBlur=12;X.fillText('DOORHOUSE',W/2,oy+dh*.88);X.font=Math.round(Math.max(10,sc*5))+'px '+PX;X.fillStyle='#c8a870';X.shadowBlur=0;X.fillText('G A M E S',W/2,oy+dh*.88+Math.max(22,sc*12));X.globalAlpha=1;
if(CT>1.8&&Math.floor(CT*2)%2==0){X.font='22px '+F;X.fillStyle='#e9f1e2';X.fillText(H>W?'tap to start':'tap or press any key to start',W/2,Math.min(H-24,oy+dh+40))}return}
const t=CT;
iCue(0,()=>iLoop('crowd',700,.6,.07));iCue(3.6,()=>{if(IA.crowd)IA.crowd.g.gain.setTargetAtTime(.2,AU.c.currentTime,.1);sfx('coin')});iCue(4.8,()=>{if(IA.crowd)IA.crowd.g.gain.setTargetAtTime(.07,AU.c.currentTime,.4)});
iCue(6,()=>{if(IA.crowd)IA.crowd.stop();iLoop('stat',3000,.4,.12)});iCue(7,()=>{if(IA.stat)IA.stat.stop();sfx('horn',null,null,.6);sfx('wave')});iCue(9,()=>sfx('hurt',null,null,.5));iCue(12.3,()=>sfx('groan'));iCue(12,()=>sfx('click'));iCue(12.6,()=>sfx('click'));iCue(13.2,()=>sfx('newz'));
const flick=t>12&&t<14&&Math.floor(t*9)%3==0;
room(t>12?.3:1);tv();guy(t>12.8,t>9.1,t>3.6&&t<5.2);
if(t>9.1&&t<12.8){CR('#c0392b',203,136,5,4);CR('#e8e4d8',204,136,3,1)}
if(flick)CR('rgba(0,0,0,.6)',0,0,320,180);CX.fillStyle='rgba(10,8,20,.25)';CX.fillRect(0,0,320,180);
const fi=Math.min(1,t/.8),fo=t>14.6?Math.min(1,(t-14.6)/1.2):0;X.imageSmoothingEnabled=false;X.drawImage(CB,ox,oy,dw,dh);X.fillStyle=`rgba(0,0,0,${Math.max(1-fi,fo)})`;X.fillRect(0,0,W,H);
for(const[a,b,s]of CAP)if(t>=a&&t<b){X.font=(H>W?22:24)+'px '+F;X.textAlign='center';const lines=[],mx=W-50;let ln='';for(const wd of s.split(' ')){const tr=ln?ln+' '+wd:wd;if(X.measureText(tr).width>mx&&ln){lines.push(ln);ln=wd}else ln=tr}lines.push(ln);const lh=26,bh=lines.length*lh+10,cy=H>W?oy+dh+30:oy+dh-bh-8,mw=Math.min(W-20,Math.max(...lines.map(l=>X.measureText(l).width))+30);X.fillStyle='rgba(7,10,8,.8)';X.fillRect(W/2-mw/2,cy,mw,bh);X.fillStyle=s[0]=='"'?'#ffd84a':'#e9f1e2';lines.forEach((l,i)=>X.fillText(l,W/2,cy+26+i*lh))}
if(t>14.6){const k=Math.min(1,(t-14.6)/.5);X.globalAlpha=k;X.textAlign='center';X.font=Math.round(Math.max(26,sc*16))+'px '+PX;X.fillStyle='#efe8d8';X.fillText('ZOMB',W/2,H/2-6);X.fillStyle='#9be860';X.fillText('DASH',W/2,H/2+Math.max(34,sc*20));X.globalAlpha=1}
X.font='18px '+F;X.textAlign='right';X.fillStyle='rgba(233,241,226,.6)';if(t>.8)X.fillText('tap to skip',W-14,H>W?H-14:24);
if(t>16.4)endIntro()}
document.addEventListener('pointerdown',e=>{if(mode=='splash'||mode=='intro')introTap()});

