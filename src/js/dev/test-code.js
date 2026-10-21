//# dev/test-code.js — Test code entry, unlock-everything backup/restore
// ---------- test mode (code 2059): everything unlocked; real progress is backed up and restored when turned off ----------
const DVK=['un','sp','sk','wp','cm','ms','sl','tt','bd','cp','cv','cpE','cpH','bm'];
function devBox(){return `<div class=dvb><h3>Test code</h3>${S.dev?`<p class=note style="color:var(--tox)">✓ Test mode is ON. Everything starts OFF, so turn on only what you want to test:</p>${(dtCss(),dtBox())}<button class=red onclick="devOff()">TURN OFF TEST MODE<small>restores your real progress</small></button>`:`<div class=dvr><input id=dvc type=tel inputmode=numeric maxlength=4 placeholder="····" autocomplete=off onkeydown="if(event.key=='Enter')devTry()"><button data-q=1 onclick="devTry()">ENTER</button></div><p class=note id=dvm>Enter a 4-digit code.</p>`}</div>`}
function devTry(){const i=document.getElementById('dvc'),v=((i&&i.value)||'').replace(/\D/g,''),m=document.getElementById('dvm');if(v==='2059'){devSet();sfx('power');options()}else{sfx('deny');if(m)m.textContent=v.length<4?'Codes are 4 digits.':'Wrong code.';if(i)i.value=''}}
function devMax(A){if(A.dvb)return;const bk={};for(const k of DVK)if(A[k]!==undefined)bk[k]=A[k];A.dvb=JSON.stringify(bk);
A.un=CH.map((_,i)=>i);A.cp=CORD.length;A.cv=4;A.cpE=A.cpH=CORD.length;A.bm=[65535,65535,65535];A.sk=Object.assign({},A.sk);wpA(A);A.wp=A.wp.map(w=>{const o=Object.assign({},w,{l:WMAX,x:0});for(let c=1;c<=6;c++){const C=CAMO[c];o[C.k]=Math.max(o[C.k],C.g)}return o});A.cm=A.cm.slice();
msA(A);A.ms=A.ms.map((s,ci)=>{const o=Object.assign({},s,{l:MMAX,x:0,cd:31});for(const[k,n]of SCH[ci])o[k]=Math.max(o[k],n);return o});A.sl=A.sl.slice()}
function devSet(){S.dev=1;S.dt={};sv()}
function devOff(){dtAllOff();for(const A of ACS()){if(!A.dvb)continue;let b={};try{b=JSON.parse(A.dvb)}catch(e){}for(const k of DVK){if(k in b)A[k]=b[k];else delete A[k]}delete A.dvb}S.dev=0;S.sw=cl(S.sw,1,S.best);sv();sfx('click');options()}

