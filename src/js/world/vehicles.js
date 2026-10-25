//# world/vehicles.js — Vehicle drawing and walk-behind handling
// ---------- vehicles: nobody's feet ever show on top of a car, truck, trailer, plane, wagon or boat ----------
// While a map is painted, every vehicle drawn into the background is also captured into its own little canvas
// (plus an alpha mask). At draw time, anyone whose feet land on a vehicle's pixels is standing behind it,
// so the vehicle is painted back over them. (School has its own walk-behind pass.)
// functions only: these run during the first map build at boot
function vRec(g,x,y,w,h,fn){if(!vRec.on||vRec.busy||vRec.nest||!g||!g.getTransform||typeof BG=='undefined'||g.canvas!==BG)return 0;
const T=g.getTransform(),P_=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([a,b])=>[T.a*a+T.c*b+T.e,T.b*a+T.d*b+T.f]);
const bx=Math.floor(Math.min(...P_.map(p=>p[0])))-1,by=Math.floor(Math.min(...P_.map(p=>p[1])))-1,bw=Math.ceil(Math.max(...P_.map(p=>p[0])))+2-bx,bh=Math.ceil(Math.max(...P_.map(p=>p[1])))+2-by;
if(!(bw>0&&bh>0&&bw<1200&&bh<1200))return 0;const cv=document.createElement('canvas');cv.width=bw;cv.height=bh;const q=cv.getContext('2d');if(!q)return 0;
if(q.setTransform)q.setTransform(T.a,T.b,T.c,T.d,T.e-bx,T.f-by);vRec.busy=1;try{fn(q)}finally{vRec.busy=0}
let al=null;try{const d=q.getImageData(0,0,bw,bh).data;al=new Uint8Array(bw*bh);for(let i=0;i<al.length;i++)al[i]=d[i*4+3]}catch(e){al=null}
vRec.L.push({x:bx,y:by,w:bw,h:bh,cv,al});return 0}
// draw a piece of map code as a vehicle (fn gets the context as its argument)
function vDraw(g,x,y,w,h,fn){vRec(g,x,y,w,h,fn);const n=vRec.nest;vRec.nest=1;try{fn(g)}finally{vRec.nest=n}}
// wrap the vehicle sprites (and other tall props) so people walk behind them. A prop is wrapped once; the list is the built-in
// maps' set, and props added later (the custom-map props) join by having wb:1 or by being in the second list (none of them is on a built-in map)
function vehWrap(){if(typeof OB=='undefined')return;const S_=vehWrap.S||(vehWrap.S=new Set(['bus','bus2','cbus','truck','forklift','mtruck','hmv','hmvx','tank','tankx','heli','wagon','canoe','shelf','conveyor','bench','picnic','lamp','mail','grill','doghouse','shed','tramp','statue','well','wtower','cactus','tent','mtent','booth','piano','bookshelf','vending','cabinet','g_obelisk','g_angel','g_cross','g_round','hitch','umb','bigjg','jg2','sptow','gazebo','stree','tlight','bstop','mdet','xray','rack','gshelf','fridge','counter','rdesk','merry','turn','rbooth','checkout','psign','flagpole','fntn','bigang','reaper','mausol','freezer','ufrz','cartrow','corral','plight','produce','pump','pillar','column','hbed','ivp','bars','bchair','mirror','espresso','display','tirestack','toolbox','hoserack','gear','bunk'].concat(['oak','oak_b','maple','birch','spruce','pine_g','willow','deadtree','sapling','sunflow','corn_r','kfridge','kfridge2','kpantry','dress_t','dress_m','shower','shower_w','gcab_t','gcab_w','bfplace','tv_big','kisland_b'])));
for(const k of Object.keys(OB)){const o=OB[k];if(!o||o.vw||typeof o.f!='function'||!(o.wb||S_.has(k)))continue;o.vw=1;const f=o.f;o.f=(g,x,y,v,c,t)=>{const L=vRec.L,n=L?L.length:0;vRec(g,x-o.w/2,y-o.h,o.w,o.h,q=>f(q,x,y,v,c,t));if(L&&L.length>n)Object.assign(L[n],{base:y,ch:o.c?o.c[1]:0});f(g,x,y,v,c,t)}}}
// feet on an opaque pixel of this vehicle?
function vOn(V,x,y){const i=Math.round(x)-V.x,j=Math.round(y)-V.y;if(i<0||j<0||i>=V.w||j>=V.h)return 0;return !V.al||V.al[j*V.w+i]>100}
// everyone on screen, with a box around their sprite and where their feet are
function fgEnts(vx0,vy0,vx1,vy1){const E=[],V=P;
for(const p of PL){if(p.dead)continue;P=p;if(p.dn)E.push({p,y:p.y,fy:p.y+10,x0:p.x-26,x1:p.x+26,y0:p.y-22,y1:p.y+18});else{const o=pfr();E.push({p,y:p.y,fy:o.by-2,x0:p.x-o.w/2-12,x1:p.x+o.w/2+12,y0:o.by-o.h-10,y1:o.by+5})}}P=V;
for(const z of zs){if(z.hp<=0)continue;const T=ZT[z.t];if(z.x<vx0-60||z.x>vx1+60||z.y<vy0-60||z.y>vy1+60)continue;if(T.sv){const k=typeof SVK=='number'?SVK:1;E.push({z,y:z.y,fy:z.y+17*k,x0:z.x-26*k,x1:z.x+26*k,y0:z.y-32*k,y1:z.y+24*k})}else{const r=T.r||12;E.push({z,y:z.y,fy:z.y+r*.9,x0:z.x-r*1.9,x1:z.x+r*1.9,y0:z.y-r*2.7,y1:z.y+r*1.5})}}
return E}
function vehFg(){const L=HS.VH;if(mapId===3||!L||!L.length||typeof document=='undefined'||!document.createElement)return;
const vx0=cam.x-30,vy0=cam.y-30,vx1=cam.x+W+30,vy1=cam.y+H+30;let E=null;
const ov=(a,x0,y0,x1,y1)=>a.x1>x0&&a.x0<x1&&a.y1>y0&&a.y0<y1;
for(const V of L){if(V.x+V.w<vx0||V.x>vx1||V.y+V.h<vy0||V.y>vy1)continue;E=E||fgEnts(vx0,vy0,vx1,vy1);
let B=null;for(const e of E){const cx=e.p?e.p.x:e.z.x;
// sprites with a base line (shelves, conveyors, buses...): behind = standing north of the middle of its footprint, so it never flickers through gaps
if(V.base!=null?(e.y<V.base-V.ch/2&&ov(e,V.x,V.y,V.x+V.w,V.base)):(vOn(V,cx,e.fy)||vOn(V,cx-4,e.fy)||vOn(V,cx+4,e.fy)))(B||(B=[])).push(e)}if(!B)continue;
X.save();X.beginPath();for(const e of B)X.rect(e.x0,e.y0,e.x1-e.x0,e.y1-e.y0);X.clip();X.drawImage(V.cv,V.x,V.y);X.restore();
for(const e of E)if(!B.includes(e)&&B.some(b=>ov(b,e.x0,e.y0,e.x1,e.y1)&&e.y>b.y))schRe(e)}}
function vS2(g,x,y,w,h,fn){vRec(g,x-w/2,y-h,w,h,q=>S2(q,x,y,w,h,fn));S2(g,x,y,w,h,fn)}

