//# maps/props/kit-props.js — Building kit props: things the built-in maps draw with map code, as real props for custom maps (signs with your own text, billboards, awnings, store / aisle / department signs, name plates, price and street signs, arches; portraits whose eyes follow you, a fallen chandelier, twisted dead trees, canopy trees, black pines; fighter jets and wrecks, shipping containers, boom gates, a campfire ring, coffins and open graves; office, school and bathroom pieces; rooftop units, water tanks, fire escapes; and a few street pieces)
// ---------- kit props ----------
// obt() is obc() for a prop that also takes text (t, up to txt characters; def is shown when the text is empty).
// wb:1 puts a prop on the walk-behind list (people standing behind it are drawn behind it).
const obt=(w,h,c,pal,txt,def,fn)=>({w,h,c,pc:pal||undefined,txt,dt:def,f:(g,x,y,v,col,t)=>S2(g,x,y,w,h,q=>fn(q,v,pal?pcK(pcCol(col,pal)):null,cmTxt(t,txt)||def))});
function kpFit(q,t,max,px,font){let s=px;q.font='bold '+s+'px '+(font||'Arial, Helvetica, sans-serif');while(s>6&&q.measureText(t).width>max){s--;q.font='bold '+s+'px '+(font||'Arial, Helvetica, sans-serif')}return s}
function kpText(q,t,x,y,max,px,col,font,sh){kpFit(q,t,max,px,font);q.textAlign='center';q.textBaseline='middle';if(sh){q.fillStyle=sh;q.fillText(t,x+1,y+1)}q.fillStyle=col;q.fillText(t,x,y);q.textAlign='left';q.textBaseline='alphabetic'}
function kpLines(t){const L=String(t).split('|');return[L[0]||'',L.slice(1).join(' ')]}
const PKSIGN=[['#5a3a22','Wood'],['#1d7a3e','Green'],['#2a4a7a','Blue'],['#6a1a1a','Red'],['#26262c','Black']];
const PKBOARD=[['#c0392b','Red'],['#2f6fd0','Blue'],['#3f8a42','Green'],['#e0b030','Yellow'],['#26262c','Black'],['#e8e4d8','White'],['#d86a2a','Orange'],['#6a3a8a','Purple']];
const PKAWN=[['#c0392b','Red'],['#2f6fd0','Blue'],['#2f8a4a','Green'],['#e07a1a','Orange'],['#8a3aaa','Purple'],['#6a4022','Brown'],['#2a4a7a','Navy'],['#e86aa0','Pink']];
const PKCONT=[['#b8392b','Red'],['#2f5fa0','Blue'],['#3f7a3a','Green'],['#d07a2a','Orange'],['#8a8f96','Grey'],['#d8d8d0','White'],['#7a5a3a','Rust']];
const PKTREE=[['#2a4e48','Spooky teal'],['#3e3058','Spooky violet'],['#448e36','Park green'],['#5a9a32','Light green'],['#c8762a','Autumn orange'],['#a8342c','Autumn red'],['#2f6a3a','Dark green']];
const PKJET=[['#7a828c','Grey'],['#6a7480','Blue grey'],['#5f6650','Olive'],['#a8adb5','Silver']];
const PKPORT=[['#4a1a2a','Lady'],['#1a1a22','Gentleman'],['#e8e8e4','Bride'],['#a8b0a0','Ghoul'],['#2a2a3a','Landscape'],['#5a1a1a','Slashed']];
const PKLOCK=[['#4a6a8a','Blue'],['#7c828c','Grey'],['#a8423a','Red'],['#3f7a4a','Green'],['#c8a040','Yellow']];
const PKPOST=[['#c0392b','Red'],['#2f6fd0','Blue'],['#3f8a42','Green'],['#e0b030','Yellow'],['#8a3aaa','Purple']];
// portrait kind from its colour, and where its eyes are (world space) for the follow-the-player animation
function kpPortK(c){const i=PKPORT.findIndex(p=>p[0]==c);return i<0?0:i}
function kpEyes(o){const k=kpPortK(cmCol(o.c,PKPORT[0][0]));if(k==3||k==4)return[];const r=(o.r||0)*Math.PI/180,cs=Math.cos(r),sn=Math.sin(r),P_=[[-2.2,-23],[2.2,-23]];return P_.map(([a,b])=>({x:o.x+a*cs-b*sn,y:o.y+a*sn+b*cs}))}
// a round canopy tree in the shades of K (the Enchanted Forest / City Park look)
function kpCanopy(q,cx,cy,r,K,v){q.fillStyle='#0c0a10';q.beginPath();q.arc(cx,cy,r+1,0,7);q.fill();q.fillStyle=K.d;q.beginPath();q.arc(cx,cy,r,0,7);q.fill();q.fillStyle=K.b;q.beginPath();q.arc(cx-r*.15,cy-r*.15,r*.78,0,7);q.fill();q.fillStyle=K.l;q.beginPath();q.arc(cx-r*.3,cy-r*.32,r*.45,0,7);q.fill();
q.fillStyle=K.ll;for(let i=0;i<5;i++){const a=v*6+i*1.3;q.fillRect(cx+Math.cos(a)*r*.5-1,cy+Math.sin(a)*r*.5-1,3,2)}q.fillStyle='rgba(8,6,10,.35)';for(let i=0;i<4;i++)q.fillRect(cx-r*.6+i*r*.35,cy+r*.15+(i%2)*3,2,r*.45)}
Object.assign(OB,{
// ----- signs (your own text) -----
signboard:Object.assign(obt(140,46,0,PKSIGN,22,'SIGN',(q,v,K,t)=>{R_(q,'#3a2416',18,20,6,26);R_(q,'#3a2416',116,20,6,26);R_(q,'#16111c',2,2,136,24);R_(q,K.b,4,4,132,20);R_(q,K.l,4,4,132,3);kpText(q,t.toUpperCase(),70,15,124,12,K.b=='#5a3a22'?'#f0e0b0':'#f4f1e6','ui-monospace,monospace')}),{wb:1}),
hwsign:Object.assign(obt(184,112,[10,8],null,30,'EXIT 13|GRAVEYARD',(q,v,K,t)=>{const[a,b]=kpLines(t);R_(q,'#16111c',88,58,8,54);R_(q,'#8a9096',89,60,6,51);R_(q,'#c8ccd0',89,60,2,51);R_(q,'#16111c',2,2,180,60);R_(q,'#1d7a3e',4,4,176,56);R_(q,'#f4f1e6',7,7,170,2);R_(q,'#f4f1e6',7,55,170,2);R_(q,'#f4f1e6',7,7,2,50);R_(q,'#f4f1e6',175,7,2,50);
if(b){kpText(q,a.toUpperCase(),92,21,160,13,'#f4f1e6');kpText(q,b.toUpperCase(),92,41,160,16,'#f4f1e6')}else kpText(q,a.toUpperCase(),92,31,160,18,'#f4f1e6')}),{wb:1}),
billboard:Object.assign(obt(320,206,0,PKBOARD,40,'VISIT|ZOMBVILLE',(q,v,K,t)=>{const[a,b]=kpLines(t),dark=K.b=='#e8e4d8'||K.b=='#e0b030';for(const px of[70,250]){R_(q,'#16111c',px-6,130,12,76);R_(q,'#6e737b',px-5,132,10,74);R_(q,'#9aa0aa',px-5,132,3,74);for(let y=142;y<200;y+=16)R_(q,'#4a4e56',px-5,y,10,2)}
R_(q,'#16111c',6,130,308,8);R_(q,'#5a5e66',7,131,306,6);R_(q,'#16111c',7,13,306,120);R_(q,'#e8e4d8',9,15,302,116);R_(q,K.b,11,17,298,112);R_(q,'rgba(255,255,255,.15)',11,17,298,30);for(let i=0;i<4;i++){const lx=40+i*80;R_(q,'#16111c',lx-1,2,3,12);R_(q,'#16111c',lx-6,0,12,6);R_(q,'#8a909c',lx-5,1,10,4)}
const fg=dark?'#26262c':'#f4f1e6',sh=dark?null:'#16111c';if(b){kpText(q,a.toUpperCase(),160,52,280,22,fg,0,sh);kpText(q,b.toUpperCase(),160,92,280,34,fg,0,sh)}else kpText(q,a.toUpperCase(),160,72,280,36,fg,0,sh)}),{wb:1}),
arrowsign:Object.assign(obt(164,92,[8,6],null,30,'MANSION|CITY',(q,v,K,t)=>{const[a,b]=kpLines(t);R_(q,'#16111c',78,18,9,74);R_(q,'#5a3a22',79,19,7,72);const bd=(y,txt,dir)=>{const w=76,bx=dir<0?82-w:84;R_(q,'#16111c',bx-1,y-1,w+2,16);q.fillStyle='#16111c';q.beginPath();dir<0?(q.moveTo(bx-9,y+7),q.lineTo(bx,y-1),q.lineTo(bx,y+15)):(q.moveTo(bx+w+9,y+7),q.lineTo(bx+w,y-1),q.lineTo(bx+w,y+15));q.fill();
R_(q,'#8a6a3a',bx,y,w,14);q.fillStyle='#8a6a3a';q.beginPath();dir<0?(q.moveTo(bx-7,y+7),q.lineTo(bx,y),q.lineTo(bx,y+14)):(q.moveTo(bx+w+7,y+7),q.lineTo(bx+w,y),q.lineTo(bx+w,y+14));q.fill();kpText(q,txt.toUpperCase(),bx+w/2,y+7.5,w-6,9,'#2a1a10')};bd(6,a,-1);if(b)bd(28,b,1)}),{wb:1}),
streetsign:Object.assign(obt(96,74,[6,6],null,16,'MAIN ST',(q,v,K,t)=>{R_(q,'#16111c',45,16,6,58);R_(q,'#8a9096',46,17,4,57);R_(q,'#16111c',2,2,92,16);R_(q,'#1d7a3e',3,3,90,14);R_(q,'#f4f1e6',4,4,88,1);kpText(q,t.toUpperCase(),48,10.5,84,10,'#f4f1e6')}),{wb:1}),
pricesign:Object.assign(obt(92,132,[10,8],PKBOARD,14,'GAS & GO',(q,v,K,t)=>{R_(q,'#16111c',42,52,8,80);R_(q,'#6e737b',43,52,6,80);R_(q,'#16111c',4,2,84,52);R_(q,K.b,6,4,80,16);kpText(q,t.toUpperCase(),46,12.5,76,11,K.b=='#e8e4d8'||K.b=='#e0b030'?'#26262c':'#f4f4f0');R_(q,'#16111c',6,20,80,32);
q.font='bold 13px ui-monospace,monospace';q.fillStyle='#ffd84a';q.textAlign='center';q.fillText('3.99',46,34);q.fillStyle='#ff8a3a';q.fillText('4.29',46,48);q.textAlign='left'}),{wb:1}),
stopsign:Object.assign(ob(30,62,[4,4],q=>{R_(q,'#16111c',13,24,5,38);R_(q,'#8a9096',14,24,3,38);q.fillStyle='#16111c';q.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;q.lineTo(15+Math.cos(a)*14,13+Math.sin(a)*14)}q.fill();q.fillStyle='#c8281e';q.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;q.lineTo(15+Math.cos(a)*12,13+Math.sin(a)*12)}q.fill();q.font='bold 8px Arial, Helvetica, sans-serif';q.fillStyle='#f4f4f0';q.textAlign='center';q.fillText('STOP',15,16);q.textAlign='left'}),{wb:1}),
awning:obt(204,24,0,PKAWN,24,'SHOP',(q,v,K,t)=>{R_(q,'#16111c',2,4,200,18);for(let i=0;i<198;i+=10)R_(q,(i/10)%2?K.b:'#f4f0e0',3+i,5,Math.min(10,199-i),16);R_(q,'rgba(0,0,0,.18)',3,17,198,4);const s=kpFit(q,t.toUpperCase(),150,10,'ui-monospace,monospace'),tw=Math.min(160,q.measureText(t.toUpperCase()).width+14);R_(q,'#16111c',102-tw/2,7,tw,12);kpText(q,t.toUpperCase(),102,13.5,150,10,'#ffe9a0','ui-monospace,monospace')}),
storesign:obt(304,40,0,PKBOARD,24,'HOMETOWN MARKET',(q,v,K,t)=>{R_(q,'#16111c',2,2,300,36);R_(q,K.b,4,4,296,32);R_(q,'#ffe9a0',4,4,296,3);kpText(q,t.toUpperCase(),152,21,284,20,K.b=='#e8e4d8'||K.b=='#e0b030'?'#26262c':'#f4f4f0')}),
aislesign:obt(66,28,0,null,10,'AISLE 1',(q,v,K,t)=>{R_(q,'#16111c',3,2,60,24);R_(q,'#2f6fd0',5,4,56,20);kpText(q,t.toUpperCase(),33,14.5,52,12,'#f4f4f0')}),
deptsign:obt(164,26,0,PKBOARD,20,'PRODUCE',(q,v,K,t)=>{R_(q,'#16111c',2,2,160,22);R_(q,K.b,4,4,156,18);kpText(q,t.toUpperCase(),82,13.5,148,12,K.b=='#e8e4d8'||K.b=='#e0b030'?'#26262c':'#f4f4f0')}),
nameplate:obt(204,22,0,null,26,'CITY HALL',(q,v,K,t)=>{R_(q,'#16111c',2,2,200,18);R_(q,'#c8a040',4,4,196,14);R_(q,'#e0c060',4,4,196,2);kpText(q,t.toUpperCase(),102,11.5,186,12,'#16111c','Georgia, serif')}),
archway:Object.assign(obt(300,152,0,null,40,'ZOMBDASH|CAMPGROUND',(q,v,K,t)=>{const[a,b]=kpLines(t);for(const x of[18,256]){R_(q,'#16111c',x-2,30,30,122);R_(q,'#6b4a2a',x,32,26,120);R_(q,'#8a5f36',x,32,6,120);for(let y=46;y<150;y+=22)R_(q,'#5a3a22',x,y,26,3)}
R_(q,'#16111c',8,14,284,22);R_(q,'#5a3a22',10,16,280,18);R_(q,'#8a5f36',10,16,280,4);R_(q,'#16111c',18,38,264,54);R_(q,'#7a5232',20,40,260,50);R_(q,'#9a6f46',20,40,260,4);R_(q,'#5a3a22',20,86,260,4);kpText(q,a.toUpperCase(),150,58,240,16,'#ffd84a','"Press Start 2P", monospace','#2a1a10');if(b)kpText(q,b.toUpperCase(),150,78,240,10,'#e8e0c8','"Press Start 2P", monospace','#2a1a10')}),{wb:1}),
gatearch:Object.assign(obt(300,150,0,null,24,'REST IN PEACE',(q,v,K,t)=>{for(const x of[14,254]){R_(q,'#16111c',x-2,26,36,124);R_(q,'#8a867c',x,28,32,122);R_(q,'#a8a294',x,28,8,122);for(let y=40;y<148;y+=14)R_(q,'#6a665c',x,y,32,2);R_(q,'#16111c',x-6,18,44,12);R_(q,'#9a958a',x-5,19,42,10)}
q.fillStyle='#16111c';q.beginPath();q.moveTo(46,46);q.quadraticCurveTo(150,-6,254,46);q.lineTo(254,34);q.quadraticCurveTo(150,-20,46,34);q.fill();q.strokeStyle='#8a867c';q.lineWidth=8;q.beginPath();q.moveTo(46,40);q.quadraticCurveTo(150,-12,254,40);q.stroke();R_(q,'#16111c',96,24,108,22);R_(q,'#3a3a40',98,26,104,18);kpText(q,t.toUpperCase(),150,35.5,98,10,'#d8d4c8','Georgia, serif')}),{wb:1}),
// ----- spooky -----
portrait:{w:28,h:36,c:0,pc:PKPORT,f:(g,x,y,v,col)=>S2(g,x,y,28,36,q=>{const k=kpPortK(pcCol(col,PKPORT));R_(q,'#16111c',0,0,28,36);R_(q,'#8a6a2a',1,1,26,34);R_(q,'#c8a040',1,1,26,1);R_(q,'#1a1418',3,3,22,30);const cx=14,w=22,h=30,X0=3,Y0=3,R=(c,a,b,ww,hh)=>R_(q,c,a,b,ww,hh);
if(k==4){R('#2a2a3a',X0,Y0,w,h*.6);R('#c8c8b0',X0+w*.7,Y0+3,4,4);R('#1a1a14',X0,Y0+h*.6,w,h*.4);R('#16111c',cx-1,Y0+h*.3,2,h*.4);return}
const sk=k==3?'#a8b0a0':k==2?'#e8dcd0':'#d8c8b0',cl_=k==0?'#4a1a2a':k==1?'#1a1a22':k==2?'#e8e8e4':k==5?'#5a1a1a':'#2a2a2a';R(cl_,X0+2,Y0+h*.62,w-4,h*.38);R(sk,cx-w*.2,Y0+h*.18,w*.4,h*.42);
if(k==0||k==2){R('#16111c',cx-w*.24,Y0+h*.12,w*.48,h*.14);R('#16111c',cx-w*.26,Y0+h*.2,w*.08,h*.5);R('#16111c',cx+w*.18,Y0+h*.2,w*.08,h*.5)}if(k==1){R('#3a3a3a',cx-w*.22,Y0+h*.12,w*.44,h*.1);R('#3a2a1a',cx-w*.1,Y0+h*.48,w*.2,2)}
const ey=Y0+h*.34;R(k==3?'#16111c':'#f0ece0',cx-w*.1-1,ey-1,3,3);R(k==3?'#16111c':'#f0ece0',cx+w*.1-1,ey-1,3,3);if(k==3){R('#16111c',cx-2,Y0+h*.5,4,2);R('#7a1010',cx-w*.18,Y0+h*.55,w*.36,1)}
if(k==5){q.strokeStyle='rgba(20,12,12,.9)';q.lineWidth=2;q.beginPath();q.moveTo(X0+2,Y0+3);q.lineTo(X0+w-3,Y0+h-3);q.moveTo(X0+w*.6,Y0+2);q.lineTo(X0+w*.2,Y0+h-2);q.stroke()}}),eyes:kpEyes},
chandelier:ob(92,50,[70,24],q=>{q.strokeStyle='#16111c';q.lineWidth=7;q.beginPath();q.ellipse(46,26,34,16,0,0,7);q.stroke();q.strokeStyle='#a8862e';q.lineWidth=4;q.stroke();for(let i=0;i<10;i++){const a=i*.628;R_(q,'#e8f0f8',46+Math.cos(a)*34-2,26+Math.sin(a)*16,4,6)}for(let i=0;i<24;i++)R_(q,i%2?'#bfe6ff':'#e8f0f8',6+(i*37)%80,4+(i*23)%42,2,2)}),
deadtwist:Object.assign(ob(120,122,[10,8],(q,v)=>{const x=60,y=118,s=1,L=(x1,y1,x2,y2,w)=>{q.lineWidth=w+2;q.strokeStyle='#16111c';q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke();q.lineWidth=w;q.strokeStyle='#3a3230';q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke()};q.lineCap='round';
q.fillStyle='rgba(0,0,0,.25)';q.beginPath();q.ellipse(x+6,y+1,16,4,0,0,7);q.fill();const top=y-58*1.6;L(x,y,x+6*(v-.5),top,9);const br=(bx,by,a,len,w,d)=>{const ex=bx+Math.cos(a)*len,ey=by+Math.sin(a)*len;L(bx,by,ex,ey,w);if(d>0){br(ex,ey,a-.5,len*.62,Math.max(1,w-1.5),d-1);br(ex,ey,a+.45,len*.6,Math.max(1,w-1.5),d-1)}};
br(x,y-48,-2.3-v*.3,34,6,2);br(x,y-64,-.8+v*.3,36,6,2);br(x+6*(v-.5),top,-1.6,26,4,2);q.lineCap='butt'}),{wb:1}),
canopytree:Object.assign({w:68,h:84,c:[10,8],pc:PKTREE,f:(g,x,y,v,col)=>S2(g,x,y,68,84,q=>{const K=pcK(pcCol(col,PKTREE));q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.ellipse(36,80,26,7,0,0,7);q.fill();R_(q,'#16111c',30,58,8,24);R_(q,'#5a3a22',31,58,6,23);kpCanopy(q,34,34,28+Math.round(v*3),K,v)})},{wb:1}),
blackpine:Object.assign(ob(52,84,[10,8],(q,v)=>{q.fillStyle='rgba(0,0,0,.3)';q.beginPath();q.ellipse(28,80,18,5,0,0,7);q.fill();R_(q,'#16111c',22,66,8,16);R_(q,'#2e2420',23,66,6,15);const x=26,r=22;for(let i=0;i<3;i++){const w=r*(1-i*.25),yy=70-i*r*.62;q.fillStyle='#0c0a10';q.beginPath();q.moveTo(x-w-1,yy+1);q.lineTo(x,yy-r*.95-1);q.lineTo(x+w+1,yy+1);q.fill();q.fillStyle=i==2?'#24403a':v>.5?'#18302c':'#1c3430';q.beginPath();q.moveTo(x-w,yy);q.lineTo(x,yy-r*.9);q.lineTo(x+w,yy);q.fill()}}),{wb:1}),
// ----- vehicles that sit still: jets and wrecks -----
jet:{w:156,h:156,c:[28,150],pc:PKJET,f:(g,x,y,v,col)=>S2(g,x,y,156,156,q=>{const C=pcCol(col,PKJET),D='#4a525c';q.fillStyle=C;q.beginPath();q.moveTo(78,4);q.lineTo(88,40);q.lineTo(150,96);q.lineTo(150,108);q.lineTo(88,96);q.lineTo(86,130);q.lineTo(112,148);q.lineTo(112,154);q.lineTo(44,154);q.lineTo(44,148);q.lineTo(70,130);q.lineTo(68,96);q.lineTo(6,108);q.lineTo(6,96);q.lineTo(68,40);q.closePath();q.fill();
R_(q,D,74,40,8,100);q.fillStyle='#2a3a4a';q.beginPath();q.ellipse(78,34,6,14,0,0,7);q.fill();R_(q,'#8fc3e8',76,26,3,8);R_(q,'#3a3d46',66,138,8,14);R_(q,'#3a3d46',82,138,8,14);R_(q,'#c8b070',30,98,10,5);R_(q,'#c8b070',116,98,10,5);if(v>.75){R_(q,'#16111c',100,80,24,14);R_(q,'#3a2a20',30,90,18,8)}})},
planebody:ob(222,82,[200,40],q=>{q.save();q.translate(111,42);q.rotate(-.12);R_(q,'#6a7056',-100,-26,190,52);R_(q,'#7a8064',-100,-26,190,8);R_(q,'#2a3a40',-96,-16,16,22);for(let x=-70;x<80;x+=18)R_(q,'#2a3a40',x,-14,8,8);R_(q,'#16111c',86,-28,10,56);R_(q,'#c8521a',80,-10,12,22);R_(q,'#ff9a2e',84,-4,6,10);q.restore()}),
planetail:ob(142,92,[100,40],q=>{q.save();q.translate(70,48);q.rotate(.4);R_(q,'#5f6650',-60,-22,110,44);R_(q,'#16111c',-66,-24,10,48);R_(q,'#6a7056',30,-50,16,100);R_(q,'#5f6650',36,-36,18,30);q.restore()}),
planewing:ob(172,42,[150,20],q=>{q.save();q.translate(86,22);q.rotate(.05);q.fillStyle='#6a7056';q.beginPath();q.moveTo(-80,-8);q.lineTo(80,-14);q.lineTo(70,12);q.lineTo(-80,10);q.fill();R_(q,'#4a4f3a',-20,-4,30,10);R_(q,'#3a3d36',-60,-2,16,10);q.restore()}),
heliwreck:ob(152,92,[110,40],q=>{for(let k=40;k>4;k-=4){q.fillStyle='rgba(18,14,10,'+(.06+(40-k)/40*.12)+')';q.beginPath();q.ellipse(76,58,k*1.6,k*.7,0,0,7);q.fill()}q.save();q.translate(70,52);q.rotate(.3);q.fillStyle='#3a4a30';q.beginPath();q.ellipse(0,0,38,20,0,0,7);q.fill();R_(q,'#3a4a30',30,-6,56,10);R_(q,'#2a3a40',-30,-10,16,14);R_(q,'#16111c',-6,-8,22,14);R_(q,'#c8521a',0,-4,8,6);q.restore();
q.strokeStyle='#2a2c26';q.lineWidth=4;q.beginPath();q.moveTo(70,40);q.lineTo(10,20);q.moveTo(70,40);q.lineTo(130,14);q.moveTo(70,40);q.lineTo(96,84);q.stroke()}),
container:{w:132,h:58,c:[124,46],pc:PKCONT,f:(g,x,y,v,col)=>S2(g,x,y,132,58,q=>{const K=pcK(pcCol(col,PKCONT));R_(q,'#16111c',2,4,128,52);R_(q,K.b,3,5,126,50);R_(q,K.l,3,5,126,6);for(let i=8;i<124;i+=6)R_(q,K.d,3+i,11,2,42);R_(q,K.dd,3,50,126,5);R_(q,K.dd,120,11,9,39);R_(q,'#c8ccd4',123,20,2,10);R_(q,'#c8ccd4',123,34,2,10)})},
boomgate:Object.assign(ob(152,34,[12,10],(q,v)=>{R_(q,'#3a3d46',4,6,12,26);R_(q,'#c83a2a',4,4,12,5);for(let i=0;i<130;i+=20){R_(q,'#16111c',16+i,12,21,8);R_(q,(i/20)%2?'#e8e4d8':'#c83a2a',17+i,13,20,6)}R_(q,'#16111c',148,14,3,4)}),{wb:1}),
campring:ob(72,48,[56,28],q=>{for(let k=0;k<12;k++){const a=k/12*6.283,x=36+Math.cos(a)*30,y=26+Math.sin(a)*18;R_(q,'#16111c',x-7,y-5,14,11);R_(q,k%2?'#8a8f96':'#a8acb4',x-6,y-4,12,9)}q.fillStyle='#2a1a10';q.beginPath();q.ellipse(36,26,22,13,0,0,7);q.fill();R_(q,'#5a3a22',18,23,36,6);R_(q,'#5a3a22',33,14,6,22);R_(q,'#16111c',24,25,4,2);R_(q,'#3a2a20',40,28,6,3)}),
// ----- graveyard -----
coffin:{w:34,h:68,c:[26,58],pc:[['#5a3a22','Dark wood'],['#8a5f36','Oak'],['#26262c','Black'],['#d8d4c8','White']],f:(g,x,y,v,col)=>S2(g,x,y,34,68,q=>{const K=pcK(pcCol(col,[['#5a3a22']]));q.fillStyle='#16111c';q.beginPath();q.moveTo(10,2);q.lineTo(24,2);q.lineTo(32,18);q.lineTo(26,66);q.lineTo(8,66);q.lineTo(2,18);q.closePath();q.fill();q.fillStyle=K.b;q.beginPath();q.moveTo(11,4);q.lineTo(23,4);q.lineTo(30,18);q.lineTo(24,64);q.lineTo(10,64);q.lineTo(4,18);q.closePath();q.fill();
if(v>.6){q.fillStyle='#1a1214';q.beginPath();q.moveTo(13,8);q.lineTo(21,8);q.lineTo(26,19);q.lineTo(21,60);q.lineTo(13,60);q.lineTo(8,19);q.closePath();q.fill();R_(q,'#d8d0c0',13,12,8,8);R_(q,'#16111c',14,14,2,2);R_(q,'#16111c',18,14,2,2)}else{R_(q,K.l,16,12,2,22);R_(q,K.l,11,18,12,2)}})},
opengrave:ob(72,58,[32,48],q=>{R_(q,'#16111c',4,4,34,52);R_(q,'#1a1410',6,6,30,48);R_(q,'#3a2a1a',6,6,30,6);q.fillStyle='#5a4128';q.beginPath();q.ellipse(54,34,16,22,0,0,7);q.fill();q.fillStyle='#6e5234';q.beginPath();q.ellipse(52,30,10,14,0,0,7);q.fill();R_(q,'#8a909c',58,8,2,22);R_(q,'#6a6f7a',55,6,8,4)}),
dirtpile:ob(46,28,[36,12],q=>{q.fillStyle='#16111c';q.beginPath();q.ellipse(23,18,22,9,0,0,7);q.fill();q.fillStyle='#5a4128';q.beginPath();q.ellipse(23,17,20,8,0,0,7);q.fill();q.fillStyle='#6e5234';q.beginPath();q.ellipse(21,14,12,5,0,0,7);q.fill();R_(q,'#86694a',14,12,3,2);R_(q,'#3e2c1a',30,19,3,2)}),
// ----- office, school, bathroom -----
officedesk:{w:66,h:44,c:[58,16],pc:PCAB,f:(g,x,y,v,col)=>S2(g,x,y,66,44,q=>{const K=pcK(pcCol(col,PCAB));R_(q,'#16111c',3,14,60,20);R_(q,K.b,4,15,58,18);R_(q,K.l,4,15,58,3);R_(q,K.d,6,32,8,10);R_(q,K.d,52,32,8,10);R_(q,'#16111c',22,2,24,15);R_(q,'#2a2c34',23,3,22,12);R_(q,'#4a8ad8',24,4,20,10);R_(q,'#6a6f7a',32,15,4,3);R_(q,'#3a3d46',20,22,26,5);R_(q,'#e8e4d8',8,18,10,7);R_(q,'#c0392b',50,19,5,5)})},
chalkb:ob(126,34,0,q=>{R_(q,'#16111c',2,4,122,26);R_(q,'#8a5f36',3,5,120,24);R_(q,'#2e4a36',6,8,114,18);q.strokeStyle='rgba(230,230,220,.7)';q.lineWidth=1;q.beginPath();q.moveTo(12,14);q.lineTo(40,14);q.moveTo(12,19);q.lineTo(32,19);q.moveTo(50,12);q.lineTo(62,22);q.lineTo(74,12);q.moveTo(86,16);q.arc(92,16,6,0,6);q.stroke();R_(q,'#8a5f36',6,28,114,3);R_(q,'#e8e8e0',20,28,6,2)}),
cubby:ob(94,38,[88,14],q=>{R_(q,'#16111c',2,4,90,32);R_(q,'#a8793e',3,5,88,30);for(let r=0;r<2;r++)for(let c=0;c<5;c++){R_(q,'#6b4426',6+c*17,8+r*13,14,10);if((r+c)%3)R_(q,['#c0392b','#3a6fb5','#3f8a42','#d8b92e','#8a3aaa'][(r*2+c)%5],8+c*17,10+r*13,10,8)}}),
wclock:ob(22,22,0,q=>{q.fillStyle='#16111c';q.beginPath();q.arc(11,11,10,0,7);q.fill();q.fillStyle='#f4f0e0';q.beginPath();q.arc(11,11,8,0,7);q.fill();R_(q,'#16111c',10,5,2,7);R_(q,'#16111c',11,10,5,2);R_(q,'#c0392b',10,10,2,2)}),
poster:{w:28,h:36,c:0,pc:PKPOST,f:(g,x,y,v,col)=>S2(g,x,y,28,36,q=>{const K=pcK(pcCol(col,PKPOST));R_(q,'#16111c',2,2,24,32);R_(q,'#f4f0e0',3,3,22,30);R_(q,K.b,5,5,18,14);q.fillStyle=K.ll;q.beginPath();q.arc(14,12,4,0,7);q.fill();R_(q,K.d,6,22,16,2);R_(q,K.d,6,26,12,2);R_(q,'#8a8a8a',13,1,2,3)})},
lockrow:{w:76,h:34,c:[72,12],pc:PKLOCK,f:(g,x,y,v,col)=>S2(g,x,y,76,34,q=>{const K=pcK(pcCol(col,PKLOCK));for(let i=0;i<5;i++){const c=i==2?K.d:i%2?K.l:K.b;R_(q,'#16111c',3+i*14,2,14,30);R_(q,c,4+i*14,3,12,28);for(let k=0;k<3;k++)R_(q,'rgba(0,0,0,.3)',6+i*14,6+k*3,8,1);R_(q,'#c8ccd4',13+i*14,16,2,4)}})},
stalls:ob(118,68,0,q=>{for(let i=0;i<3;i++){const x=3+i*38;R_(q,'#c8d4dc',x+2,4,34,60);q.fillStyle='#f2f4f6';q.beginPath();q.ellipse(x+19,22,8,9,0,0,7);q.fill();q.fillStyle='#8a9aa8';q.beginPath();q.ellipse(x+19,22,4,5,0,0,7);q.fill();R_(q,'#d8dce2',x+12,6,14,7);R_(q,'#8a9aa8',x+4,58,30,4)}for(let i=0;i<=3;i++)R_(q,'#16111c',2+i*38,2,3,64);R_(q,'#16111c',2,2,117,3)}),
showers:ob(126,58,0,q=>{for(let i=0;i<3;i++){const sx=3+i*40;R_(q,'#c8d4dc',sx+2,4,36,50);R_(q,'#16111c',sx,2,2,54);R_(q,'#8a9aaa',sx+17,4,6,4);R_(q,'#d8dce2',sx+19,7,2,3);q.fillStyle='#5a6672';q.beginPath();q.arc(sx+20,42,3,0,7);q.fill();R_(q,'rgba(120,170,210,.35)',sx+4,48,32,4)}R_(q,'#16111c',123,2,2,54)}),
cafeteria:ob(166,44,[160,18],q=>{R_(q,'#16111c',2,12,162,28);R_(q,'#a8b0ba',3,13,160,26);R_(q,'#c8ccd4',3,13,160,4);for(let i=0;i<6;i++){R_(q,'#6a7480',8+i*26,18,20,14);R_(q,['#d8a040','#3f8a42','#c0392b','#e8d8a0','#8a5a32','#d8d0b8'][i],10+i*26,20,16,10)}R_(q,'#8a909c',3,4,160,6);R_(q,'#e8e8e4',10,5,14,4);R_(q,'#e8e8e4',40,5,14,4)}),
// ----- rooftop and building pieces -----
acunit:ob(34,28,[30,18],q=>{R_(q,'#16111c',1,3,32,24);R_(q,'#9aa0aa',2,4,30,22);R_(q,'#7a808a',5,7,24,16);q.fillStyle='#5a606a';q.beginPath();q.arc(17,15,7,0,7);q.fill();R_(q,'#9aa0aa',16,8,2,14);R_(q,'#9aa0aa',10,14,14,2)}),
wtank:Object.assign(ob(46,52,[36,20],q=>{R_(q,'#3a2416',8,26,4,24);R_(q,'#3a2416',34,26,4,24);R_(q,'#3a2416',8,36,30,3);q.fillStyle='#16111c';q.beginPath();q.ellipse(23,22,21,20,0,0,7);q.fill();q.fillStyle='#8a5a32';q.beginPath();q.ellipse(23,21,19,18,0,0,7);q.fill();q.fillStyle='#6a4022';for(let a=0;a<6.28;a+=.5)q.fillRect(23+Math.cos(a)*13-1,21+Math.sin(a)*12-1,2,2);q.fillStyle='#5a3a22';q.beginPath();q.arc(23,21,6,0,7);q.fill()}),{wb:1}),
fireesc:ob(66,22,0,q=>{R_(q,'rgba(0,0,0,.25)',4,8,60,12);R_(q,'#16111c',2,4,62,14);R_(q,'#3a3d46',3,5,60,12);for(let i=6;i<62;i+=5)R_(q,'#5a5e66',3+i,5,2,12);R_(q,'#6a6e78',28,2,10,18);for(let j=4;j<20;j+=4)R_(q,'#16111c',28,j,10,1)}),
elevator:ob(50,16,0,q=>{R_(q,'#16111c',2,4,46,10);R_(q,'#a8b0ba',3,5,44,8);R_(q,'#7a828c',24,5,2,8);R_(q,'#ffd84a',44,2,3,3)}),
micro:ob(28,22,0,q=>{R_(q,'#16111c',2,4,24,16);R_(q,'#2a2c32',3,5,22,14);R_(q,'#4a6a8a',5,7,13,10);R_(q,'#8a909c',20,7,3,2);R_(q,'#8a909c',20,11,3,2)}),
coffeetable:{w:58,h:36,c:[50,18],pc:PCAB,f:(g,x,y,v,col)=>S2(g,x,y,58,36,q=>{const K=pcK(pcCol(col,PCAB));R_(q,'#16111c',3,8,52,24);R_(q,K.b,4,9,50,22);R_(q,K.l,4,9,50,3);R_(q,'#e8e4d8',12,14,12,9);R_(q,'#c0392b',38,16,8,6);R_(q,K.d,6,30,4,4);R_(q,K.d,48,30,4,4)})},
garageshelf:ob(96,34,[92,14],q=>{R_(q,'#16111c',2,4,92,26);R_(q,'#6a6f7a',3,5,90,24);const C=['#b58a52','#3a6fb5','#c0392b','#3f8a42','#d8b92e','#8a909c'];for(let k=6,i=0;k<86;k+=13,i++)R_(q,C[i%6],3+k,8,10,18)}),
tpole:Object.assign(ob(46,118,[6,6],q=>{R_(q,'#16111c',20,6,7,112);R_(q,'#6b4a2a',21,7,5,111);R_(q,'#16111c',2,16,42,5);R_(q,'#5a3a22',3,17,40,3);R_(q,'#8a909c',6,13,3,4);R_(q,'#8a909c',37,13,3,4);R_(q,'#3a3d46',30,26,10,12)}),{wb:1}),
bollard:ob(14,22,[8,6],q=>{R_(q,'#16111c',3,4,8,17);R_(q,'#e0b030',4,5,6,15);R_(q,'#16111c',4,9,6,2);R_(q,'#16111c',4,14,6,2)})});
// ----- forest trees (the Suburb's woods) -----
// var picks the size and shade: var = (size step × 3 + shade) / 100 (pine: 13–18 px canopy radius, oak: 16–24). Trunks are
// see-through (cf:2: bullets fly through the woods, as on the Suburb). The canopy joins the walk-behind list as one shared
// picture per size and shade, so a forest of a thousand trees costs no extra memory (kpWB; sh:1 tells bgFree not to free it).
function kpWB(g,cv,x,y,base,ch){if(!vRec.on||vRec.busy||vRec.nest||!vRec.L||!g||!g.getTransform||typeof BG=='undefined'||g.canvas!==BG)return;const T=g.getTransform();if(!T||T.a!==1||T.b!==0||T.c!==0||T.d!==1)return;
vRec.L.push({x:x+T.e,y:y+T.f,w:cv.width,h:cv.height,cv,al:null,base:base+T.f,ch,sh:1})}
function kpFTree(pine){const b=pine?13:16,n=pine?12:13;return{w:pine?44:56,h:pine?60:62,c:[12,12],cf:2,f(g,x,y,v){const i=Math.round(cl(+v||0,0,1)*100),s=i%3,r=b+Math.floor(i/3)%n,ty=y-6,sp=subSpr(pine,r,(s+.5)/3);
g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+4,ty+2,r*.9,r*.45,0,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-4,ty-6,8,9);g.fillStyle='#5a3a22';g.fillRect(x-3,ty-6,6,8);
const sx=Math.round(x-sp.width/2),sy=pine?Math.round(ty-10-sp.height+2):Math.round(ty-r*.7-sp.height/2);g.drawImage(sp,sx,sy);kpWB(g,sp,sx,sy,y,12)}}}
Object.assign(OB,{foak:kpFTree(0),fpine:kpFTree(1)});
// ----- the Suburb's yard, street and crash-site pieces -----
// ytree: the round yard tree (trunk box 12×12 above its base). dirsign: a green direction sign with an arrow (line 1, then
// line 2 with the arrow). smallcar: a small crashed car seen from above (its base is the middle of its back bumper when it
// lies left to right; turn it with rot). chopper: the crashed helicopter with its broken tail and rotor (solid body).
// ftrunk: a fallen tree (var = (length step × 9 + leaf pattern) / 100, length 58–80; the base is the middle of its bottom
// edge). sstump: a splintered stump. hplant: a house plant seen from above. flamp: a floor lamp seen from above with its glow. curtain: curtains over a window.
const PKCAR=[['#2f6fd0','Blue'],['#e0a82e','Yellow'],['#c0392b','Red'],['#3f8a42','Green'],['#e8e4d8','White'],['#26262c','Black']];
const PKDIR=[['#1d7a3e','Green'],['#2a4a7a','Blue'],['#5a3a22','Brown'],['#6a1a1a','Red']];
const PKCURT=[['#8a2a3a','Red'],['#2a3a6a','Blue'],['#3f6a3a','Green'],['#c8b48e','Beige'],['#5a3a6a','Purple']];
function kpLog(g,x,y,L,v){const R=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(x+a,y+b,w,h)};
R('rgba(0,0,0,.25)',-2,4,L,8);R('#16111c',-1,-6,L+2,12);R('#6b4a2a',0,-5,L,10);R('#8a6038',0,-5,L,3);for(let i=8;i<L-4;i+=11){R('#4a3020',i,-3,6,1);R('#4a3020',i+4,1,5,1)}
R('#d8b07a',-1,-4,3,8);R('#a8804a',0,-1,1,2);
for(let i=0;i<5;i++){const bx=x+L-6+i*7+(v*13+i*5)%6,by=y-12+((i*11+v*7)%24);g.fillStyle='#16111c';g.beginPath();g.ellipse(bx,by,11,7,0,0,7);g.fill();g.fillStyle=i%2?'#2f6d2e':'#3c8a3a';g.beginPath();g.ellipse(bx,by-1,10,6,0,0,7);g.fill()}
R('#5a3a22',L*.4,-9,3,4);R('#5a3a22',L*.65,5,3,5)}
function kpFtrunk(v){const i=Math.round(cl(+v||0,0,1)*100);return{L:58+Math.min(10,Math.floor(i/9))*2.2,p:i%9}}
Object.assign(OB,{
ytree:{w:40,h:40,c:[12,12],f(g,x,y){g.fillStyle='#6b4a2a';g.fillRect(x-6,y-12,12,12);g.fillStyle='#2f7d32';g.beginPath();g.arc(x,y-18,19,0,7);g.fill();g.fillStyle='#3f9a3f';g.beginPath();g.arc(x-5,y-23,9,0,7);g.fill()}},
dirsign:{w:168,h:104,c:[6,14],pc:PKDIR,txt:30,dt:'ZOMBDASH SCHOOL|1 MILE',f(g,x,y,v,col,t){const[a,b]=kpLines(cmTxt(t,30)||'ZOMBDASH SCHOOL|1 MILE'),K=pcK(pcCol(col,PKDIR)),py=y-2,pw=164,ph=54,bx=x-pw/2,by=py-ph-44,R=(c,a_,b_,w,h)=>{g.fillStyle=c;g.fillRect(a_,b_,w,h)};
R('rgba(0,0,0,.25)',x-1,py-2,14,4);R('#16111c',x-4,by+ph-2,8,py-by-ph+4);R('#8a9096',x-3,by+ph,6,py-by-ph+1);R('#c8ccd0',x-3,by+ph,2,py-by-ph+1);
R('#16111c',bx-2,by-2,pw+4,ph+4);R(K.b,bx,by,pw,ph);R('#f4f1e6',bx+3,by+3,pw-6,2);R('#f4f1e6',bx+3,by+ph-5,pw-6,2);R('#f4f1e6',bx+3,by+3,2,ph-6);R('#f4f1e6',bx+pw-5,by+3,2,ph-6);
kpText(g,a.toUpperCase(),x,by+17,pw-14,14,'#f4f1e6');if(b)kpText(g,b.toUpperCase(),x-18,by+37,100,13,'#f4f1e6');
g.fillStyle='#f4f1e6';const ax=x+22,ay=by+37;g.fillRect(ax,ay-2,22,5);g.beginPath();g.moveTo(ax+20,ay-8);g.lineTo(ax+32,ay+.5);g.lineTo(ax+20,ay+9);g.fill();R('rgba(0,0,0,.25)',bx+pw-14,by+ph-10,6,3)}},
smallcar:{w:60,h:32,c:[54,26],pc:PKCAR,wb:1,f(g,x,y,v,col){const c=pcCol(col,PKCAR),cy=y-16,R=(k,a,b,w,h)=>{g.fillStyle=k;g.fillRect(x+a,cy+b,w,h)};
R('#111',-25,-10,54,26);R(c,-27,-13,54,26);R('rgba(0,0,0,.25)',-27,-13,54,3);R('rgba(0,0,0,.25)',-27,10,54,3);R('#8fc3e8',-9,-10,16,20);R('#e8e8c0',23,-11,4,5);R('#e8e8c0',23,6,4,5);R('#3a2216',16,-9,11,18)}},
chopper:{w:212,h:96,c:[80,32],f(g,x,y){const hx=x,hy=y-16;g.fillStyle='rgba(20,20,15,.5)';g.beginPath();g.ellipse(hx,hy+4,76,50,0,0,7);g.fill();
// only the body is a walk-behind picture (as on the old Suburb): people's feet on it are drawn behind it
vDraw(g,hx-46,hy-46,92,92,g=>{g.save();g.translate(hx,hy);g.rotate(.6);g.fillStyle='#333';g.fillRect(-30,13,60,4);g.fillStyle='#55664a';g.fillRect(-32,-12,64,24);g.fillStyle='#7fb3cf';g.fillRect(14,-9,16,18);g.fillStyle='#2a2a24';g.fillRect(-12,-12,18,24);g.fillStyle='#e8e8c0';g.fillRect(20,-9,1,18);g.restore()});
g.save();g.translate(hx-74,hy-44);g.rotate(.5);g.fillStyle='#55664a';g.fillRect(-28,-4,56,8);g.fillRect(22,-14,6,14);g.restore();
g.save();g.translate(hx+16,hy-38);g.rotate(.9);g.fillStyle='#2b2b2b';g.fillRect(-46,-2,92,4);g.rotate(2);g.fillRect(-30,-2,60,4);g.restore()}},
ftrunk:{w:124,h:34,c:0,f(g,x,y,v){const F=kpFtrunk(v);kpLog(g,Math.round(x-(F.L+30)/2),y-12,F.L,F.p)}},
sstump:{w:20,h:20,c:[12,8],f(g,x,y){const Y=y-5,R=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(x+a,Y+b,w,h)};g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+2,Y+3,8,4,0,0,7);g.fill();
R('#16111c',-7,-6,14,11);R('#6b4a2a',-6,-5,12,9);R('#e0bc84',-5,-5,10,4);R('#e0bc84',-4,-10,3,6);R('#e0bc84',1,-12,2,8);R('#e0bc84',3,-8,2,4);R('#a8804a',-1,-4,2,2)}},
hplant:{w:22,h:24,c:0,f(g,x,y){const cy=y-8;g.fillStyle='#16111c';g.beginPath();g.arc(x,cy,9,0,7);g.fill();g.fillStyle='#8a5a34';g.fillRect(x-4,cy-2,8,8);g.fillStyle='#3f8a3a';g.beginPath();g.arc(x,cy-3,8,0,7);g.fill();g.fillStyle='#5aaa4a';g.beginPath();g.arc(x-3,cy-6,3,0,7);g.fill()}},
flamp:{w:56,h:60,c:0,f(g,x,y){const ly=y-8;g.fillStyle='rgba(255,230,140,.2)';g.beginPath();g.arc(x,ly,26,0,7);g.fill();g.fillStyle='#16111c';g.fillRect(x-8,ly-8,16,16);g.fillStyle='#e8c060';g.fillRect(x-7,ly-7,14,14);g.fillStyle='#f8e0a0';g.fillRect(x-5,ly-5,10,4)}},
curtain:{w:58,h:10,c:0,pc:PKCURT,f(g,x,y,v,col){const c=pcCol(col,PKCURT),l=pcSh(c,1.22),R=(k,a,b,w,h)=>{g.fillStyle=k;g.fillRect(x+a,y+b,w,h)};
R(c,-28,-7,10,7);R(c,18,-7,10,7);R('#16111c',-28,-8,56,1);R(l,-27,-6,3,5);R(l,19,-6,3,5)}}});
// ----- lights: spot lights, flood lights, a light tower, a wall light, a work light, a searchlight -----
// lt: the lamp heads. Each is a beam that lights the ground at dusk and night (kit-lighting.js): dx,dy from the base (where the lamp
// is in the picture, so the beam starts at the lamp on top of a pole, tower or tripod), r reach,
// w half its width in degrees, a its angle from straight ahead. A prop's turn (rot) aims the beams; turned 0 they shine down the
// screen. nr:1 keeps the picture standing when turned (poles, towers, tripods), so only the light turns. The colour is the light's.
const PKLT=[['#fff2c8','Warm white'],['#e8f0ff','Cool white'],['#ffc860','Sodium yellow'],['#ff5a4a','Red'],['#6aff8a','Green'],['#6aa8ff','Blue']];
function kpLens(q,x,y,w,h,K){R_(q,'#16111c',x-1,y-1,w+2,h+2);R_(q,K.b,x,y,w,h);R_(q,'#ffffff',x+1,y,Math.max(1,w-2),1)}
Object.assign(OB,{
spotlight:Object.assign(obc(28,24,[16,10],PKLT,(q,v,K)=>{R_(q,'#16111c',3,13,22,10);R_(q,'#3a3d46',4,14,20,8);R_(q,'#5a5e68',4,14,20,2);R_(q,'#16111c',5,3,18,14);R_(q,'#4a4e58',6,4,16,12);R_(q,'#6a6e78',6,4,16,3);kpLens(q,8,15,12,4,K)}),{lt:[{dx:0,dy:-6,r:230,w:16}]}),
walllight:Object.assign(obc(24,18,0,PKLT,(q,v,K)=>{R_(q,'#16111c',3,1,18,8);R_(q,'#3a3d46',4,2,16,6);R_(q,'#2a2c32',11,7,2,3);R_(q,'#16111c',5,8,14,8);R_(q,'#4a4e58',6,9,12,6);kpLens(q,7,13,10,3,K)}),{lt:[{dx:0,dy:-4,r:160,w:48}]}),
floodlight:Object.assign(obc(56,120,[8,8],PKLT,(q,v,K)=>{R_(q,'#16111c',24,20,8,94);R_(q,'#6a6e78',25,20,6,92);R_(q,'#8a8f96',25,20,2,92);R_(q,'#16111c',19,111,18,8);R_(q,'#4a4e58',20,112,16,6);R_(q,'#16111c',5,13,46,6);R_(q,'#4a4e58',6,14,44,4);
for(const x of[4,32]){R_(q,'#16111c',x-1,3,22,14);R_(q,'#3a3d46',x,4,20,12);R_(q,'#5a5e68',x,4,20,3);kpLens(q,x+2,12,16,4,K)}}),{nr:1,wb:1,lt:[{dx:-14,dy:-106,r:400,w:30,a:-8},{dx:14,dy:-106,r:400,w:30,a:8}]}),
floodtower:Object.assign(obc(76,176,[24,12],PKLT,(q,v,K)=>{q.strokeStyle='#16111c';q.lineWidth=4;const L=(a,b,c,d)=>{q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()};L(16,172,31,32);L(60,172,45,32);
q.strokeStyle='#8a8f96';q.lineWidth=2;L(16,172,31,32);L(60,172,45,32);q.lineWidth=1;q.strokeStyle='#6a6e78';for(let y=48;y<168;y+=24){const a=16+(172-y)/140*15,b=60-(172-y)/140*15,a2=16+(172-y-24)/140*15,b2=60-(172-y-24)/140*15;L(a,y,b2,y-24);L(b,y,a2,y-24);L(a,y,b,y)}
R_(q,'#16111c',12,166,52,8);R_(q,'#4a4e58',13,167,50,6);R_(q,'#16111c',13,3,50,32);R_(q,'#2a2c32',14,4,48,30);for(let j=0;j<2;j++)for(let i=0;i<2;i++){R_(q,'#4a4e58',16+i*24,6+j*14,20,12);kpLens(q,18+i*24,13+j*14,16,4,K)}}),{nr:1,wb:1,lt:[{dx:-12,dy:-156,r:560,w:40,a:-12},{dx:12,dy:-156,r:560,w:40,a:12}]}),
worklight:Object.assign(obc(44,56,[18,8],PKLT,(q,v,K)=>{q.strokeStyle='#16111c';q.lineWidth=3;const L=(a,b,c,d)=>{q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()};L(22,24,6,54);L(22,24,38,54);L(22,18,22,54);q.strokeStyle='#8a8f96';q.lineWidth=1;L(22,24,6,54);L(22,24,38,54);L(22,18,22,54);
R_(q,'#16111c',5,13,34,4);R_(q,'#3a3d46',6,14,32,2);for(const x of[4,24]){R_(q,'#16111c',x-1,3,18,14);R_(q,'#e0b030',x,4,16,12);R_(q,'#a87a1a',x,13,16,3);kpLens(q,x+2,6,12,6,K)}}),{nr:1,wb:1,lt:[{dx:-10,dy:-47,r:280,w:30,a:-6},{dx:10,dy:-47,r:280,w:30,a:6}]}),
ceillight:Object.assign(obc(18,18,0,PKLT,(q,v,K)=>{q.fillStyle='#16111c';q.beginPath();q.arc(9,9,8,0,7);q.fill();q.fillStyle='#d8dce2';q.beginPath();q.arc(9,9,7,0,7);q.fill();q.fillStyle=K.b;q.beginPath();q.arc(9,9,5,0,7);q.fill();q.fillStyle='rgba(255,255,255,.8)';q.fillRect(6,6,3,2)}),{eo:1,lt:[{dx:0,dy:-9,r:120,w:0}]}),
searchlight:Object.assign(obc(44,46,[28,12],PKLT,(q,v,K)=>{R_(q,'#16111c',7,37,30,9);R_(q,'#3a3d46',8,38,28,7);R_(q,'#16111c',9,20,6,20);R_(q,'#16111c',29,20,6,20);R_(q,'#5a5e68',10,21,4,18);R_(q,'#5a5e68',30,21,4,18);
q.fillStyle='#16111c';q.beginPath();q.arc(22,20,16,0,7);q.fill();q.fillStyle='#5a5f68';q.beginPath();q.arc(22,20,15,0,7);q.fill();q.fillStyle=K.b;q.beginPath();q.arc(22,20,11,0,7);q.fill();q.fillStyle='rgba(255,255,255,.75)';q.beginPath();q.arc(18,16,4,0,7);q.fill()}),{nr:1,wb:1,lt:[{dx:0,dy:-26,r:480,w:7}]})});
// ----- the Warehouse's pieces -----
// wcont: a small shipping container (90×28). guardbooth: the lot's guard booth. lotgate: a gate post with a short red and white
// arm reaching left. deskpc: an office desk with a computer; ochair: an office chair from above; fcab: a grey filing cabinet.
// sinkrow: a washroom counter with two sinks and a mirror strip (var ≥ 0.5 puts the mirror on the left). wc: a toilet from above.
// lockstrip: five lockers from above (var ≥ 0.5: wider, shallower lockers, a longer row). exitsign: a green exit light (glows at night).
// dirsign2: a direction sign with the arrow on the left pointing down-left. firebarrel: a burning barrel from above (glows).
// btable: a break-room table from above.
const PKWC=[['#b5483a','Red'],['#3a6fb5','Blue'],['#4f8a4a','Green'],['#c9a02e','Yellow'],['#7a4a8a','Purple'],['#d07a2a','Orange']];
function kpR(g){return(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h)}}
Object.assign(OB,{
wcont:{w:92,h:30,c:[90,28],pc:PKWC,f(g,x,y,v,col){const R=kpR(g),c=pcCol(col,PKWC),X=x-45,Y=y-28;R('#222',X-1,Y-1,92,30);R(c,X,Y,90,28);for(let k=6;k<90;k+=8)R('rgba(0,0,0,.22)',X+k,Y,2,28)}},
guardbooth:{w:98,h:86,c:[96,84],wb:1,f(g,x,y){const R=kpR(g),X=x-48,Y=y-84;R('#16111c',X-1,Y-1,98,86);R('#6c7686',X,Y,96,84);R('#8a95a8',X,Y,96,10);R('#55606f',X+6,Y+16,84,62);R('#14101a',X,Y+54,8,22);R('#8fc3e8',X,Y+20,6,26);R('#3a3d46',X+50,Y+20,28,20);R('#8a909c',X+52,Y+22,24,4);R('#e8c53a',X+20,Y+2,56,4)}},
lotgate:{w:196,h:22,c:[10,16],f(g,x,y){const R=kpR(g);R('#3a3d46',x-5,y-16,10,16);R('#8a909c',x-3,y-14,6,4);R('#16111c',x-98,y-12,98,8);for(let i=0;i<8;i++)R(i%2?'#e8e8e4':'#d83a3a',x-13-12*i,y-11,12,6);R('#e0443a',x-2,y-20,4,4)}},
deskpc:{w:82,h:42,c:[80,28],f(g,x,y){const R=kpR(g);R('#7a5a3a',x-40,y-28,80,28);R('#a8703a',x-40,y-28,80,5);R('#222',x-12,y-40,24,14);R('#59a',x-10,y-38,20,9)}},
ochair:{w:18,h:16,c:0,f(g,x,y){kpR(g)('#3a3d46',x-8,y-14,16,14)}},
fcab:{w:24,h:42,c:[22,40],f(g,x,y){const R=kpR(g);R('#6b7078',x-11,y-40,22,40);for(const d of[36,24,12])R('#8a909c',x-9,y-d,18,6)}},
sinkrow:{w:24,h:72,c:[16,70],f(g,x,y,v){const R=kpR(g);R('#8a909c',x-8,y-70,16,70);R('#fff',x-5,y-62,10,12);R('#fff',x-5,y-38,10,12);R('#8fc3e8',(+v||0)>=.5?x-10:x+8,y-66,2,60)}},
wc:{w:16,h:30,c:0,f(g,x,y){const R=kpR(g);R('#fff',x-7,y-14,14,14);R('#dfe6ea',x-5,y-28,10,10)}},
lockstrip:{w:114,h:22,c:[92,18],f(g,x,y,v){const R=kpR(g),big=(+v||0)>=.5,s=big?22:18,L=s*5,D=big?14:18;R('#16111c',x-L/2-1,y-D-1,L+2,D+2);for(let i=0;i<5;i++){const lx=x-L/2+i*s;R(i%2?(big?'#6a6f7a':'#3a6fb5'):(big?'#3a6fb5':'#6a6f7a'),lx,y-D,s-2,D);R('#16111c',lx+4,y-D+3,8,1);R('#16111c',lx+4,y-D+6,8,1)}}},
exitsign:{w:26,h:10,c:0,f(g,x,y){kpR(g)('#3fd25a',x-12,y-8,24,8)}},
dirsign2:{w:180,h:102,c:[8,10],cf:2,pc:PKDIR,txt:30,dt:'HIGHWAY|ENTRANCE',wb:1,f(g,x,y,v,col,t){const[a,b]=kpLines(cmTxt(t,30)||'HIGHWAY|ENTRANCE'),K=pcK(pcCol(col,PKDIR)),R=kpR(g),py=y,pw=176,ph=58,bx=x-pw/2,by=py-ph-40;
R('rgba(0,0,0,.25)',x-1,py-2,14,4);R('#16111c',x-4,by+ph-2,8,py-by-ph+4);R('#8a9096',x-3,by+ph,6,py-by-ph+1);R('#c8ccd0',x-3,by+ph,2,py-by-ph+1);
R('#16111c',bx-2,by-2,pw+4,ph+4);R(K.b,bx,by,pw,ph);R('#f4f1e6',bx+3,by+3,pw-6,2);R('#f4f1e6',bx+3,by+ph-5,pw-6,2);R('#f4f1e6',bx+3,by+3,2,ph-6);R('#f4f1e6',bx+pw-5,by+3,2,ph-6);
kpText(g,a.toUpperCase(),x+20,by+19,pw-60,14,'#f4f1e6');if(b)kpText(g,b.toUpperCase(),x+20,by+38,pw-60,14,'#f4f1e6');
g.save();g.translate(bx+30,by+ph/2);g.rotate(Math.PI*.75);g.fillStyle='#f4f1e6';g.fillRect(-12,-2.5,20,5);g.beginPath();g.moveTo(6,-8);g.lineTo(17,0);g.lineTo(6,8);g.fill();g.restore();R('rgba(0,0,0,.25)',bx+pw-14,by+ph-10,6,3)}},
firebarrel:{w:42,h:48,c:[12,12],f(g,x,y){const cy=y-6;g.fillStyle='rgba(255,140,40,.25)';g.beginPath();g.arc(x,cy,20,0,7);g.fill();const R=kpR(g);R('#8a3a22',x-6,cy-6,12,12);R('#ff9a2e',x-4,cy-4,8,8)}},
btable:{w:52,h:22,c:[50,12],f(g,x,y){const R=kpR(g);R('#a8703a',x-25,y-12,50,12);R('#7a5a3a',x-23,y,4,8);R('#7a5a3a',x+19,y,4,8)}}});

// ---------- the School's pieces (seen from above, on a wall or the floor) ----------
const PKSTALL=[['#8a909c','Grey'],['#c8c0a8','Beige'],['#5a7a98','Blue'],['#7a9a6a','Green']],PKBAN=[['#7a2828','Red'],['#2a3a6a','Navy'],['#2f5a3a','Green'],['#d8aa32','Gold']],PKWCS=[['#4a90e2','Boys (blue)'],['#d85a9a','Girls (pink)'],['#3f8a42','All (green)']];
Object.assign(OB,{
// toilet stall divider: 4×56, solid; turn it 90° to run left–right
stall:{w:4,h:56,c:[4,56],pc:PKSTALL,f(g,x,y,v,col){kpR(g)(pcCol(col,PKSTALL),x-2,y-56,4,56)}},
// a banner hung on a wall, with words
banner:{w:300,h:16,c:0,pc:PKBAN,txt:24,dt:'HOME OF THE ZOMBIES',f(g,x,y,v,col,t){const c=pcCol(col,PKBAN),R=kpR(g);R('#16111c',x-149,y-15,298,15);R(c,x-148,y-14,296,13);kpText(g,(cmTxt(t,24)||'HOME OF THE ZOMBIES').toUpperCase(),x,y-8,286,10,c=='#d8aa32'?'#7a2828':'#d8aa32')}},
// a small wall clock seen from above (on a classroom's front wall)
sclock:{w:14,h:14,c:0,f(g,x,y){const cy=y-7;g.fillStyle='#16111c';g.beginPath();g.arc(x,cy,6,0,7);g.fill();g.fillStyle='#f4f1e6';g.beginPath();g.arc(x,cy,5,0,7);g.fill();const R=kpR(g);R('#16111c',x-1,cy-4,1,5);R('#16111c',x-1,cy,4,1)}},
// a restroom sign over a door
wcsign:{w:18,h:12,c:0,pc:PKWCS,f(g,x,y,v,col){const R=kpR(g);R('#16111c',x-9,y-12,18,12);R(pcCol(col,PKWCS),x-8,y-11,16,10);R('#f4f1e6',x-1,y-9,2,6)}}});

// lights that flicker now and then (a failing bulb): the same lights with a 'fault' lamp head; half the lens is dim, so the editor tells them apart
{const fl=(k,mk)=>{const B=OB[k],f=B.f;return Object.assign({},B,{lt:B.lt.map(h=>Object.assign({},h,{f:'fault'})),f(g,x,y,...a){f.call(this,g,x,y,...a);g.fillStyle='rgba(40,40,52,.6)';mk(g,x,y)}})};
 Object.assign(OB,{ceilflk:fl('ceillight',(g,x,y)=>{g.beginPath();g.arc(x,y-9,5,Math.PI/2,Math.PI*1.5);g.closePath();g.fill()}),wallflk:fl('walllight',(g,x,y)=>g.fillRect(x-5,y-5,5,3))})}
// ---------- Hometown Market's pieces ----------
// hanging signs (ov:1): in the game they hang from the ceiling, drawn over players and zombies (cmFxTop; see-through while someone is
// under one) with only a soft shadow on the floor; the editor draws them like any prop. The base is the floor spot under the sign.
const PKHS=[['#c0392b','Red'],['#2f6fd0','Blue'],['#2f8a4a','Green'],['#e08a1c','Orange'],['#6a4a9a','Purple'],['#b8783c','Brown'],['#16a0a0','Teal'],['#c8407a','Pink'],['#3a3d46','Charcoal']];
const PKLANE=[['#3a3d46','Charcoal'],['#c0392b','Red'],['#2f6fd0','Blue'],['#2f8a4a','Green'],['#8a5a32','Wood']];
function kpWires(q,x1,x2,y,y0){q.fillStyle='#5a5e68';q.fillRect(x1,y0,1,y-y0);q.fillRect(x2,y0,1,y-y0)}
Object.assign(OB,{
hsign:{w:170,h:96,c:0,ov:1,sw:150,pc:PKHS,txt:18,dt:'PRODUCE',f:(g,x,y,v,col,t)=>S2(g,x,y,170,96,q=>{const K=pcK(pcCol(col,PKHS)),T=(cmTxt(t,18)||'PRODUCE').toUpperCase();kpWires(q,24,145,54,30);
 R_(q,K.dd,6,54,158,30);R_(q,K.b,7,55,156,26);R_(q,K.ll,7,55,156,3);R_(q,K.d,7,78,156,3);kpText(q,T,85,68,146,16,'#f8f6ee',0,'rgba(0,0,0,.35)')})},
haisle:{w:100,h:100,c:0,ov:1,sw:84,pc:PKHS,txt:30,dt:'1|CEREAL|SNACKS',f:(g,x,y,v,col,t)=>S2(g,x,y,100,100,q=>{const K=pcK(pcCol(col,PKHS)),L=String(cmTxt(t,30)||'1|CEREAL|SNACKS').toUpperCase().split('|');kpWires(q,20,79,44,28);
 R_(q,K.dd,6,44,88,46);R_(q,K.b,7,45,86,15);R_(q,K.ll,7,45,86,2);kpText(q,'AISLE '+(L[0]||''),50,53,80,11,'#f8f6ee');R_(q,'#f4f2ea',7,60,86,29);R_(q,'#d8d6ce',7,86,86,3);
 kpText(q,L[1]||'',50,67,80,9,'#26262c');kpText(q,L[2]||'',50,79,80,9,'#26262c')})},
// a checkout lane: belt with a divider, register, card reader on the customer's side (right), bagging well, the lane's number light
lane:{w:56,h:128,c:[26,100],wb:1,pc:PKLANE,txt:2,dt:'1',f:(g,x,y,v,col,t)=>S2(g,x,y,56,128,q=>{const K=pcK(pcCol(col,PKLANE)),n=String(cmTxt(t,2)||'1');
 R_(q,'#16111c',14,25,28,103);R_(q,K.b,15,26,26,101);R_(q,K.d,15,122,26,5);R_(q,'#c8ccd4',18,28,20,92);
 R_(q,'#26262a',20,30,16,56);for(let k=33;k<86;k+=5)R_(q,'#3c3c44',20,k,16,1);R_(q,'#e8e4d8',19,58,18,3);R_(q,'#c8a050',23,40,6,5);R_(q,'#d84a3a',28,48,5,6);R_(q,'#7ab84a',22,70,7,4);
 R_(q,'#16111c',19,90,12,9);R_(q,'#2a3a4a',20,91,10,7);R_(q,'#3aff7a',21,92,6,1);R_(q,'#8a909c',21,100,8,4);R_(q,'#16111c',35,92,6,8);R_(q,'#c8ccd4',36,93,4,3);R_(q,'#3aff7a',37,97,2,1);
 R_(q,'#b8bcc4',18,106,20,13);R_(q,'#f8f8f4',20,108,7,9);R_(q,'#f8f8f4',29,109,7,8);R_(q,'#d8d8d0',22,108,3,1);R_(q,'#d8d8d0',31,109,3,1);
 R_(q,'#8a909c',15,6,2,20);const lit=(+n||0)%2?'#3aff7a':'#ffd84a';R_(q,'#16111c',9,0,14,13);R_(q,lit,10,1,12,11);kpText(q,n,16,7,11,9,'#16111c')})},
// an impulse rack (candy, gum, magazines) at a lane's entrance
candy:{w:22,h:44,c:[16,12],wb:1,f:(g,x,y)=>S2(g,x,y,22,44,q=>{R_(q,'#16111c',2,2,18,40);R_(q,'#5a5e68',3,3,16,38);for(let r=0;r<4;r++){R_(q,'#3a3d46',3,6+r*9,16,1);for(let c=0;c<4;c++)R_(q,['#e8403a','#ffd84a','#3a9ae8','#7ad04a','#c84ab8','#f08a2a'][(r*3+c)%6],4+c*4,7+r*9,3,6)}R_(q,'#8a909c',3,38,16,3)})}});
// shelves like the grocery gondola but with other stock: wine and spirits bottles, pharmacy bottles and boxes
function kpGond(q,v,C,bt){R_(q,'#16111c',2,4,112,40);R_(q,bt?'#6a4a32':'#c8ccd4',3,5,110,38);for(let r=0;r<3;r++){R_(q,bt?'#4a3222':'#9aa0aa',3,16+r*12,110,2);for(let i=0;i<(bt?18:13);i++){const c=C[(i*5+r*3+Math.floor(v*7))%C.length];if(bt){R_(q,c,5+i*6,8+r*12,4,8);R_(q,c,6+i*6,6+r*12,2,2);R_(q,'rgba(255,255,255,.35)',5+i*6,9+r*12,1,4)}else R_(q,c,5+i*8,7+r*12,6,8)}}}
Object.assign(OB,{
wineshelf:ob(116,46,[110,16],(q,v)=>kpGond(q,v,['#5a1a2a','#2a4a2a','#7a2a3a','#c8b070','#3a2a1a','#8a1a2a','#e8e0c8','#1a3a22'],1)),
rxshelf:ob(116,46,[110,16],(q,v)=>kpGond(q,v,['#f4f4f0','#e88a2a','#f4f4f0','#3a8ad0','#e8e4d8','#d84a4a','#f4f4f0','#7ac04a'],0)),
// a self-checkout station: screen, scanner bed, bagging rack with bags
selfco:{w:36,h:52,c:[28,14],wb:1,f:(g,x,y)=>S2(g,x,y,36,52,q=>{R_(q,'#16111c',3,22,30,28);R_(q,'#5a5e68',4,23,28,26);R_(q,'#c8ccd4',4,23,28,8);R_(q,'#2a2a30',7,25,12,4);R_(q,'#d84a3a',9,26,4,1);
 R_(q,'#8a909c',16,4,3,20);R_(q,'#16111c',10,1,16,12);R_(q,'#2a4a6a',11,2,14,10);R_(q,'#7ad0ff',12,3,8,2);R_(q,'#3aff7a',12,7,4,3);R_(q,'#f8f8f4',22,33,8,10);R_(q,'#d8d8d0',24,33,3,1);R_(q,'#3a3d46',7,36,10,8);R_(q,'#ffd84a',8,37,3,2)})},
// a cash machine set in the wall
atm:{w:28,h:46,c:[24,10],wb:1,f:(g,x,y)=>S2(g,x,y,28,46,q=>{R_(q,'#16111c',2,2,24,42);R_(q,'#3a5a8a',3,3,22,40);R_(q,'#2a3a5a',3,3,22,8);kpText(q,'ATM',14,7,20,7,'#f8f6ee');R_(q,'#16111c',6,13,16,11);R_(q,'#7ad0ff',7,14,14,9);R_(q,'#c8ccd4',6,27,16,8);for(let r=0;r<3;r++)for(let c=0;c<3;c++)R_(q,'#5a5e68',8+c*4,28+r*2,3,1);R_(q,'#16111c',8,37,12,2);R_(q,'#3aff7a',18,37,2,2)})},
// an ICE merchandiser (outdoor freezer)
icebox:{w:66,h:46,c:[60,16],wb:1,f:(g,x,y)=>S2(g,x,y,66,46,q=>{R_(q,'#16111c',2,6,62,38);R_(q,'#e8f0f8',3,7,60,36);R_(q,'#2f6fd0',3,7,60,10);kpText(q,'ICE',33,12,40,9,'#f8f6ee');for(const x of[6,35])R_(q,'#c8d8e8',x,20,25,20),R_(q,'#9ab8d0',x+20,28,3,4);R_(q,'#9aa0aa',3,40,60,3)})},
// a propane exchange cage with tanks
propane:{w:58,h:52,c:[52,16],wb:1,f:(g,x,y)=>S2(g,x,y,58,52,q=>{R_(q,'#16111c',2,4,54,46);R_(q,'#3a3d46',3,5,52,44);for(let r=0;r<2;r++)for(let c=0;c<4;c++){const X=6+c*12,Y=10+r*18;R_(q,'#e8e8e4',X,Y,9,14);R_(q,'#c8ccd4',X+6,Y,3,14);R_(q,'#8a909c',X+3,Y-2,3,3)}
 R_(q,'#d84a3a',3,5,52,4);for(let x=6;x<56;x+=6)R_(q,'rgba(220,224,230,.55)',x,9,1,40);for(let y=14;y<48;y+=6)R_(q,'rgba(220,224,230,.4)',3,y,52,1)})},
// a wooden bin of pumpkins
pumpkins:{w:64,h:40,c:[58,14],f:(g,x,y)=>S2(g,x,y,64,40,q=>{R_(q,'#16111c',2,14,60,24);R_(q,'#8a5a32',3,15,58,22);for(let k=18;k<36;k+=6)R_(q,'#6b4426',3,k,58,1);
 for(const[px,py,r]of[[12,15,7],[26,12,8],[41,14,7],[53,16,6],[19,7,6],[35,6,6],[48,8,5]]){q.fillStyle='#16111c';q.beginPath();q.arc(px,py,r+1,0,7);q.fill();q.fillStyle='#e8781c';q.beginPath();q.arc(px,py,r,0,7);q.fill();q.fillStyle='#c85a10';q.fillRect(px-1,py-r+1,2,r*2-2);q.fillStyle='#4a7a2a';q.fillRect(px-1,py-r-2,2,3)}})},
// a pallet of soil and mulch bags
soilbags:{w:60,h:40,c:[54,16],f:(g,x,y)=>S2(g,x,y,60,40,q=>{R_(q,'#16111c',3,32,54,7);R_(q,'#a8703a',4,33,52,5);for(let r=0;r<3;r++)for(let c=0;c<2;c++){const X=5+c*25+(r%2)*2,Y=8+r*8;R_(q,'#16111c',X,Y,25,9);R_(q,(r+c)%2?'#5a3a22':'#3a6a2a',X+1,Y+1,23,7);R_(q,'#e8d8a0',X+8,Y+3,8,2)}})},
// a flower stand: buckets of cut flowers on tiers
flowers:{w:70,h:44,c:[64,14],wb:1,f:(g,x,y)=>S2(g,x,y,70,44,q=>{R_(q,'#16111c',2,26,66,16);R_(q,'#3a6a3a',3,27,64,14);R_(q,'#2a5a2a',3,33,64,1);
 const C=['#ff6a8a','#ffd84a','#f8f8f4','#c86aff','#ff8a3a','#e8304a'];for(let r=0;r<2;r++)for(let i=0;i<7;i++){const X=6+i*9,Y=10+r*12;R_(q,'#2f6b34',X+2,Y+4,2,7);q.fillStyle=C[(i+r*3)%6];q.beginPath();q.arc(X+3,Y+3,4,0,7);q.fill();R_(q,'#9aa0aa',X,Y+9,7,5)}})}});
// ---------- Main Street's pieces ----------
// the theater marquee over the doors (text "NAME|LINE|LINE"), theater seats, a popcorn cart, the bank vault door and the drive-thru
// tube terminal, the church steeple and altar, a street banner that hangs over the road (ov:1, like the market's hanging signs; it
// hangs from the inner arms of two telephone poles 148 px apart), a festival booth, school and railroad crossing signs, freight cars and
// a locomotive, a parking meter, an air & vacuum station and a blue mail drop box
const PKSEAT=[['#a8282a','Red'],['#2a4a8a','Blue'],['#6a2a6a','Plum']],PKSTEEP=[['#4a5060','Slate'],['#7a3a2a','Brick red'],['#3a6a5a','Copper green'],['#3a3d46','Charcoal']];
const PKLOCO=[['#e0b030','Yellow'],['#2f5fa0','Blue'],['#b8392b','Red'],['#3f7a3a','Green']];
function kpTri(q,c,a,b,d){q.fillStyle=c;q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(b[0],b[1]);q.lineTo(d[0],d[1]);q.closePath();q.fill()}
function kpCirc(q,c,x,y,r){q.fillStyle=c;q.beginPath();q.arc(x,y,r,0,7);q.fill()}
// a railroad crossing signal: crossbuck, two red lights, the gate arm reaching right (d=1) or left (d=-1); the post is the base
function kpRR(q,d){const X=100;R_(q,'#16111c',X-3,22,7,78);R_(q,'#e8e8e4',X-2,23,5,77);for(let y=30;y<100;y+=12)R_(q,'#16111c',X-2,y,5,5);
 q.save();q.translate(X,14);for(const a of[.6,-.6]){q.save();q.rotate(a);R_(q,'#16111c',-24,-5,48,10);R_(q,'#f4f4f0',-23,-4,46,8);R_(q,'#16111c',-18,-1,36,2);q.restore()}q.restore();
 R_(q,'#16111c',X-22,34,44,6);for(const s of[-1,1]){kpCirc(q,'#16111c',X+s*17,37,8);kpCirc(q,'#c82a2a',X+s*17,37,6);kpCirc(q,'rgba(255,140,120,.7)',X+s*17-2,35,2)}
 const a0=d>0?X+6:4,L=90;R_(q,'#3a3d46',d>0?X-18:X+6,56,12,10);R_(q,'#16111c',a0,58,L,7);for(let i=0;i<L-2;i+=10)R_(q,(i/10)%2?'#f4f4f0':'#d83a3a',a0+1+i,59,Math.min(10,L-2-i),5);for(const k of[.35,.7,.98])kpCirc(q,'#ff4a3a',d>0?a0+L*k:a0+L*(1-k),57,2)}
// a freight car seen from above, lying left to right: boxcar (var < .34), tank car (< .67) or an open hopper with coal
function kpCar(q,v,K){const t=v<.34?0:v<.67?1:2;R_(q,'#26262a',10,46,30,10);R_(q,'#26262a',164,46,30,10);R_(q,'#16111c',0,30,6,6);R_(q,'#16111c',198,30,6,6);
 if(t==1){R_(q,'#16111c',8,12,188,40);q.fillStyle='#16111c';q.beginPath();q.arc(26,32,21,0,7);q.arc(178,32,21,0,7);q.fill();R_(q,'#2a2c32',9,13,186,38);R_(q,'#3a3d46',9,15,186,10);R_(q,'#4a4e58',9,17,186,3);R_(q,K?K.b:'#d8d8d0',60,30,84,10);kpCirc(q,'#5a5e68',102,24,6);R_(q,'#16111c',4,22,6,20);R_(q,'#16111c',194,22,6,20);return}
 R_(q,'#16111c',4,10,196,44);R_(q,K.d,5,11,194,42);R_(q,K.b,5,11,194,32);if(t==0){R_(q,K.l,5,11,194,4);for(let x=12;x<198;x+=12)R_(q,K.dd,x,11,1,32);R_(q,'#5a5e68',5,26,194,3);R_(q,K.dd,5,43,194,10);R_(q,'#16111c',90,43,24,10);R_(q,K.x,92,44,20,8)}
 else{R_(q,K.dd,9,15,186,26);R_(q,'#26262a',12,17,180,22);for(let i=0;i<46;i++)R_(q,['#3a3a40','#1a1a1e','#4a4a52'][i%3],14+((i*37)%172),18+((i*13)%18),5,3);for(const x of[60,102,144])R_(q,K.d,x,15,4,26)}}
Object.assign(OB,{
marquee:{w:230,h:84,c:0,ov:1,sw:200,pc:PKAWN,txt:48,dt:'ROXY|NOW SHOWING|NIGHT OF THE DEAD',f:(g,x,y,v,col,t)=>S2(g,x,y,230,84,q=>{const K=pcK(pcCol(col,PKAWN)),L=String(cmTxt(t,48)||'ROXY|NOW SHOWING|NIGHT OF THE DEAD').toUpperCase().split('|');
 R_(q,'#16111c',44,0,142,24);R_(q,K.b,45,1,140,22);R_(q,K.dd,45,19,140,4);kpText(q,L[0]||'',115,11,128,15,'#ffd84a',0,'rgba(0,0,0,.45)');
 R_(q,'#16111c',6,22,218,52);R_(q,K.d,7,23,216,50);R_(q,'#f8f6ee',17,31,196,34);R_(q,'#d8d6ce',17,62,196,3);for(let i=0;i<27;i++){kpCirc(q,'#ffe27a',11+i*8,27,2);kpCirc(q,'#ffe27a',11+i*8,69,2)}for(const xx of[11,219])for(let j=35;j<66;j+=8)kpCirc(q,'#ffe27a',xx,j,2);
 kpText(q,L[1]||'',115,40,186,12,'#16111c');kpText(q,L.slice(2).join(' ')||'',115,55,186,12,'#16111c');R_(q,'#16111c',14,74,202,8);for(let i=0;i<25;i++)R_(q,'#ffe9a0',18+i*8,77,3,2)})},
tseats:obt(132,30,[128,14],PKSEAT,0,'',(q,v,K)=>{for(let i=0;i<6;i++){const X=4+i*21;R_(q,'#16111c',X,3,20,25);R_(q,K.b,X+1,4,18,14);R_(q,K.l,X+2,5,16,3);R_(q,K.d,X+1,18,18,8);R_(q,'#2a2a30',X+19,10,3,17)}R_(q,'#2a2a30',2,10,3,17)}),
popcorn:ob(28,44,[22,10],q=>{R_(q,'#16111c',3,4,22,38);R_(q,'#c0392b',4,5,20,5);R_(q,'#e8f0f4',4,10,20,18);for(let i=0;i<22;i++)R_(q,i%3?'#ffe27a':'#fff4c0',5+((i*7)%17),18+((i*5)%9),3,3);R_(q,'#c0392b',4,28,20,12);R_(q,'#ffd84a',6,31,16,3);R_(q,'#16111c',5,40,4,4);R_(q,'#16111c',19,40,4,4)}),
vault:ob(64,66,[60,10],q=>{R_(q,'#16111c',2,4,60,60);R_(q,'#8a909c',3,5,58,58);R_(q,'#6a707a',3,58,58,5);kpCirc(q,'#16111c',32,32,26);kpCirc(q,'#b8bcc4',32,32,24);kpCirc(q,'#9aa0aa',32,32,18);
 for(let k=0;k<12;k++){const a=k*Math.PI/6;kpCirc(q,'#5a5e68',32+Math.cos(a)*21,32+Math.sin(a)*21,2)}q.strokeStyle='#3a3d46';q.lineWidth=3;for(let k=0;k<3;k++){const a=k*Math.PI/3;q.beginPath();q.moveTo(32-Math.cos(a)*12,32-Math.sin(a)*12);q.lineTo(32+Math.cos(a)*12,32+Math.sin(a)*12);q.stroke()}kpCirc(q,'#5a5e68',32,32,4);R_(q,'#c8a040',54,28,4,9)}),
steeple:obt(72,120,[66,62],PKSTEEP,0,'',(q,v,K)=>{R_(q,'#16111c',4,60,64,60);R_(q,'#ece8dc',5,61,62,58);R_(q,'#d8d4c8',5,112,62,7);R_(q,'#16111c',24,70,24,34);kpCirc(q,'#16111c',36,72,12);R_(q,'#3a3d46',26,72,20,32);kpCirc(q,'#3a3d46',36,73,10);for(let y=74;y<102;y+=5)R_(q,'#5a5e68',26,y,20,2);
 kpTri(q,'#16111c',[2,13],[70,13],[36,41]);kpTri(q,'#16111c',[2,13],[2,63],[36,41]);kpTri(q,'#16111c',[70,13],[70,63],[36,41]);kpTri(q,'#16111c',[2,63],[70,63],[36,41]);
 kpTri(q,K.l,[4,15],[68,15],[36,39]);kpTri(q,K.b,[4,15],[4,61],[36,39]);kpTri(q,K.d,[68,15],[68,61],[36,39]);kpTri(q,K.dd,[4,61],[68,61],[36,39]);R_(q,'#16111c',34,6,5,36);R_(q,'#e0b040',35,7,3,34);R_(q,'#16111c',27,14,19,5);R_(q,'#e0b040',28,15,17,3)}),
altar:ob(84,44,[78,16],q=>{R_(q,'#16111c',3,20,78,22);R_(q,'#f4f2ea',4,21,76,20);R_(q,'#c8a040',4,21,76,3);R_(q,'#c8a040',36,21,12,20);R_(q,'#7a1a2a',38,24,8,14);R_(q,'#16111c',40,2,4,20);R_(q,'#e0b040',41,3,2,18);R_(q,'#16111c',35,7,14,4);R_(q,'#e0b040',36,8,12,2);
 for(const xx of[14,66]){R_(q,'#16111c',xx-2,9,5,13);R_(q,'#f8f4e0',xx-1,10,3,11);kpCirc(q,'#ffb040',xx+.5,7,2)}}),
stbanner:{w:170,h:112,c:0,ov:1,sw:150,pc:PKHS,txt:30,dt:'HOMETOWN|FALL FESTIVAL',f:(g,x,y,v,col,t)=>S2(g,x,y,170,112,q=>{const K=pcK(pcCol(col,PKHS)),L=String(cmTxt(t,30)||'HOMETOWN|FALL FESTIVAL').toUpperCase().split('|');
 q.strokeStyle='#3a3d46';q.lineWidth=1.5;for(const[a,b]of[[26,30],[144,140]]){q.beginPath();q.moveTo(a,8);q.lineTo(b,48);q.stroke()}q.beginPath();q.moveTo(26,8);q.quadraticCurveTo(85,26,144,8);q.stroke();for(let i=1;i<10;i++){const u=i/10,xx=26+118*u,yy=8+36*u*(1-u);kpTri(q,['#e8403a','#ffd84a','#3a9ae8','#7ad04a','#e8781c'][i%5],[xx-4,yy],[xx+4,yy],[xx,yy+8])}
 R_(q,K.dd,16,46,138,40);R_(q,K.b,17,47,136,36);R_(q,K.ll,17,47,136,3);R_(q,K.d,17,80,136,3);R_(q,'#f8f6ee',21,51,128,1);R_(q,'#f8f6ee',21,77,128,1);
 if(L.length>1){kpText(q,L[0],85,58,124,10,'#f8f6ee');kpText(q,L.slice(1).join(' '),85,70,128,13,'#ffe27a',0,'rgba(0,0,0,.35)')}else kpText(q,L[0],85,64,128,15,'#ffe27a',0,'rgba(0,0,0,.35)')})},
fbooth:obt(80,70,[72,16],PKAWN,14,'CIDER',(q,v,K,t)=>{for(const xx of[6,72])R_(q,'#16111c',xx-1,20,4,48),R_(q,'#8a6a4a',xx,21,2,47);R_(q,'#16111c',2,4,76,22);for(let i=0;i<74;i+=9)R_(q,(i/9)%2?'#f4f0e0':K.b,3+i,5,Math.min(9,74-i),20);
 for(let i=0;i<8;i++){q.fillStyle=i%2?'#f4f0e0':K.b;q.beginPath();q.arc(7+i*9.4,26,5,0,Math.PI);q.fill()}R_(q,'#16111c',14,22,52,11);R_(q,'#f8f6ee',15,23,50,9);kpText(q,String(t).toUpperCase(),40,28,46,8,'#26262c');
 R_(q,'#16111c',6,48,68,18);R_(q,'#a8784a',7,49,66,8);R_(q,'#8a5a32',7,57,66,8);for(let i=0;i<7;i++)kpCirc(q,['#e8781c','#c0392b','#f4d040','#7ab84a'][(i+Math.floor(v*4))%4],13+i*9,46,4)}),
schoolx:Object.assign(ob(28,60,[4,4],q=>{R_(q,'#16111c',12,26,4,34);R_(q,'#9aa0aa',13,27,2,33);q.fillStyle='#16111c';q.beginPath();q.moveTo(14,0);q.lineTo(28,11);q.lineTo(28,29);q.lineTo(0,29);q.lineTo(0,11);q.closePath();q.fill();
 q.fillStyle='#c8e830';q.beginPath();q.moveTo(14,2);q.lineTo(26,12);q.lineTo(26,27);q.lineTo(2,27);q.lineTo(2,12);q.closePath();q.fill();for(const[xx,s]of[[10,1],[18,.85]]){kpCirc(q,'#16111c',xx,12,2*s);R_(q,'#16111c',xx-2*s,14,4*s,7*s);R_(q,'#16111c',xx-2*s,21*s+(1-s)*21,1.6,4);R_(q,'#16111c',xx+1,21*s+(1-s)*21,1.6,4)}R_(q,'#16111c',4,24,20,1)}),{wb:1}),
rrxing:Object.assign(ob(200,100,[8,6],q=>kpRR(q,1)),{wb:1}),rrxing2:Object.assign(ob(200,100,[8,6],q=>kpRR(q,-1)),{wb:1}),
boxcar:{w:204,h:58,c:[200,40],pc:PKCONT,f:(g,x,y,v,col)=>S2(g,x,y,204,58,q=>kpCar(q,v,pcK(pcCol(col,PKCONT))))},
loco:obt(214,62,[210,42],PKLOCO,0,'',(q,v,K)=>{R_(q,'#26262a',12,50,40,10);R_(q,'#26262a',160,50,40,10);R_(q,'#16111c',2,12,210,44);R_(q,K.b,3,13,208,42);R_(q,K.d,3,44,208,10);R_(q,'#26262a',3,40,208,4);
 R_(q,K.l,3,13,208,3);for(let x=20;x<150;x+=14)R_(q,K.dd,x,18,8,16);R_(q,'#3a3d46',40,20,24,10);kpCirc(q,'#2a2c32',100,24,6);R_(q,'#16111c',158,8,46,40);R_(q,K.b,159,9,44,38);R_(q,K.ll,159,9,44,4);R_(q,'#1a2a3a',163,16,36,10);R_(q,'rgba(170,220,255,.5)',165,17,10,3);
 R_(q,'#f4f4f0',3,46,208,2);kpCirc(q,'#ffe9a0',208,30,3);kpCirc(q,'#ffe9a0',6,30,3)}),
pmeter:Object.assign(ob(12,36,[4,4],q=>{R_(q,'#16111c',4,14,4,22);R_(q,'#5a5e68',5,15,2,21);R_(q,'#16111c',1,1,10,15);R_(q,'#8a909c',2,2,8,13);R_(q,'#c8e0f0',3,4,6,5);R_(q,'#d83a3a',4,5,3,2);R_(q,'#5a5e68',3,11,6,2)}),{wb:1}),
airpump:Object.assign(ob(32,48,[26,10],q=>{R_(q,'#16111c',4,6,24,42);R_(q,'#c0392b',5,7,22,40);R_(q,'#2f6fd0',5,7,22,12);kpText(q,'AIR',16,13,18,8,'#f8f6ee');R_(q,'#f8f6ee',8,22,16,8);R_(q,'#16111c',10,24,12,4);R_(q,'#7ad04a',11,25,5,2);
 q.strokeStyle='#16111c';q.lineWidth=2;q.beginPath();q.arc(26,34,6,0,7);q.stroke();R_(q,'#8a909c',5,42,22,4)}),{wb:1}),
dtterm:Object.assign(ob(28,52,[22,10],q=>{R_(q,'#16111c',4,4,20,46);R_(q,'#6a7a8a',5,5,18,44);R_(q,'#16111c',7,8,14,9);R_(q,'#7ad0ff',8,9,12,7);for(let k=0;k<3;k++)R_(q,'#3a3d46',8,20+k*3,12,1);R_(q,'#16111c',7,30,14,10);R_(q,'#c8e8f8',8,31,12,8);R_(q,'#f8f8f4',11,32,6,6);R_(q,'#3aff7a',18,43,2,2);R_(q,'#4a5a6a',5,46,18,3)}),{wb:1}),
dropbox:ob(26,42,[20,12],q=>{R_(q,'#16111c',2,6,22,32);q.fillStyle='#16111c';q.beginPath();q.arc(13,8,11,Math.PI,0);q.fill();R_(q,'#2a4aa0',3,7,20,30);q.fillStyle='#2a4aa0';q.beginPath();q.arc(13,8,10,Math.PI,0);q.fill();R_(q,'#16111c',6,10,14,3);R_(q,'#f8f6ee',7,18,12,6);R_(q,'#c0392b',7,18,12,2);R_(q,'#16111c',4,37,4,5);R_(q,'#16111c',18,37,4,5)})});
// ---------- Deadway Highway's pieces ----------
// the two picture billboards (the Old West attraction and the army recruiting poster), a mile marker, a call box, a reflector post
function kpBill(g,x,py,k){const bw=300,bh=124,bx=x-bw/2,by=py-70-bh,R=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(a,b,w,h)},T=(t,a,b,f,c,al)=>{g.font=f;g.textAlign=al||'center';g.textBaseline='middle';g.fillStyle='#16111c';for(const[dx,dy]of[[2,2],[1,2],[2,1]])g.fillText(t,a+dx,b+dy);g.fillStyle=c;g.fillText(t,a,b)};
g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+8,py+2,bw*.42,10,0,0,7);g.fill();
for(const px of[x-90,x+90]){R('#16111c',px-6,by+bh-2,12,py-by-bh+4);R('#6e737b',px-5,by+bh,10,py-by-bh+1);R('#9aa0aa',px-5,by+bh,3,py-by-bh+1);R('#4a4e56',px-1,by+bh,2,py-by-bh+1);for(let y=by+bh+10;y<py-6;y+=16)R('#4a4e56',px-5,y,10,2)}
R('#16111c',bx-4,by+bh+2,bw+8,8);R('#5a5e66',bx-3,by+bh+3,bw+6,6);for(let i=bx;i<bx+bw;i+=12)R('#3a3d44',i,by+bh+3,2,6);
R('#16111c',bx-3,by-3,bw+6,bh+6);R('#e8e4d8',bx-1,by-1,bw+2,bh+2);g.save();g.beginPath();g.rect(bx,by,bw,bh);g.clip();
if(k=='west'){const sky=['#ffcf6a','#ffb04a','#ff944a','#f07a4a','#d8664a'];sky.forEach((c,i)=>R(c,bx,by+i*14,bw,14));g.fillStyle='#fff2b0';g.beginPath();g.arc(bx+250,by+52,20,0,7);g.fill();
g.fillStyle='#b8784a';g.beginPath();g.moveTo(bx,by+78);g.lineTo(bx+40,by+56);g.lineTo(bx+70,by+66);g.lineTo(bx+110,by+50);g.lineTo(bx+150,by+78);g.fill();g.fillStyle='#c98a50';g.beginPath();g.moveTo(bx+150,by+78);g.lineTo(bx+200,by+60);g.lineTo(bx+240,by+72);g.lineTo(bx+300,by+58);g.lineTo(bx+300,by+80);g.fill();R('#d8a868',bx,by+78,bw,46);R('#c8945a',bx,by+90,bw,2);R('#c8945a',bx,by+106,bw,2);
// saloon front with swinging doors, a water tower and a cactus
R('#16111c',bx+186,by+44,98,62);R('#8a5a34',bx+187,by+45,96,60);R('#a8703a',bx+187,by+45,96,6);R('#6a4024',bx+187,by+72,96,3);R('#f4e0a0',bx+200,by+52,70,12);g.font='bold 10px Arial, Helvetica, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#7a2a1a';g.fillText('SALOON',bx+235,by+58);
R('#2a1a10',bx+222,by+80,26,25);R('#c8945a',bx+223,by+84,11,14);R('#c8945a',bx+236,by+84,11,14);R('#fff4c0',bx+195,by+80,14,10);R('#fff4c0',bx+261,by+80,14,10);R('#16111c',bx+186,by+105,98,2);
R('#5a3a22',bx+150,by+60,4,46);R('#5a3a22',bx+172,by+60,4,46);R('#16111c',bx+146,by+40,34,24);R('#7a5232',bx+147,by+41,32,22);R('#6a4024',bx+147,by+48,32,2);R('#6a4024',bx+147,by+55,32,2);
const cac=(cx,cy,s)=>{R('#16111c',cx-4*s,cy-28*s,8*s,30*s);R('#3f8a42',cx-3*s,cy-27*s,6*s,28*s);R('#16111c',cx-12*s,cy-18*s,6*s,12*s);R('#3f8a42',cx-11*s,cy-17*s,4*s,10*s);R('#3f8a42',cx-11*s,cy-9*s,10*s,3*s);R('#16111c',cx+6*s,cy-22*s,6*s,10*s);R('#3f8a42',cx+7*s,cy-21*s,4*s,8*s);R('#3f8a42',cx+2*s,cy-14*s,8*s,3*s)};cac(bx+128,by+110,1);cac(bx+24,by+116,.7);
T('VISIT THE',bx+12,by+16,'bold 13px Arial, Helvetica, sans-serif','#fff4c0','left');T('OLD WEST!',bx+10,by+38,'bold 24px Arial, Helvetica, sans-serif','#7a2a1a','left');
R('rgba(122,42,26,.92)',bx,by+bh-22,bw,22);T('SHOOTOUTS AT HIGH NOON · GOLD PANNING',x,by+bh-15,'bold 10px Arial, Helvetica, sans-serif','#fff4c0');T('EXIT 21 · 30 MILES',x,by+bh-5,'bold 8px Arial, Helvetica, sans-serif','#ffcf6a')}
else{R('#4f5a3a',bx,by,bw,bh);for(let i=0;i<7;i++)R(i%2?'#f4f1e6':'#b8261e',bx,by+bh-30+i*4,bw,4);R('#1f3f7a',bx,by+bh-30,92,28);
g.fillStyle='#f4f1e6';for(let r=0;r<3;r++)for(let c=0;c<5;c++)g.fillRect(bx+8+c*17+(r%2)*8,by+bh-26+r*8,3,3);
// helmeted soldier silhouette pointing at you
g.fillStyle='#16111c';g.beginPath();g.ellipse(bx+250,by+44,30,18,0,Math.PI,0);g.fill();R('#16111c',bx+218,by+42,64,6);g.fillStyle='#6a7056';g.beginPath();g.ellipse(bx+250,by+44,28,16,0,Math.PI,0);g.fill();R('#5a6048',bx+220,by+43,60,4);R('#16111c',bx+230,by+48,40,34);R('#d8a878',bx+232,by+48,36,24);R('#16111c',bx+238,by+56,6,3);R('#16111c',bx+256,by+56,6,3);R('#a8784a',bx+242,by+66,16,2);
R('#16111c',bx+214,by+72,72,22);R('#6a7056',bx+215,by+73,70,20);R('#16111c',bx+196,by+60,26,12);R('#d8a878',bx+197,by+61,22,10);R('#d8a878',bx+192,by+62,8,4);
g.fillStyle='#e8c040';const st=(cx,cy,r)=>{g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}g.fill()};st(bx+42,by+52,9);st(bx+158,by+52,9);
T('ZOMBVILLE NEEDS YOU!',bx+100,by+18,'bold 13px Arial, Helvetica, sans-serif','#e8c040');T('JOIN THE',bx+100,by+42,'bold 15px Arial, Helvetica, sans-serif','#f4f1e6');T('ARMY',bx+100,by+66,'bold 30px Arial, Helvetica, sans-serif','#f4f1e6');
R('rgba(22,17,28,.75)',bx+96,by+bh-28,bw-96,24);T('SIGN UP AT YOUR LOCAL',bx+198,by+bh-21,'bold 10px Arial, Helvetica, sans-serif','#f4f1e6');T('MILITARY BASE',bx+198,by+bh-9,'bold 11px Arial, Helvetica, sans-serif','#e8c040')}
g.restore();g.textAlign='left';g.textBaseline='alphabetic';
// spotlights along the top
for(let i=0;i<4;i++){const lx=bx+40+i*74;R('#16111c',lx-1,by-14,3,12);R('#16111c',lx-6,by-17,12,6);R('#8a909c',lx-5,by-16,10,4);R('#fff4c0',lx-4,by-13,8,1)}}
Object.assign(OB,{
bbwest:Object.assign(ob(320,218,0,q=>kpBill(q,160,214,'west')),{wb:1}),bbarmy:Object.assign(ob(320,218,0,q=>kpBill(q,160,214,'army')),{wb:1}),
milemkr:Object.assign(obt(18,44,[4,4],null,3,'13',(q,v,K,t)=>{R_(q,'#16111c',8,20,3,24);R_(q,'#8a9096',9,21,1,23);R_(q,'#16111c',1,1,16,22);R_(q,'#1d7a3e',2,2,14,20);R_(q,'#f4f1e6',3,3,12,1);kpText(q,'MILE',9,7,12,5,'#f4f1e6');kpText(q,String(t),9,15,12,8,'#f4f1e6')}),{wb:1}),
callbox:Object.assign(ob(20,50,[4,4],q=>{R_(q,'#16111c',8,20,4,30);R_(q,'#8a9096',9,21,2,29);R_(q,'#16111c',2,2,16,20);R_(q,'#e8c040',3,3,14,18);R_(q,'#16111c',5,6,10,5);R_(q,'#3a3d46',6,7,8,3);kpText(q,'SOS',10,16,12,6,'#c0392b')}),{wb:1}),
reflpost:Object.assign(ob(8,26,[3,3],q=>{R_(q,'#16111c',2,2,4,24);R_(q,'#f4f4f0',3,3,2,23);R_(q,'#ffb02a',2,4,4,5);R_(q,'#16111c',3,18,2,1)}),{wb:1})});
// tall median light poles (two heads on curved arms; sodium yellow unless coloured): hwlight lit, hwlightf a failing one (its right
// head stutters; half that lens is dim so the editor tells it apart), hwlightx a dead one (dark heads, the right arm bent, a wire
// hanging). Their light falls round the foot of the pole, over the lanes either side. hwpoledown: a pole knocked flat, seen from above.
const PKHWL=[['#ffc860','Sodium yellow'],['#fff2c8','Warm white'],['#e8f0ff','Cool white']];
function kpPole(q,K,st){q.fillStyle='#16111c';q.beginPath();q.moveTo(55,198);q.lineTo(57,30);q.lineTo(63,30);q.lineTo(65,198);q.fill();q.fillStyle='#8a9098';q.beginPath();q.moveTo(56.5,197);q.lineTo(58,31);q.lineTo(62,31);q.lineTo(63.5,197);q.fill();
R_(q,'#b4bac2',58,32,1,164);R_(q,'#6e737b',61,32,1,164);R_(q,'#16111c',53,150,14,6);R_(q,'#6e737b',54,151,12,4);R_(q,'#c8a030',55,152,10,2);R_(q,'#16111c',48,190,24,10);R_(q,'#5a5e66',49,191,22,8);R_(q,'#7a7f88',49,191,22,2);
const arm=(a,b,c,d,e,f)=>{q.lineCap='round';q.strokeStyle='#16111c';q.lineWidth=5;q.beginPath();q.moveTo(a,b);q.quadraticCurveTo(c,d,e,f);q.stroke();q.strokeStyle='#8a9098';q.lineWidth=2.5;q.stroke();q.lineCap='butt'};
const head=(x,y,lit,dim)=>{R_(q,'#16111c',x-1,y-1,30,12);R_(q,'#5a5e66',x,y,28,10);R_(q,'#8a9098',x,y,28,3);R_(q,'#16111c',x+2,y+7,24,5);R_(q,lit?K.b:'#2a2c32',x+3,y+8,22,3);if(lit)R_(q,'#ffffff',x+5,y+8,8,1);if(dim)R_(q,'rgba(40,40,52,.6)',x+14,y+8,11,3)};
arm(60,36,58,14,33,15);head(6,10,st<2,0);if(st<2){arm(60,36,62,14,87,15);head(86,10,1,st==1)}else{arm(60,36,66,22,82,42);q.save();q.translate(82,42);q.rotate(.9);R_(q,'#16111c',-3,-6,30,12);R_(q,'#4a4e56',-2,-5,28,10);R_(q,'#2a2c32',1,2,22,3);R_(q,'#9aa0a8',8,2,3,2);q.restore();
 q.strokeStyle='#16111c';q.lineWidth=1;q.beginPath();q.moveTo(84,46);q.quadraticCurveTo(90,70,86,92);q.stroke();R_(q,'#c8a030',85,91,3,3)}}
Object.assign(OB,{
hwlight:Object.assign(obc(120,200,[10,8],PKHWL,(q,v,K)=>kpPole(q,K,0)),{wb:1,nr:1,lt:[{dx:-46,dy:-4,r:230,i:1},{dx:46,dy:-4,r:230,i:1}]}),
hwlightf:Object.assign(obc(120,200,[10,8],PKHWL,(q,v,K)=>kpPole(q,K,1)),{wb:1,nr:1,lt:[{dx:-46,dy:-4,r:230,i:1},{dx:46,dy:-4,r:230,i:1,f:'fault'}]}),
hwlightx:Object.assign(obc(120,200,[10,8],PKHWL,(q,v,K)=>kpPole(q,K,2)),{wb:1}),
hwpoledown:ob(224,44,0,q=>{R_(q,'#16111c',4,26,190,8);R_(q,'#8a9098',5,27,188,6);R_(q,'#b4bac2',5,27,188,2);for(const[x,y,w]of[[2,25,4],[0,29,3],[3,33,3]])R_(q,'#6e737b',x,y,w,2);R_(q,'#16111c',190,4,8,38);R_(q,'#8a9098',191,5,6,36);
 for(const[y,d]of[[2,-1],[34,1]]){R_(q,'#16111c',196,y,26,9);R_(q,'#5a5e66',197,y+1,24,7);R_(q,'#2a2c32',199,y+(d<0?6:1),20,2)}for(let i=0;i<9;i++)R_(q,i%2?'#bfe6ff':'#8a9ab0',150+((i*37)%60),18+((i*23)%22),2,2)}),
// the sign gantry: a truss over the road on two lattice legs, two signs hanging from it (split the text with ' / ', a slash with
// spaces round it, so 1/2 MILE stays one sign; | breaks a line;
// a sign starting with * is an amber message board). It hangs over people and goes see-through while someone is under it. A low
// look (var under 0.3) leaves the right sign hanging crooked from one bracket. Each sign has a lamp under it, so it reads at night.
gantry:{w:400,h:210,c:0,ov:1,sw:380,nr:1,txt:60,dt:'EXIT 13|GRAVEYARD|1/2 MILE / *QUARANTINE AHEAD|USE EXIT 13',lt:[{dx:-84,dy:-110,r:96,i:.6},{dx:84,dy:-110,r:96,i:.6}],f:(g,x,y,v,col,t)=>S2(g,x,y,400,210,q=>{
 const L=(a,b,c,d)=>{q.beginPath();q.moveTo(a,b);q.lineTo(c,d);q.stroke()};
 for(const lx of[18,370]){R_(q,'#16111c',lx-1,56,14,150);R_(q,'#8a9098',lx,56,3,149);R_(q,'#8a9098',lx+9,56,3,149);q.strokeStyle='#6e737b';q.lineWidth=1.5;for(let yy=60;yy<198;yy+=14){L(lx+2,yy,lx+10,yy+7);L(lx+10,yy+7,lx+2,yy+14)}R_(q,'#16111c',lx-6,200,24,10);R_(q,'#9a968c',lx-5,201,22,8);R_(q,'#b4b0a6',lx-5,201,22,2)}
 R_(q,'#16111c',8,32,384,28);R_(q,'#8a9098',9,33,382,4);R_(q,'#8a9098',9,54,382,4);R_(q,'#b4bac2',9,33,382,1);q.strokeStyle='#6e737b';q.lineWidth=2;for(let xx=12;xx<386;xx+=16)L(xx,37,xx+8,54),L(xx+8,54,xx+16,37);R_(q,'#2a2c32',9,37,382,1);
 const P=String(cmTxt(t,60)||'EXIT 13|GRAVEYARD|1/2 MILE / *QUARANTINE AHEAD|USE EXIT 13').split(/\s+\/\s+/).slice(0,2);if(P.length<2)P.push('');
 const sign=(s,bx)=>{const led=s.charAt(0)=='*',ln=s.replace(/^\*/,'').toUpperCase().split('|').slice(0,3).filter(z=>z.trim()!=='');R_(q,'#16111c',bx+20,58,4,6);R_(q,'#16111c',bx+128,58,4,6);
  R_(q,'#16111c',bx,62,152,78);if(led){R_(q,'#3a3d46',bx+2,64,148,74);R_(q,'#0e0c10',bx+6,68,140,66);const n=ln.length||1,hh=58/n;ln.forEach((z,i)=>kpText(q,z,bx+76,72+hh*(i+.5),132,Math.min(15,hh-2),'#ffc040','ui-monospace,monospace'));
   q.fillStyle='rgba(14,12,16,.35)';for(let yy=68;yy<134;yy+=2)q.fillRect(bx+6,yy,140,1);for(let xx=bx+6;xx<bx+146;xx+=3)q.fillRect(xx,68,1,66)}
  else{R_(q,'#1d7a3e',bx+2,64,148,74);R_(q,'#f4f1e6',bx+5,67,142,2);R_(q,'#f4f1e6',bx+5,133,142,2);R_(q,'#f4f1e6',bx+5,67,2,68);R_(q,'#f4f1e6',bx+145,67,2,68);const n=ln.length||1;
   ln.forEach((z,i)=>{const big=n==1||i==1||(n==2&&i==0&&!/\d/.test(z)),px=n==1?22:big?18:12,yy=n==1?101:n==2?(i?112:86):[80,101,122][i];kpText(q,z,bx+76,yy,134,px,'#f4f1e6')})}
  R_(q,'#16111c',bx+60,140,32,6);R_(q,'#4a4e56',bx+61,141,30,4);R_(q,'#fff2c8',bx+63,141,26,1)};
 sign(P[0],40);if(v<.3){q.save();q.translate(228,60);q.rotate(.13);q.translate(-228,-60);sign(P[1],208);q.restore();R_(q,'#16111c',336,58,4,3)}else sign(P[1],208)})},
// a ROAD CLOSED barricade (your text on its plate), striped boards on two legs, an amber lamp blinking on top
rcbarr:Object.assign(obt(124,56,[112,8],null,16,'ROAD CLOSED',(q,v,K,t)=>{for(const lx of[12,104]){R_(q,'#16111c',lx,8,8,46);R_(q,'#d8d4c8',lx+1,9,6,44);R_(q,'#16111c',lx-4,50,16,5);R_(q,'#5a5e66',lx-3,51,14,3)}
 for(const yy of[20,34]){R_(q,'#16111c',2,yy,120,10);q.save();q.beginPath();q.rect(3,yy+1,118,8);q.clip();R_(q,'#f4f1e6',3,yy+1,118,8);q.fillStyle='#e8642a';for(let xx=-10;xx<124;xx+=16){q.beginPath();q.moveTo(xx,yy+9);q.lineTo(xx+8,yy+9);q.lineTo(xx+16,yy+1);q.lineTo(xx+8,yy+1);q.fill()}q.restore()}
 R_(q,'#16111c',24,3,76,15);R_(q,'#f4f1e6',25,4,74,13);kpText(q,String(t).toUpperCase(),62,11,70,10,'#16111c');R_(q,'#16111c',13,0,8,7);R_(q,'#ffa62a',14,1,6,5);R_(q,'#fff2b0',15,2,2,2)}),{wb:1,nr:1,lt:[{dx:-45,dy:-52,r:34,i:.9,f:'blink',c:'#ffa62a'}]}),
// a searchlight whose beam sweeps slowly back and forth (about 30° either way of where it is turned)
sweeplight:Object.assign({},OB.searchlight,{vw:0,lt:[{dx:0,dy:-26,r:520,w:7,sw:30}]})});
// ---------- the Haunted Mansion's pieces ----------
// dust sheets thrown over furniture: dsheet_c an armchair, dsheet_s a sofa, dsheet_t something tall (a mirror, a clock); sconce: two
// candles on a brass bracket against a wall (candle light); hchand: a crystal chandelier hanging over the room, its candles lit (it is
// drawn over people and goes see-through while someone is under it); hchandx: the same, dark, crooked and cobwebbed; cryptdoor: a heavy
// crypt door standing ajar, seen from above (its hinge is the left end: turn it to swing it open)
function kpSheet(q,o,folds,seat){q.fillStyle='rgba(0,0,0,.28)';q.beginPath();q.ellipse(o.w/2,o.h-3,o.w/2-2,3,0,0,7);q.fill();q.fillStyle='#cfccc2';q.beginPath();o.top(q);
for(let x=o.r;x>o.l;x-=4)q.lineTo(x-2,o.h-(x%8<4?2:4));q.closePath();q.fill();q.save();q.clip();q.fillStyle='rgba(255,255,255,.35)';q.beginPath();q.ellipse(o.w*.32,o.h*.25,o.w*.2,o.h*.14,-.4,0,7);q.fill();
q.strokeStyle='#aeaaa0';q.lineWidth=1.5;for(const[a,b,c,d]of folds){q.beginPath();q.moveTo(a,b);q.quadraticCurveTo((a+c)/2+2,(b+d)/2,c,d);q.stroke()}if(seat){q.beginPath();q.moveTo(seat[0],seat[1]);q.quadraticCurveTo(o.w/2,seat[1]+5,seat[2],seat[1]);q.stroke()}
q.fillStyle='rgba(60,56,50,.25)';q.fillRect(0,o.h-7,o.w,7);q.restore()}
function kpChand(q,lit){const cx=55;R_(q,'#16111c',cx-2,0,4,40);for(let y=2;y<40;y+=6)R_(q,'#a8862e',cx-1,y,2,4);q.fillStyle='#16111c';q.beginPath();q.ellipse(cx,44,12,6,0,0,7);q.fill();q.fillStyle='#c8a040';q.beginPath();q.ellipse(cx,44,10,4,0,0,7);q.fill();
q.strokeStyle='#a8862e';q.lineWidth=1.5;for(let i=0;i<8;i++){const a=i*Math.PI/4;q.beginPath();q.moveTo(cx,46);q.quadraticCurveTo(cx+Math.cos(a)*20,62,cx+Math.cos(a)*44,72+Math.sin(a)*16);q.stroke()}
for(const[ry,rx,y]of[[16,44,72],[9,26,88]]){q.strokeStyle='#16111c';q.lineWidth=6;q.beginPath();q.ellipse(cx,y,rx,ry,0,0,7);q.stroke();q.strokeStyle='#c8a040';q.lineWidth=3;q.stroke()}
for(let i=0;i<16;i++){const a=i*Math.PI/8,x=cx+Math.cos(a)*44,y=72+Math.sin(a)*16;R_(q,i%2?'#bfe6ff':'#e8f0f8',x-1,y+2,2,6+(i%3)*2)}for(let i=0;i<10;i++){const a=i*Math.PI/5,x=cx+Math.cos(a)*26,y=88+Math.sin(a)*9;R_(q,'#d8ecf8',x-1,y+2,2,8)}
R_(q,'#e8f0f8',cx-2,96,4,16);R_(q,'#bfe6ff',cx-1,112,2,6);
for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,x=Math.round(cx+Math.cos(a)*44),y=Math.round(72+Math.sin(a)*16);R_(q,'#16111c',x-3,y-12,6,12);R_(q,lit?'#f4ecd8':'#9a968c',x-2,y-11,4,10);if(lit){R_(q,'#ff9a2a',x-2,y-17,4,5);R_(q,'#ffe08a',x-1,y-16,2,3)}else R_(q,'#2a2420',x,y-13,1,3)}
if(!lit){q.strokeStyle='rgba(225,225,225,.55)';q.lineWidth=1;for(const[a,b,c,d]of[[cx-44,72,cx-30,100],[cx+44,72,cx+36,104],[cx,40,cx-40,70],[cx-26,88,cx-10,118]]){q.beginPath();q.moveTo(a,b);q.quadraticCurveTo((a+c)/2+6,(b+d)/2,c,d);q.stroke()}}}
Object.assign(OB,{
dsheet_c:ob(38,36,[30,20],q=>kpSheet(q,{w:38,h:36,l:4,r:34,top:q=>{q.moveTo(4,33);q.quadraticCurveTo(2,20,6,14);q.quadraticCurveTo(6,3,19,3);q.quadraticCurveTo(32,3,32,14);q.quadraticCurveTo(36,20,34,33)}},[[12,9,9,32],[19,12,19,33],[27,9,29,32]],[7,17,31])),
dsheet_s:ob(74,34,[66,20],q=>kpSheet(q,{w:74,h:34,l:3,r:71,top:q=>{q.moveTo(3,31);q.quadraticCurveTo(1,16,8,11);q.quadraticCurveTo(37,1,66,11);q.quadraticCurveTo(73,16,71,31)}},[[14,10,12,31],[28,7,27,32],[46,7,47,32],[60,10,62,31]],[8,16,66])),
dsheet_t:ob(38,64,[32,12],q=>kpSheet(q,{w:38,h:64,l:4,r:34,top:q=>{q.moveTo(4,61);q.lineTo(5,11);q.quadraticCurveTo(6,2,19,2);q.quadraticCurveTo(32,2,33,11);q.lineTo(34,61)}},[[11,8,10,60],[19,6,19,61],[27,8,28,60]],null)),
sconce:{w:18,h:24,c:0,f:(g,x,y)=>S2(g,x,y,18,24,q=>{R_(q,'#16111c',6,6,6,14);R_(q,'#a8862e',7,7,4,12);R_(q,'#c8a040',7,7,2,12);q.strokeStyle='#a8862e';q.lineWidth=2;q.beginPath();q.moveTo(9,16);q.quadraticCurveTo(3,18,4,13);q.moveTo(9,16);q.quadraticCurveTo(15,18,14,13);q.stroke();
 for(const cx of[4,14]){R_(q,'#16111c',cx-3,12,6,3);R_(q,'#c8a040',cx-2,12,4,2);R_(q,'#16111c',cx-2,5,4,8);R_(q,'#f4ecd8',cx-1,6,2,6);R_(q,'#ff9a2a',cx-1,1,2,4);R_(q,'#ffe08a',cx-1,2,1,2)}})},
hchand:{w:110,h:120,c:0,ov:1,sw:60,nr:1,lt:[{dx:0,dy:-48,r:250,i:.9,f:'flk'}],f:(g,x,y)=>S2(g,x,y,110,120,q=>kpChand(q,1))},
hchandx:{w:110,h:120,c:0,ov:1,sw:60,f:(g,x,y)=>S2(g,x,y,110,120,q=>{q.translate(55,0);q.rotate(.12);q.translate(-55,0);kpChand(q,0)})},
cryptdoor:ob(64,22,0,q=>{q.fillStyle='rgba(0,0,0,.3)';q.fillRect(6,12,56,8);R_(q,'#16111c',4,4,56,13);R_(q,'#7c786e',5,5,54,11);R_(q,'#9a968c',5,5,54,3);R_(q,'#5e5a52',5,13,54,3);for(const x of[14,30,46])for(const yy of[8,12])R_(q,'#3a3832',x,yy,2,2);
 q.fillStyle='#16111c';q.beginPath();q.arc(5,10,5,0,7);q.fill();q.fillStyle='#4a4a52';q.beginPath();q.arc(5,10,3,0,7);q.fill();R_(q,'#3a3d46',52,8,4,6)})});
// props that belong at doorways (cmDoorBlocks leaves them out)
for(const k of['awning','walllight','wallflk','exitsign','curtain','wcsign','banner','deptsign','hsign','haisle','marquee','vault','sconce','portrait','cryptdoor'])if(OB[k])OB[k].dk=1;
