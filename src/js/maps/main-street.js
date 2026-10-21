//# maps/main-street.js — Hometown Main Street map
// ---------- Hometown Main Street: shops, one stop light, city hall, police + fire stations, urgent care, a gas station, houses on the edge of town ----------
function msH(i,k){const v=Math.sin(i*12.9898+k*78.233+5.9)*43758.5453;return v-Math.floor(v)}
// eight different houses: siding colour, room layout, floors, furniture, fence and yard all change from one to the next
const MSV=[
{sid:'#8fb4d8',tr:'#f4f4f0',fl:[['#8a6a4a','#7e6044'],['#7a8ab8','#6e7eac']],sp:[.5],fd:.3,bd:.38,fen:'pick',F:[['couch',.22,70],['table',.22,130],['plant',.05,4],['cabinet',.2,4],['bed',.64,4],['wardrobe',.88,4],['chair',.86,120]],Y:[['swing',.5,0]]},
{sid:'#a8583e',tr:'#e8e0d0',fl:[['#d8d0b8','#ccc4ac'],['#8a8a84','#80807a']],sp:[.62],dy:.25,fd:.3,fen:'wood',gar:1,open:1,F:[['stove',.08,4],['cabinet',.18,4],['bookshelf',.4,4],['table',.3,100],['chair',.2,106],['couch',.3,150],['tirestack',.7,4]],Y:[['doghouse',.25,0],['grill',.75,0]]},
{sid:'#e8d890',tr:'#6a4a2a',fl:[['#a07a52','#946e48'],['#e8ecf0','#dde2e8'],['#c87a8a','#bc6e7e']],sp:[.36,.68],fd:.52,bd:.27,fen:'pick',bath:[.36,.68],F:[['bed',.1,4],['wardrobe',.27,120],['tub',.52,4],['toilet',.64,4],['plant',.52,150],['stove',.76,4],['cabinet',.86,4],['table',.84,110],['chair',.75,116]],Y:[['tramp',.5,0]]},
{sid:'#e0a8b8',tr:'#f4f4f0',fl:[['#c8a070','#bc9464'],['#8ab0a0','#7ea494']],sp:[.55],fd:.4,nobd:1,fen:'pastel',small:1,porch:1,F:[['fplace',.27,4],['couch',.27,80],['piano',.78,4],['plant',.94,4]],Y:[['grill',.3,0],['flower',.6,0],['flower',.7,0],['flower',.8,0]]},
{sid:'#4a4e58',tr:'#d8dce4',fl:[['#e8eaee','#dcdee4']],sp:[],fd:.5,bd:.45,fen:'chain',pool:1,F:[['couch',.3,90],['table',.3,150],['plant',.04,4],['plant',.96,4],['cabinet',.6,4],['cabinet',.68,4],['table',.78,90],['chair',.7,96],['chair',.86,96],['bookshelf',.9,4]],Y:[]},
{sid:'#c8a878',tr:'#5a3a22',fl:[['#9a6a3e','#8e6036'],['#b88a5a','#ac7e4e']],sp:[.42],fd:.25,bd:.53,fen:'wood',F:[['stove',.07,4],['cabinet',.17,4],['cabinet',.25,4],['table',.2,100],['chair',.1,106],['chair',.3,106],['fplace',.78,4],['couch',.7,90],['bookshelf',.94,4]],Y:[['fbed',.3,0],['fbed',.7,0],['barrel',.95,0]]},
{sid:'#8ab87a',tr:'#f4f4f0',fl:[['#c8b898','#bcac8c'],['#6a8ac8','#5e7ebc']],sp:[.45],fd:.22,bd:.3,fen:'pick',bath:[.45,1],F:[['couch',.2,80],['table',.2,140],['plant',.04,4],['tub',.6,4],['toilet',.78,4],['msink',.9,4],['bed',.72,999]],Y:[['picnic',.35,0],['grill',.7,0]]},
{sid:'#f0eee6',tr:'#2a3a5a',fl:[['#7a5232','#6e4a2c'],['#a8988a','#9c8c7e'],['#c8b8a0','#bcac94']],sp:[.3,.66],fd:.48,bd:.2,fen:'hedge',open:1,hoop:1,F:[['plant',.05,4],['chair',.16,120],['plant',.05,150],['piano',.48,4],['couch',.48,110],['bed',.8,4],['wardrobe',.93,4]],Y:[['bench',.5,0]]}];
function msHouse(HO,D,V,x,y,w,h,side,v){const S=MSV[v];if(S.small){const nh=160,nw=220;if(side=='s')y+=h-nh;x+=Math.round((w-nw)/2);w=nw;h=nh}
const top=side=='n',fd=x+Math.round(w*S.fd),bd=x+Math.round(w*(S.bd??(S.fd<.5?.82:.16))),F=top?y:y+h,B=top?y+h:y;
hwall(F,x,x+w,[fd]);hwall(B,x,x+w,S.gar||S.nobd?[]:[bd]);vwall(x,y,y+h,[]);vwall(x+w,y,y+h,[]);
for(const f of S.sp)vwall(x+Math.round(w*f),y,y+h,[S.dy?(top?y+h-h*S.dy:y+h*S.dy):y+h*.5]);
if(S.bath){const by=top?y+Math.round(h*.55):y+Math.round(h*.45),a=x+Math.round(w*S.bath[0]),b=x+Math.round(w*S.bath[1]);hwall(by,a,b,[Math.round((a+b)/2)])}
for(const[k,uf,p]of S.F){const c=OB[k].c?OB[k].c[1]:6,cw=OB[k].c?OB[k].c[0]:6,pp_=p==999?h-c-14:p;let bx=x+Math.round(w*uf);const by=top?y+h-6-pp_:y+6+pp_+c;
for(const[dx,near]of[[bd,pp_<40],[fd,pp_+c>h-50]])if(near&&!(S.gar&&dx==bd)&&Math.abs(bx-dx)<cw/2+34)bx=dx+(bx<dx?-1:1)*(cw/2+36);bx=cl(bx,x+cw/2+6,x+w-cw/2-6);put(D,k,bx,by)}
if(S.gar)V.push({k:'sedan',x:x+Math.round(w*.81),y:y+h/2,a:top?-Math.PI/2:Math.PI/2,L:72,W:32,c:['#2f6fd0','#c0392b'][v%2]});
HO.push({x,y,w,h,side,fd,bd,v,S})}
function mapMainSt(){WW=2800;WH=2600;
const MY=1300,MR=72,OX=1400,OR=56,EY=480,SY_=2170,RR=50,SW=36;
HS={px:1300,py:MY-MR-18,cx:1400,cy:1300,nx0:-999,nx1:-998,ny0:-999,ny1:-998};
// ----- road graph (the police car drives it) -----
const N=[],A=[],nid=(x,y)=>{let i=N.findIndex(n=>n[0]==x&&n[1]==y);if(i<0){i=N.length;N.push([x,y]);A.push([])}return i},ed=(a,b)=>{A[a].push(b);A[b].push(a)};
for(const y of[EY,MY,SY_]){const xs=[60,700,OX,2100,WW-60];for(let i=0;i<xs.length-1;i++)ed(nid(xs[i],y),nid(xs[i+1],y))}
{const ys=[60,EY,MY,SY_,WH-60];for(let i=0;i<ys.length-1;i++)ed(nid(OX,ys[i]),nid(OX,ys[i+1]))}HS.RG={N,A};
const RD=[[0,MY-MR,WW,2*MR],[OX-OR,0,2*OR,WH],[0,EY-RR,WW,2*RR],[0,SY_-RR,WW,2*RR]];
const D=[],pp=(k,x,y)=>put(D,k,x,y),V=[],G=[],H=[];dtBox.D=[];
// ----- downtown blocks: shops + restaurants on the north side, civic buildings on the south side -----
const NB=MY-MR-SW,SB=MY+MR+SW;
const B=[
[110,NB-290,350,NB,'hard','s','HARDWARE'],[360,NB-260,640,NB,'diner','s','MAIN ST DINER'],[650,NB-240,820,NB,'barber','s','BARBER'],[830,NB-250,1050,NB,'bakery','s','BAKERY'],[1060,NB-280,OX-OR-40,NB,'books','s','BOOKS'],
[OX+OR+40,NB-260,1720,NB,'pizza','s','PIZZA'],[1730,NB-300,2080,NB,'clinic','s','URGENT CARE'],[2090,NB-240,2280,NB,'icecream','s','ICE CREAM'],
[110,SB,570,SB+360,'police','n','POLICE'],[580,SB,800,SB+240,'cafe','n','CORNER CAFE'],[OX+OR+620+40,SB,2400,SB+250,'flower','n','FLOWERS'],[2410,SB,2700,SB+260,'post','n','POST OFFICE']];
for(const[x0,y0,x1,y1,ty,fr,nm]of B){const b=[x0,y0,x1,y1],w=x1-x0,h=y1-y0;dtBox(b,fr,w>300?[.3,.7]:[.5],1);G.push({b,ty,fr,nm});H.push({x:x0,y:y0,w,h,ty});
const uv=dtUV(b,fr),P2=(k,u,v)=>{const p=uv(u,v);pp(k,p[0],p[1])},rL=w,rD=h;
switch(ty){
case 'hard':for(let v=110;v<rD-40;v+=80)P2('gshelf',rL/2,v);P2('checkout',rL-50,58);P2('toolbox',30,rD-14);P2('tirestack',rL-24,rD-14);P2('barrel',60,rD-12);break;
case 'diner':for(let u=50;u<rL-40;u+=78)P2('rbooth',u,90);P2('counter',rL/2,rD*.72);P2('stove',40,rD-14);P2('stove',76,rD-14);P2('fridge',rL-46,rD-12);break;
case 'barber':P2('bchair',40,110);P2('bchair',90,110);P2('bchair',140,110);P2('mirror',90,rD-14);P2('chair',30,40);P2('chair',56,40);P2('plant',rL-20,40);break;
case 'bakery':P2('display',rL/2,96);P2('counter',rL/2,rD*.66);P2('espresso',40,rD-14);P2('stove',rL-40,rD-14);P2('table',50,40);break;
case 'books':for(let u=40;u<rL-30;u+=60)P2('bookshelf',u,rD-12);for(let u=60;u<rL-60;u+=90)P2('bookshelf',u,130);P2('couch',rL*.3,60);P2('table',rL*.72,60);break;
case 'pizza':for(let u=50;u<rL-40;u+=80)P2('table',u,74);for(let u=50;u<rL-40;u+=80)P2('table',u,140);P2('counter',rL/2,rD*.76);P2('stove',40,rD-14);P2('fridge',rL-46,rD-12);break;
case 'clinic':{P2('rdesk',rL/2,110);for(let u=40;u<rL/2-60;u+=26)P2('chair',u,40);for(let u=rL/2+60;u<rL-30;u+=26)P2('chair',u,40);const[ax,ay]=uv(0,170),[bx,by]=uv(rL,170);hwall(ay,ax,bx,[x0+rL*.25,x0+rL*.75]);vwall(x0+rL/2,y0,ay,[]);
for(const u of[rL*.12,rL*.62]){P2('hbed',u+30,rD-60);P2('ivp',u+70,rD-30);P2('cabinet',u+110,rD-12)}break}
case 'icecream':P2('display',rL/2,rD-40);P2('table',50,60);P2('table',rL-50,60);P2('fridge',40,rD-12);break;
case 'police':{P2('rdesk',rL/2,100);P2('plant',30,40);P2('plant',rL-30,40);P2('chair',rL/2-90,40);P2('chair',rL/2-64,40);P2('vending',rL-60,40);
const cy=y0+170;hwall(cy,x0,x1,[x0+rL*.5]);for(let i=0;i<3;i++){const cx=x0+i*100;pp('bars',cx+50,cy+76);vwall(cx+100,cy+70,y1,[])}
for(let u=330;u<rL-30;u+=60)P2('tdesk',u,rD-80);P2('lockerx',rL-30,rD-14);P2('cabinet',rL-60,rD-12);break}
case 'cafe':P2('espresso',rL/2,rD-14);P2('counter',rL/2,rD-50);for(const u of[50,rL-50])for(const v of[60,120])P2('table',u,v);break;
case 'flower':for(let u=50;u<rL-40;u+=70)P2('planter',u,70);P2('counter',rL/2,rD-50);P2('plant',30,rD-14);P2('plant',rL-30,rD-14);break;
case 'post':P2('counter',rL/2,rD*.6);P2('cabinet',30,rD-12);P2('cabinet',56,rD-12);for(let u=60;u<rL-40;u+=50)P2('mail',u,50);break}}
// fire department: two open bays facing Main Street, the engine parked in bay 1, bunk room behind
const FX0=820,FX1=OX-OR-40,FY1=SB+420,BAY=[FX0+110,FX0+300];
hwall(SB,FX0,FX1,[BAY[0],BAY[1]],70);hwall(FY1,FX0,FX1,[FX1-80]);vwall(FX0,SB,FY1,[]);vwall(FX1,SB,FY1,[SB+120]);hwall(SB+280,FX0,FX1,[FX0+200,FX1-120]);vwall(FX0+400,SB,SB+280,[]);
V.push({k:'fire',x:BAY[0],y:SB+128,a:-Math.PI/2,L:178,W:48});
for(let y=SB+40;y<SB+260;y+=58){pp('gear',BAY[1]-60,y+50);pp('gear',BAY[1]+60,y+50)}pp('hoserack',FX0+460,SB+60);pp('hoserack',FX0+460,SB+130);pp('toolbox',FX0+470,SB+240);
for(let x=FX0+40;x<FX1-60;x+=70)pp('bunk',x,FY1-12);pp('couch',FX0+260,SB+330);pp('table',FX0+120,SB+340);pp('stove',FX1-60,SB+300);pp('fridge',FX1-120,SB+310);
G.push({b:[FX0,SB,FX1,FY1],ty:'fire',fr:'n',nm:'FIRE DEPT'});H.push({x:FX0,y:SB,w:FX1-FX0,h:FY1-SB,ty:'fire'});
// city hall: a big solid building with steps, columns, flagpoles and a plaza
const CX0=OX+OR+100,CX1=OX+OR+600,CY0=SB+110,CY1=SB+520,CC=(CX0+CX1)/2;WL.push([CX0,CY0,CX1-CX0,CY1-CY0,1]);
for(let x=CX0+40;x<=CX1-40;x+=60)pp('column',x,CY0+4);pp('flagpole',CX0-30,CY0-10);pp('flagpole',CX1+30,CY0-10);pp('fntn',CC,SB+60);
for(const x of[CX0+40,CX1-40])pp('bench',x,SB+60);for(const x of[CX0-60,CX1+60])pp('planter',x,SB+30);
HS.CH={x:CC,y:CY0+40,rx:CX0,ry:CY0,rw:CX1-CX0,rh:CY1-CY0};
// gas station on the east edge of town
const GX0=2340,GX1=2770,GY1=NB,GY0=NB-460;dtBox([GX0+170,GY0,GX1,GY0+190],'s',[.4],1);{const b=[GX0+170,GY0,GX1,GY0+190],uv=dtUV(b,'s'),P2=(k,u,v)=>{const p=uv(u,v);pp(k,p[0],p[1])};P2('gshelf',150,110);P2('checkout',60,60);for(let u=40;u<560-200;u+=72)P2('fridge',u,176);G.push({b,ty:'mart',fr:'s',nm:'GAS & GO'});H.push({x:b[0],y:b[1],w:b[2]-b[0],h:b[3]-b[1],ty:'mart'})}
const CAN=[GX0+40,GY0+250,GX1-20,GY1-40];for(const[x,y]of[[CAN[0]+20,CAN[1]+20],[CAN[2]-20,CAN[1]+20],[CAN[0]+20,CAN[3]],[CAN[2]-20,CAN[3]]])pp('pillar',x,y);
for(const x of[GX0+150,GX0+300])for(const y of[CAN[1]+90,CAN[1]+160]){pp('pump',x-16,y);pp('pump',x+16,y)}pp('trash',GX0+225,CAN[1]+128);
V.push({k:'sedan',x:GX0+225,y:CAN[1]+60,a:Math.PI/2,L:72,W:32,c:'#2f8a4a'});
// ----- the houses on the edge of town -----
const HN=[[200,160,260,200],[700,170,250,190],[1700,160,270,200],[2200,170,250,190]],HSo=[[220,SY_+RR+90,260,200],[740,SY_+RR+90,250,190],[1650,SY_+RR+90,270,200],[2160,SY_+RR+90,260,200]],HO=[];
[...HN.map(q=>[...q,'s']),...HSo.map(q=>[...q,'n'])].forEach((q,i)=>msHouse(HO,D,V,q[0],q[1],q[2],q[3],q[4],[0,1,2,3,4,5,6,7][i]));
const YD=[];for(const h of HO){const top=h.side=='n',yx=[h.x-60,h.x+h.w+60],yy=top?[SY_+RR+26,Math.min(WH-10,h.y+h.h+70)]:[Math.max(10,h.y-70),EY-RR-26];YD.push([yx[0],yy[0],yx[1],yy[1],top]);
{const a=Math.min(yy[0],yy[1]),b=Math.max(yy[0],yy[1]),fr=top?a:b,bk=top?b:a;fv(WL,yx[0],a,b,[]);fv(WL,yx[1],a,b,[]);WL.push([yx[0],bk-2,yx[1]-yx[0],4,2]);if(!h.S.open)WL.push([yx[0],fr-2,h.fd-22-yx[0],4,2],[h.fd+22,fr-2,yx[1]-h.fd-22,4,2])}
pp('stree',h.x-95,top?h.y+60:h.y+h.h-20);for(const u of[30,46,h.w-46,h.w-30])pp('flower',h.x+u,top?h.y-10:h.y+h.h+20);pp('mail',h.fd+50,top?h.y-50:h.y+h.h+56);
const by=top?h.y+h.h+40:h.y-24;for(const[k,uf]of h.S.Y)pp(k,h.x+h.w*uf,k=='flower'?(top?h.y-14:h.y+h.h+24):by+(k=='fbed'&&top?20:0));if(h.S.pool)WL.push([h.x+h.w*.25,top?h.y+h.h+18:h.y-58,h.w*.5,40,1]);if(h.S.hoop){pp('hoop',h.x+h.w-30,top?h.y-8:h.y+h.h+50);V.push({k:'pickup',x:h.x+h.w-60,y:top?SY_+RR-22:EY-RR+22,a:top?0:Math.PI,L:85,W:35,c:'#2a3a5a'})}}
H.push(...HO.map(h=>({x:h.x,y:h.y,w:h.w,h:h.h,ty:'house'})));HS.HO=H;
// ----- behind the shops: an alley with dumpsters + small lots; a town green with a gazebo east of Oak -----
const AY=NB-330;for(const[x,y]of[[200,AY+20],[520,AY+20],[930,AY+20],[1180,AY+20],[1600,AY+20],[1900,AY+10]])pp('dumpster',x,y);for(const[x,y]of[[260,AY+30],[980,AY+36],[1650,AY+34]])pp('bags',x,y);
const PK_=[1520,640,2280,AY-40];pp('gazebo',(PK_[0]+PK_[2])/2,(PK_[1]+PK_[3])/2+30);for(const[x,y]of[[1600,700],[2200,700],[1600,830],[2200,830]])pp('bench',x,y);for(const[x,y]of[[1560,660],[2250,660],[1700,780],[2100,790],[1560,850],[2250,850]])pp('stree',x,y);
for(const[x,y]of[[1760,700],[2050,700]])pp('lamp',x,y);pp('flagpole',1820,860);for(const[x,y]of[[200,640],[420,700],[640,620],[900,690],[1150,640],[1250,760],[560,780],[80,860]])pp('stree',x,y);for(const[x,y]of[[320,620],[780,720],[1050,780]])pp('bush',x,y);
V.push({k:'sedan',x:420,y:AY-30,a:0,L:72,W:32,c:'#6a4a9a'},{k:'pickup',x:760,y:AY-26,a:Math.PI,L:85,W:35,c:'#2f8a4a'},{k:'van',x:1120,y:AY-30,a:0,L:83,W:37,c:'#d8d8d4'});
for(const[x,y]of[[700,SB+300],[700,1990],[1300,1990],[1100,1900],[2200,1820],[2500,1950],[2650,1820],[2300,2050],[80,2000],[400,1990]])pp('stree',x,y);pp('wtower',2560,1990);pp('picnic',2380,1880);pp('picnic',2380,1990);
// ----- cars: parked along Main Street, a few wrecks, cruisers behind the station -----
const cc=['#c0392b','#2f6fd0','#d8d8d4','#26262c','#2f8a4a','#f0c020','#8a8f96','#6a4a9a','#3a8a8a','#b8783c'],ks=['sedan','suv','sedan','pickup','van','sedan'];let n=0;
for(const s of[-1,1])for(let x=60;x<WW-60;x+=110+msH(n,1)*60){n++;if(Math.abs(x-OX)<160||(s>0&&x>CX0-40&&x<CX1+40)||(s>0&&Math.abs(x-BAY[0])<80)||(s<0&&x>GX0-60)||msH(n,2)<.5)continue;const k=ks[n%6],z=HWV(k);V.push({k,x,y:MY+s*52,a:s<0?Math.PI:0,L:z[0]*.88,W:z[1]*.84,c:cc[n%cc.length]})}
V.push({k:'sedan',x:560,y:MY-46,a:2.6,L:72,W:32,c:'#2f6fd0',dmg:1},{k:'pickup',x:640,y:MY-58,a:-.4,L:85,W:35,c:'#c0392b',dmg:1});
V.push({k:'suv',x:2050,y:MY+50,a:.35,L:79,W:35,c:'#26262c',dmg:1},{k:'sedan',x:1610,y:MY-50,a:-2.9,L:72,W:32,c:'#f0c020',dmg:1,hz:1},{k:'van',x:960,y:MY+55,a:.15,L:83,W:37,c:'#d8d8d4',dmg:1});
V.push({k:'sedan',x:1520,y:SY_-40,a:.4,L:72,W:32,c:'#8a8f96',dmg:1},{k:'pickup',x:250,y:EY+36,a:-.2,L:85,W:35,c:'#b8783c'});
for(const x of[200,300,400])V.push({k:'police',x,y:SB+410+22,a:-Math.PI/2,L:84,W:36,lt:0});
for(const v of V)hwCol(v);
// ----- street furniture: lamps, trees, benches, hydrants, the stop light -----
const okSW=(x,y)=>!WL.some(w=>x>w[0]-20&&x<w[0]+w[2]+20&&y>w[1]-18&&y<w[1]+w[3]+18)&&!dtBox.D.some(d=>Math.abs(d[0]-x)<50&&Math.abs(d[1]-y)<50);
const SF=['lamp','stree','bench','lamp','stree','planter','trash','lamp','stree','newsb'];n=0;
for(const s of[-1,1])for(let x=90;x<WW-60;x+=130){n++;if(Math.abs(x-OX)<120)continue;const yy=MY+(s<0?-MR-8:MR+SW-4),k=SF[n%SF.length];if(okSW(x,yy))pp(k,x,yy)}
for(const[x,y]of[[OX-OR-16,MY-MR-6],[OX+OR+16,MY+MR+34]])pp('tlight',x,y);
for(const[x,y]of[[1000,MY-MR-6],[2030,MY+MR+22],[OX-OR-18,EY+RR+40],[700,SY_-RR-8]])pp('hydrant',x,y);
pp('mail',OX+OR+22,MY-MR-8);pp('newsb',OX-OR-24,MY+MR+26);
const KO=[...RD.map(r=>[r[0]-10,r[1]-SW-10,r[0]+r[2]+10,r[1]+r[3]+SW+10]),...G.map(q=>[q.b[0]-10,q.b[1]-10,q.b[2]+10,q.b[3]+10]),[CX0-80,SB,CX1+80,CY1+20],[GX0,GY0,GX1+30,GY1+10],...YD.map(y=>[y[0]-4,Math.min(y[1],y[3])-4,y[2]+4,Math.max(y[1],y[3])+4]),[90,SB,580,SB+470]];
D.push(...scatter(23,[['tuft',5],['flower',3],['bush',1],['rock',1]],90,KO));D.ko=KO;
const SP=[];for(const y of[EY,MY,SY_]){SP.push([20,y-20],[20,y+20],[WW-20,y-20],[WW-20,y+20])}SP.push([OX-20,20],[OX+20,20],[OX-20,WH-20],[OX+20,WH-20]);HS.sp=SP;
SM=[];grid();
// ======================= paint =======================
const g=ground('#5a9a46','#62a24a','#55923f','#4a8a3a');
// sidewalks (clean concrete) then streets
const side=(x,y,w,h)=>{g.fillStyle='#c4c2ba';g.fillRect(x,y,w,h);g.fillStyle='#b2b0a8';for(let i=0;i<w;i+=32)g.fillRect(x+i,y,1,h);for(let j=0;j<h;j+=32)g.fillRect(x,y+j,w,1)};
side(0,MY-MR-SW,WW,SW);side(0,MY+MR,WW,SW);side(OX-OR-SW,0,SW,WH);side(OX+OR,0,SW,WH);for(const y of[EY,SY_]){side(0,y-RR-24,WW,24);side(0,y+RR,WW,24)}
side(CX0-100,SB,CX1-CX0+200,CY0-SB);                     // city hall plaza
g.fillStyle='#d8d4c8';for(let i=0;i<4;i++)g.fillRect(CX0+20,CY0-10-i*10,CX1-CX0-40,8);g.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<4;i++)g.fillRect(CX0+20,CY0-3-i*10,CX1-CX0-40,1);
for(const r of RD){g.fillStyle='#8a8a84';g.fillRect(r[0]-3,r[1]-3,r[2]+6,r[3]+6)}for(const r of RD){g.fillStyle='#3e4046';g.fillRect(r[0],r[1],r[2],r[3])}
for(let i=0;i<4000;i++){const r=RD[i%RD.length],x=r[0]+msH(i,5)*r[2],y=r[1]+msH(i,6)*r[3];g.fillStyle=i%3?'rgba(0,0,0,.1)':'rgba(255,255,255,.05)';g.fillRect(x,y,2+i%3,2)}
// lane paint
g.fillStyle='rgba(230,190,60,.85)';for(let x=0;x<WW;x+=4)if(Math.abs(x-OX)>OR+30){g.fillRect(x,MY-4,4,3);g.fillRect(x,MY+1,4,3)}
for(let y=0;y<WH;y+=4)if(Math.abs(y-MY)>MR+30&&Math.abs(y-EY)>RR+10&&Math.abs(y-SY_)>RR+10)g.fillRect(OX-1,y,3,4);
for(const y of[EY,SY_])for(let x=0;x<WW;x+=50)if(Math.abs(x-OX)>OR+20)g.fillRect(x,y-1,26,3);
g.fillStyle='rgba(240,240,232,.6)';for(const s of[-1,1])for(let x=0;x<WW;x+=4)if(Math.abs(x-OX)>OR+30)g.fillRect(x,MY+s*28-1,4,2);
g.fillStyle='rgba(245,245,238,.85)';for(let k=-MR+8;k<MR-8;k+=14){g.fillRect(OX-OR-30,MY+k,22,8);g.fillRect(OX+OR+8,MY+k,22,8)}for(let k=-OR+6;k<OR-6;k+=14){g.fillRect(OX+k,MY-MR-30,8,22);g.fillRect(OX+k,MY+MR+8,8,22)}
g.fillStyle='rgba(245,245,238,.9)';g.fillRect(OX-OR-34,MY-MR+4,4,MR-6);g.fillRect(OX+OR+30,MY+4,4,MR-8);
// the stop light hangs over the middle of the intersection
// small parking lots: behind the shops, the police lot, the gas station apron
const AS=(x,y,w,h)=>{g.fillStyle='#45474d';g.fillRect(x,y,w,h);g.fillStyle='rgba(245,245,238,.7)';for(let i=x+10;i<x+w-10;i+=50)g.fillRect(i,y+6,3,46)};
AS(110,SB+380,460,100);
g.fillStyle='#3e4046';g.fillRect(GX0,GY0+190,GX1-GX0+30,GY1-GY0-190);g.fillRect(GX0,GY0,170,190);
// canopy over the pumps: a big translucent roof outline
g.fillStyle='rgba(20,20,24,.18)';g.fillRect(CAN[0],CAN[1],CAN[2]-CAN[0],CAN[3]-CAN[1]);g.strokeStyle='#c0392b';g.lineWidth=6;g.strokeRect(CAN[0],CAN[1],CAN[2]-CAN[0],CAN[3]-CAN[1]);g.strokeStyle='#f4f4f0';g.lineWidth=2;g.strokeRect(CAN[0]+5,CAN[1]+5,CAN[2]-CAN[0]-10,CAN[3]-CAN[1]-10);
for(const x of[GX0+150,GX0+300]){g.fillStyle='#16111c';g.fillRect(x-44,CAN[1]+56,88,126);g.fillStyle='#b4b2aa';g.fillRect(x-42,CAN[1]+58,84,122)}
{const x=GX0+12,y=GY1-20;g.fillStyle='#16111c';g.fillRect(x-4,y-80,8,80);g.fillRect(x-40,y-122,80,48);g.fillStyle='#c0392b';g.fillRect(x-38,y-120,76,16);g.fillStyle='#f4f4f0';g.font='bold 11px Arial';g.textAlign='center';g.fillText('GAS & GO',x,y-108);g.fillStyle='#16111c';g.fillRect(x-38,y-104,76,28);g.fillStyle='#ffd84a';g.font='bold 12px ui-monospace,monospace';g.fillText('3.49⁹',x,y-86);g.textAlign='left'}
// yards: mowed stripes and a garden bed
for(const y of YD){const y0=Math.min(y[1],y[3]),y1=Math.max(y[1],y[3]);for(let x=y[0];x<y[2];x+=24){g.fillStyle=(x/24|0)%2?'rgba(255,255,255,.05)':'rgba(0,0,0,.04)';g.fillRect(x,y0,12,y1-y0)}}
for(const h of HO){const top=h.side=='n';if(top)side(h.fd-14,SY_+RR+24,28,h.y-(SY_+RR+24));else side(h.fd-14,h.y+h.h,28,EY-RR-24-(h.y+h.h))}
// alley behind the north shops, the town green's paths
g.fillStyle='#55575d';g.fillRect(90,AY-60,OX-OR-90,90);g.fillRect(OX+OR,AY-10,GX0-OX-OR-40,40);g.fillStyle='rgba(245,245,238,.6)';for(let x=110;x<OX-OR-20;x+=60)g.fillRect(x,AY-58,3,40);
g.fillStyle='#c8b890';g.fillRect(PK_[0],(PK_[1]+PK_[3])/2+24,PK_[2]-PK_[0],14);g.fillRect((PK_[0]+PK_[2])/2-7,PK_[1],14,PK_[3]-PK_[1]);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(PK_[0],(PK_[1]+PK_[3])/2+36,PK_[2]-PK_[0],2);
// floors
const FL={hard:['#a8a49a','#9e9a90'],diner:['#f4f4f0','#26262c'],barber:['#f4f4f0','#26262c'],bakery:['#e8d8b8','#dccca8'],books:['#7a5232','#6e4a2c'],pizza:['#c8784a','#b86a3e'],clinic:['#eef2f4','#e2e6e8'],icecream:['#f8d8e4','#f0c8d8'],police:['#b8bcc4','#aeb2ba'],cafe:['#8a6040','#7a5438'],flower:['#e8ecdf','#dfe4d4'],post:['#c8c4b8','#bcb8ac'],fire:['#a8a8a0','#9c9c94'],mart:['#eceee8','#e2e4de']};
for(const q of G){const[x0,y0,x1,y1]=q.b,f=FL[q.ty];(q.ty=='clinic'||q.ty=='diner'||q.ty=='barber'||q.ty=='mart'||q.ty=='police'?tiles:chk)(g,x0,y0,x1-x0,y1-y0,f[0],f[1])}
chk(g,FX0,SB+280,FX1-FX0,FY1-SB-280,'#8a6a4a','#7e6044');g.fillStyle='rgba(240,200,64,.85)';for(const x of BAY)for(let y=SB+10;y<SB+260;y+=30)g.fillRect(x-60,y,4,16),g.fillRect(x+56,y,4,16);
for(const h of HO){const{x,y,w,S}=h,hh=h.h,top=h.side=='n',xs=[0,...S.sp,1];for(let i=0;i<xs.length-1;i++){const a=x+Math.round(w*xs[i]),b=x+Math.round(w*xs[i+1]),f=S.gar&&i==xs.length-2?['#8a8a84','#80807a']:S.fl[i%S.fl.length];(S.pool?tiles:chk)(g,a,y,b-a,hh,f[0],f[1])}
if(S.bath){const a=x+Math.round(w*S.bath[0]),b=x+Math.round(w*S.bath[1]),y0=top?y+Math.round(hh*.55):y,y1=top?y+hh:y+Math.round(hh*.45);tiles(g,a,y0,b-a,y1-y0,'#e8f0f4','#d8e4ec')}
if(S.gar){g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+w*.81,y+hh/2+20,18,8,0,0,7);g.fill()}
if(S.porch){const py=top?y-34:y+hh;g.fillStyle='#16111c';g.fillRect(x+16,py-1,w-32,36);g.fillStyle='#b8885a';g.fillRect(x+18,py,w-36,34);g.fillStyle='#9a6e44';for(let k=x+18;k<x+w-18;k+=10)g.fillRect(k,py,1,34)}
if(S.pool){const px=x+w*.25,py=top?y+hh+18:y-58;g.fillStyle='#d8d4c8';g.fillRect(px-8,py-8,w*.5+16,56);g.fillStyle='#16111c';g.fillRect(px-1,py-1,w*.5+2,42);g.fillStyle='#3aa8d8';g.fillRect(px,py,w*.5,40);g.fillStyle='rgba(255,255,255,.4)';for(let k=0;k<5;k++)g.fillRect(px+8+k*24,py+8+(k%2)*14,14,2);g.fillStyle='#c8ccd4';g.fillRect(px+w*.5-14,py+2,3,12);g.fillRect(px+w*.5-8,py+2,3,12)}
if(S.open){const a=top?SY_+RR+24:y+hh,b=top?y:EY-RR-24,cx=S.gar?x+w*.81:x+w-60;g.fillStyle='#b4b2aa';g.fillRect(cx-40,Math.min(a,b),80,Math.abs(b-a));g.fillStyle='rgba(0,0,0,.08)';for(let k=Math.min(a,b);k<Math.max(a,b);k+=20)g.fillRect(cx-40,k,80,1)}}
// police cells floor
chk(g,110,SB+240,300,120,'#8a8e96','#80848c');
wl(g,'#26262c','#c8c4b8');
for(const h of HO){const S=h.S,top=h.side=='n';for(const q of WL){if(q[4]||q[0]<h.x-4||q[0]>h.x+h.w+4||q[1]<h.y-4||q[1]>h.y+h.h+4)continue;g.fillStyle='#16111c';g.fillRect(q[0],q[1],q[2],q[3]);g.fillStyle=S.sid;g.fillRect(q[0]+1,q[1]+1,Math.max(0,q[2]-2),Math.max(0,q[3]-2))}
for(const wy of[h.y,h.y+h.h])for(let wx=h.x+24;wx<h.x+h.w-30;wx+=56){if(Math.abs(wx+13-h.fd)<40||Math.abs(wx+13-h.bd)<40)continue;g.fillStyle='#16111c';g.fillRect(wx-1,wy-4,28,8);g.fillStyle='#9ad0f0';g.fillRect(wx,wy-3,26,6);g.fillStyle='rgba(255,255,255,.6)';g.fillRect(wx+3,wy-2,6,2);g.fillStyle=S.tr;g.fillRect(wx-6,wy-4,5,8);g.fillRect(wx+27,wy-4,5,8)}
if(S.gar){const gy=top?h.y:h.y+h.h,gx=h.x+h.w*.81;g.fillStyle='#16111c';g.fillRect(gx-38,gy-5,76,10);g.fillStyle='#e8e4d8';g.fillRect(gx-37,gy-4,74,8);g.fillStyle='rgba(0,0,0,.2)';for(let k=gx-34;k<gx+36;k+=8)g.fillRect(k,gy-4,1,8)}
{const dy=top?h.y:h.y+h.h;g.fillStyle=S.tr;g.fillRect(h.fd-24,dy-5,4,10);g.fillRect(h.fd+20,dy-5,4,10)}}
// picket fences (or wood, chain-link, hedges) around the yards
for(const y of YD){const a=Math.min(y[1],y[3]),b=Math.max(y[1],y[3]),top=y[4],fr=top?a:b,bk=top?b:a,h=HO[YD.indexOf(y)],FS=h.S.fen,FC={pick:['#f8f6ee','#f4f2ea'],pastel:['#f8d8e4','#f0c8d8'],wood:['#9a6a3e','#7a5232'],chain:['#c8ccd4','#9aa0aa'],hedge:['#3f8a3a','#2f6b34']}[FS],pk=(x0,y0,x1,y1)=>{if(FS=='hedge'){g.fillStyle='#16111c';const hz=x1-x0>y1-y0;if(hz){g.fillRect(x0,y0-9,x1-x0,14);for(let k=x0;k<x1;k+=9){g.fillStyle=k%18?FC[0]:FC[1];g.beginPath();g.arc(k+4,y0-3,7,0,7);g.fill()}}else{g.fillRect(x0-6,y0,14,y1-y0);for(let k=y0;k<y1;k+=9){g.fillStyle=k%18?FC[0]:FC[1];g.beginPath();g.arc(x0+1,k+4,7,0,7);g.fill()}}return}if(FS=='chain'){if(x1-x0>y1-y0)fenceH(g,x0,y0,x1-x0);else fenceV(g,x0,y0,y1-y0);return}if(x1-x0>y1-y0){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x0,y0+2,x1-x0,4);g.fillStyle=FC[1];g.fillRect(x0,y0-3,x1-x0,2);g.fillRect(x0,y0+1,x1-x0,2);for(let x=x0;x<x1;x+=7){g.fillStyle='#16111c';g.fillRect(x,y0-8,5,11);g.fillStyle=FC[0];g.fillRect(x+1,y0-7,3,9)}}else{g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x0+2,y0,4,y1-y0);for(let yy=y0;yy<y1;yy+=7){g.fillStyle='#16111c';g.fillRect(x0-2,yy,5,6);g.fillStyle=FC[0];g.fillRect(x0-1,yy+1,3,4)}}};
pk(y[0],a,y[0]+2,b);pk(y[2],a,y[2]+2,b);pk(y[0],bk,y[2],bk);if(!h.S.open){pk(y[0],fr,h.fd-22,fr);pk(h.fd+22,fr,y[2],fr)}}

// city hall roof: slate with a clock dome and a big seal
{const w=CX1-CX0,h=CY1-CY0;g.fillStyle='#16111c';g.fillRect(CX0-3,CY0-3,w+6,h+6);g.fillStyle='#e8e2d2';g.fillRect(CX0,CY0,w,h);g.fillStyle='#5a6270';g.fillRect(CX0+18,CY0+18,w-36,h-36);g.fillStyle='#525a68';for(let y=CY0+18;y<CY1-18;y+=14)g.fillRect(CX0+18,y,w-36,1);
g.fillStyle='#16111c';g.beginPath();g.arc(CC,(CY0+CY1)/2+20,78,0,7);g.fill();g.fillStyle='#4a8a7a';g.beginPath();g.arc(CC,(CY0+CY1)/2+20,75,0,7);g.fill();g.fillStyle='#5aa090';g.beginPath();g.arc(CC-14,(CY0+CY1)/2+6,50,0,7);g.fill();
g.fillStyle='#f4f0e0';g.beginPath();g.arc(CC,(CY0+CY1)/2+20,30,0,7);g.fill();g.strokeStyle='#16111c';g.lineWidth=3;g.stroke();g.beginPath();g.moveTo(CC,(CY0+CY1)/2+20);g.lineTo(CC,(CY0+CY1)/2);g.moveTo(CC,(CY0+CY1)/2+20);g.lineTo(CC+14,(CY0+CY1)/2+24);g.stroke();
g.fillStyle='#16111c';g.fillRect(CC-120,CY0+4,240,30);g.fillStyle='#c8a040';g.fillRect(CC-118,CY0+6,236,26);g.fillStyle='#16111c';g.font='bold 18px Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillText('CITY HALL',CC,CY0+20);g.textAlign='left';g.textBaseline='alphabetic';
g.fillStyle='rgba(0,0,0,.18)';g.fillRect(CX0,CY1,w,10)}
// glass storefronts + striped awnings with the shop names
for(const q of G){const[x0,y0,x1,y1]=q.b,fr=q.fr,yy=fr=='s'?y1:y0;for(const w of WL){if(w[4]||w[2]<w[3]||Math.abs(w[1]+3-yy)>1||w[0]<x0-2||w[0]>x1)continue;g.fillStyle='#8fc3e8';g.fillRect(w[0]+1,w[1]+1,Math.max(0,w[2]-2),4);g.fillStyle='rgba(255,255,255,.7)';for(let x=w[0]+6;x<w[0]+w[2]-4;x+=22)g.fillRect(x,w[1]+2,6,2)}
if(q.ty=='fire')continue;const AC={hard:'#c0392b',diner:'#2f6fd0',barber:'#c0392b',bakery:'#e07a1a',books:'#2a4a7a',pizza:'#2f8a4a',clinic:'#3f9a5a',icecream:'#e86aa0',police:'#28386a',cafe:'#6a4022',flower:'#8a3aaa',post:'#2f6fd0',mart:'#c0392b'}[q.ty];
const L=x1-x0,aw=Math.min(L-20,Math.max(110,q.nm.length*10+30)),ax=x0+(L-aw)/2,ay=fr=='s'?y1+6:y0-20;g.fillStyle='#16111c';g.fillRect(ax-1,ay-1,aw+2,16);for(let i=0;i<aw;i+=10){g.fillStyle=(i/10)%2?AC:'#f4f0e0';g.fillRect(ax+i,ay,Math.min(10,aw-i),14)}
g.fillStyle='#16111c';g.fillRect(ax+aw/2-q.nm.length*4-6,ay+1,q.nm.length*8+12,12);g.fillStyle='#ffe9a0';g.font='bold 10px ui-monospace,monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(q.nm,ax+aw/2,ay+7.5);g.textAlign='left';g.textBaseline='alphabetic'}
// fire department doors + sign, the clinic cross, police badge
for(const x of BAY){g.fillStyle='#16111c';g.fillRect(x-72,SB-5,144,10);g.fillStyle='#c0392b';g.fillRect(x-71,SB-4,142,8);g.fillStyle='rgba(255,255,255,.35)';for(let k=x-70;k<x+70;k+=8)g.fillRect(k,SB-4,1,8)}
{const x=(FX0+FX1)/2,y=SB-26;g.fillStyle='#16111c';g.fillRect(x-80,y-2,160,22);g.fillStyle='#c0392b';g.fillRect(x-78,y,156,18);g.fillStyle='#f4f4f0';g.font='bold 12px Arial, Helvetica, sans-serif';g.textAlign='center';g.fillText('HOMETOWN FIRE DEPT · 1',x,y+14);g.textAlign='left'}
{const q=G.find(q=>q.ty=='clinic'),x=(q.b[0]+q.b[2])/2,y=q.b[1]+40;g.fillStyle='#16111c';g.fillRect(x-14,y-38,28,76);g.fillRect(x-38,y-14,76,28);g.fillStyle='#d83a3a';g.fillRect(x-12,y-36,24,72);g.fillRect(x-36,y-12,72,24)}
for(const v of V){g.save();g.translate(v.x+4,v.y+5);g.rotate(v.a);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-v.L/2,-v.W/2,v.L,v.W);g.restore()}
for(const v of V){const r=Math.hypot(v.L,v.W)/2+6;vDraw(g,v.x-r,v.y-r,r*2,r*2,q=>hwDraw(q,v))}
sign(g,OX+OR+130,MY-MR-SW-28,'MAIN ST',90);sign(g,OX-OR-60,EY+RR+30,'OAK ST',80);sign(g,500,EY-RR-48,'ELM ST',80);sign(g,1560,SY_+RR+28,'MAPLE ST',90);
paintDec(g,D)}

