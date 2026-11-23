//# world/kit-hospital.js — Building kit pieces from Zombville General Hospital: the lobby fountain (a basin you can't walk into, jets, ripples, lights under the water), the elevator (a cab with sliding doors: shut, pried open, open, or the escape elevator the roof escape opens), the roof deck, the helipad (edge lights that blink, floodlights), skylights glowing from below, the parapet wall round the roof, the fire alarm strobe (its red light pulses down the halls), a broken ceiling light hanging by its wires (swinging, sparking, flickering), and decals (pills, bloody gauze, an X-ray film, a syringe, an IV bag, a clipboard)
// ---------- Zombville General's pieces ----------
const HSK={o:'#16111c',st:'#c8ccd4',stl:'#e4e8ee',std:'#8a8f96',sk:'#5a5e68',sk2:'#3a3d46'};
// ----- the lobby fountain: an oval basin with a stone rim, the water, a tiered centre; jets and ripples move (anim), lights under the water -----
function hfBox(o){const{x,y,w,h}=o;return{cx:x+w/2,cy:y+h/2,rx:w/2,ry:h/2}}
function arFount(g,o){const B=hfBox(o),{cx,cy,rx,ry}=B,on=po(o,'on',1),st=cmCol(o.c,'#d8d2c4'),wa=cmCol(o.c2,'#2a8aa8');
 g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(cx+4,cy+6,rx,ry,0,0,7);g.fill();
 g.fillStyle=HSK.o;g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);g.fill();g.fillStyle=pcSh(st,.78);g.beginPath();g.ellipse(cx,cy+3,rx-1,ry-2,0,0,7);g.fill();g.fillStyle=st;g.beginPath();g.ellipse(cx,cy,rx-1,ry-4,0,0,7);g.fill();
 g.fillStyle=pcSh(st,1.12);g.beginPath();g.ellipse(cx,cy-2,rx-4,ry-7,0,0,7);g.fill();
 // the water: deep in the middle, light at the edges, tiles on the floor of the basin
 const iw=rx-16,ih=ry-16,gr=g.createRadialGradient?g.createRadialGradient(cx,cy,4,cx,cy,Math.max(iw,ih)):null;if(gr&&gr.addColorStop){gr.addColorStop(0,pcSh(wa,.7));gr.addColorStop(.7,wa);gr.addColorStop(1,pcSh(wa,1.25))}g.fillStyle=HSK.o;g.beginPath();g.ellipse(cx,cy,iw+2,ih+2,0,0,7);g.fill();g.fillStyle=gr&&gr.addColorStop?gr:wa;g.beginPath();g.ellipse(cx,cy,iw,ih,0,0,7);g.fill();
 g.save();g.beginPath();g.ellipse(cx,cy,iw,ih,0,0,7);g.clip();g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1;for(let k=-iw;k<iw;k+=14){g.beginPath();g.moveTo(cx+k,cy-ih);g.lineTo(cx+k,cy+ih);g.stroke()}for(let k=-ih;k<ih;k+=14){g.beginPath();g.moveTo(cx-iw,cy+k);g.lineTo(cx+iw,cy+k);g.stroke()}
 // coins on the bottom, a few things that fell in
 for(let i=0;i<26;i++){const a=cmH(i,o.x,5)*6.283,r=.2+cmH(i,o.y,6)*.75;g.fillStyle=i%3?'#c8a040':'#a8a8a0';g.fillRect(Math.round(cx+Math.cos(a)*iw*r),Math.round(cy+Math.sin(a)*ih*r),2,2)}
 if(po(o,'mess',1)){g.fillStyle='rgba(230,230,220,.75)';g.save();g.translate(cx-iw*.5,cy+ih*.3);g.rotate(.4);g.fillRect(-7,-5,14,10);g.restore();g.fillStyle='rgba(130,12,18,.35)';g.beginPath();g.ellipse(cx+iw*.4,cy-ih*.2,18,9,0,0,7);g.fill()}g.restore();
 // the centre: three stone bowls, smaller as they go up
 for(const[r,dy]of[[Math.min(iw,ih)*.42,0],[Math.min(iw,ih)*.26,-10],[Math.min(iw,ih)*.13,-18]]){g.fillStyle=HSK.o;g.beginPath();g.ellipse(cx,cy+dy,r+1,r*.55+1,0,0,7);g.fill();g.fillStyle=pcSh(st,.85);g.beginPath();g.ellipse(cx,cy+dy+2,r,r*.55,0,0,7);g.fill();g.fillStyle=st;g.beginPath();g.ellipse(cx,cy+dy,r,r*.5,0,0,7);g.fill();g.fillStyle=pcSh(wa,1.15);g.beginPath();g.ellipse(cx,cy+dy,r*.78,r*.36,0,0,7);g.fill()}
 g.fillStyle=HSK.o;g.fillRect(cx-3,cy-30,6,12);g.fillStyle=st;g.fillRect(cx-2,cy-30,4,11);if(!on){g.fillStyle='rgba(40,60,50,.25)';g.beginPath();g.ellipse(cx,cy,iw,ih,0,0,7);g.fill()}}
function arFountAn(o,t){if(!po(o,'on',1))return;const{cx,cy,rx,ry}=hfBox(o),iw=rx-16,ih=ry-16,ph=cmR(o,0,91)*7;X.save();X.beginPath();X.ellipse(cx,cy,iw,ih,0,0,7);X.clip();
 // ripples where the jets come down, spreading out
 for(let i=0;i<6;i++){const a=i/6*6.283+.3,jx=cx+Math.cos(a)*iw*.62,jy=cy+Math.sin(a)*ih*.62;for(let k=0;k<2;k++){const u=((t*.6+i*.17+k*.5+ph)%1);X.strokeStyle='rgba(220,245,255,'+(.4*(1-u)).toFixed(3)+')';X.lineWidth=1.2;X.beginPath();X.ellipse(jx,jy,3+u*16,2+u*8,0,0,7);X.stroke()}}
 for(let k=0;k<3;k++){const u=((t*.4+k/3+ph)%1),r=Math.min(iw,ih)*(.45+u*.5);X.strokeStyle='rgba(220,245,255,'+(.22*(1-u)).toFixed(3)+')';X.lineWidth=1;X.beginPath();X.ellipse(cx,cy,r*iw/Math.min(iw,ih),r*ih/Math.min(iw,ih)*.9,0,0,7);X.stroke()}
 // glints
 for(let i=0;i<14;i++){const a=cmH(i,o.x,8)*6.283,r=.15+cmH(i,o.y,9)*.8,b=Math.sin(t*3+i*2.1+ph);if(b<.6)continue;X.fillStyle='rgba(255,255,255,'+((b-.6)*1.8).toFixed(3)+')';X.fillRect(Math.round(cx+Math.cos(a)*iw*r),Math.round(cy+Math.sin(a)*ih*r),3,1)}X.restore();
 // the jets: arcs of water from the rim into the basin, and the plume from the top bowl
 X.save();for(let i=0;i<6;i++){const a=i/6*6.283+.3,sx=cx+Math.cos(a)*(rx-10),sy=cy+Math.sin(a)*(ry-10),ex=cx+Math.cos(a)*iw*.62,ey=cy+Math.sin(a)*ih*.62;
  for(let k=0;k<7;k++){const u=((t*1.6+k/7+i*.13)%1),x=sx+(ex-sx)*u,y=sy+(ey-sy)*u-Math.sin(u*Math.PI)*22;X.fillStyle='rgba(225,245,255,.75)';X.fillRect(Math.round(x)-1,Math.round(y)-1,2+(k%2),2)}}
 for(let k=0;k<16;k++){const u=((t*1.2+k/16)%1),a=k*2.4,x=cx+Math.cos(a)*u*20,y=cy-30-Math.sin(u*Math.PI)*26+u*20;X.fillStyle='rgba(230,248,255,'+(.8-u*.4).toFixed(3)+')';X.fillRect(Math.round(x)-1,Math.round(y)-1,2,2)}X.restore()}
function arFountColl(o,out){const{cx,cy,rx,ry}=hfBox(o),n=Math.max(4,Math.round(o.h/16));for(let i=0;i<n;i++){const y0=o.y+i*o.h/n,y1=y0+o.h/n,ym=(y0+y1)/2,dy=(ym-cy)/ry,k=Math.sqrt(Math.max(0,1-dy*dy)),hw=rx*k;if(hw<4)continue;out.push([cx-hw,y0,hw*2,y1-y0,1])}}
function arFountLts(o,L){if(!po(o,'on',1))return;const{cx,cy,rx,ry}=hfBox(o),c=cmCol(o.c2,'#2a8aa8');L.push({x:cx,y:cy,r:Math.max(rx,ry)+60,c:pcSh(c,1.6),i:.55,f:'glow',ph:1});for(let i=0;i<4;i++){const a=i/4*6.283+.8;L.push({x:cx+Math.cos(a)*rx*.5,y:cy+Math.sin(a)*ry*.5,r:70,c:'#8ae8ff',i:.45})}}
cmAddArea({id:'hfount',n:'Lobby fountain (water feature)',cat:'build',fl:1,pal:[['#d8d2c4','Stone'],['#e8e8e4','White marble'],['#8a8a8a','Granite'],['#b8a888','Sandstone']],pal2:[['#2a8aa8','Blue water'],['#2aa890','Green-blue'],['#3a5a6a','Dark water']],
 def:{c:'#d8d2c4',c2:'#2a8aa8',o:{on:1,mess:1}},opts:[['on','Running','chk'],['mess','Things fell in','chk']],min:[120,80],pri:-35,f:arFount,anim:arFountAn,coll(o,out){if(cmSolid(o,'a'))arFountColl(o,out)},lts:arFountLts});
// ----- the elevator: the cab (its box), the doors on one side (d), the frame, the floor display and call buttons outside -----
// st: shut (doors closed), pried (forced half open, the shaft dark beyond: still solid), open (the cab lit, walk in), esc (the escape
// elevator: shut until the roof escape opens it; its call button glows)
function elG(o){const{x,y,w,h}=o,d=po(o,'d','s'),T=8;let door,walls;if(d=='s'){door=[x+T,y+h-T,w-2*T,T];walls=[[x,y,w,T],[x,y,T,h],[x+w-T,y,T,h]]}else if(d=='n'){door=[x+T,y,w-2*T,T];walls=[[x,y+h-T,w,T],[x,y,T,h],[x+w-T,y,T,h]]}
 else if(d=='e'){door=[x+w-T,y+T,T,h-2*T];walls=[[x,y,T,h],[x,y,w,T],[x,y+h-T,w,T]]}else{door=[x,y+T,T,h-2*T];walls=[[x+w-T,y,T,h],[x,y,w,T],[x,y+h-T,w,T]]}return{d,door,walls,T,inr:[x+T,y+T,w-2*T,h-2*T]}}
// the roof escape's car: dark and shut like the others until the escape starts (wave 20 beaten), then lit with its doors opening
const elEsc=o=>po(o,'st','shut')=='esc'&&typeof escElevK=='function'&&escElevK(o)!=null;
function elOpenK(o){const st=po(o,'st','shut');if(typeof escElevK=='function'){const k=escElevK(o);if(k!=null)return k}return st=='open'?1:st=='pried'?.45:0}
function arElev(g,o){arElevCab(g,o,po(o,'st','shut')=='open')}
function arElevCab(g,o,lit){const{x,y,w,h}=o,G=elG(o),st=po(o,'st','shut');
 // the cab: steel panels, a handrail, a floor (light from the ceiling when the power's on)
 g.fillStyle=HSK.o;g.fillRect(x,y,w,h);g.fillStyle=lit?'#8a8f98':'#2a2c32';g.fillRect(x+2,y+2,w-4,h-4);const[ix,iy,iw,ih]=G.inr;g.fillStyle=lit?'#b8a888':'#3a3630';g.fillRect(ix,iy,iw,ih);
 g.fillStyle=lit?'rgba(255,255,255,.08)':'rgba(0,0,0,.15)';for(let k=0;k<iw;k+=12)g.fillRect(ix+k,iy,1,ih);
 for(const b of G.walls){g.fillStyle=HSK.o;g.fillRect(b[0],b[1],b[2],b[3]);g.fillStyle=lit?HSK.st:'#5a5e66';g.fillRect(b[0]+1,b[1]+1,b[2]-2,b[3]-2);g.fillStyle=lit?HSK.stl:'#6a6e76';if(b[2]>b[3])g.fillRect(b[0]+1,b[1]+1,b[2]-2,1);else g.fillRect(b[0]+1,b[1]+1,1,b[3]-2)}
 // the handrail on the back wall, the button panel by the door
 g.fillStyle=lit?'#e8ecf0':'#6a6e76';const bw=G.walls[0];if(bw[2]>bw[3])g.fillRect(bw[0]+14,G.d=='s'?bw[1]+bw[3]+2:bw[1]-4,bw[2]-28,2);else g.fillRect(G.d=='e'?bw[0]+bw[2]+2:bw[0]-4,bw[1]+14,2,bw[3]-28);
 if(G.d=='s'||G.d=='n'){const py=G.d=='s'?y+h-22:y+12;g.fillStyle=HSK.o;g.fillRect(x+w-20,py,9,12);g.fillStyle=lit?'#d8dce2':'#4a4e56';g.fillRect(x+w-19,py+1,7,10);for(let k=0;k<3;k++){g.fillStyle=lit&&k==0?'#ffcf40':'#8a8f96';g.fillRect(x+w-17,py+2+k*3,3,2)}}
 // the door frame (a steel surround) on the door side
 const[dx,dy,dw,dh]=G.door;g.fillStyle=HSK.o;if(dw>dh){g.fillRect(dx-6,dy-2,6,dh+4);g.fillRect(dx+dw,dy-2,6,dh+4)}else{g.fillRect(dx-2,dy-6,dw+4,6);g.fillRect(dx-2,dy+dh,dw+4,6)}g.fillStyle=HSK.std;if(dw>dh){g.fillRect(dx-5,dy-1,4,dh+2);g.fillRect(dx+dw+1,dy-1,4,dh+2)}else{g.fillRect(dx-1,dy-5,dw+2,4);g.fillRect(dx-1,dy+dh+1,dw+2,4)}
 if(st=='pried'){g.fillStyle='#0a0a0e';g.fillRect(ix,iy,iw,ih);g.fillStyle='rgba(255,255,255,.04)';for(let k=4;k<ih;k+=10)g.fillRect(ix+4,iy+k,iw-8,1);g.fillStyle='#3a3d46';g.fillRect(ix+iw/2-2,iy,4,ih)}}
// the doors (they slide into the walls on each side), and outside: the floor display over the doors, the call button
function arElevAn(o,t){const G=elG(o),k=elOpenK(o),[dx,dy,dw,dh]=G.door,st=po(o,'st','shut'),on=elEsc(o),hz=dw>dh,L=hz?dw:dh,half=L/2,gap=Math.round(half*k);if(on)arElevCab(X,o,1);
 const leaf=(a,b)=>{if(b<=a)return;if(hz){X.fillStyle=HSK.o;X.fillRect(dx+a,dy,b-a,dh);X.fillStyle='#a8b0ba';X.fillRect(dx+a+1,dy+1,b-a-2,dh-2);X.fillStyle='#d4dae2';X.fillRect(dx+a+1,dy+1,b-a-2,2)}else{X.fillStyle=HSK.o;X.fillRect(dx,dy+a,dw,b-a);X.fillStyle='#a8b0ba';X.fillRect(dx+1,dy+a+1,dw-2,b-a-2);X.fillStyle='#d4dae2';X.fillRect(dx+1,dy+a+1,2,b-a-2)}};
 leaf(0,half-gap);leaf(half+gap,L);if(gap<1){X.fillStyle=HSK.o;hz?X.fillRect(dx+half,dy,1,dh):X.fillRect(dx,dy+half,dw,1)}
 // outside the doors: the floor display (a number, or the escape's count) and the call button
 const out=G.d=='s'?[dx+dw/2,dy+dh+12]:G.d=='n'?[dx+dw/2,dy-12]:G.d=='e'?[dx+dw+12,dy+dh/2]:[dx-12,dy+dh/2];const fl=typeof escElevFloor=='function'?escElevFloor(o):null,f=fl!=null?fl:st=='open'?'1':st=='esc'&&on?'1':'--';
 X.fillStyle=HSK.o;X.fillRect(out[0]-11,out[1]-6,22,11);X.fillStyle='#160a08';X.fillRect(out[0]-10,out[1]-5,20,9);X.font='bold 8px monospace';X.textAlign='center';X.textBaseline='middle';X.fillStyle=st=='shut'||(st=='esc'&&!on)?'#5a2a20':'#ff6a3a';X.fillText(f,out[0],out[1]);X.textAlign='left';X.textBaseline='alphabetic';
 if(st=='esc'){const lt=on&&typeof escElevCall=='function'&&escElevCall(o);const bx=G.d=='s'||G.d=='n'?dx+dw+12:out[0],by=G.d=='s'||G.d=='n'?out[1]:dy+dh+12;X.fillStyle=HSK.o;X.fillRect(bx-4,by-6,9,13);X.fillStyle='#8a8f96';X.fillRect(bx-3,by-5,7,11);X.fillStyle=lt?'#ffe27a':'#5a4a2a';X.fillRect(bx-1,by-3,3,3);X.fillRect(bx-1,by+1,3,3)}}
// shut, the doors and the inside are solid (nobody stands in a closed car); the roof escape takes both away when it opens the doors
function arElevColl(o,out){const G=elG(o),st=po(o,'st','shut');for(const b of G.walls)out.push([b[0],b[1],b[2],b[3],0]);if(st!='open'){out.push([G.door[0],G.door[1],G.door[2],G.door[3],0,'elev']);out.push([G.inr[0],G.inr[1],G.inr[2],G.inr[3],0,'elev'])}}
function arElevLts(o,L){const st=po(o,'st','shut');if(st=='open'||st=='esc'){const G=elG(o),[ix,iy,iw,ih]=G.inr,q={rect:[ix,iy,iw,ih],x:ix+iw/2,y:iy+ih/2,r:Math.hypot(iw,ih)/2+16,c:'#fff2d8',i:st=='esc'?.55:.8,ph:0};if(st=='esc'){q.f='escel';q.o=o}L.push(q)}}
cmAddArea({id:'elev',n:'Elevator (the cab, doors on one side)',cat:'build',fl:0,def:{o:{d:'s',st:'shut'}},opts:[['d','Doors face',[['s','Down'],['n','Up'],['e','Right'],['w','Left']]],['st','Doors',[['shut','Shut'],['pried','Pried half open (dark shaft)'],['open','Open (walk in)'],['esc','The roof escape elevator']]]],
 min:[64,64],pri:-20,f:arElev,anim:arElevAn,coll(o,out){if(cmSolid(o,'a'))arElevColl(o,out)},lts:arElevLts});
// ----- the roof deck: the membrane in long sheets, seams, drains, patches of gravel ballast -----
function arRdeck(g,o){const{x,y,w,h}=o,c=cmCol(o.c,'#5a5c60');g.fillStyle=c;g.fillRect(x,y,w,h);g.fillStyle=pcSh(c,.88);for(let k=0;k<h;k+=48)g.fillRect(x,y+k,w,1);g.fillStyle=pcSh(c,1.08);for(let k=24;k<h;k+=48)g.fillRect(x,y+k,w,1);
 for(let i=0;i<w*h/2600;i++){const px=x+cmH(i,o.x,11)*w,py=y+cmH(i,o.y,12)*h;g.fillStyle=cmH(i,3,13)<.5?pcSh(c,.8):pcSh(c,1.18);g.fillRect(Math.round(px),Math.round(py),2,1)}
 for(let i=0;i<w*h/180000;i++){const px=x+40+cmH(i,o.x,14)*(w-80),py=y+40+cmH(i,o.y,15)*(h-80);g.fillStyle=pcSh(c,.82);g.beginPath();g.ellipse(px,py,30+cmH(i,1,16)*40,14+cmH(i,2,17)*14,0,0,7);g.fill();for(let k=0;k<60;k++){g.fillStyle=k%2?pcSh(c,.65):pcSh(c,1.2);g.fillRect(Math.round(px+(cmH(k,i,18)-.5)*70),Math.round(py+(cmH(k,i,19)-.5)*24),2,2)}}
 for(let i=0;i<Math.max(1,Math.round(w*h/400000));i++){const px=x+80+cmH(i,o.x,21)*(w-160),py=y+80+cmH(i,o.y,22)*(h-160);g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(px,py,22,12,0,0,7);g.fill();g.fillStyle=HSK.o;g.beginPath();g.arc(px,py,7,0,7);g.fill();g.fillStyle='#3a3d46';g.beginPath();g.arc(px,py,6,0,7);g.fill();g.fillStyle='#6a6e76';for(let k=-4;k<5;k+=2)g.fillRect(px+k,py-4,1,8)}}
cmAddArea({id:'rdeck',n:'Roof deck (membrane, gravel, drains)',cat:'ground',fl:null,pal:[['#5a5c60','Grey'],['#6a6a66','Light grey'],['#4a4a50','Dark']],def:{c:'#5a5c60'},min:[64,64],pri:-110,f:arRdeck});
// ----- the helipad: a square deck, the circle, the H, the touchdown marks; edge lights blink, floodlights at the corners -----
function arHpad(g,o){const{x,y,w,h}=o,cx=x+w/2,cy=y+h/2,r=Math.min(w,h)/2;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+6,y+8,w,h);g.fillStyle=HSK.o;g.fillRect(x,y,w,h);g.fillStyle='#3e4248';g.fillRect(x+2,y+2,w-4,h-4);
 g.fillStyle='#4a4e56';for(let k=0;k<w;k+=24)g.fillRect(x+2+k,y+2,1,h-4);g.fillStyle='#e8e4d8';const m=10;g.fillRect(x+m,y+m,w-2*m,4);g.fillRect(x+m,y+h-m-4,w-2*m,4);g.fillRect(x+m,y+m,4,h-2*m);g.fillRect(x+w-m-4,y+m,4,h-2*m);
 g.strokeStyle='#f0c419';g.lineWidth=Math.max(4,r*.06);g.beginPath();g.arc(cx,cy,r*.72,0,7);g.stroke();g.fillStyle='#f0c419';const k=r/120;g.fillRect(cx-30*k,cy-40*k,14*k,80*k);g.fillRect(cx+16*k,cy-40*k,14*k,80*k);g.fillRect(cx-16*k,cy-7*k,32*k,14*k);
 g.fillStyle='#e8e4d8';g.font='bold '+Math.round(14*k)+'px monospace';g.textAlign='center';g.fillText(po(o,'t','8.5'),cx+r*.52,cy+r*.62);g.textAlign='left';
 for(const[a,b]of[[x+6,y+6],[x+w-14,y+6],[x+6,y+h-14],[x+w-14,y+h-14]]){g.fillStyle=HSK.o;g.fillRect(a,b,8,8);g.fillStyle='#2a2c32';g.fillRect(a+1,b+1,6,6)}
 const n=Math.max(4,Math.round((w+h)*2/90));for(let i=0;i<n;i++){const p=elPerim(o,i/n);g.fillStyle=HSK.o;g.fillRect(p[0]-3,p[1]-3,6,6);g.fillStyle='#2a6a3a';g.fillRect(p[0]-2,p[1]-2,4,4)}}
function elPerim(o,u){const{x,y,w,h}=o,P=2*(w+h)-24,s=u*P,a=w-6,b=h-6;let[px,py]=s<a?[x+3+s,y+3]:s<a+b?[x+w-3,y+3+s-a]:s<2*a+b?[x+w-3-(s-a-b),y+h-3]:[x+3,y+h-3-(s-2*a-b)];return[px,py]}
function arHpadAn(o,t){const n=Math.max(4,Math.round((o.w+o.h)*2/90));for(let i=0;i<n;i++){const p=elPerim(o,i/n),on=((t*1.2-i/n*2)%1+1)%1<.3;X.fillStyle=on?'#9aff9a':'#3a8a4a';X.fillRect(p[0]-2,p[1]-2,4,4);if(on){X.fillStyle='rgba(150,255,150,.35)';X.fillRect(p[0]-5,p[1]-5,10,10)}}}
function arHpadLts(o,L){const n=Math.max(4,Math.round((o.w+o.h)*2/90));for(let i=0;i<n;i+=2){const p=elPerim(o,i/n);L.push({x:p[0],y:p[1],r:40,c:'#8aff8a',i:.7,f:'blink',ph:i/n*6.283})}
 const{x,y,w,h}=o;for(const[a,b]of[[x+10,y+10],[x+w-10,y+10],[x+10,y+h-10],[x+w-10,y+h-10]])L.push({x:a,y:b,r:Math.min(w,h)*.75,c:'#f4f0e0',i:.5});L.push({x:x+w/2,y:y+h/2,r:Math.min(w,h)*.55,c:'#fff2d8',i:.45})}
cmAddArea({id:'hpad',n:'Helipad (lit)',cat:'ground',fl:null,txt:4,def:{o:{t:'8.5'}},opts:[['t','Weight limit',[['8.5','8.5'],['12','12'],['20','20']]]],min:[160,160],pri:-30,f:arHpad,anim:arHpadAn,lts:arHpadLts});
// ----- a skylight on its curb: panes of glass glowing with the light from below -----
function arSkyl(g,o){const{x,y,w,h}=o;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+4,y+6,w,h);g.fillStyle=HSK.o;g.fillRect(x,y,w,h);g.fillStyle='#8a8f96';g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle='#a8acb4';g.fillRect(x+1,y+1,w-2,3);
 const nx=Math.max(1,Math.round((w-12)/48)),ny=Math.max(1,Math.round((h-12)/48)),pw=(w-12)/nx,ph=(h-12)/ny;for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const a=x+6+i*pw,b=y+6+j*ph;g.fillStyle=HSK.o;g.fillRect(a,b,pw-2,ph-2);g.fillStyle=po(o,'lit',1)?'#e8c890':'#2a3440';g.fillRect(a+1,b+1,pw-4,ph-4);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(a+2,b+2,pw*.4,2)}}
function arSkylLts(o,L){if(!po(o,'lit',1))return;L.push({rect:[o.x,o.y,o.w,o.h],x:o.x+o.w/2,y:o.y+o.h/2,r:Math.hypot(o.w,o.h)/2+50,c:'#ffd8a0',i:.6,ph:0,f:'flk'})}
cmAddArea({id:'skyl',n:'Skylight (glowing from below)',cat:'build',fl:2,def:{o:{lit:1}},opts:[['lit','Lit from below','chk']],min:[40,40],pri:-25,f:arSkyl,lts:arSkylLts});
// ----- the parapet: the low wall round a roof, with its coping (zombies climb over it) -----
cmAddWall({id:'parapet',n:'Roof parapet (low wall with coping)',fl:0,f(g,x,y,w,h){kwOut(g,x,y,w,h);const hz=kwH(w,h);g.fillStyle='#8a8a86';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#b8b8b0';hz?g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(1,Math.round(h*.35))):g.fillRect(x+1,y+1,Math.max(1,Math.round(w*.35)),Math.max(0,h-2));
 g.fillStyle='#6a6a66';if(hz)for(let k=x+18;k<x+w-2;k+=36)g.fillRect(k,y+1,1,Math.max(0,h-2));else for(let k=y+18;k<y+h-2;k+=36)g.fillRect(x+1,k,Math.max(0,w-2),1)}});
// ----- the fire alarm strobe: a red box on the wall, its white strobe flashes; its red light pulses down the hall -----
function hsAlarmBox(o,t){const x=Math.round(o.x),y=Math.round(o.y),ph=cmR(o,0,97),on=((t*.9+ph)%1)<.12;X.fillStyle=HSK.o;X.fillRect(x-6,y-9,12,14);X.fillStyle='#c8281e';X.fillRect(x-5,y-8,10,12);X.fillStyle=on?'#ffffff':'#e8d8d0';X.fillRect(x-3,y-6,6,4);X.fillStyle='#fff';X.fillRect(x-4,y,8,2);
 if(on){X.fillStyle='rgba(255,255,255,.5)';X.beginPath();X.arc(x,y-4,14,0,7);X.fill()}}
cmAddFx({id:'alarm',n:'Fire alarm strobe (red light pulses)',cat:'light',r:40,anim:hsAlarmBox,ed(g,o){g.fillStyle='#16111c';g.fillRect(o.x-6,o.y-9,12,14);g.fillStyle='#c8281e';g.fillRect(o.x-5,o.y-8,10,12);g.fillStyle='#fff';g.fillRect(o.x-3,o.y-6,6,4)},
 lts(o,s,ph,L){L.push({x:o.x,y:o.y,r:210*s,c:'#ff2a1a',i:.85,f:'alarm',ph:cmR(o,0,97)*6.283})}});
// ----- a broken ceiling light hanging down by its wires: it swings, sparks and flickers (drawn over people) -----
function hsHangTop(o,t){const ph=cmR(o,0,93)*7,a=Math.sin(t*1.4+ph)*.18+(cmR(o,0,94)-.5)*.6,x=o.x,y=o.y-60;X.save();X.translate(x,y);X.strokeStyle='#2a2c32';X.lineWidth=1;X.beginPath();X.moveTo(-10,0);X.lineTo(Math.sin(a)*44-6,Math.cos(a)*44);X.moveTo(-4,0);X.quadraticCurveTo(6,20,Math.sin(a)*44,Math.cos(a)*44);X.stroke();
 X.rotate(a);X.translate(0,44);X.rotate(1.25);const on=hsHangOn(o,t);X.fillStyle=HSK.o;X.fillRect(-30,-6,60,12);X.fillStyle='#d8dce2';X.fillRect(-29,-5,58,10);X.fillStyle=on?'#f4fbff':'#8a9098';X.fillRect(-26,-3,52,3);X.fillRect(-26,1,52,3);if(on){X.fillStyle='rgba(220,240,255,.35)';X.fillRect(-34,-10,68,20)}X.restore();
 const u=(t*2.3+ph)%3;if(u<.25){for(let i=0;i<7;i++){const k=(u/.25+i*.13)%1;X.fillStyle=i%2?'#ffe27a':'#fff';X.fillRect(Math.round(x-6+Math.cos(i*1.7)*k*18),Math.round(y+k*k*60+4),2,2)}}}
function hsHangOn(o,t){const ph=cmR(o,0,93)*7,u=(t+ph*3)%4.2;return u<2.6?(cmH(Math.floor(t*14),o.x,5)<.75):(cmH(Math.floor(t*22),o.y,6)<.3)}
cmAddFx({id:'hanglight',n:'Broken ceiling light (hanging, sparking)',cat:'light',r:90,top:hsHangTop,ed(g,o){g.fillStyle='#16111c';g.fillRect(o.x-30,o.y-14,60,12);g.fillStyle='#d8dce2';g.fillRect(o.x-29,o.y-13,58,10);g.strokeStyle='#2a2c32';g.beginPath();g.moveTo(o.x-10,o.y-60);g.lineTo(o.x,o.y-14);g.stroke()},
 lts(o,s,ph,L){L.push({x:o.x,y:o.y-10,r:130*s,c:'#e8f4ff',i:.9,f:'hang',ph:cmR(o,0,93)*7,o})}});
// ----- a fluorescent ceiling light, seen from below the ceiling (drawn over people): its frame and two tubes; on, flickering
// (a failing tube, in step with its light) or dead (dark, cracked); wet 1 adds its reflection in the wet floor under it -----
const ftOn=(o,t)=>{const k=po(o,'k','on');if(k=='off')return 0;if(k!='flk')return 1;return cmLtNow({f:'fault',ph:cmH(o.x,o.y,9)*6.283},t,0)>.5};
function hsTubeTop(o,t){const v=!!+po(o,'v',0),on=ftOn(o,t),x=Math.round(o.x),y=Math.round(o.y),L=56,T=16,w=v?T:L,h=v?L:T,x0=x-w/2,y0=y-h/2;
 if(on){X.fillStyle='rgba(200,225,255,.22)';X.fillRect(x0-8,y0-8,w+16,h+16);X.fillStyle='rgba(220,236,255,.3)';X.fillRect(x0-3,y0-3,w+6,h+6)}
 X.fillStyle=HSK.o;X.fillRect(x0,y0,w,h);X.fillStyle='#b8bec8';X.fillRect(x0+1,y0+1,w-2,h-2);const tc=on?'#f6fbff':'#5a6068';X.fillStyle=tc;
 if(v){X.fillRect(x0+3,y0+3,3,h-6);X.fillRect(x0+w-6,y0+3,3,h-6)}else{X.fillRect(x0+3,y0+3,w-6,3);X.fillRect(x0+3,y0+h-6,w-6,3)}
 if(!on&&po(o,'k','on')=='off'){X.fillStyle='#2a2c32';if(v){X.fillRect(x0+3,y0+18,3,4);X.fillRect(x0+w-6,y0+34,3,6)}else{X.fillRect(x0+20,y0+3,5,3);X.fillRect(x0+36,y0+h-6,7,3)}}}
function hsTubeRefl(o,t){if(!+po(o,'wet',0)||!ftOn(o,t))return;const v=!!+po(o,'v',0),x=o.x,y=o.y+54,w=v?14:40,h=v?70:46;X.save();X.globalCompositeOperation='lighter';
 for(const[p,a]of[[14,.05],[8,.07],[3,.09]]){X.fillStyle='rgba(205,225,255,'+a+')';v?X.fillRect(x-8-p,y-30-p,16+p*2,60+p*2):X.fillRect(x-28-p,y-6-p,56+p*2,12+p*2)}X.fillStyle='rgba(240,248,255,.3)';if(v){X.fillRect(x-5,y-26,2,52);X.fillRect(x+3,y-26,2,52)}else{X.fillRect(x-25,y-3,50,2);X.fillRect(x-25,y+2,50,2)}X.restore()}
cmAddFx({id:'ftube',n:'Fluorescent ceiling light (tubes)',cat:'light',r:60,pal:[['#dbe9ff','Cool white'],['#fff0d0','Warm white'],['#c8f0ff','Icy blue']],def:{c:'#dbe9ff',o:{k:'on',v:0,wet:0}},
 opts:[['k','Tubes',[['on','On'],['flk','Flickering (failing)'],['off','Dead']]],['v','Runs up and down','chk'],['wet','Reflected in a wet floor','chk']],anim:hsTubeRefl,top:hsTubeTop,
 ed(g,o){const v=!!+po(o,'v',0),w=v?16:56,h=v?56:16;g.fillStyle='#16111c';g.fillRect(o.x-w/2,o.y-h/2,w,h);g.fillStyle=po(o,'k','on')=='off'?'#5a6068':'#f6fbff';g.fillRect(o.x-w/2+2,o.y-h/2+2,w-4,h-4)},
 lts(o,s,ph,L){const k=po(o,'k','on');if(k=='off')return;const q={x:o.x,y:o.y,r:135*s,c:cmCol(o.c,'#dbe9ff'),i:.72,gs:1.5};if(k=='flk'){q.f='fault';q.ph=cmH(o.x,o.y,9)*6.283}L.push(q)}});
// ----- a soft ceiling light: only its light, a wide soft pool (rows of them wash a hall evenly); on or flickering -----
cmAddFx({id:'softlight',n:'Soft ceiling light (light only)',cat:'light',r:60,pal:[['#aab8cc','Cool (dim)'],['#d6e0ee','Cool white'],['#c8c0b0','Warm (dim)'],['#ffe0b0','Warm white']],def:{c:'#aab8cc',o:{k:'on'}},
 opts:[['k','Light',[['on','On'],['flk','Flickering']]]],ed(g,o){g.fillStyle='#16111c';g.beginPath();g.arc(o.x,o.y,7,0,7);g.fill();g.fillStyle=cmCol(o.c,'#aab8cc');g.beginPath();g.arc(o.x,o.y,5,0,7);g.fill()},
 lts(o,s,ph,L){const q={x:o.x,y:o.y,r:200*s,c:cmCol(o.c,'#aab8cc'),i:.85};if(po(o,'k','on')=='flk'){q.f='fault';q.ph=cmH(o.x,o.y,9)*6.283}L.push(q)}});
// ----- sparks: a broken light or a cut cable spitting sparks now and then (each to its own beat), an orange flash with each burst;
// the sparks fall over people -----
function hsSpkU(o,t){const P=1.5+cmH(o.x,o.y,5)*2.4,tau=(t+cmH(o.x,o.y,6)*P)%P;return tau<.7?tau/.7:-1}
function hsSparks(o,t){const x=o.x,y=o.y;X.strokeStyle='#16111c';X.lineWidth=1.5;X.beginPath();X.moveTo(x-4,y-10);X.quadraticCurveTo(x-6,y-4,x-2,y);X.moveTo(x+3,y-10);X.quadraticCurveTo(x+6,y-3,x+2,y+1);X.stroke();
 const u=hsSpkU(o,t);if(u<0)return;const tau=u*.7;if(u<.25){X.fillStyle='rgba(255,242,190,'+(1-u*4)+')';X.beginPath();X.arc(x,y,7-u*12,0,7);X.fill()}
 for(let i=0;i<16;i++){const vx=(cmH(i,o.x,7)-.5)*240,vy=-30-cmH(i,o.y,8)*90,px=x+vx*tau,py=y+vy*tau+210*tau*tau,a=Math.max(0,1-u*(1+cmH(i,3,9)));if(a<=0)continue;
  X.fillStyle=i%3?'rgba(255,170,60,'+a+')':'rgba(255,236,170,'+a+')';X.fillRect(Math.round(px),Math.round(py),i%2?3:2,2)}}
cmAddFx({id:'sparks',n:'Sparks (a broken light or cable)',cat:'light',r:60,def:{o:{}},top:hsSparks,
 ed(g,o){g.fillStyle='#ffb040';for(let i=0;i<6;i++)g.fillRect(o.x-10+i*4,o.y-4+(i%3)*4,2,2)},
 lts(o,s,ph,L){L.push({x:o.x,y:o.y,r:110*s,c:'#ffa040',i:.95,f:'spk',o})}});
// ----- decals -----
// the biohazard mark painted on the floor of a sealed room (or stuck by its door)
cmAddDec({id:'biohaz',n:'Biohazard mark',cat:'misc',w:60,h:60,f(g){const R_=c=>{g.fillStyle=c};g.strokeStyle='rgba(192,40,36,.9)';g.lineWidth=3;g.beginPath();g.arc(0,0,26,0,7);g.stroke();R_('rgba(192,40,36,.9)');
 for(let k=0;k<3;k++){const a=-Math.PI/2+k*2.094;g.beginPath();g.arc(Math.cos(a)*10,Math.sin(a)*10,9,0,7);g.fill()}R_('rgba(22,17,28,.9)');for(let k=0;k<3;k++){const a=-Math.PI/2+k*2.094;g.beginPath();g.arc(Math.cos(a)*13,Math.sin(a)*13,4.5,0,7);g.fill()}
 g.beginPath();g.arc(0,0,4,0,7);g.fill();g.strokeStyle='rgba(192,40,36,.9)';g.lineWidth=2;g.beginPath();g.arc(0,0,15,0,7);g.stroke()}});
// a wet floor: a sheen of water from the sprinklers, darker and cooler, with streaks where it catches the lights (var: its shape)
cmAddDec({id:'wetfloor',n:'Wet floor (shiny)',cat:'misc',w:170,h:80,f(g,v){const P=[];for(let i=0;i<4;i++)P.push([(cmH(i,v*13,41)-.5)*90,(cmH(i,v*13,42)-.5)*30,34+cmH(i,v*13,43)*36,14+cmH(i,v*13,44)*12]);
 g.fillStyle='rgba(60,95,150,.08)';for(const[x,y,a,b]of P){g.beginPath();g.ellipse(x,y,a,b,0,0,7);g.fill()}g.strokeStyle='rgba(215,232,255,.3)';g.lineWidth=1;for(const[x,y,a,b]of P){g.beginPath();g.ellipse(x,y,a,b,0,3.5,5.9);g.stroke()}
 for(let i=0;i<2;i++){const[x,y,a,b]=P[i];g.fillStyle='rgba(230,242,255,.16)';g.beginPath();g.ellipse(x-a*.15,y-b*.2,a*.55,3.5,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.45)';g.fillRect(Math.round(x-a*.4),Math.round(y-b*.2),Math.round(a*.5),1)}}});
const HSPILL=[['#e8e8e4','White'],['#e8a040','Orange'],['#7ab8e8','Blue']];
cmAddDec({id:'pills',n:'Spilled pills',cat:'misc',w:44,h:26,pal:HSPILL,f(g,v,K){g.fillStyle='#16111c';g.fillRect(-20,-6,14,10);g.fillStyle='#e8a040';g.fillRect(-19,-5,12,8);g.fillStyle='#fff';g.fillRect(-17,-3,6,4);for(let i=0;i<16;i++){const x=-4+cmH(i,v*9,2)*26,y=-10+cmH(i,v*9,3)*20;g.fillStyle='#16111c';g.fillRect(x-1,y-1,4,3);g.fillStyle=i%3?K.b:'#fff';g.fillRect(x,y,2,1)}}});
cmAddDec({id:'gauze',n:'Bloody gauze',cat:'misc',w:40,h:30,f(g,v){for(let i=0;i<3;i++){const x=(cmH(i,v*7,4)-.5)*22,y=(cmH(i,v*7,5)-.5)*14;g.fillStyle='#16111c';g.fillRect(x-8,y-6,16,12);g.fillStyle='#f0ece4';g.fillRect(x-7,y-5,14,10);g.fillStyle='rgba(150,14,20,.8)';g.beginPath();g.ellipse(x+1,y,4+i,3,0,0,7);g.fill()}}});
cmAddDec({id:'xfilm',n:'X-ray film on the floor',cat:'misc',w:36,h:44,f(g,v){g.fillStyle='#16111c';g.fillRect(-16,-20,32,40);g.fillStyle='#1a2230';g.fillRect(-15,-19,30,38);g.strokeStyle='#b8c8d8';g.lineWidth=1.2;for(let k=-12;k<14;k+=5){g.beginPath();g.moveTo(-10,k);g.quadraticCurveTo(0,k-5,10,k);g.stroke()}g.fillStyle='#b8c8d8';g.fillRect(-1,-16,2,32)}});
cmAddDec({id:'syringe',n:'Syringe',cat:'misc',w:34,h:10,f(g){g.fillStyle='#16111c';g.fillRect(-15,-3,26,6);g.fillStyle='#e8f0f8';g.fillRect(-14,-2,24,4);g.fillStyle='#e8a040';g.fillRect(-10,-2,10,4);g.fillStyle='#a8b0ba';g.fillRect(10,-1,7,2);g.fillStyle='#16111c';g.fillRect(-17,-4,3,8)}});
cmAddDec({id:'ivbag',n:'IV bag (burst)',cat:'misc',w:40,h:34,f(g,v){g.fillStyle='rgba(200,225,240,.35)';g.beginPath();g.ellipse(4,6,18,10,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(-10,-14,18,24);g.fillStyle='#dcecf4';g.fillRect(-9,-13,16,22);g.fillStyle='#fff';g.fillRect(-7,-10,8,6);g.strokeStyle='#c8d8e0';g.lineWidth=1;g.beginPath();g.moveTo(-1,10);g.quadraticCurveTo(8,18,16,10);g.stroke()}});
cmAddDec({id:'clipb',n:'Clipboard (patient chart)',cat:'misc',w:26,h:32,f(g){g.fillStyle='#16111c';g.fillRect(-11,-14,22,28);g.fillStyle='#a87a4a';g.fillRect(-10,-13,20,26);g.fillStyle='#f4f4ee';g.fillRect(-8,-10,16,21);g.fillStyle='#8a8f96';g.fillRect(-4,-15,8,4);g.fillStyle='#9aa0a8';for(let k=-6;k<9;k+=3)g.fillRect(-6,k,12,1)}});
// ----- hospital walls: painted plaster with a coloured bumper rail along them (c: the rail) -----
cmAddWall({id:'hwall',n:'Hospital wall (painted, with a rail)',fl:0,pal:[['#5aa0c8','Blue rail'],['#5ab088','Green rail'],['#c86a5a','Red rail'],['#a88ad0','Purple rail'],['#c8b070','Gold rail'],['#9aa0a8','Grey rail']],f(g,x,y,w,h,c){kwOut(g,x,y,w,h);const hz=kwH(w,h);g.fillStyle='#c8ccd2';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#e8eaee';hz?g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(1,Math.round(h*.4))):g.fillRect(x+1,y+1,Math.max(1,Math.round(w*.4)),Math.max(0,h-2));
 g.fillStyle=c||'#5aa0c8';hz?g.fillRect(x+1,y+h-3,Math.max(0,w-2),2):g.fillRect(x+w-3,y+1,2,Math.max(0,h-2))}});
// ----- a broken-out window zombies climb through (walkable): the frame, shards of glass left in it -----
cmAddWall({id:'winbroke',n:'Broken-out window (walk through)',fl:0,walk:1,f(g,x,y,w,h){const hz=kwH(w,h);g.fillStyle='#16111c';g.fillRect(x,y,w,h);g.fillStyle='#2a2a30';g.fillRect(x+1,y+1,Math.max(0,w-2),Math.max(0,h-2));g.fillStyle='#8a8f96';hz?(g.fillRect(x,y,3,h),g.fillRect(x+w-3,y,3,h)):(g.fillRect(x,y,w,3),g.fillRect(x,y+h-3,w,3));
 g.fillStyle='#bcd8ee';const L=hz?w:h;for(let k=4;k<L-4;k+=7){const a=(k*13)%9;if(a<4)continue;hz?g.fillRect(x+k,y+(a%2?0:h-3),2,3):g.fillRect(x+(a%2?0:w-3),y+k,3,2)}}});
// ----- the city far below a rooftop (nobody walks there): dark blocks, street lights in rows, fires, a few cars still moving -----
function arBelow(g,o){const{x,y,w,h}=o;g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle='#07080c';g.fillRect(x,y,w,h);const S=56;g.fillStyle='#111319';for(let k=Math.floor(x/S)*S;k<x+w;k+=S)g.fillRect(k,y,10,h);for(let k=Math.floor(y/S)*S;k<y+h;k+=S)g.fillRect(x,k,w,10);
 for(let i=0;i<w*h/900;i++){const px=x+cmH(i,o.x,31)*w,py=y+cmH(i,o.y,32)*h;g.fillStyle=cmH(i,1,33)<.7?'rgba(255,214,140,.55)':'rgba(180,210,255,.45)';g.fillRect(Math.round(px),Math.round(py),1,1)}
 for(let k=Math.floor(x/S)*S;k<x+w;k+=S)for(let j=Math.floor(y/S)*S;j<y+h;j+=S*2){if(cmH(k,j,34)<.5)continue;g.fillStyle='rgba(255,200,120,.7)';g.fillRect(k+4,j+4,2,2)}g.restore()}
function arBelowAn(o,t){const{x,y,w,h}=o,S=56,ph=cmR(o,0,35)*9;X.save();X.beginPath();X.rect(x,y,w,h);X.clip();
 for(let i=0;i<6;i++){const hz=i%2==0,u=((t*.05+i*.17+ph)%1),lane=Math.floor(cmH(i,o.x,36)*(hz?h:w)/S)*S+5;const px=hz?x+u*w:(Math.floor(x/S)*S+lane),py=hz?(Math.floor(y/S)*S+lane):y+u*h;if(px<x||px>x+w||py<y||py>y+h)continue;X.fillStyle='#fff6d0';X.fillRect(Math.round(px),Math.round(py),2,1);X.fillStyle='#ff4030';X.fillRect(Math.round(px)-(hz?3:0),Math.round(py)-(hz?0:3),1,1)}
 for(let i=0;i<2;i++){const fx_=x+cmH(i,o.x,37)*w,fy=y+cmH(i,o.y,38)*h,f=.6+.4*Math.sin(t*9+i*3)*Math.sin(t*5.3+i);X.fillStyle='rgba(255,120,40,'+(.25*f).toFixed(3)+')';X.beginPath();X.arc(fx_,fy,10+4*f,0,7);X.fill();X.fillStyle='rgba(255,200,90,'+(.6*f).toFixed(3)+')';X.fillRect(Math.round(fx_)-1,Math.round(fy)-1,3,3)}X.restore()}
cmAddArea({id:'below',n:'The city far below (from a roof)',cat:'effect',fl:1,min:[32,32],pri:-120,f:arBelow,anim:arBelowAn});
