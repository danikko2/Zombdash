//# render/camos.js — Camo pattern rendering
// ----- camo rendering (small canvases, built once and cached) -----
const CMC={},CMK=[],ARM={};
const hsh=(x,y,s)=>{let h=Math.imul((x*374761393+y*668265263+s*982451653)|0,1274126177);h^=h>>>13;h=Math.imul(h,1103515245);return((h^h>>>16)>>>0)/4294967296};
function vn(x,y,c,s){const X=Math.floor(x/c),Y=Math.floor(y/c),fx=x/c-X,fy=y/c-Y,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),a=hsh(X,Y,s),b=hsh(X+1,Y,s),d=hsh(X,Y+1,s),e=hsh(X+1,Y+1,s);return a+(b-a)*sx+(d-a)*sy+(a-b-d+e)*sx*sy}
const fbm=(x,y,s)=>vn(x,y,7,s)*.65+vn(x,y,3,s+7)*.35;
const HX=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const CPAL={1:['#3a4a26','#5a7a3a','#8a7448','#1f2816'],2:['#c9a46a','#a8814a','#e6cf9e','#7d5f36'],3:['#5a6068','#8a9099','#c0c5cb','#2e3236'],4:['#ef8e2a','#1a1410'],5:['#7a1018','#b3202a','#2a0a0c','#e04848'],6:['#18221a','#2c4a2a','#7cff4a','#d0ffa8']};for(const k in CPAL)CPAL[k]=CPAL[k].map(HX);
function camoCol(c,x,y,fr,s){let n;const P=CPAL[c];switch(c){
case 1:n=fbm(x,y,s);return n<.36?P[3]:n<.52?P[0]:n<.66?P[1]:P[2];
case 2:n=fbm(x*.8,y*1.4,s);return n<.38?P[1]:n<.6?P[0]:n<.72?P[2]:P[3];
case 3:n=hsh(x>>1,y>>1,s);return n<.3?P[0]:n<.6?P[1]:n<.85?P[2]:P[3];
case 4:n=Math.sin(x*.62+y*.22+fbm(x,y,s)*5);return n>.5?P[1]:P[0];
case 5:n=fbm(x,y,s);return n<.3?P[2]:n>.72?P[3]:hsh(x,y,s)<.08?P[2]:n<.5?P[0]:P[1];
case 6:n=fbm(x,y,s);n=Math.abs(n-.5);return n<.035?P[3]:n<.075?P[2]:fbm(x,y,s)<.5?P[0]:P[1];
case 7:return[236,186,52];
case 8:n=hsh(Math.floor((x+y)/4),Math.floor((x-y+64)/4),s);return n<.25?[127,216,255]:n<.5?[191,239,255]:n<.75?[232,251,255]:[90,184,232];
default:n=fbm(x+fr*1.5,y-fr*.75,s);const v=Math.abs(n-.5);return v<.045?[150,255,90]:v<.09?[60,180,70]:n<.5?[36,14,52]:[92,40,128]}}
function armMask(ci){if(ARM[ci])return ARM[ci];const G=PS[ci].gun,w=G[0][2],h=G[0][3],cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d',{willReadFrequently:true});
const D=(CH[ci]&&CH[ci].dw?G.slice(1):G).map(f=>{g.clearRect(0,0,w,h);g.drawImage(PIMG,f[0],f[1],f[2],f[3],0,0,f[2],f[3]);return g.getImageData(0,0,w,h).data}),m=new Uint8Array(w*h);
for(let j=0;j<h;j++)for(let i=0;i<Math.min(w,34);i++){const o=(j*w+i)*4;if(D[0][o+3]<10)continue;let same=1;for(const d of D)if(d[o]!==D[0][o]||d[o+1]!==D[0][o+1]||d[o+2]!==D[0][o+2]||d[o+3]<10){same=0;break}m[j*w+i]=same}cv.width=0;return ARM[ci]=m}
function camoC(ci,v,gi,c,fr){if(!c||!PIMG.naturalWidth||typeof document=='undefined'||!document.createElement||!PS[ci])return null;fr=CAMO[c].an?fr&7:0;const key=ci+'_'+(v||0)+'_'+gi+'_'+c+'_'+fr;if(CMC[key])return CMC[key];
try{const f=PS[ci].gun[gi],w=f[2],h=f[3],src=v?skinImg(ci,v):PIMG,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d',{willReadFrequently:true});g.drawImage(src,f[0],f[1],w,h,0,0,w,h);
const d=g.getImageData(0,0,w,h),a=d.data,M=armMask(ci),dw=CH[ci]&&CH[ci].dw&&gi==0,T=new Uint8Array(w*h),L=[];
for(let i=0;i<w*h;i++){const o=i*4;if(a[o+3]<10||M[i])continue;if(dw){const x0=i%w+2,y0=(i/w|0)+4;if(x0<w&&y0<h&&M[y0*w+x0])continue}const r=a[o],gg=a[o+1],b=a[o+2],mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),l=lum([r,gg,b]);if(l<34||mx-mn>90&&mx>170)continue;T[i]=1;L.push(l)}
L.sort((x,y)=>x-y);const Lm=L.length?L[L.length>>1]:100,s=gi*13+ci*3;
for(let i=0;i<w*h;i++){if(!T[i])continue;const o=i*4,x=i%w,y=i/w|0,k=cl(lum([a[o],a[o+1],a[o+2]])/Lm,.45,1.6),col=camoCol(c,x,y,fr,s);let r=col[0]*k,gg=col[1]*k,b=col[2]*k;
if(c==7){const u=x+y*.7,cc=fr/8*(w+50)-25,dd=Math.abs(u-cc),m=dd<3?.7:dd<6?.35:0;r+=(255-r)*m;gg+=(255-gg)*m;b+=(255-b)*m}
if(c==8&&hsh(x,y,fr+99)<.03)r=gg=b=255;
if(c==9&&col[1]>150){const q=.75+.35*Math.sin(fr*.785+x*.15);r*=q;gg*=q;b*=q}
a[o]=cl(r,0,255);a[o+1]=cl(gg,0,255);a[o+2]=cl(b,0,255)}
g.putImageData(d,0,0);CMK.push(key);if(CMK.length>300){const o=CMK.shift(),q=CMC[o];if(q){q.width=0;delete CMC[o]}}return CMC[key]=cv}catch(e){return null}}
// a gun on its own, without the survivor's arm holding it (store pictures). The arm is the part of a survivor's gun frames
// that is the same in all of them (armMask); bits of the arm's dark outline left floating once it is gone are dropped too.
// Guns look the same in every survivor's hands, so Dave's frames are used, except a survivor's own laser version of a gun.
const GOM={},GOC={},GOK=[];
function gunSrc(ci,gi){const c=CH[ci];return c&&c.lv&&c.lv.includes(gi)&&!c.dw?ci:0}
function gunMask(src,gi){const key=src+'_'+gi;if(GOM[key])return GOM[key];const f=PS[src].gun[gi],w=f[2],h=f[3],cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d',{willReadFrequently:true});g.drawImage(PIMG,f[0],f[1],w,h,0,0,w,h);
const a=g.getImageData(0,0,w,h).data,M=armMask(src),K=new Uint8Array(w*h),B=new Uint8Array(w*h);cv.width=0;
for(let i=0;i<w*h;i++){if(a[i*4+3]<10||M[i])continue;K[i]=1;if(lum([a[i*4],a[i*4+1],a[i*4+2]])>=40)B[i]=1}
let x0=w,y0=h,x1=-1,y1=-1;for(let i=0;i<w*h;i++){if(!K[i])continue;const x=i%w,y=i/w|0;if(!B[i]){let n=0;for(let dy=-1;dy<=1&&!n;dy++)for(let dx=-1;dx<=1;dx++){const X_=x+dx,Y_=y+dy;if(X_>=0&&X_<w&&Y_>=0&&Y_<h&&B[Y_*w+X_]){n=1;break}}if(!n){K[i]=0;continue}}
if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
// the Pistol is mostly hidden by the hand: close the gap between its slide and grip with the nearest colour
const Fl=new Int32Array(w*h).fill(-1);if(gi==0)for(let i=0;i<w*h;i++){if(K[i]||!M[i])continue;const x=i%w,y=i/w|0;let u=0,d=0;for(let k=1;k<6&&!u;k++)if(y-k>=0&&B[(y-k)*w+x])u=k;for(let k=1;k<6&&!d;k++)if(y+k<h&&B[(y+k)*w+x])d=k;if(u&&d)Fl[i]=u<=d?(y-u)*w+x:(y+d)*w+x}
return GOM[key]={K,Fl,bb:x1<0?[0,0,w,h]:[x0,y0,x1-x0+1,y1-y0+1]}}
function gunOnly(ci,gi,cm){if(!PIMG.naturalWidth||typeof document=='undefined'||!document.createElement)return null;const src=gunSrc(ci,gi);cm=cm||0;const key=src+'_'+gi+'_'+cm;if(GOC[key])return GOC[key];
try{const f=PS[src].gun[gi],w=f[2],h=f[3],m=gunMask(src,gi),cc=cm?camoC(src,0,gi,cm,0):null,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d',{willReadFrequently:true});g.drawImage(cc||PIMG,cc?0:f[0],cc?0:f[1],w,h,0,0,w,h);
const d=g.getImageData(0,0,w,h),a=d.data;for(let i=0;i<w*h;i++){const s=m.Fl[i];if(s>=0){a[i*4]=a[s*4];a[i*4+1]=a[s*4+1];a[i*4+2]=a[s*4+2];a[i*4+3]=255}else if(!m.K[i])a[i*4+3]=0}g.putImageData(d,0,0);cv.bb=m.bb;GOK.push(key);if(GOK.length>120){const o=GOK.shift(),q=GOC[o];if(q){q.width=0;delete GOC[o]}}return GOC[key]=cv}catch(e){return null}}
// canvas[data-gn=gun] (data-ci survivor, data-cm camo, data-w × data-h its size on the page): drawn at twice that for sharp pixels
function paintGuns(root){if(!root||!root.querySelectorAll)return;for(const cv of root.querySelectorAll('canvas[data-gn]')){const gi=+cv.dataset.gn,W2=(+cv.dataset.w||110)*2,H2=(+cv.dataset.h||40)*2,g=cv.getContext&&cv.getContext('2d');if(!g)continue;if(cv.width!=W2)cv.width=W2;if(cv.height!=H2)cv.height=H2;g.clearRect(0,0,W2,H2);g.imageSmoothingEnabled=false;
const o=gunOnly(+cv.dataset.ci||0,gi,+cv.dataset.cm||0);if(!o||!o.bb)continue;const b=o.bb,k=Math.min((W2-4)/b[2],(H2-4)/b[3],+cv.dataset.k||99);g.drawImage(o,b[0],b[1],b[2],b[3],Math.round((W2-b[2]*k)/2),Math.round((H2-b[3]*k)/2),b[2]*k,b[3]*k)}}
function gunFr(){return Math.floor(performance.now()/110)}
function paintCam(root){if(!root||!root.querySelectorAll)return;for(const cv of root.querySelectorAll('canvas[data-cg]')){const gi=+cv.dataset.cg,ci=+cv.dataset.ci||0,cm=+cv.dataset.cm||0,f=PS[ci]&&PS[ci].gun[gi],W2=+cv.dataset.w||64,H2=+cv.dataset.h||24,g=cv.getContext('2d');if(cv.width!=W2)cv.width=W2;if(cv.height!=H2)cv.height=H2;g.clearRect(0,0,W2,H2);g.imageSmoothingEnabled=false;if(!f||!PIMG.naturalWidth)continue;
const cc=cm?camoC(ci,0,gi,cm,cv.classList.contains('anim')?ARF:0):null,k=Math.min((W2-4)/f[2],(H2-2)/f[3]);g.drawImage(cc||PIMG,cc?0:f[0],cc?0:f[1],f[2],f[3],(W2-f[2]*k)/2,(H2-f[3]*k)/2,f[2]*k,f[3]*k)}}
if(typeof setInterval=='function')setInterval(()=>{try{if(mode!='menu'||UIS!='arm'||!ui.querySelector)return;const cv=ui.querySelector('canvas.anim');if(!cv||!CAMO[+cv.dataset.cm||0].an)return;ARF=(ARF+1)&7;paintCam(cv.parentNode)}catch(e){}},120);
