//# campaign/life-lost.js — "You were eaten" screen
// ---------- losing a life: "you were eaten" with CONTINUE (uses a life) or MAIN MENU ----------
function lifeDeath(){mode='lifeo';L=R=null;duck(1);sfx('over');music(null);const left=LIVES-1;
show(`<div class=p><h2 style="color:var(--blood)">YOU WERE EATEN</h2><div class=sum><div><b>${wave}</b><small>Wave</small></div><div><b>${'♥'.repeat(left)}</b><small>${left==1?'Life left':'Lives left'}</small></div><div><b>${kills}</b><small>Kills</small></div></div>
${left==1?'<p class=note style="text-align:center;color:#ff8a5a">⚠ This is your last life!</p>':''}
<div class=row><button onclick="lifeMenu()">MAIN MENU</button><button class=go onclick="lifeCont()">CONTINUE</button></div></div>`)}
function lifeCont(){if(mode!='lifeo'||LIVES<=1){sfx('deny');return}sfx('click');ui.innerHTML='';mode='play';music(wave%10==0?'boss':'game');lifeLost()}
function lifeMenu(){if(mode!='lifeo')return;LIVES=0;mode='play';over(1);menu()}

