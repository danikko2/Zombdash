//# editor/history.js — The Map Workshop's single undo/redo history (terrain, props, walls, spawns and map settings all use it)
// ---------- undo / redo ----------
// An entry is {n: name, undo(), redo()}, pushed after its change is already made. Each entry gets an id, so "saved"
// just remembers the id on top of the undo list: undoing back to that point makes the map clean again.
let EDH={u:[],r:[],id:0,max:400};
function hReset(){EDH={u:[],r:[],id:0,max:400}}
function hTop(){const e=EDH.u[EDH.u.length-1];return e?e.id:0}
function hPush(e){e.id=++EDH.id;EDH.u.push(e);if(EDH.u.length>EDH.max)EDH.u.shift();EDH.r.length=0;edChanged(e)}
function hUndo(){const e=EDH.u.pop();if(!e)return null;e.undo();EDH.r.push(e);edChanged(e);return e}
function hRedo(){const e=EDH.r.pop();if(!e)return null;e.redo();EDH.u.push(e);edChanged(e);return e}
// several entries as one step
function hGroup(n,L){return{n,undo(){for(let i=L.length-1;i>=0;i--)L[i].undo()},redo(){for(const e of L)e.redo()}}}
