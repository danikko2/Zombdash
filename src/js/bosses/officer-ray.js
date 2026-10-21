//# bosses/officer-ray.js — Officer Ray boss
// ---------- Officer Ray (Deadway Highway boss): riot shield + sliding over vehicles ----------
// find a slide over the car (or rail, or barrier) right in front of him: returns the slide or null
function svVault(z,a0){const solid=(x,y)=>wlAt(x,y).some(w=>x>w[0]-6&&x<w[0]+w[2]+6&&y>w[1]-6&&y<w[1]+w[3]+6),wall=(x,y)=>wlAt(x,y).some(w=>!w[4]&&x>w[0]-2&&x<w[0]+w[2]+2&&y>w[1]-2&&y<w[1]+w[3]+2);
for(const da of[0,.45,-.45,.9,-.9]){const a=a0+da,c=Math.cos(a),s=Math.sin(a);let hit=-1;
for(let d=8;d<300;d+=6){const x=z.x+c*d,y=z.y+s*d;if(x<30||y<30||x>WW-30||y>WH-30||wall(x,y))break;const b=solid(x,y);if(b&&hit<0){if(d>70)break;hit=d}
if(hit>=0&&!b&&d-hit>14&&svOK(x+c*10,y+s*10)){const dx=x+c*10,dy=y+s*10,L=Math.hypot(dx-z.x,dy-z.y);return{sx:z.x,sy:z.y,dx,dy,t:0,T:Math.max(.32,L/460)}}}}
return null}
function svPolUpd(z,Q,d,sg,aim,dt,can){const D=SVS[9];let mv=null;z.shk=Math.max(0,(z.shk||0)-dt);
if(z.vt){const J=z.vt;J.t+=dt;const u=Math.min(1,J.t/J.T);z.x=J.sx+(J.dx-J.sx)*u;z.y=J.sy+(J.dy-J.sy)*u;z.alt=14*Math.sin(Math.PI*u);z.mvg=1;z.fa=Math.atan2(J.dy-J.sy,J.dx-J.sx);
if(Math.random()<.5)pt.push({x:z.x+rnd(-8,8),y:z.y+14,vx:rnd(-40,40),vy:rnd(-30,0),l:.3,c:'#c8ccd0'});if(u>=1){z.vt=null;z.alt=0;z.ab2=.9+Math.random()*1.1;z.cd=Math.min(z.cd,.25)}return null}
z.ab2=(z.ab2??1.4)-dt;
if(z.sh>0){z.sh-=dt;mv=[aim,D.sp*.45,0];if(z.sh<=0)z.ab=3+Math.random()*2.2}
else{const[a,m]=svKite(z,Q,d,sg,dt);mv=[a,D.sp*m,0];if(z.ab<=0&&sg&&d<520){z.sh=2.6;sfx('armor',z.x,z.y);FT.push({x:z.x,y:z.y-62,t:'RIOT SHIELD!',c:'#9af0ff',l:1.1})}else if(z.cd<=0&&can())svFire(z,aim)}
// slide over whatever is in the way: when he's stuck, can't see you, or you're far off
if(z.ab2<=0&&!(z.sh>0)&&(z.wallHit||!sg||d>240)){const v=svVault(z,z.wallHit?mv[0]:Math.atan2(Q.y-z.y,Q.x-z.x));if(v){z.vt=v;sfx('swoosh',z.x,z.y);if(Math.random()<.5)FT.push({x:z.x,y:z.y-62,t:'SLIDE!',c:'#ffcf40',l:.8});return null}z.ab2=.3}
return mv}
// the riot shield, held toward the player
function svShield(z,fy,h,fl,t){const x=z.x+fl*15,top=fy-h*.95,hh=h*.9,w=12;X.save();X.globalAlpha=1;X.fillStyle='#16111c';X.fillRect(Math.round(x-w/2-1),Math.round(top-1),w+2,Math.round(hh+2));
X.globalAlpha=.78;X.fillStyle='#9fb8cc';X.fillRect(Math.round(x-w/2),Math.round(top),w,Math.round(hh));X.globalAlpha=1;X.fillStyle='#e8f2fa';X.fillRect(Math.round(x-w/2+2),Math.round(top+3),2,Math.round(hh-6));
X.fillStyle='#16111c';X.fillRect(Math.round(x-w/2),Math.round(top+hh*.38),w,7);X.fillStyle='#f4f1e6';X.fillRect(Math.round(x-w/2+1),Math.round(top+hh*.38)+2,w-2,3);
if((z.shk||0)>0){X.globalAlpha=.6;X.fillStyle='#ffffff';X.fillRect(Math.round(x-w/2),Math.round(top),w,Math.round(hh));X.globalAlpha=1}X.restore()}

