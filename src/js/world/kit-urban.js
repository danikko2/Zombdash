//# world/kit-urban.js — Urban Outskirts' kit pieces: the freeway overpass (a deck on two rows of pillars that hangs over people and opens up around anyone under it), a drained swimming pool you walk down into, an overgrown vacant lot, and decals (trash piles, an oil sheen, a cardboard bed, loose boards, a hubcap, beer cans)
// ---------- Urban Outskirts' pieces ----------
const UBK={o:'#16111c',cn:'#a8a49a',cnl:'#c4c0b4',cnd:'#86827a',cndd:'#64605a',as:'#4a4b50',asl:'#56575c',asd:'#3c3d42',w:'#e4e2d8',y:'#d8a830'};
// ----- the freeway overpass -----
// the box is the deck; it runs along its long side. Pillars stand in two rows under it (solid), `pil` px apart.
function ubOvG(o){const v=o.h>o.w,L=v?o.h:o.w,S=v?o.w:o.h,sp=cl(+ao(o,'pil',320)||320,160,900),P=[];for(let u=sp/2;u<L-20;u+=sp)for(const s of[S*.24,S*.76])P.push([u,s]);return{v,L,S,P,pa:38,pc:28}}
function ubOvW(o,G,u,s){return G.v?[o.x+s,o.y+u]:[o.x+u,o.y+s]}
function ubTag(g,x,y,c,k,s){g.strokeStyle=c;g.lineWidth=2*(s||1);g.lineCap='round';g.beginPath();g.moveTo(x,y);for(let i=1;i<6;i++)g.lineTo(x+i*4*(s||1),y+((i+k)%3-1)*3*(s||1));g.stroke();g.lineCap='butt'}
const UBTAG=['#d8403a','#3aa8e8','#e8c030','#8a5ab8','#3aa06a','#f088b8','#f4f4f0'];
// a pillar seen from above, its foot on the ground (the deck hides its top in the game)
function ubPillar(g,cx,cy,v,r){const a=v?28:38,c=v?38:28,x=cx-a/2,y=cy-c/2;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-3,y+2,a+8,c+6);g.fillStyle=UBK.cndd;g.fillRect(x-4,y-3,a+8,c+8);g.fillStyle=UBK.o;g.fillRect(x-1,y-1,a+2,c+2);
 g.fillStyle=UBK.cnd;g.fillRect(x,y,a,c);g.fillStyle=UBK.cn;g.fillRect(x,y,a,c-8);g.fillStyle=UBK.cnl;g.fillRect(x,y,3,c-8);g.fillStyle=UBK.cndd;g.fillRect(x+a-4,y,4,c);g.fillStyle='rgba(0,0,0,.14)';for(let k=0;k<3;k++)g.fillRect(x+5+k*11+r*6,y,2,c-4);
 ubTag(g,x+4+r*6,y+c-4,UBTAG[Math.floor(r*99)%UBTAG.length],Math.floor(r*7),.8);if(r>.5)ubTag(g,x+12,y+c-10,UBTAG[Math.floor(r*57)%UBTAG.length],2,.7)}
function arOverpass(g,o){const G=ubOvG(o),{x,y,w,h}=o;
 // in the deck's shade, darker toward the middle, and the low sun throws its shadow past the south (or west) side
 g.fillStyle='rgba(10,12,22,.26)';g.fillRect(x,y,w,h);if(G.v)g.fillRect(x+w*.15,y,w*.7,h);else g.fillRect(x,y+h*.15,w,h*.7);
 for(let k=0;k<5;k++){g.fillStyle='rgba(10,12,22,'+(.16-k*.03).toFixed(2)+')';if(G.v)g.fillRect(x-(k+1)*7,y,7,h);else g.fillRect(x,y+h+k*7,w,7)}
 // drip lines under the deck's joints, puddles, pigeon droppings, litter blown in
 const n=Math.floor(G.L/90);for(let i=0;i<n;i++){const u=cmR(o,i,1)*G.L,s=cmR(o,i,2)*G.S,[px,py]=ubOvW(o,G,u,s),r=cmR(o,i,3);
  if(r<.25){g.fillStyle='rgba(40,46,58,.45)';g.beginPath();g.ellipse(px,py,10+r*40,5+r*14,0,0,7);g.fill();g.fillStyle='rgba(180,170,150,.18)';g.fillRect(px-6,py-2,10,1)}
  else if(r<.6){g.fillStyle='rgba(235,235,225,.5)';for(let k=0;k<5;k++)g.fillRect(px+cmR(o,i,k+10)*20-10,py+cmR(o,i,k+20)*12-6,2,2)}
  else{g.fillStyle=['#c8c0a8','#8a8478','#a83a2a','#3a6aa8'][i%4];g.fillRect(px,py,4+r*4,3)}}
 for(let u=300;u<G.L;u+=300){const[a,b]=ubOvW(o,G,u,0);g.fillStyle='rgba(20,22,30,.18)';if(G.v)g.fillRect(x,b-5,w,10);else g.fillRect(a-5,y,10,h)}
 for(const p of G.P){const[cx,cy]=ubOvW(o,G,p[0],p[1]);ubPillar(g,cx,cy,G.v,cmR(o,Math.round(p[0]+p[1]),5))}
 if(!CMGP){const e=ubDeck(o);g.drawImage(e.cv,x,y)}}
function arOverpassColl(o,out){const G=ubOvG(o);for(const p of G.P){const[cx,cy]=ubOvW(o,G,p[0],p[1]),a=G.v?28:38,c=G.v?38:28;out.push([cx-a/2-2,cy-c/2-2,a+4,c+4,1])}}
// the deck from above: parapets, the fascia on its near side, two carriageways and a median barrier, lane lines, expansion joints,
// light poles, patches, and the cars left in the lanes the morning it all went wrong
const UBOV=new WeakMap();
function ubDeck(o){const key=[o.w,o.h,JSON.stringify(o.o||{})].join();let e=UBOV.get(o);if(e&&e.k===key)return e;const G=ubOvG(o),L=Math.ceil(G.L),S=Math.ceil(G.S),c=document.createElement('canvas');c.width=L;c.height=S;ubDeckArt(c.getContext('2d'),o,G,L,S);
 let cv=c;if(G.v){cv=document.createElement('canvas');cv.width=S;cv.height=L;const r=cv.getContext('2d');r.translate(S,0);r.rotate(Math.PI/2);r.drawImage(c,0,0)}e={k:key,cv,A:new Float32Array(Math.ceil(L/48)+1).fill(1),Z:new Float32Array(Math.ceil(L/48)+1),t:0};UBOV.set(o,e);return e}
function ubDeckArt(q,o,G,L,S){const R=(c,x,y,w,h)=>{q.fillStyle=c;q.fillRect(x,y,w,h)},pt=12,fs=14,md=10,y0=pt,y1=S-pt-fs,mid=(y0+y1)/2,ln=cl(+ao(o,'lanes',2)||2,1,4);
 R(UBK.as,0,y0,L,y1-y0);for(let i=0;i<L*S/60;i++){const x=cmR(o,i,30)*L,y=y0+cmR(o,i,31)*(y1-y0);R(i%3?'rgba(0,0,0,.12)':'rgba(255,255,255,.05)',x,y,2+i%3,2)}
 // wheel tracks, patches, oil stains
 for(let c=0;c<2;c++)for(let k=0;k<ln;k++){const a=c?mid+md/2:y0,b=c?y1:mid-md/2,lw=(b-a)/ln,cy=a+lw*(k+.5);R('rgba(0,0,0,.08)',0,cy-lw*.3,L,4);R('rgba(0,0,0,.08)',0,cy+lw*.3-4,L,4)}
 for(let i=0;i<L/140;i++){const x=cmR(o,i,32)*L,y=y0+6+cmR(o,i,33)*(y1-y0-12),r=cmR(o,i,34);if(r<.4){R(UBK.asd,x,y,20+r*60,10+r*20);R('rgba(255,255,255,.04)',x,y,20+r*60,1)}else if(r<.7){q.fillStyle='rgba(10,10,14,.35)';q.beginPath();q.ellipse(x,y,6+r*8,3+r*3,0,0,7);q.fill()}else{q.strokeStyle='rgba(10,10,14,.5)';q.lineWidth=1;q.beginPath();q.moveTo(x,y);for(let k=1;k<5;k++)q.lineTo(x+k*7,y+(cmR(o,i,40+k)-.5)*8);q.stroke()}}
 // lane lines: white dashes between lanes, yellow by the median, white along the parapets (worn)
 for(let c=0;c<2;c++){const a=c?mid+md/2:y0,b=c?y1:mid-md/2,lw=(b-a)/ln;R(c?UBK.y:UBK.w,0,c?a+3:a+3,L,2);R(c?UBK.w:UBK.y,0,b-5,L,2);for(let k=1;k<ln;k++)for(let x=(k*37)%60;x<L;x+=60)if(cmH(x,k+c*9,35)>.12)R('rgba(228,226,216,.8)',x,a+lw*k-1,28,2)}
 // the median barrier and the parapets
 const bar=(y,h,top)=>{R(UBK.o,0,y,L,h);R(UBK.cnd,0,y+1,L,h-2);R(UBK.cn,0,y+1,L,(h-2)*.6);R(UBK.cnl,0,y+1,L,2);for(let x=0;x<L;x+=40)R('rgba(0,0,0,.18)',x,y+1,1,h-2);if(top)R('rgba(0,0,0,.25)',0,y+h,L,3)};
 bar(mid-md/2,md,1);bar(0,pt,1);bar(y1,pt,0);
 // the fascia: the deck's near side seen from the street, with drip stains and tags
 R(UBK.o,0,S-fs,L,fs);R(UBK.cndd,0,S-fs+1,L,fs-2);R(UBK.cnd,0,S-fs+1,L,4);for(let x=0;x<L;x+=6+Math.floor(cmH(x,1,36)*16)){R('rgba(20,24,20,.3)',x,S-fs+4,2,4+cmH(x,2,37)*(fs-6))}
 for(let i=0;i<L/260;i++){const x=40+cmR(o,i,38)*(L-120);ubTag(q,x,S-fs/2,UBTAG[i%UBTAG.length],i,1.1);if(cmR(o,i,39)<.4)ubTag(q,x+30,S-fs/2+2,UBTAG[(i+3)%UBTAG.length],i+1,.9)}
 // expansion joints
 for(let x=300;x<L;x+=300){R('#2a2b30',x-2,y0,4,y1-y0);R('#7a7c84',x-1,y0,1,y1-y0)}
 // light poles on the median, their arms out over both carriageways
 for(let x=150;x<L;x+=600){R(UBK.o,x-4,mid-4,8,8);R('#6a6e76',x-3,mid-3,6,6);for(const d of[-1,1]){const e=mid+d*(mid-y0)*.55;R('#5a5e66',x-1,Math.min(mid,e),3,Math.abs(e-mid));R(UBK.o,x-6,e-3,12,6);R('#c8ccd2',x-5,e-2,10,4)}}
 // the jam: cars left where they stopped, some crashed, doors open, one burned
 if(ao(o,'cars',1)&&typeof hwDraw=='function'&&typeof HWV=='function'){const K=['sedan','suv','hatch','pickup','van','sedan','semi'],C=['#8a8f96','#c0392b','#2f4a7a','#d8d8d4','#26262c','#7a6a4a','#3a6a4a','#a8a49a'];
  for(let i=0;i<L/170;i++){if(cmR(o,i,50)<.35)continue;const c=cmR(o,i,51)<.5?0:1,a=c?mid+md/2:y0,b=c?y1:mid-md/2,lw=(b-a)/ln,k=Math.floor(cmR(o,i,52)*ln),x=60+i*170+cmR(o,i,53)*80;if(x>L-60)break;
   const kk=K[Math.floor(cmR(o,i,54)*K.length)],s=HWV(kk);if(!s)continue;if(s[0]>lw*5&&cmR(o,i,58)<.5)continue;const ang=(c?0:Math.PI)+(cmR(o,i,55)-.5)*(cmR(o,i,56)<.25?1.1:.12);
   try{hwDraw(q,{k:kk,x,y:a+lw*(k+.5),a:ang,L:s[0],W:s[1],c:C[Math.floor(cmR(o,i,57)*C.length)],dmg:cmR(o,i,59)<.35?1:0,burn:cmR(o,i,60)<.08?1:0})}catch(e){}
   if(cmR(o,i,61)<.4){q.fillStyle='rgba(200,220,230,.6)';for(let k2=0;k2<8;k2++)q.fillRect(x+(cmR(o,i,70+k2)-.5)*60,a+lw*(k+.5)+(cmR(o,i,80+k2)-.5)*30,2,2)}}}}
// over people: the deck, opening up around a player under it (and a zombie under it shows through)
function arOverpassTop(o,t){const e=ubDeck(o),G=ubOvG(o),dt=Math.min(.1,Math.max(0,t-(e.t||t)));e.t=t;const seg=48,n=e.A.length;
 let u0=0,u1=G.L;if(typeof cam!='undefined'){if(G.v){if(o.x>cam.x+W||o.x+o.w<cam.x)return;u0=cam.y-o.y;u1=u0+H}else{if(o.y>cam.y+H||o.y+o.h<cam.y)return;u0=cam.x-o.x;u1=u0+W}}
 const i0=Math.max(0,Math.floor(u0/seg)-2),i1=Math.min(n-1,Math.ceil(u1/seg)+2);e.Z.fill(1,i0,i1+1);
 if(typeof zs!='undefined')for(const z of zs){if(!(z.hp>0))continue;const zu=G.v?z.y-o.y:z.x-o.x,zv=G.v?z.x-o.x:z.y-o.y;if(zv<0||zv>G.S||zu<0||zu>G.L)continue;const k=Math.floor(zu/seg);for(let j=k-1;j<=k+1;j++)if(j>=i0&&j<=i1)e.Z[j]=Math.min(e.Z[j],.45)}
 const pl=typeof PL!='undefined'&&PL.length?PL:typeof P!='undefined'&&P?[P]:[];
 for(let i=i0;i<=i1;i++){let to=e.Z[i];const uc=(i+.5)*seg;for(const p of pl){if(!p||(typeof alive=='function'&&!alive(p)))continue;const pu=G.v?p.y-o.y:p.x-o.x,ps=G.v?p.x-o.x:p.y-o.y;if(ps<-60||ps>G.S+60)continue;const inS=ps>-6&&ps<G.S+6,d=Math.abs(pu-uc);
   to=Math.min(to,inS?(d<150?.14:d<320?.14+.86*(d-150)/170:1):(d<220?.62:1))}
  e.A[i]+=(to-e.A[i])*Math.min(1,dt*6);const a=e.A[i],u=i*seg,len=Math.min(seg,G.L-u);if(a<.02||len<=0)continue;X.globalAlpha=a;
  if(G.v)X.drawImage(e.cv,0,u,G.S,len,o.x,o.y+u,G.S,len);else X.drawImage(e.cv,u,0,len,G.S,o.x+u,o.y,len,G.S)}X.globalAlpha=1}
cmAddArea({id:'overpass',n:'Freeway overpass (over people)',cat:'build',fl:1,def:{o:{pil:320,lanes:2,cars:1}},opts:[['pil','Pillars every',[160,900]],['lanes','Lanes each way',[1,4]],['cars','Abandoned cars on it','chk']],min:[200,120],pri:-20,f:arOverpass,coll:arOverpassColl,top:arOverpassTop});
// ----- a drained swimming pool you can walk down into -----
function arDryPool(g,o){const{x,y,w,h}=o,v=h>w,L=v?h:w,cp=10,ix=x+cp,iy=y+cp,iw=w-cp*2,ih=h-cp*2,R=(c,a,b,c2,d)=>{g.fillStyle=c;g.fillRect(a,b,c2,d)};
 // the coping: worn stone slabs
 R(UBK.o,x-1,y-1,w+2,h+2);R('#c8c2b2',x,y,w,h);for(let k=0;k<w;k+=24)R('#a8a294',x+k,y,1,cp),R('#a8a294',x+k,y+h-cp,1,cp);for(let k=0;k<h;k+=24)R('#a8a294',x,y+k,cp,1),R('#a8a294',x+w-cp,y+k,cp,1);R('#d8d2c4',x,y,w,2);
 // the inside: pale plaster, shallow end to deep end, stained
 const B=['#b4c4c8','#a8b8be','#9cacb4','#90a0aa','#8494a0','#7a8a96'],n=B.length;for(let i=0;i<n;i++){g.fillStyle=B[i];if(v)g.fillRect(ix,iy+ih*i/n,iw,ih/n+1);else g.fillRect(ix+iw*i/n,iy,iw/n+1,ih)}
 // the far wall's face and its tile band (3/4 view)
 R('#5a7a8a',ix,iy,iw,12);R('#2f6a9a',ix,iy,iw,5);for(let k=0;k<iw;k+=6)R(k%12?'#3a8ab8':'#e8e4dc',ix+k,iy+1,4,3);R('rgba(0,0,0,.25)',ix,iy+12,iw,3);R('rgba(0,0,0,.18)',ix,iy,4,ih);R('rgba(255,255,255,.12)',ix+iw-3,iy,3,ih);
 // the lane line, algae, rust, cracks, tags, leaves, a drain and a puddle of green water at the deep end
 if(v)R('#3a5a7a',ix+iw/2-3,iy+20,6,ih-40);else R('#3a5a7a',ix+20,iy+ih/2-3,iw-40,6);
 for(let i=0;i<w*h/900;i++){const px=ix+cmR(o,i,1)*iw,py=iy+14+cmR(o,i,2)*(ih-16),r=cmR(o,i,3);g.fillStyle=r<.3?'rgba(70,110,50,.35)':r<.5?'rgba(140,80,40,.3)':r<.7?'rgba(30,30,30,.25)':'rgba(255,255,255,.12)';g.beginPath();g.ellipse(px,py,3+r*14,2+r*6,r*6,0,7);g.fill()}
 for(let i=0;i<4;i++){const px=ix+10+cmR(o,i,5)*(iw-60),py=iy+18+cmR(o,i,6)*(ih-40);ubTag(g,px,py,UBTAG[(i*3+1)%UBTAG.length],i,1.6)}
 const dx=v?ix+iw/2:ix+iw-36,dy=v?iy+ih-36:iy+ih/2;if(ao(o,'water',1)){g.fillStyle='#3a4a26';g.beginPath();g.ellipse(dx,dy,v?iw*.36:34,v?30:ih*.32,0,0,7);g.fill();g.fillStyle='#4e6a2e';g.beginPath();g.ellipse(dx-2,dy-2,v?iw*.32:30,v?26:ih*.28,0,0,7);g.fill();g.fillStyle='rgba(200,220,150,.35)';g.fillRect(dx-10,dy-6,14,2)}
 R(UBK.o,dx-6,dy-6,12,12);R('#5a5e66',dx-5,dy-5,10,10);for(let k=-4;k<5;k+=3)R(UBK.o,dx-4,dy+k,8,1);
 for(let i=0;i<w*h/500;i++){const px=ix+cmR(o,i,7)*iw,py=iy+12+cmR(o,i,8)*(ih-14);g.fillStyle=['#8a5a2a','#a8742e','#6a4a22','#b8883a'][i%4];g.fillRect(px,py,3,2);g.fillRect(px+1,py-1,1,1)}
 // the ladder at the shallow end
 const lx=v?ix+iw-26:ix+8,ly=v?iy+4:iy+ih-34;for(const k of[0,14]){R(UBK.o,lx+k-1,ly-cp-2,5,28);R('#c8ccd4',lx+k,ly-cp-2,3,26)}for(let k=0;k<3;k++)R('#8a8f96',lx,ly+k*7,16,2)}
cmAddArea({id:'drypool',n:'Drained pool (walk down into it)',cat:'ground',fl:null,def:{o:{water:1}},opts:[['water','Green puddle at the deep end','chk']],min:[60,40],pri:-48,f:arDryPool});
// ----- an overgrown vacant lot -----
function ubTuft(g,x,y,s,r,k){const C=['#6e7e34','#8a9040','#5a6a2a','#a8a050','#7a7a36','#94884a'],n=4+Math.floor(r*5);g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+2,y+1,6*s,2.5*s,0,0,7);g.fill();g.lineWidth=1.4;
 for(let i=0;i<n;i++){const a=-Math.PI/2+(cmH(x,i,k)-.5)*1.3,l=(8+cmH(y,i,k+1)*12)*s;g.strokeStyle=C[(i+Math.floor(r*9))%C.length];g.beginPath();g.moveTo(x+(i-n/2)*1.2,y);g.quadraticCurveTo(x+Math.cos(a)*l*.4,y+Math.sin(a)*l*.6,x+Math.cos(a)*l+(i-n/2),y+Math.sin(a)*l);g.stroke()}
 if(r>.82){g.fillStyle=r>.92?'#e8c030':'#a868b8';g.fillRect(x-2,y-14*s,3,3);g.fillRect(x+4,y-11*s,2,2)}else if(r<.08){g.strokeStyle='#8a6a3a';g.beginPath();g.moveTo(x,y);g.lineTo(x+3,y-22*s);g.stroke();g.fillStyle='#a8844a';g.fillRect(x+1,y-25*s,4,4)}}
function arWeeds(g,o){const{x,y,w,h}=o,d=cl(+ao(o,'d',1)||1,.3,2),edge=(px,py)=>Math.min(px-x,x+w-px,py-y,y+h-py)/(26+cmH(px*.05|0,py*.05|0,9)*30);
 // patchy dry ground: blotches of straw, dirt and green
 for(let i=0;i<w*h/1600;i++){const px=x+cmR(o,i,1)*w,py=y+cmR(o,i,2)*h,e=edge(px,py);if(e<.3)continue;const r=cmR(o,i,3);g.fillStyle=r<.35?'rgba(140,124,72,.4)':r<.6?'rgba(110,84,52,.38)':r<.85?'rgba(86,96,46,.42)':'rgba(170,150,100,.3)';g.beginPath();g.ellipse(px,py,12+r*30,6+r*14,r*5,0,7);g.fill()}
 // weeds, thicker away from the edges, with thistles, dandelions and dead stalks
 const T=[];const m=Math.floor(w*h/260*d);for(let i=0;i<m;i++){const px=x+cmR(o,i,4)*w,py=y+cmR(o,i,5)*h,e=edge(px,py);if(e<cmR(o,i,6))continue;T.push([px,py,cmR(o,i,7)])}T.sort((a,b)=>a[1]-b[1]);for(const t of T)ubTuft(g,t[0],t[1],.8+t[2]*.6,t[2],11);
 if(ao(o,'lit',1))for(let i=0;i<w*h/2400;i++){const px=x+cmR(o,i,8)*w,py=y+cmR(o,i,9)*h,r=cmR(o,i,10);if(edge(px,py)<.4)continue;if(r<.4){g.fillStyle='#e8e4d4';g.fillRect(px,py,5,4);g.fillStyle='#b8b4a4';g.fillRect(px+1,py+1,3,1)}else if(r<.7){g.fillStyle=['#c0392b','#2f6fd0','#c8a040','#3a8a3a'][i%4];g.fillRect(px,py,4,2);g.fillStyle='#d8d8d0';g.fillRect(px,py,1,2)}else{g.fillStyle='rgba(60,90,60,.8)';g.fillRect(px,py,2,5);g.fillStyle='rgba(200,230,200,.5)';g.fillRect(px,py,1,2)}}}
cmAddArea({id:'weeds',n:'Overgrown lot (tall weeds)',cat:'ground',fl:null,def:{o:{d:1,lit:1}},opts:[['d','Thickness',[.3,2]],['lit','Litter in it','chk']],min:[40,40],pri:-58,f:arWeeds});
// ----- decals -----
cmAddDec({id:'trashpile',n:'Pile of trash',cat:'misc',w:70,h:44,f(g,v){g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(2,4,32,14,0,0,7);g.fill();const n=10+Math.floor(v*10);for(let i=0;i<n;i++){const x=-28+dcH(v,i,1)*56,y=-14+dcH(v,i,2)*28,r=dcH(v,i,3);
 if(r<.3){g.fillStyle='#16111c';g.beginPath();g.ellipse(x,y,7,5,0,0,7);g.fill();g.fillStyle=['#2a2a30','#3a4a2a','#5a5a62'][i%3];g.beginPath();g.ellipse(x,y-1,6,4,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x-3,y-3,3,1)}
 else if(r<.55){g.fillStyle='#e8e4d4';g.fillRect(x,y,6,4);g.fillStyle='#b8b4a4';g.fillRect(x+1,y+1,4,1)}else if(r<.75){g.fillStyle='#16111c';g.fillRect(x-1,y-1,10,7);g.fillStyle='#a8844a';g.fillRect(x,y,8,5);g.fillStyle='#c8a46a';g.fillRect(x,y,8,1)}
 else{g.fillStyle=['#c0392b','#2f6fd0','#d8a830','#3a8a3a','#e8e8e0'][i%5];g.fillRect(x,y,4,2);g.fillStyle='#d8d8d0';g.fillRect(x,y,1,2)}}}});
cmAddDec({id:'oilsheen',n:'Oil sheen on a puddle',cat:'wear',w:60,h:30,f(g,v){g.fillStyle='rgba(20,22,30,.55)';g.beginPath();g.ellipse(0,0,28,12,0,0,7);g.fill();const C=['rgba(200,90,200,.35)','rgba(80,200,220,.35)','rgba(230,210,80,.32)','rgba(90,220,120,.3)'];
 for(let i=0;i<4;i++){g.strokeStyle=C[(i+Math.floor(v*4))%4];g.lineWidth=2;g.beginPath();g.ellipse((dcH(v,i,1)-.5)*10,(dcH(v,i,2)-.5)*4,20-i*4,8-i*1.6,.1,0,5.4);g.stroke()}g.fillStyle='rgba(255,240,210,.35)';g.fillRect(-12,-5,10,1)}});
cmAddDec({id:'cardbed',n:'Cardboard bed with a blanket',cat:'misc',w:70,h:40,pal:[['#6a4a8a','Purple'],['#3a5a8a','Blue'],['#8a3a3a','Red'],['#4a6a3a','Green'],['#7a6a52','Brown']],f(g,v,K){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-31,-15,66,34);
 g.fillStyle='#16111c';g.fillRect(-33,-17,66,34);g.fillStyle='#a8844a';g.fillRect(-32,-16,64,32);g.fillStyle='#c09a5e';g.fillRect(-32,-16,30,32);g.fillStyle='#8a6a3a';g.fillRect(-2,-16,2,32);g.fillStyle='#6a5030';g.fillRect(-26,-6,10,1);
 g.fillStyle=K.dd;g.beginPath();g.moveTo(-12,-14);g.lineTo(30,-12);g.lineTo(28,15);g.lineTo(-16,14);g.closePath();g.fill();g.fillStyle=K.b;g.beginPath();g.moveTo(-10,-13);g.lineTo(28,-11);g.lineTo(26,12);g.lineTo(-14,12);g.closePath();g.fill();g.fillStyle=K.l;g.fillRect(-8,-8,30,2);g.fillRect(-10,2,34,2);
 g.fillStyle='#e8e4dc';g.beginPath();g.ellipse(-22,0,8,6,0,0,7);g.fill();g.fillStyle='#c8c4bc';g.fillRect(-28,1,12,2);if(v>.5){g.fillStyle='#3a6a9a';g.fillRect(24,-18,8,5);g.fillStyle='#e8e4dc';g.fillRect(25,-17,3,3)}}});
cmAddDec({id:'boards',n:'Loose boards and plywood',cat:'misc',w:80,h:40,f(g,v){for(let i=0;i<3+Math.floor(v*3);i++){g.save();g.translate(-20+dcH(v,i,1)*40,-8+dcH(v,i,2)*16);g.rotate((dcH(v,i,3)-.5)*1.6);const ply=dcH(v,i,4)<.4,w=ply?34:46,h=ply?22:7;
 g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-w/2+2,-h/2+2,w,h);g.fillStyle='#16111c';g.fillRect(-w/2-1,-h/2-1,w+2,h+2);g.fillStyle=ply?'#c8a46a':'#9a7448';g.fillRect(-w/2,-h/2,w,h);g.fillStyle=ply?'#d8b87e':'#b08a58';g.fillRect(-w/2,-h/2,w,1);if(ply){g.fillStyle='rgba(120,90,50,.4)';g.fillRect(-w/2+4,-2,w-8,1);g.fillRect(-w/2+6,4,w-14,1)}
 g.fillStyle='#5a5e66';g.fillRect(-w/2+3,-1,1,1);g.fillRect(w/2-4,-1,1,1);g.restore()}}});
cmAddDec({id:'hubcap',n:'Hubcap',cat:'crash',w:22,h:16,f(g,v){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(1,2,9,6,0,0,7);g.fill();g.fillStyle='#16111c';g.beginPath();g.ellipse(0,0,9,6,0,0,7);g.fill();g.fillStyle='#b8bcc4';g.beginPath();g.ellipse(0,0,8,5,0,0,7);g.fill();g.fillStyle='#8a8e96';g.beginPath();g.ellipse(0,0,4,2.5,0,0,7);g.fill();g.fillStyle='#e8ecf0';g.fillRect(-5,-3,4,1)}});
cmAddDec({id:'cans',n:'Beer cans',cat:'misc',w:40,h:24,f(g,v){for(let i=0;i<3+Math.floor(v*5);i++){const x=-14+dcH(v,i,1)*28,y=-8+dcH(v,i,2)*16,a=dcH(v,i,3)*3;g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#16111c';g.fillRect(-4,-2.5,9,5);g.fillStyle=['#c8ccd4','#c0392b','#2f6fd0','#d8a830'][i%4];g.fillRect(-3,-1.5,7,3);g.fillStyle='#e8ecf0';g.fillRect(-3,-1.5,7,1);g.fillStyle='#8a8e96';g.fillRect(3,-1.5,1,3);g.restore()}}});
