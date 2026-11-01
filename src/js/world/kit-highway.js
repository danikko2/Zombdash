//# world/kit-highway.js — Building kit pieces from Deadway Highway: the roadside grass and headlights on a stopped car
// ---------- Deadway Highway's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// the highway's embankment grass: the old map's olive green
cmAddTer({id:'grass_hwy',n:'Highway verge',cat:'ground',mc:'#5d7a3c',f(g,x,y){cmCells(g,x,y,'#5d7a3c','#587436','#62803f');g.fillStyle='#4a6630';for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16)if(((x+i)*31+(y+j)*17)%7==0){g.fillRect(x+i+4,y+j+6,2,5);g.fillRect(x+i+9,y+j+4,2,6)}}});
// headlights: put it on a car (same spot, same turn): two beams out of the front (they light the road at dusk and night, the
// lighting system's beams), two red tail lights at the back. size scales it for longer vehicles (1 = a car about 80 px long).
cmAddFx({id:'headlights',n:'Headlights (on a car)',cat:'light',r:180,anim(o,t){const s=cl(+o.sc||1,.25,4);X.save();try{fxTurn(X,o);for(const k of[-1,1]){const fx=o.x+38*s,fy=o.y+k*11*s,bx=o.x-38*s,by=o.y+k*12*s;
 X.fillStyle='#fff6d0';X.globalAlpha=.18;X.beginPath();X.arc(fx,fy,7,0,7);X.fill();X.globalAlpha=1;X.fillRect(Math.round(fx)-1,Math.round(fy)-2,3,4);X.fillStyle='#ff2a1a';X.globalAlpha=.2;X.beginPath();X.arc(bx,by,6,0,7);X.fill();X.globalAlpha=1;X.fillRect(Math.round(bx)-1,Math.round(by)-2,2,4)}}finally{X.restore()}},
 ed(g,o){const s=cl(+o.sc||1,.25,4);g.save();fxTurn(g,o);g.fillStyle='#fff6d0';for(const k of[-1,1])g.fillRect(o.x+38*s-1,o.y+k*11*s-2,3,4);g.fillStyle='#ff2a1a';for(const k of[-1,1])g.fillRect(o.x-38*s-1,o.y+k*12*s-2,2,4);g.strokeStyle='rgba(255,246,208,.4)';g.beginPath();g.moveTo(o.x+38*s,o.y-11*s);g.lineTo(o.x+120*s,o.y-40*s);g.moveTo(o.x+38*s,o.y+11*s);g.lineTo(o.x+120*s,o.y+40*s);g.stroke();g.restore()}});
