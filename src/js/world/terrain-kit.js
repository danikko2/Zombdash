//# world/terrain-kit.js — Building kit ground: the remaining ground textures of the built-in maps as terrain (lawns, forest floor, moss, leaves, worn and dark asphalt, runway, cobbles, pavers, brick, slabs, rubber, terrazzo, planks, boards, checker, marble, linoleum, metal, bath / store tile, charred, straw, deep and pool water), grouped for the editor
// ---------- more terrain ----------
// Every terrain has a group (cat) for the editor's Terrain tab. Sidewalk-like terrains (curb:1) draw a curb where they meet a road
// terrain (road:1), so painted streets get curbs that join up by themselves.
const CMTCAT=[['ground','Ground'],['paving','Paving & roads'],['floor','Floors'],['carpet','Carpet'],['water','Water']];
// tiny helpers for 32px tiles
function cmT2(g,x,y,s,a,b){for(let j=0;j<32;j+=s)for(let i=0;i<32;i+=s){g.fillStyle=((i+j)/s)%2?a:b;g.fillRect(x+i,y+j,s,s)}}
function cmGrout(g,x,y,s,c){g.fillStyle=c;for(let k=0;k<32;k+=s){g.fillRect(x+k,y,1,32);g.fillRect(x,y+k,32,1)}}
function cmLitter(g,x,y,tx,ty,n,cols,k){for(let i=0;i<n;i++){const u=cmH(tx,ty,k+i*2.3),v=cmH(ty+3,tx,k+i*4.1),c=cols[i%cols.length];g.fillStyle=c;const w=1+Math.floor(cmH(tx+i,ty,k+9)*4);g.fillRect(x+Math.floor(u*(32-w)),y+Math.floor(v*30),w,1+(i%2))}}
const CMTK=[
// ground
{id:'grass_dark',n:'Spooky lawn',cat:'ground',mc:'#3a4632',f(g,x,y,tx,ty){cmCells(g,x,y,'#3a4632','#34402d','#404c37');if(cmH(tx,ty,101)<.35){g.fillStyle='#2a3424';g.fillRect(x+4+Math.floor(cmH(tx,ty,102)*20),y+8+Math.floor(cmH(tx,ty,103)*16),2,5)}cmSpeck(g,x,y,tx,ty,2,['#2e3828','#46523a'],2,1,104)}},
{id:'grass_dry',n:'Dry grass',cat:'ground',mc:'#565536',f(g,x,y,tx,ty){cmCells(g,x,y,'#565536','#4f4e32','#5c5b3a');cmSpeck(g,x,y,tx,ty,3,['#43422a','#6a6440','#7a6a48'],2,1,106);if(cmH(tx,ty,107)<.2){g.fillStyle='rgba(90,74,50,.45)';g.fillRect(x+6,y+10,14+Math.floor(cmH(tx,ty,108)*8),6)}}},
{id:'grass_olive',n:'Olive scrub',cat:'ground',mc:'#7a7550',f(g,x,y,tx,ty){cmCells(g,x,y,'#7a7550','#73704a','#807a54');cmSpeck(g,x,y,tx,ty,3,['#5f5a3a','#8a8460','#6a6644'],2,1,110)}},
{id:'grass_park',n:'Mown grass',cat:'ground',mc:'#52a042',f(g,x,y,tx,ty){cmCells(g,x,y,'#4f9a3e','#56a044','#4a923a');if(ty%2==0){g.fillStyle='rgba(255,255,255,.045)';g.fillRect(x,y,32,32)}g.fillStyle='#3f8432';if(cmH(tx,ty,112)<.4){const u=x+3+Math.floor(cmH(tx,ty,113)*24),v=y+4+Math.floor(cmH(tx,ty,114)*22);g.fillRect(u,v,2,4);g.fillRect(u+4,v-1,2,5)}}},
{id:'forest',n:'Forest floor',cat:'ground',mc:'#262f22',f(g,x,y,tx,ty){cmCells(g,x,y,'#252e22','#212a1e','#2a3426');cmLitter(g,x,y,tx,ty,6,['#4a2a4a','#6a3a2a','#3a4a2a','#5a4a2a','#14100c','#2e4a34'],116)}},
{id:'moss',n:'Moss',cat:'ground',mc:'#38462e',f(g,x,y,tx,ty){cmCells(g,x,y,'#34422c','#3a4a30','#2f3c28');cmSpeck(g,x,y,tx,ty,5,['#4a5e36','#5a6e3e','#2a3424'],2,2,118)}},
{id:'leaves',n:'Fallen leaves',cat:'ground',mc:'#6a6a32',f(g,x,y,tx,ty){cmCells(g,x,y,'#4f7a3a','#567f3e','#4a7236');for(let i=0;i<9;i++){const u=cmH(tx,ty,120+i),v=cmH(ty,tx,130+i),c=['#c8762a','#a8462a','#d8a43a','#8a5a2a','#b8862e'][i%5];g.fillStyle=c;g.fillRect(x+Math.floor(u*29),y+Math.floor(v*30),3,2);if(i%3==0)g.fillRect(x+Math.floor(u*29)+1,y+Math.floor(v*30)-1,1,1)}}},
// paving
{id:'asphalt_dark',n:'Dark asphalt',cat:'paving',mc:'#3e4046',road:1,f(g,x,y,tx,ty){cmCells(g,x,y,'#3e4046','#3b3d43','#414349');cmSpeck(g,x,y,tx,ty,4,['rgba(0,0,0,.18)','rgba(255,255,255,.06)'],2,2,140)}},
{id:'asphalt_worn',n:'Worn asphalt',cat:'paving',mc:'#44474c',road:1,f(g,x,y,tx,ty){cmCells(g,x,y,'#3e4146','#42454a','#3a3d42');if(cmH(tx,ty,142)<.22){g.fillStyle='#4a4d52';g.fillRect(x+2+Math.floor(cmH(tx,ty,143)*10),y+3+Math.floor(cmH(tx,ty,144)*10),12+Math.floor(cmH(tx,ty,145)*12),9+Math.floor(cmH(tx,ty,146)*8))}
if(cmH(tx,ty,147)<.25){g.strokeStyle='rgba(10,10,10,.55)';g.lineWidth=1;g.beginPath();let px=x+4+cmH(tx,ty,148)*24,py=y+4+cmH(tx,ty,149)*24;g.moveTo(px,py);for(let i=0;i<3;i++){px+=(cmH(tx+i,ty,150)-.5)*16;py+=(cmH(tx,ty+i,151)-.5)*16;g.lineTo(px,py)}g.stroke();if(cmH(tx,ty,152)<.5){g.fillStyle='#4a5a2a';g.fillRect(px,py,2,3)}}cmSpeck(g,x,y,tx,ty,3,['rgba(0,0,0,.16)','rgba(255,255,255,.05)'],2,1,153)}},
{id:'runway',n:'Runway',cat:'paving',mc:'#4a4d52',road:1,f(g,x,y,tx,ty){cmCells(g,x,y,'#4a4d52','#4d5055','#46494e');cmSpeck(g,x,y,tx,ty,3,['#55585e','#3e4146'],2,1,155);if(cmH(tx,ty,156)<.06){g.strokeStyle='rgba(20,20,20,.5)';g.lineWidth=1;g.beginPath();g.moveTo(x+6,y+8);g.lineTo(x+14,y+16);g.lineTo(x+12,y+26);g.stroke()}}},
{id:'cobble',n:'Cobblestones',cat:'paving',mc:'#5a5850',road:1,f(g,x,y,tx,ty){g.fillStyle='#3e3a30';g.fillRect(x,y,32,32);for(let r=0;r<4;r++)for(let c=0;c<5;c++){const ox=(r%2)*4,px=x+c*8-4+ox,py=y+r*8,h=cmH(tx*5+c,ty*4+r,158);g.fillStyle=h<.33?'#6a6860':h<.66?'#5a5850':'#4a4840';g.fillRect(Math.max(x,px+1),py+1,Math.min(px+7,x+32)-Math.max(x,px+1),6);g.fillStyle='rgba(255,255,255,.07)';if(px+1>=x)g.fillRect(px+1,py+1,5,1)}}},
{id:'pavers',n:'Pavers',cat:'paving',mc:'#b4aea0',curb:1,f(g,x,y,tx,ty){for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16){g.fillStyle=cmH(tx*2+i/16,ty*2+j/16,160)<.5?'#b4aea0':'#aca698';g.fillRect(x+i,y+j,16,16)}g.fillStyle='#968f80';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32);g.fillRect(x,y+16,32,1);g.fillRect(x+16,y,1,32);cmSpeck(g,x,y,tx,ty,2,['#c4beb0','#8a8476'],1,1,161)}},
{id:'brick_pave',n:'Brick pavers',cat:'paving',mc:'#94483a',curb:1,f(g,x,y,tx,ty){g.fillStyle='#6a3022';g.fillRect(x,y,32,32);for(let r=0;r<4;r++)for(let c=-1;c<3;c++){const px=x+c*16+(r%2)*8,py=y+r*8,h=cmH(tx*3+c,ty*4+r,163);const a=Math.max(x,px+1),b=Math.min(x+32,px+15);if(b<=a)continue;g.fillStyle=h<.4?'#9a4a36':h<.75?'#8a4232':'#a85440';g.fillRect(a,py+1,b-a,6)}}},
{id:'slabs',n:'Slab sidewalk',cat:'paving',mc:'#a8a69e',curb:1,f(g,x,y,tx,ty){cmCells(g,x,y,'#a8a69e','#a2a098','#aeaca4');g.fillStyle='rgba(60,60,60,.16)';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32);cmSpeck(g,x,y,tx,ty,2,['#9a9890','#b8b6ae'],1,1,165)}},
{id:'rubber_blue',n:'Rubber (blue)',cat:'paving',mc:'#3d70b4',f(g,x,y,tx,ty){cmT2(g,x,y,16,'#3f72b8','#3a6cb0');cmSpeck(g,x,y,tx,ty,6,['#4a80c8','#3262a0'],1,1,167)}},
{id:'rubber_red',n:'Rubber (red)',cat:'paving',mc:'#bc5646',f(g,x,y,tx,ty){cmT2(g,x,y,16,'#c05a4a','#b85244');cmSpeck(g,x,y,tx,ty,6,['#cc6a58','#a8483a'],1,1,169)}},
// floors
{id:'terrazzo',n:'Terrazzo',cat:'floor',mc:'#cfc8b8',f(g,x,y,tx,ty){cmCells(g,x,y,'#cfc8b8','#d4cdbd','#c9c2b2');cmSpeck(g,x,y,tx,ty,10,['#8a7a6a','#a86a4a','#5a6a7a','#e8e2d4','#6a8a6a'],1,1,171)}},
{id:'plank_dark',n:'Dark planks',cat:'floor',mc:'#45331f',f(g,x,y,tx,ty){for(let r=0;r<32;r+=8){const row=ty*4+r/8;g.fillStyle=row%2?'#4a3626':'#40301f';g.fillRect(x,y+r,32,8);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x,y+r,32,1);const j=Math.floor(cmH(row,tx,173)*32);g.fillRect(x+j,y+r,1,8)}}},
{id:'boards',n:'Old boards',cat:'floor',mc:'#86663f',f(g,x,y,tx,ty){for(let r=0;r<32;r+=16){const row=ty*2+r/16;g.fillStyle=cmH(row,tx,175)<.5?'#8a6a44':'#7e6040';g.fillRect(x,y+r,32,16);g.fillStyle='#4a3420';g.fillRect(x,y+r+15,32,1);g.fillStyle='#3a2a1a';g.fillRect(x+3,y+r+3,1,1);g.fillRect(x+3,y+r+11,1,1);g.fillRect(x+28,y+r+3,1,1);g.fillRect(x+28,y+r+11,1,1);if(cmH(row,tx,176)<.3){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x+8+Math.floor(cmH(row,tx,177)*14),y+r+6,6,1)}}}},
{id:'checker',n:'Black & white checker',cat:'floor',mc:'#8c8d8b',f(g,x,y){cmT2(g,x,y,16,'#e8e8e4','#2a2c32')}},
{id:'checker_red',n:'Red & white checker',cat:'floor',mc:'#c88a84',f(g,x,y){cmT2(g,x,y,16,'#e8e4dc','#a8342c')}},
{id:'marble',n:'Marble',cat:'floor',mc:'#c8c4bc',f(g,x,y,tx,ty){g.fillStyle=(tx+ty)%2?'#d8d4cc':'#b4b0a8';g.fillRect(x,y,32,32);g.strokeStyle='rgba(120,110,100,.35)';g.lineWidth=1;g.beginPath();const a=cmH(tx,ty,179)*32;g.moveTo(x,y+a);g.lineTo(x+12,y+a*.6+6);g.lineTo(x+32,y+cmH(tx,ty,180)*32);g.stroke();g.fillStyle='rgba(0,0,0,.12)';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32)}},
{id:'linoleum',n:'Linoleum',cat:'floor',mc:'#9a9180',f(g,x,y,tx,ty){cmT2(g,x,y,16,'#a8a08a','#8a8270');cmSpeck(g,x,y,tx,ty,2,['rgba(40,30,20,.25)'],3,2,182)}},
{id:'metal',n:'Metal floor',cat:'floor',mc:'#686b70',f(g,x,y,tx,ty){g.fillStyle='#6a6d72';g.fillRect(x,y,32,32);for(let j=0;j<32;j+=8)for(let i=((j/8)%2)*4;i<32;i+=8){g.fillStyle='#7a7d82';g.fillRect(x+i,y+j+1,3,1);g.fillStyle='#55585d';g.fillRect(x+i+1,y+j+2,3,1)}g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32)}},
{id:'tile_blue',n:'Bath tile (blue)',cat:'floor',mc:'#a2bac6',f(g,x,y){cmT2(g,x,y,8,'#a8c0cc','#9cb4c0');cmGrout(g,x,y,8,'rgba(0,0,0,.08)')}},
{id:'tile_green',n:'Bath tile (green)',cat:'floor',mc:'#95bb9f',f(g,x,y){cmT2(g,x,y,8,'#9ac0a4','#90b69a');cmGrout(g,x,y,8,'rgba(0,0,0,.08)')}},
{id:'tile_white',n:'Store tile',cat:'floor',mc:'#e7e9e3',f(g,x,y){cmT2(g,x,y,16,'#eceee8','#e2e4de');cmGrout(g,x,y,16,'rgba(0,0,0,.07)')}},
{id:'charred',n:'Charred floor',cat:'floor',mc:'#26201c',f(g,x,y,tx,ty){cmT2(g,x,y,16,'#2a2420','#221c18');cmLitter(g,x,y,tx,ty,4,['#14100c','#3a2a20','#4a3a2a'],184)}},
{id:'hay',n:'Straw',cat:'floor',mc:'#c4a456',f(g,x,y,tx,ty){cmCells(g,x,y,'#c8a858','#c0a050','#d0b060');for(let i=0;i<8;i++){const u=cmH(tx,ty,186+i),v=cmH(ty,tx,196+i);g.fillStyle=i%2?'#a88a3a':'#e0c070';g.fillRect(x+Math.floor(u*26),y+Math.floor(v*30),4+(i%3)*2,1)}}},
// water
{id:'water_deep',n:'Deep water',cat:'water',mc:'#1f5a88',walk:0,liq:1,f(g,x,y,tx,ty){cmCells(g,x,y,'#1f5a88','#225e8e','#1c5482');g.fillStyle='rgba(220,240,255,.18)';if(cmH(tx,ty,206)<.4)g.fillRect(x+4+Math.floor(cmH(tx,ty,207)*18),y+6+Math.floor(cmH(tx,ty,208)*20),8,1)}},
{id:'pool',n:'Pool water',cat:'water',mc:'#3aa8d8',walk:0,liq:1,f(g,x,y,tx,ty){g.fillStyle='#3aa8d8';g.fillRect(x,y,32,32);g.fillStyle='#46b4e2';g.fillRect(x,y,32,1);g.fillRect(x,y,1,32);g.fillStyle='rgba(255,255,255,.4)';if(cmH(tx,ty,210)<.5)g.fillRect(x+6+Math.floor(cmH(tx,ty,211)*14),y+8+Math.floor(cmH(tx,ty,212)*14),10,2)}}];
for(const t of CMTK)cmAddTer(t);
// groups for the terrain that was there before the kit
for(const[id,c]of[['grass','ground'],['dirt','ground'],['sand','ground'],['gravel','ground'],['mud','ground'],['soil','ground'],['asphalt','paving'],['concrete','paving'],['sidewalk','paving'],['wood','floor'],['tile','floor'],['water','water']])if(CMTI[id])CMTI[id].cat=c;
for(const t of CMTER)if(!t.cat)t.cat=t.carpet?'carpet':'ground';
for(const id of['asphalt'])if(CMTI[id])CMTI[id].road=1;
for(const id of['sidewalk','concrete'])if(CMTI[id])CMTI[id].curb=1;
// a curb along every edge of a sidewalk-like tile that touches a road (top(i) = the terrain shown on tile i)
function cmCurbs(g,d,tx,ty,x,y,top){const T=d.tile,rd=(a,b)=>{if(a<0||b<0||a>=d.w||b>=d.h)return false;const t=top(b*d.w+a);return !!t&&!!t.road};
const E=[[0,-1,x,y,T,4],[0,1,x,y+T-4,T,4],[-1,0,x,y,4,T],[1,0,x+T-4,y,4,T]];for(const[dx,dy,a,b,w,h]of E)if(rd(tx+dx,ty+dy)){g.fillStyle='#8a8a84';g.fillRect(a,b,w,h);g.fillStyle='#a6a69e';if(dy)g.fillRect(a,dy<0?b+3:b,w,1);else g.fillRect(dx<0?a+3:a,b,1,h);g.fillStyle='#4a4c50';if(dy)g.fillRect(a,dy<0?b:b+3,w,1);else g.fillRect(dx<0?a:a+3,b,1,h)}}
