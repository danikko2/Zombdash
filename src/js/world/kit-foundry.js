//# world/kit-foundry.js — Building kit pieces from the Black Iron Foundry: molten metal that bubbles and pops, welding arcs that flash and throw sparks
// ---------- the Black Iron Foundry's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// what each effect last did (which bubble popped, whether an arc was lit), so a pop or a strike makes its sound once
const FDST=new WeakMap();
function fdSt(o){let s=FDST.get(o);if(!s){s={b:[],w:0};FDST.set(o,s)}return s}
// a welding arc's rhythm: a burst of welding (2–4 s of stuttering light), then a pause; ph is the effect's own phase (the same one its
// light gets in cmLightSrc). Returns 0 while it's dark, else how bright it is right now.
function fdWeld(ph,t){const P=5+(ph/6.283)*4,u=(t+ph*3)%P,on=P*.42;if(u>=on)return 0;const k=Math.floor(t*22+ph*9);return cmH(k,ph,5)<.22?.35:1}
// molten metal: put it on the surface of a ladle (89 px above the ladle's foot) or anything else full of melt. Bubbles rise, swell
// and pop (each pop sends up droplets and makes a little bloop if a player is near), a bright skin drifts across, embers float up.
// size scales it (1 = the ladle's surface, about 106 × 24 px). It has no light of its own: the ladle's lights the room.
cmAddFx({id:'molten',n:'Molten metal (bubbling)',cat:'fire',r:100,
 top(o,t){const s=cl(+o.sc||1,.25,4),rx=50*s,ry=11*s,S=fdSt(o);
  X.fillStyle='#fff2b0';for(let i=0;i<5;i++){const x=o.x+Math.sin(t*.4+i*1.7)*rx*.6,y=o.y+Math.cos(t*.33+i*2.3)*ry*.45;X.globalAlpha=.28+.12*Math.sin(t*2+i);X.beginPath();X.ellipse(x,y,(6+i%3*3)*s,2.2*s,0,0,7);X.fill()}
  X.fillStyle='#9a3a1a';for(let i=0;i<3;i++){const x=o.x+Math.sin(t*.22+i*2.1+1)*rx*.55,y=o.y+Math.cos(t*.18+i*1.3)*ry*.5;X.globalAlpha=.4;X.fillRect(Math.round(x-5*s),Math.round(y),Math.round((8+i*3)*s),Math.max(1,Math.round(1.5*s)))}X.globalAlpha=1;
  for(let i=0;i<7;i++){const big=i==0,P=big?5.5+cmR(o,i,70)*3:1.5+cmR(o,i,70)*2.2,u=(t+cmR(o,i,71)*P)/P,n=Math.floor(u),p=u-n,a=cmH(n,i+o.x,81)*6.283,d=Math.sqrt(cmH(n,i+o.y,82))*(big?.45:.8),bx=o.x+Math.cos(a)*rx*d,by=o.y+Math.sin(a)*ry*d,br=(big?8+cmH(n,i,83)*3:2.5+cmH(n,i,83)*4.5)*s;
   if(p<.78){const r=br*(p/.78);if(r<.8)continue;X.fillStyle='#e0601a';X.beginPath();X.ellipse(bx,by,r+1,(r+1)*.7,0,0,7);X.fill();X.fillStyle='#ffd84a';X.beginPath();X.ellipse(bx,by-r*.15,r,r*.62,0,0,7);X.fill();X.fillStyle='#fff6d0';X.fillRect(Math.round(bx-r*.45),Math.round(by-r*.5),Math.max(1,Math.round(r*.4)),Math.max(1,Math.round(r*.25)))}
   else{const q=(p-.78)/.22;if(S.b[i]!==n){S.b[i]=n;if(mode=='play'&&(big||br>5*s)&&typeof sfx=='function')sfx('blub',bx,by,big?.8:.45,.12)}
    X.strokeStyle='#fff2b0';X.lineWidth=Math.max(1,s);X.globalAlpha=1-q;X.beginPath();X.ellipse(bx,by,br*(1+q*1.6),br*(1+q*1.6)*.55,0,0,7);X.stroke();
    const m=big?9:4,h=big?42*s:br*3.2;for(let k=0;k<m;k++){const ka=cmH(n,k+i*10,84)*Math.PI,sp=(.5+cmH(n,k,85))*(big?26*s:br*2.4),dx=Math.cos(ka)*sp*q,dy=-Math.sin(Math.PI*Math.min(1,q*1.1))*h*(.5+cmH(n,k,86)*.5)+q*q*h*.4;X.fillStyle=k%3?'#ffb02e':'#fff2b0';X.fillRect(Math.round(bx+dx),Math.round(by+dy),big?3:2,big?3:2)}X.globalAlpha=1}}
  for(let i=0;i<12;i++){const p=(t*(.25+cmR(o,i,90)*.2)+cmR(o,i,91))%1,x=o.x+(cmR(o,i,92)-.5)*rx*1.5+Math.sin(t*2+i)*4*s,y=o.y-p*95*s;X.globalAlpha=(1-p)*.9;X.fillStyle=i%3?'#ff8a2a':'#ffd84a';X.fillRect(Math.round(x),Math.round(y),i%4?1:2,i%4?1:2)}X.globalAlpha=1},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.fillStyle='#ffd84a';g.beginPath();g.ellipse(o.x,o.y,50*s,11*s,0,0,7);g.fill();g.fillStyle='#fff2b0';for(const[dx,dy,r]of[[-20,-2,4],[12,3,3],[26,-3,5]]){g.beginPath();g.ellipse(o.x+dx*s,o.y+dy*s,r*s,r*.6*s,0,0,7);g.fill()}g.fillStyle='#ff8a2a';for(let i=0;i<5;i++)g.fillRect(o.x+(i-2)*14*s,o.y-(20+i*9)*s,2,2)}});
// welding arc: put it where someone welds (on a welding table, at a part). Every few seconds it strikes: a stuttering blue-white
// flash that lights the shop round it, a shower of sparks, then a dark pause with the weld glowing red as it cools.
cmAddFx({id:'weldarc',n:'Welding arc',cat:'light',r:50,
 top(o,t){const s=cl(+o.sc||1,.25,4),ph=cmH(o.x,o.y,9)*6.283,b=fdWeld(ph,t),S=fdSt(o);
  if(!b){if(S.w)S.w=0;const P=5+(ph/6.283)*4,u=(t+ph*3)%P,cool=Math.max(0,1-(u-P*.42)/1.6);if(cool>0){X.fillStyle='#ff6a1a';X.globalAlpha=cool;X.fillRect(Math.round(o.x)-1,Math.round(o.y)-1,3,2);X.globalAlpha=1}return}
  if(!S.w){S.w=1;if(mode=='play'&&typeof sfx=='function')sfx('weld',o.x,o.y,.4,.25)}
  X.fillStyle='#bfe0ff';X.globalAlpha=.14*b;X.beginPath();X.arc(o.x,o.y,40*s,0,7);X.fill();X.globalAlpha=.3*b;X.beginPath();X.arc(o.x,o.y,16*s,0,7);X.fill();X.globalAlpha=.6*b;X.beginPath();X.arc(o.x,o.y,7*s,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#ffffff';X.fillRect(Math.round(o.x)-3,Math.round(o.y)-3,6,6);X.fillRect(Math.round(o.x)-7*b,Math.round(o.y)-1,14*b,2);X.fillRect(Math.round(o.x)-1,Math.round(o.y)-6*b,2,12*b);
  for(let i=0;i<14;i++){const L=.35+cmR(o,i,95)*.35,p=((t+cmR(o,i,96)*L)/L)%1,n=Math.floor((t+cmR(o,i,96)*L)/L),a=-Math.PI*(.1+cmH(n,i,97)*.8),v=(18+cmH(n,i,98)*30)*s,x=o.x+Math.cos(a)*v*p*(i%2?1:-1),y=o.y+Math.sin(a)*v*p+p*p*26*s;X.globalAlpha=1-p;X.fillStyle=p<.3?'#fff6d0':'#ffb02e';X.fillRect(Math.round(x),Math.round(y),2,1)}X.globalAlpha=1},
 lts(o,s,ph,L){L.push({x:o.x,y:o.y,r:160*s,c:'#b4d8ff',i:1,f:'weld',ph,gs:3})},
 ed(g,o){g.fillStyle='rgba(191,224,255,.35)';g.beginPath();g.arc(o.x,o.y,14,0,7);g.fill();g.fillStyle='#ffffff';g.fillRect(o.x-2,o.y-2,4,4);g.fillStyle='#ffb02e';for(let i=0;i<6;i++)g.fillRect(o.x+(i-3)*5,o.y-6+Math.abs(i-2.5)*3,2,1)}});
