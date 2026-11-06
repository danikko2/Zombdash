//# campaign/life-lost.js — "You were eaten" screen
// ---------- losing a life: "you were eaten" with CONTINUE (uses a life) or MAIN MENU ----------
function lifeDeath(){mode='lifeo';L=R=null;duck(1);sfx('over');music(null);const left=LIVES-1;
endLife(left)}
function lifeCont(){if(mode!='lifeo'||LIVES<=1){sfx('deny');return}sfx('click');ui.innerHTML='';mode='play';music(wave%10==0?'boss':'game');lifeLost()}
function lifeMenu(){if(mode!='lifeo')return;LIVES=0;mode='play';over(1);menu()}

