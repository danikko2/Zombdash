//# ui/nx-core.js — Night Ops look: the scaled stage new screens are laid out on, icons, key hints, top bar, small shared pieces
// ---------- Night Ops screens ----------
// New-style screens are laid out on a "stage" of about 1280×720 (720×1280 held upright) that is scaled to fit the real
// screen. The scale never drops below 0.8, so on small phones text stays readable and the stage just gets smaller in
// stage units (the layouts flex to fit). nxS() works it out and stores it in the --nxs CSS variable on #ui.
function nxS(){const w=W||1280,h=H||720,pt=w<h,s=Math.max(.8,Math.min(3,pt?Math.min(w/720,h/1280):Math.min(w/1280,h/720)));
try{if(ui.style&&ui.style.setProperty)ui.style.setProperty('--nxs',String(s))}catch(e){}return{s,pt,w:w/s,h:h/s}}
// the outer markup of a new-style screen: cls names the screen, inner is what goes on the stage
function nxWrap(cls,inner,bg){const z=nxS();return `<div class="nx ${cls||''}${z.pt?' pt':''}${z.h<600?' short':''}${z.w<1180?' nar':''}${PCM()?'':' touch'}">${bg==null?'<div class=nxbg></div>':bg}<div class=nxs>${inner}</div></div>`}
if(typeof addEventListener=='function')addEventListener('resize',()=>{try{if(!ui.querySelector||!ui.querySelector('.nx'))return;const z=nxS();for(const n of ui.querySelectorAll('.nx')){n.classList.toggle('pt',z.pt);n.classList.toggle('short',z.h<600&&!n.classList.contains('hubf'));n.classList.toggle('nar',z.w<1180)}if(UIS=='cmap'&&typeof cwFit=='function')cwFit(0)}catch(e){}});
// line icons (24×24, drawn with the text colour)
const NXI={
back:'<path d="M20 12H5M11 6l-6 6 6 6"/>',home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
play:'<path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none"/>',r:'<path d="M9 6l6 6-6 6"/>',l:'<path d="M15 6l-6 6 6 6"/>',up:'<path d="M6 15l6-6 6 6"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',check:'<path d="M5 12l5 5 9-10"/>',plus:'<path d="M12 5v14M5 12h14"/>',
flag:'<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="currentColor" stroke="none"/>',
zoomout:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6"/>',map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4"/><path d="M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4"/><path d="M8 20h8"/>'};
function nxi(k,sz){return `<svg aria-hidden="true" width="${sz||18}" height="${sz||18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${NXI[k]||''}</svg>`}
// a key hint ("ESC", "Q"); hidden on touch screens
function kc(t){return `<span class=kc>${t}</span>`}
// the top bar every menu screen shares: Back on the left, where you are, extra controls, Main Menu on the right
// o = {back:'js', crumbs:[['Campaign','js'],['Hometown']], mid:'html', right:'html', home:false to hide Main Menu}
function nxTop(o){const cr=(o.crumbs||[]).map((c,i,a)=>i<a.length-1&&c[1]?`<button data-q=1 class=ncr onclick="${c[1]}">${edEsc(c[0])}</button>${nxi('r',14)}`:`<b class=ncr>${edEsc(c[0])}</b>`).join('');
return `<div class=nxtop>${o.back?`<button data-q=1 class=nb onclick="${o.back}">${nxi('back')}BACK${kc('ESC')}</button>`:''}<nav class=ncrs aria-label="Where you are">${cr}</nav>${o.mid?`<div class=nxmid>${o.mid}</div>`:''}<div class=nxr>${o.right||''}${o.home===false?'':`<button data-q=1 class=nb onclick="nxHome()">${nxi('home')}<span class=nbt>MAIN MENU</span></button>`}${o.gear===false?'':`<button data-q=1 class="nb nbi" onclick="options(0)" aria-label="Settings">${nxi('gear')}</button>`}</div></div>`}
// a settings-style page under the shared top bar (options, accounts, online, game balance): cards in a scrolling area
function nxPage(cls,title,top,inner){return nxWrap('npg '+cls,`${nxTop(top)}<h2 class=sr>${title}</h2><div class=npm><div class=npi>${inner}</div></div>`)}
// a small card on its own (your name, new profile, account codes); Esc / Enter press the buttons marked data-esc / data-ent
function nxCard(title,inner,btns){return nxWrap('wmo npd',`<div class="wmd wmsm" role=dialog aria-label="${edEsc(title)}"><b class=wmt>${title}</b>${inner}${btns}</div>`)}
function nxHome(){sfx('click');if(CMLB)return clbBack();menu()}
// segmented control: items [[label, js, on, small text]]
function nxSeg(items,cls){return `<div class="nseg ${cls||''}">${items.map(([t,js,on,sm])=>`<button data-q=1 class="${on?'on':''}" onclick="${js}">${t}${sm?`<small>${sm}</small>`:''}</button>`).join('')}</div>`}
// difficulty for the current mode, with campaign lives under each choice
function nxDif(after){const c=GMD=='c';return nxSeg([0,1,2].map(d=>[DNm(d,c),`setDif(${d});${after}`,DIF()==d,c?[4,3,1][d]+(d==2?' life':' lives'):'']),'ndif')}
// a survivor sprite drawn by paintUI (lk = dark silhouette for locked ones)
function nxCh(ci,lk,cls){return `<canvas class="nch ${cls||''}" data-ch=${ci}${lk?' data-lk=1':''}></canvas>`}
const nxN=n=>fmt(Math.round(n||0));
// older screens (options, accounts, survivor select…) get the same top bar: their own BACK, the screen's title, Main Menu
function topFrame(h){const z=nxS(),m=/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(h),t=m?m[1].replace(/<small[\s\S]*?<\/small>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim():'',bk=/<button[^>]*onclick="([^"]*)"[^>]*>(?:BACK|CANCEL|DONE)</.exec(h);
return `<div class="nx hubf${z.pt?' pt':''}${z.w<1180?' nar':''}${PCM()?'':' touch'}" style="height:calc(72px * var(--nxs,1))"><div class=nxs>${nxTop({back:bk?bk[1]:'menu()',crumbs:[[t||'Menu']]})}</div></div><div class=hubp style="top:calc(72px * var(--nxs,1))">${h}</div>`}
