//# world/map-list-and-pathfinding.js — The map list (MP), build() to load a map, zombie pathfinding flow field, wall push-out
const MP=[{n:'Suburb',d:'House, garage, road, wrecks',f:()=>bimBuild(0)},{n:'Warehouse',d:'Shelves, containers, 4 doors',f:()=>bimBuild(1)},{n:'Graveyard',d:'Chapel, glowing mausoleum, crypt, open graves',f:()=>bimBuild(2)},{n:'School',d:'Halls, classrooms, cafeteria',f:()=>bimBuild(3)},{n:'Old West',d:'Saloon, church, stables, shops',f:mapWest},{n:'Neighborhood',d:'Two houses, cul-de-sac, yards',f:mapNeighborhood},{n:'Military Base',d:'Runway, hangars, barracks, tanks',f:mapBase},{n:'Campground',d:'Cabins, lake, dock, campfire',f:mapCamp},{n:'Deadway Highway',d:'Jammed interstate, wrecks, emergency scene',f:()=>bimBuild(8)},{n:'Haunted Mansion',d:'Old mansion, portraits, statues, candles',f:()=>bimBuild(9)},{n:'Enchanted Forest',d:'Night woods, a trail looping round, the witch\'s log cabin',f:()=>bimBuild(10)},{n:'Urban Outskirts',d:'Run-down houses, wrecks, worn streets',f:mapUrban},{n:'City Park',d:'Trails, fishing ponds, food trucks, a big playground',f:mapPark},{n:'Downtown Zombville',d:'Sunrise, towers, the stadium and the hospital, checkpoints',f:()=>bimBuild(13)},{n:'Hometown Market',d:'Aisles, freezers, loading docks, parking lot',f:()=>bimBuild(14)},{n:'Main Street',d:'Shops, city hall, police + fire stations',f:()=>bimBuild(15)},{n:'Black Iron Foundry',d:'Furnaces, molten metal, cranes, a truck bay',f:()=>bimBuild(16)},{n:'Zombville Stadium',d:'The field turned treatment center, overrun',f:()=>bimBuild(17)}];
function build(){bgFree();WW=1800;WH=1800;WL=[];TR=[];SM=[];sk=[];NOGO=[];const cd=cmIs(mapId)&&cmDocOf(mapId);if(!cd&&!MP[mapId])mapId=0;vRec.on=1;vRec.L=[];vRec.busy=0;vehWrap();try{if(cd)cmBuild(cd);else MP[mapId].f()}finally{vRec.on=0}HS.VH=vRec.L;mkSurf();bgLow();bnPlace()}
// the first build runs in world/builtin-maps.js, once the Suburb's map file and the kit are loaded
// the walking-distance maps zombies follow (fd; in split screen one per player, p.fd), refreshed about 7 times a second.
// With a background thread (world/pathfinding-worker.js) every map is worked out there. Without one, split screen refreshes
// one player per call, so the cost is spread over the frames instead of landing on one. Returns when to call again.
let FLI=0;
function flow(){const L=MPn?PL.filter(p=>alive(p)):[P];if(!L.length||!P)return .15;if(pfAsk(L)&&PFW.ok)return .15;
 if(!MPn){bfs(fd,P.x,P.y);return .15}
 let fresh=0;for(const p of L)if(!p.fd||p.fd.length!==fd.length){p.fd=new Int16Array(fd.length);bfs(p.fd,p.x,p.y);fresh=1}if(fresh)return .15/L.length;
 FLI=(FLI+1)%L.length;const p=L[FLI];bfs(p.fd,p.x,p.y);return .15/L.length}
// breadth-first walking distance from (px,py) in grid cells; diagonal steps only between two open sides.
// bfsCore has no game globals, so the background thread runs the same code.
function bfs(F,px,py){if(!BFQ||BFQ.length<gw*gh)BFQ=new Int32Array(gw*gh);bfsCore(F,BFQ,bl,gw,gh,cl(px/gs|0,0,gw-1),cl(py/gs|0,0,gh-1))}
let BFQ=null;
function bfsCore(F,q,bl,gw,gh,ci,cj){F.fill(-1);let h=0,t=0;const s0=cj*gw+ci;F[s0]=0;q[t++]=s0;
 while(h<t){const c=q[h++],i=c%gw,j=(c-i)/gw,d=F[c]+1,L=i>0,R=i<gw-1,U=j>0,B=j<gh-1;let k;
  if(R){k=c+1;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}if(L){k=c-1;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}
  if(B){k=c+gw;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}if(U){k=c-gw;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}
  if(R&&B&&!bl[c+1]&&!bl[c+gw]){k=c+gw+1;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}if(R&&U&&!bl[c+1]&&!bl[c-gw]){k=c-gw+1;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}
  if(L&&B&&!bl[c-1]&&!bl[c+gw]){k=c+gw-1;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}if(L&&U&&!bl[c-1]&&!bl[c-gw]){k=c-gw-1;if(F[k]<0&&!bl[k]){F[k]=d;q[t++]=k}}}}
function dirTo(z){let tx=P.x,ty=P.y;
if(z.x<0||z.x>WW||z.y<0||z.y>WH){tx=cl(z.x,4,WW-4);ty=cl(z.y,4,WH-4)}
else{const F=MPn&&P.fd&&P.fd.length===fd.length?P.fd:fd,i=cl(z.x/gs|0,0,gw-1),j=cl(z.y/gs|0,0,gh-1),c=F[j*gw+i];
if(c!=0){let bd=c<0?1e9:c,bx=0,by=0,f=0;for(const[di,dj]of D){const a=i+di,b=j+dj;if(a<0||b<0||a>=gw||b>=gh)continue;const n=F[b*gw+a];if(n<0||n>=bd)continue;if(di&&dj&&(bl[j*gw+a]||bl[b*gw+i]))continue;bd=n;bx=a;by=b;f=1}
if(f){tx=bx*gs+gs/2;ty=by*gs+gs/2}}}
return Math.atan2(ty-z.y,tx-z.x)}
function push(o,r){for(const w of wlAt(o.x,o.y)){const nx=cl(o.x,w[0],w[0]+w[2]),ny=cl(o.y,w[1],w[1]+w[3]),dx=o.x-nx,dy=o.y-ny,d=Math.hypot(dx,dy);if(d<r){if(d>.01){o.x+=dx/d*(r-d);o.y+=dy/d*(r-d)}else o.y-=r}}}
