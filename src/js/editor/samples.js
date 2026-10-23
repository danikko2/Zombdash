//# editor/samples.js — Sample maps that come with the game (src/maps/samples/*.json, embedded by tools/build.js) and the Workshop's Samples list: add a copy to your maps or edit one
// ---------- sample maps ----------
// Each sample is an ordinary map file. Taking one makes a copy with a new id, so it can be changed freely and taken again.
const CMSAMPLES=[{{json:maps/samples/town-block.zombdash-map.json}}];
const WSST={};
function wsSampleDoc(i){const j=CMSAMPLES[i];if(!j)return null;const r=cmRead(JSON.stringify(j));return r.doc}
function wsSampleThumb(i){if(WSST[i]!=null)return WSST[i];let u='';try{const d=wsSampleDoc(i);if(d)u=edMakeThumb(d)}catch(e){}return WSST[i]=u}
function wsSamples(){const touch=wsTouch();if(!CMSAMPLES.length)return '';return `<h3 class=wssh>Sample maps</h3><div class=wsl>${CMSAMPLES.map((j,i)=>{const img=wsImg(wsSampleThumb(i));return `<div class=wsc>${img?`<img class=wst alt="" src="${img}">`:'<i class=wst></i>'}<div class=wsi><b>${edEsc(j.name)}</b><small>${j.width}×${j.height} tiles · comes with the game</small><small>${edEsc(j.description||'')}</small><div class=wsa><button class=go onclick="wsSample(${i},1)"${touch?' disabled':''}>EDIT A COPY</button><button onclick="wsSample(${i},0)">ADD TO MY MAPS</button></div></div></div>`}).join('')}</div>`}
async function wsSample(i,edit){const d=wsSampleDoc(i);if(!d){sfx('deny');return}d.id=cmUid('m');d.created=d.updated=new Date().toISOString();sfx('click');try{await wsStore(d)}catch(err){return workshop('Could not add the sample: '+edEsc(err&&err.message||err))}if(edit)return edOpen(cmClone(d),'saved');workshop('Added “'+edEsc(d.name)+'” to your maps: PLAY it from the list.')}
