//# tutorial/tutorial.js — Tutorial
// ---------- tutorial: the middle house on Suburb, zoomed in, the rest of the world blacked out ----------
var TUT=null,TUTF=0;
function tutGeo(){const hw=340,hh=380,gd=130,x0=(2300-hw-gd)/2,y0=(1800-hh)/2-60,x1=x0+hw,y1=y0+hh;return{x0,y0,x1,y1,yA:y0+hh*.32,kx:x0+hw*.2,cx:x0+hw/2,gx:x1+gd,gd}}
function tutOK(){if(MPn||GMD!='c'||mapId!==0||swEff()!==1||S.dev)return 0;if(TUTF)return 1;const A=S.ac;if(!A||A.tut||S.tut)return 0;if(!A.g&&(cpOf(A)>0||bmOf(A).some(x=>x)||(A.lv||1)>1))return 0;return 1}
function tutAgain(){TUTF=1;setGM('c');mapId=0;S.mp=0;survs()}
function tutStart(){TUTF=0;const G=tutGeo();wave=0;toSp=0;bossQ=-1;mode='play';ui.innerHTML='';banner=0;ep=[];pd=[];fr=[];rg=[];DR=[];FT=[];ET=0;music('game');
const B=[[G.cx-32,G.y1-4,64,8,2],[G.kx-32,G.y0-4,64,8,2],[G.x1,G.y1-4,G.gd,8,2]];WL.push(...B);
TUT={ph:0,t:0,mv:0,lx:P.x,ly:P.y,sh:0,fk:0,B,G,k:0,cam:{x:P.x,y:P.y}};tutUpd(0)}
function tutBar(i){const T=TUT,w=T.B[i];if(!w)return;const j=WL.indexOf(w);if(j>=0)WL.splice(j,1);T.B[i]=null}
function tutUpd(dt){const T=TUT,G=T.G;T.t+=dt;toSp=0;bossQ=-1;for(const p of PL){p.hp=Math.max(p.hp,p.mx)}
const hc={x:(G.x0+G.gx)/2,y:(G.y0+G.y1)/2};
if(T.ph==0){T.mv+=Math.hypot(P.x-T.lx,P.y-T.ly);T.lx=P.x;T.ly=P.y;if(T.mv>180&&T.t>1.2){T.ph=1;T.t=0;sfx('click')}}
else if(T.ph==1){if((P.fk||0)>0&&!(T.fk>0))T.sh++;T.fk=P.fk||0;if(T.sh>=4&&T.t>1){T.ph=2;T.t=0;const z=mk(0,G.kx+30,G.y0+50);z.hp=Math.min(z.hp,3);zs.push(z);sfx('newz');FT.push({x:z.x,y:z.y-30,t:'ZOMBIE!',c:'#ff5a4a',l:1.4})}}
else if(T.ph==2){if(!zs.length&&T.t>.6){T.ph=3;T.t=0;tutBar(0);sfx('clear')}}
else if(T.ph==3){if(P.y>G.y1+10&&Math.abs(P.x-G.cx)<70){T.ph=4;T.t=0;tutBar(1);tutBar(2);sfx('wave')}}
else if(T.ph==4){T.k=Math.min(1,T.t/1.7);if(T.k>=1){const A=S.ac;if(A)A.tut=1;S.tut=1;sv();TUT=null;wave=0;nextWave();return}}
const z=tutZ(),vw=W/z,vh=H/z,ax=(lo,hi,p,v)=>v>=hi-lo?(lo+hi)/2:cl(p,lo+v/2,hi-v/2),c={x:ax(G.x0-30,G.gx+30,P.x,vw),y:ax(G.y0-30,G.y1+70,P.y,vh)};if(vh>=G.y1-G.y0+100)c.y-=80/z;
const e=T.ph==4?T.k*T.k*(3-2*T.k):0;T.cam={x:c.x+(P.x-c.x)*e,y:c.y+(P.y-c.y)*e}}
// how far the camera is zoomed in (1 = normal)
function tutZ(){const T=TUT;if(!T||mode=='menu'||mode=='lobby'||MPn)return 1;const G=T.G,z0=Math.max(1,Math.min(2.6,Math.min(W/(G.gx-G.x0+90),(H-(H<520?80:200))/(G.y1-G.y0+60))));if(T.ph<4)return z0;const e=T.k*T.k*(3-2*T.k);return z0+(1-z0)*e}
function zmEnd(){if(drawW.z){drawW.z=0;X.restore();W=drawW.W0;H=drawW.H0}}
// black out everything but the house (fades away as the camera pulls back)
function tutDark(){const T=TUT;if(!T||MPn)return;const G=T.G,a=T.ph==4?1-T.k:1;if(a<=0)return;X.save();X.translate(-Math.round(cam.x),-Math.round(cam.y));X.fillStyle='rgba(4,6,5,'+a+')';X.beginPath();X.rect(cam.x-60,cam.y-60,W+120,H+120);
const m=10;X.moveTo(G.x0-m,G.y0-m);X.lineTo(G.x1+m,G.y0-m);X.lineTo(G.x1+m,G.yA-m);X.lineTo(G.gx+m,G.yA-m);X.lineTo(G.gx+m,G.y1+m+4);X.lineTo(G.x0-m,G.y1+m+4);X.closePath();if(T.ph>=3)X.rect(G.cx-40,G.y1+m+4,80,50);
X.fill('evenodd');X.restore()}
// instruction card + the door arrow
function tutHud(){const T=TUT;if(!T||MPn||T.ph==4)return;let dv='km';try{if(GP&&GP.length)dv='pad';else if(typeof matchMedia!='undefined'&&matchMedia('(pointer: coarse)').matches)dv='touch'}catch(e){}
const M=[['WELCOME TO ZOMBDASH',{km:'Move with  W A S D',touch:'Drag on the LEFT side of the screen to move',pad:'Move with the LEFT stick'},'Walk around the house'],
['AIM AND SHOOT',{km:'Aim with the mouse · hold LEFT CLICK to shoot',touch:'Drag on the RIGHT side of the screen to aim and shoot',pad:'Aim with the RIGHT stick · pull RT to shoot'},{km:'Number keys switch weapons once you own more',touch:'Tap the weapon buttons to switch once you own more',pad:'LB / RB switch weapons once you own more'}],
['A ZOMBIE GOT IN!',{km:'Shoot it before it reaches you',touch:'Shoot it before it reaches you',pad:'Shoot it before it reaches you'},'Zombies drop cash and power-ups'],
['NICE SHOT!',{km:'When you feel ready, walk through the front door to begin the fight',touch:'When you feel ready, walk through the front door to begin the fight',pad:'When you feel ready, walk through the front door to begin the fight'},'Between waves, spend your cash in the shop on guns, armor and health']][T.ph];
const L1=M[1][dv],L2=typeof M[2]=='string'?M[2]:M[2][dv],PX='"Press Start 2P", ui-monospace, monospace',VT='VT323, ui-monospace, monospace';
X.save();const sm=H<520,f1=sm?17:22,f2=sm?15:18;X.font=f1+'px '+VT;const tw=Math.min(sm?Math.max(300,W-390):W-24,Math.max(X.measureText(L1).width,X.measureText(L2).width)+56),th=sm?70:96,bx=Math.round(W/2-tw/2),by=sm?6:Math.round(Math.max(64,H*.12));
X.fillStyle='rgba(7,10,8,.86)';X.fillRect(bx,by,tw,th);X.fillStyle='rgba(155,232,96,.55)';X.fillRect(bx,by,tw,3);X.fillStyle='rgba(0,0,0,.5)';X.fillRect(bx,by+th,tw,3);
X.textAlign='center';X.textBaseline='middle';X.font=(sm?9:12)+'px '+PX;X.fillStyle='#ffcf40';X.fillText(M[0],W/2,by+(sm?12:20));X.font=(sm?7:10)+'px '+PX;X.fillStyle='#8a9a8a';X.fillText('TUTORIAL · '+(T.ph+1)+'/4',W/2,by+th-(sm?8:12));
X.font=f1+'px '+VT;X.fillStyle='#f4f1e6';X.fillText(L1,W/2,by+(sm?30:44),tw-16);X.font=f2+'px '+VT;X.fillStyle='#9be860';X.fillText(L2,W/2,by+(sm?47:66),tw-16);
if(T.ph==3){const z=tutZ(),G=T.G,sx=(G.cx-cam.x)*z,sy=(G.y1-cam.y)*z,b=Math.sin(performance.now()/160)*6;X.fillStyle='#ffcf40';X.strokeStyle='#070a08';X.lineWidth=3;X.beginPath();X.moveTo(sx-12,sy-46+b);X.lineTo(sx+12,sy-46+b);X.lineTo(sx+12,sy-30+b);X.lineTo(sx+22,sy-30+b);X.lineTo(sx,sy-10+b);X.lineTo(sx-22,sy-30+b);X.lineTo(sx-12,sy-30+b);X.closePath();X.stroke();X.fill();
X.font='10px '+PX;X.lineWidth=4;X.strokeText('FRONT DOOR',sx,sy-58+b);X.fillText('FRONT DOOR',sx,sy-58+b)}
X.restore()}

