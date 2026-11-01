//# world/kit-mainst.js — Building kit pieces from Main Street: power lines and festival bunting strung between poles
// ---------- Main Street's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// Overhead lines: the points are the bases of the poles (or lamp posts) they hang from; the lines hang h px above them with a sag.
// The editor draws them in place. In the game the background gets only their faint shadow on the ground and the lines themselves are
// drawn over players and zombies every frame (cmFxData collects paths with a top() into the overhead list; CMGP is set while the
// game's background is painted).
function kmSag(g,a,b,s){g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2+s*2,b[0],b[1]);g.stroke()}
function kmSpan(a,b){return Math.min(30,Math.hypot(b[0]-a[0],b[1]-a[1])*.07)}
function kmShadow(g,P){g.strokeStyle='rgba(0,0,0,.13)';g.lineWidth=1.5;g.beginPath();g.moveTo(P[0][0]+5,P[0][1]+3);for(let i=1;i<P.length;i++)g.lineTo(P[i][0]+5,P[i][1]+3);g.stroke()}
// power lines: two wires on the crossarm (the telephone pole's insulators sit 15 px each side of the pole, 104 px up), three with n=3
function kmWires(g,P,o){const h=po(o,'h',104),n=po(o,'n','2');g.strokeStyle=o.c||'#2a2a2e';g.lineWidth=1.3;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],s=kmSpan(a,b);
 for(const dx of[-15,15])kmSag(g,[a[0]+dx,a[1]-h],[b[0]+dx,b[1]-h],s);if(n=='3')kmSag(g,[a[0],a[1]-h-6],[b[0],b[1]-h-6],s)}}
// bunting: a string of little flags (lamp posts are 54 px to the top)
const KMFLAG=['#e8403a','#ffd84a','#3a9ae8','#7ad04a','#f08a2a','#f4f4f0'];
function kmFlags(g,P,o){const h=po(o,'h',54);g.strokeStyle='#3a3d46';g.lineWidth=1;for(let i=1;i<P.length;i++){const a=[P[i-1][0],P[i-1][1]-h],b=[P[i][0],P[i][1]-h],s=kmSpan(a,b);kmSag(g,a,b,s);
 const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(2,Math.floor(L/13));for(let k=1;k<n;k++){const u=k/n,x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u+s*4*u*(1-u);
  g.fillStyle=o.c&&k%2?o.c:KMFLAG[(k+i)%KMFLAG.length];g.beginPath();g.moveTo(x-4,y);g.lineTo(x+4,y);g.lineTo(x,y+8);g.closePath();g.fill()}}}
cmAddPath({id:'powerline',sharp:1,n:'Power lines (between poles)',cat:'line',w:2,wr:[1,4],def:{c:'#2a2a2e',o:{h:104,n:'2'}},opts:[['h','Height',[40,140]],['n','Wires',[['2','Two'],['3','Three']]]],pri:30,
 f(g,P,o){kmShadow(g,P);if(!CMGP)kmWires(g,P,o)},top:kmWires});
cmAddPath({id:'bunting',sharp:1,n:'Bunting (flags on a string)',cat:'line',w:2,wr:[1,4],def:{o:{h:54}},opts:[['h','Height',[20,140]]],pri:30,
 f(g,P,o){kmShadow(g,P);if(!CMGP)kmFlags(g,P,o)},top:kmFlags});
// the overhead list entries for the game (see cmFxData): a box round the lines and everything top() needs
function kmTopItems(d){const out=[];for(const o of d.paths||[]){const T=cmPath(o.p);if(!T||!T.top)continue;const P=cmPathSm(o);if(P.length<2)continue;const h=+po(o,'h',(T.def&&T.def.o&&T.def.o.h)||0)||0;
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of P){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}
 out.push({o:{x:x0-30,y:y0-h-30,w:x1-x0+60,h:y1-y0+h+70},a:1,f:{top(b){if(b.x>cam.x+W||b.x+b.w<cam.x||b.y>cam.y+H||b.y+b.h<cam.y)return;X.save();try{T.top(X,P,o)}finally{X.restore()}}}})}return out}
// the town's lawn: the old Main Street map's grass with its tufts
cmAddTer({id:'grass_main',n:'Main Street lawn',cat:'ground',mc:'#5a9a46',f(g,x,y){cmCells(g,x,y,'#5a9a46','#62a24a','#55923f');g.fillStyle='#4a8a3a';for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16)if(((x+i)*31+(y+j)*17)%7==0){g.fillRect(x+i+4,y+j+6,2,5);g.fillRect(x+i+9,y+j+4,2,6)}}});
