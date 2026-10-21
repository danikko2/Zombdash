//# campaign/lives.js — Campaign lives
// ---------- campaign lives: 3 (1 on Hard); losing one restarts the current wave ----------
let LIVES=0,LLB=0;
function livesInit(){LIVES=GMD=='c'?[4,3,1][DIF()]:0;LLB=0}
function lifeLost(){LIVES--;LLB=3;zs=[];nq=[];ep=[];bs=[];pd=[];fr=[];rg=[];KN=null;RH=null;RKS=[];GHH=[];GRN=[];ICB=[];GCI=[];GCC=[];SVB=0;bossQ=-1;pend=0;ET=0;
PL.forEach((p,i)=>{p.dead=0;p.dn=0;p.rv=0;p.hp=p.mx;p.inv=3;p.eat=null;p.bn=0;p.dd=0;p.x=HS.px+[0,26,-26,0][i];p.y=HS.py+[0,0,0,26][i];push(p,9)});P=PL[0];WRP=WRC?{w:WRC.w,b:WRC.b,t:WRC.t,x:WRC.x}:null;wave--;nextWave()}
function livesHud(){if(GMD!='c'||!LIVES||mode!='play')return;const PX='"Press Start 2P", ui-monospace, monospace';X.textAlign='center';X.font='10px '+PX;X.lineWidth=4;X.strokeStyle='#070a08';const t='LIVES '+'♥'.repeat(LIVES);X.strokeText(t,W/2,18);X.fillStyle='#ff6a5c';X.fillText(t,W/2,18);
if(LLB>0){const a=Math.min(1,LLB);X.globalAlpha=a;X.font='20px '+PX;X.lineWidth=6;const m='LIFE LOST!';X.strokeText(m,W/2,H/3-44);X.fillStyle='#ff5a4a';X.fillText(m,W/2,H/3-44);X.font='12px '+PX;const n=LIVES==1?'LAST LIFE · WAVE '+wave+' RESTARTS':LIVES+' LIVES LEFT · WAVE '+wave+' RESTARTS';X.strokeText(n,W/2,H/3-18);X.fillStyle='#ffcf40';X.fillText(n,W/2,H/3-18);X.globalAlpha=1}}

