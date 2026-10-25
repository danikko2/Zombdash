//# editor/lighting-panel.js — Map Workshop: the map's time of day (off, morning, day, dusk, night) and its amount slider in the Map panel, live in the editor view
// ---------- time of day in the editor ----------
// The slider changes the map live while it is dragged; letting go makes one undo step. The editor shows the lighting
// (with the player's own light at the player start) unless "Show in the editor" is off; the game always shows it.
function edLtSrc(){const E=ED;if(E.ltsV!==E.ver||!E.lts){E.lts=cmLightSrc(E.d);E.ltsV=E.ver}return E.lts}
function edLtHTML(){const E=ED,d=E.d,lt=d.lt,p=lt&&cmLtP(lt.t),a=lt?Math.round(cl(+lt.a||0,0,1)*100):0;
return `<h4>Time of day</h4><label class=edf title="How the light looks in the game"><span>Lighting</span><select data-f=ltt>${[['','Off (as painted)']].concat(CMLT.map(q=>[q.id,q.n])).map(([id,n])=>`<option value="${id}"${(lt?lt.t:'')===id?' selected':''}>${edEsc(n)}</option>`).join('')}${lt&&!p?`<option selected>${edEsc(lt.t)} (unknown)</option>`:''}</select></label>
${p?`<div class=edrow title="0% looks as painted, 100% is the strongest"><span class=edltl>Amount</span><input type=range data-f=lta min=0 max=100 step=1 value="${a}" aria-label="Lighting amount"><span class=edval id=edltv>${a}%</span></div><p class=edhint>${edEsc(p.d)}${p.lit?' Lamps, light pools, candles, lanterns, fires, sirens, glows and lit windows light the ground, and every player carries a little light.':''}</p>
<label class=edck title="The game always shows it"><input type=checkbox data-f=ltv${E.ltv!==0?' checked':''}> Show the lighting in the editor</label>`:''}`}
// f: ltt (time), lta (amount, %), ltv (show in the editor); commit=1 on change, 0 while dragging
function edLtField(f,t,commit){const E=ED,d=E.d;
if(f=='ltt'){if(!commit)return 1;const v=String(t.value||''),p=cmLtP(v);if(!v){if(d.lt)edSet(d,{lt:null},'Turn the time of day off');return 1}if(!p)return 1;if(d.lt&&d.lt.t===v)return 1;edSet(d,{lt:{t:v,a:p.def}},'Time of day: '+p.n);return 1}
if(f=='lta'){if(!d.lt)return 1;const A={t:d.lt.t,a:cl((+t.value||0)/100,0,1)};if(!commit){if(!E.ltB)E.ltB=d.lt;d.lt=A;E.need=1;E.mmNeed=1;const el=E.root&&E.root.querySelector('#edltv');if(el)el.textContent=Math.round(A.a*100)+'%';return 1}
const B=E.ltB||d.lt;E.ltB=null;d.lt=B;if(B&&B.a===A.a){edRight();return 1}edSet(d,{lt:A},'Change the light amount');return 1}
if(f=='ltv'){E.ltv=t.checked?1:0;E.need=1;return 1}return 0}
// a selected light prop shows where its beams reach (dashed), with or without the lighting shown
function edLtAim(g,o,lw){if(!o||o.veh||o.dc||o.fx)return;const B=cmOB(o.k);if(!B||!B.lt)return;g.save();g.strokeStyle='rgba(255,226,140,.9)';g.lineWidth=lw;g.setLineDash([5*lw,4*lw]);
for(const s of cmLightSrc({obj:[o]})){g.beginPath();if(s.cw){g.moveTo(s.x,s.y);g.arc(s.x,s.y,s.r,s.ca-s.cw,s.ca+s.cw);g.closePath()}else g.arc(s.x,s.y,s.r,0,7);g.stroke()}g.setLineDash([]);g.restore()}
