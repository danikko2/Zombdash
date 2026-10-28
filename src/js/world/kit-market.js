//# world/kit-market.js — Building kit pieces from Hometown Market: the market's lawn
// ---------- Hometown Market's pieces ----------
// (functions and registries only: nothing here runs during the first map build at boot)
// the market's lawn: the old map's darker grass with its tufts
cmAddTer({id:'grass_market',n:'Market lawn',cat:'ground',mc:'#4f8a3e',f(g,x,y){cmCells(g,x,y,'#4f8a3e','#57943f','#4a8238');g.fillStyle='#3f7a34';for(let j=0;j<32;j+=16)for(let i=0;i<32;i+=16)if(((x+i)*31+(y+j)*17)%7==0){g.fillRect(x+i+4,y+j+6,2,5);g.fillRect(x+i+9,y+j+4,2,6)}}});
