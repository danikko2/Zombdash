//# input/aim-reticle.js — Mouse / right-stick aiming reticle
// ---------- aiming reticle: mouse aims without firing (PC), right stick aims and the trigger fires (controllers) ----------
var MSE={on:0};
try{C.addEventListener('pointermove',e=>{if(e.pointerType=='mouse'){MSE.on=1}else MSE.on=0});C.addEventListener('pointerdown',e=>{if(e.pointerType&&e.pointerType!='mouse')MSE.on=0})}catch(e){}
// world point the mouse is over, for the player using the mouse
function msWorld(p){const v=MPn&&p.vp||{x:0,y:0,z:tutZ()},c=MPn&&p.cam||cam;return{x:(mouse.x-v.x)/v.z+c.x,y:(mouse.y-v.y)/v.z+c.y}}
function retDraw1(x,y,col,a){X.save();X.globalAlpha=a;X.lineCap='square';
 for(const[lw,c]of[[5,'#070a08'],[2,col]]){X.lineWidth=lw;X.strokeStyle=c;X.beginPath();X.arc(x,y,9,0,7);X.stroke();X.beginPath();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){X.moveTo(x+dx*5,y+dy*5);X.lineTo(x+dx*14,y+dy*14)}X.stroke()}
 X.fillStyle=col;X.fillRect(x-1,y-1,2,2);X.restore()}
// drawn inside the world view of player P (called once per viewport)
function aimRet(){if(mode!='play'||!P||P.dead||P.dn)return;const p=P,col=MPn?PC[p.pi]:'#ffe27a',now=performance.now();
 if(MSE.on&&(p.inp=='km'||p.inp=='any')){const w=msWorld(p);retDraw1(w.x,w.y,col,.95);return}
 if(p.rtW&&now-p.rtW<1400){const a=Math.min(1,(1400-(now-p.rtW))/400),D=p.rtD||110;retDraw1(p.x+Math.cos(p.a)*D,p.y-8+Math.sin(p.a)*D,col,.9*a)}}
// hide the system cursor over the game while the reticle stands in for it
let CURS='';function aimCursor(){try{const c=mode=='play'&&MSE.on?'none':'';if(c!==CURS){CURS=c;C.style.cursor=c}}catch(e){}}

