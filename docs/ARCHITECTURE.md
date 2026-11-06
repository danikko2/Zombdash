# Zombdash code map

The game ships as **one self-contained file**, `index.html` (what GitHub Pages serves, what the Claude artifact shows, and what a future desktop/Steam build will wrap). That file is **generated**: the real source lives in `src/` and `tools/build.js` joins it back together.

> **Don't edit `index.html` by hand.** Edit the files in `src/`, then build. On GitHub, editing a file in `src/` is enough: the *Build index.html* action rebuilds and commits `index.html` for you.

## Folders

| Path | What it is |
|---|---|
| `src/index.html` | The page shell (head, canvas, menu layer). `{{CSS}}`, `{{EARLY}}` and `{{GAME}}` mark where the build puts the styles and code. |
| `src/css/game.css` | All the styles for menus and the HUD. |
| `src/js/early-error-screen.js` | Tiny script that shows a "Startup error" box if the game fails to load. |
| `src/js/modules.txt` | **Load order** of the game modules. |
| `src/js/**` | The game, split into 131 modules (listed below). The Map Workshop is in `src/js/editor/`, the custom map format, loader and building kit in `src/js/world/`. |
| `src/maps/` | Map files that ship with the game, embedded by the build with `{{json:maps/<file>}}`: `suburb.json`, `warehouse.json`, `graveyard.json`, `school.json`, `highway.json`, `mansion.json`, `market.json`, `mainst.json`, `foundry.json`, `forest.json` and `downtown.json` are the Suburb, the Warehouse, the Graveyard, the School, Deadway Highway, the Haunted Mansion, Hometown Market, Main Street and the Black Iron Foundry (maps 0, 1, 2, 3, 8, 9, 14, 15 and 16, built-in maps made from files, see "Built-in maps from map files"); `samples/town-block.zombdash-map.json` is the Workshop's sample map. |
| `src/assets/sprites/` | `zombies.png` (zombie atlas, plus the Chicken Gun's rubber chicken and the bolts of the Crossbow, Blastbow and Firebow: `ZS.chicken`, `ZS.bolt`, `ZS.bbolt`, `ZS.fbolt`, the Life Saver's heart, `ZS.heart`, the Bubble Cannon's bubble, `ZS.bubble`, and the Fire Hose's flame, `ZS.flame`) and `survivors.png` (player atlas, with every gun in each survivor's hand, plus Ken's MIG welding gun, `PS[17].mig`, which only his boss holds, and Buck's football in his hand, `PS[18].ball`, his boss minigun carried hanging at his side, `PS[18].mini`, and that gun on its own, `PS[18].minid`; and the Headlamp: its store icon and its lamp lit and dark, `XS.hl`, with where it sits on every survivor's head in each walk and idle frame, `HLA`). Frame positions are in `ZS` / `PS` / `XS` / `HLA` in `render/sprites.js`. New frames go below the old ones so nothing moves. |
| `src/assets/thumbs/map-NN.jpg` | Map preview pictures; `NN` is the map's number in `MP`. |
| `src/assets/sounds/` | Recorded reload sounds (everything else is synthesized in `audio/sound.js`). |
| `tools/build.js` | The build (Node, no packages needed). |
| `tools/check-map.js` | The map checker: `node tools/check-map.js map.json` reports errors, missing assets and other problems in map files (see `docs/map-format.md`). |
| `tests/run.js`, `tests/suites/` | Automated tests that load the real game in Node with a fake browser. `tests/fixtures/suburb-walls.json`, `warehouse-walls.json` and `school-walls.json` are the old maps' collision, start, spawns and no-spawn box, which `tests/suites/suburb.js`, `warehouse.js` and `school.js` check the converted maps against; `tests/suites/market.js` checks Hometown Market (redesigned, so no old-collision fixture). |
| `docs/` | This file, the map editor plan (`map-editor-plan.md`), the map file format (`map-format.md`) and the Supabase setup SQL for online accounts. |

## Build and test

```
node tools/build.js          # src/ → index.html
node tools/build.js --check  # fails if index.html is out of date with src/
node tests/run.js            # every test suite (about 4 minutes)
node tests/run.js spawn ammo # only suites whose name contains a word
```
(`npm run build`, `npm run check` and `npm test` do the same.)

## How the modules fit together

* Every module is a plain script; the build joins them **in the order of `modules.txt`** into one `<script>`. They all share one global scope, exactly like before the split.
* Order only matters for code that runs **while the page loads** (top-level `const`/`let` values, wrappers such as `devBox=function(){…}`, and anything called at the top level). Functions can call any other function once the game is running.
* To add a module: create the file and add its path to `modules.txt` after everything it needs during loading. The build refuses to run if a `.js` file isn't listed, or is listed twice.
* Lines starting with `//#` at the very top of a module are notes for people; the build leaves them out.
* Pictures and sounds are written as `data:image/png;base64,{{asset:sprites/zombies.png}}`; the build swaps in the file from `src/assets/`. To change a sprite sheet, replace the PNG.
* JSON files from `src/` are embedded with `{{json:maps/samples/town-block.zombdash-map.json}}` (the build writes the file's JSON there, with `</` escaped); that is how map files ship with the game.
* The split was done so that the built `index.html` is **byte-for-byte identical** to the single file it came from, so nothing in the game changed.

## Where to change things

| To change… | Look at |
|---|---|
| Weapon damage, fire rate, spread, store price | `WP` in `data/tables.js` |
| Survivors: health, speed, starting gun, unlock price | `CH` in `data/tables.js` |
| Zombie / wave boss health, speed, size, cash per kill | `ZT` in `data/tables.js` |
| Magazine sizes, ammo types (max, per purchase, price, pickup size) | `MAG`, `AMI` in `weapons/ammo-and-inventory.js` |
| Fire and reload sounds of each gun | `FSN`, `RLS` in `weapons/ammo-and-inventory.js` |
| Crossbow bolts (speed, life) and the Chicken Gun (rockets per chicken; how many chickens are out at once, how many zombies each eats, the health that counts as two, their speed) | `WP` (`bv`, `bl`, `apr`) in `data/tables.js`, `CKG` in `weapons/chickens.js` |
| Blastbow (blast damage to the zombie it sticks in and around it, blast radius, fuse), Death Row (damage range, most zombies in a chain, jump distance, reach) and Firebow (burn time, fire damage per second) | `WP` (`bx`, `bs`, `br`, `bf`; `d`, `dx`, `zn`, `zj`, `zr`; `bt`, `bd`) in `data/tables.js`, explained at the top of `weapons/bows-and-lightning.js` |
| Life Saver (health a heart heals, rockets per heart, heart speed, wall bounces, how long a heart flies) | `WP` (`hl`, `apr`, `lv`, `lb`, `ll`) in `data/tables.js`; its 3 s reload is `RLT` in `weapons/ammo-and-inventory.js` |
| Bubble Cannon (damage of each pop, bubbles a shot, rockets per shot, splash radius, float time, bubble speed) | `WP` (`d`, `bn0`, `bn1`, `apr`, `br`, `bt`, `bv`) in `data/tables.js`; magazine and reload are `MAG` / `RLT` in `weapons/ammo-and-inventory.js` |
| Fire Hose (damage a second in the flame, reach, half-width, afterburn seconds and damage, seconds of flame per round, rounds of flame per rocket) | `WP` (`d`, `fr`, `fw`, `fb0`, `fb1`, `fbd`, `r`, `rpu`) in `data/tables.js`; magazine (100 rounds) and reload are `MAG` / `RLT`; rounds per rocket and the spare rounds kept in `p.amx` are `RPU`, `amTake`, `amGive` in `weapons/ammo-and-inventory.js` |
| Extras slots and the Headlamp (store price, how far its light goes, brightness, beam width, how it fades going out) | `EXG.slots` and `EXI` (`cost`, `r`, `i`, `w`, `fd`) in `extras/extras.js`; the fade is drawn by `cmLtOne` in `world/kit-lighting.js` (lights with `fd`); GAME BALANCE has them on the Extras tab |
| What each zombie / boss drops and how often | `DROPT`, `DROPG` in `game/drop-table.js` |
| Zombie tiers, special/ranged caps, new-type schedule, campaign sections | `ZC`, `ZCFG` in `zombies/spawn-system.js` |
| Exploder, Healer, Rotwood tuning | `ZX`, `ZH`, `ZR` in `zombies/spawn-system.js` |
| How many zombies per wave (formula and per-map %) | `ZWN`, `ZMAPM` in `zombies/wave-size.js` |
| Survivor boss health and speed | `SVS` in `bosses/survivors.js` |
| Ken's lightning (reach, bolt speed, gap between zaps, the overcharged gap, the warning crackle) | `SVS[17]` (`br`, `bv`, `cd`, `c3`, `ch`) in `bosses/survivors.js`, explained at the top of `bosses/ken.js`; all in GAME BALANCE → Speed |
| Buck's charge and minigun (charge speed and length, ghost teammates, the crouch before the snap, the break between plays; the minigun's fire rate, burst length, turn speed, bullet speed) | `SVS[18]` (`cv`, `cl`, `gn`, `cw`, `ca`; `mr`, `mt`, `mtr`, `mv`, `ml`, `ms`) in `bosses/survivors.js`, explained at the top of `bosses/quarterback.js`; all but `ml` and `ms` in GAME BALANCE → Speed |
| Easy / Normal / Hard multipliers | `core/difficulty.js` |
| Map list and names | `MP` in `world/map-list-and-pathfinding.js`; descriptions `MPD` in `ui/map-and-survivor-select.js` |
| The Suburb's, the Warehouse's, the Graveyard's, the School's, Deadway Highway's, the Haunted Mansion's, Hometown Market's, Main Street's, the Black Iron Foundry's, the Enchanted Forest's, Downtown Zombville's or Zombville Stadium's layout | `src/maps/suburb.json`, `src/maps/warehouse.json`, `src/maps/graveyard.json`, `src/maps/school.json`, `src/maps/highway.json`, `src/maps/mansion.json`, `src/maps/market.json`, `src/maps/mainst.json`, `src/maps/foundry.json`, `src/maps/forest.json`, `src/maps/downtown.json`, `src/maps/stadium.json` (a map file: edit a copy in the Workshop, export it, and replace the file; check it with `tools/check-map.js` and `tests/suites/suburb.js`) |
| Campaign sections and map order | `SEC` in `campaign/sections.js`, `CORD` in `campaign/modes.js` |
| Which survivor holds out on each map (the wave-20 boss) | `UNM` / `MUN` in `progress/survivor-unlocks.js` (a map left out has no survivor yet: clearing wave 20 wins it) |
| Which survivor bosses custom campaign maps may use | `CCBOSS` / `CCNOT` in `campaign/custom-campaign.js` |
| Skill tree | `SKB` in `ui/core-ui.js` |
| Online accounts / leaderboards | `online/supabase.js` and `docs/supabase-setup.sql` |
| Test code and its switches | `dev/test-code.js`, `dev/test-switches.js`, `dev/balance-editor.js` |
| Terrain types for custom maps (add one with `cmAddTer`) | `CMTER` in `world/map-schema.js` |
| Blood / burn overlays, wall styles for custom maps | `CMOVL`, `CMWALL` in `world/map-schema.js` |
| Carpet colours, farm soil, road markings | `CMCARPET`, `cmAddOvl(...)` in `world/terrain-more.js` |
| House props (kitchen, living room, bedroom, bathroom, garage) and their colour choices | `maps/props/home-props.js` (`PCAB`, `PFAB`, `PAPP`, `PMET`, `PTIL`, `PBRK`) |
| Forest and farm props, leaf / grass colours | `maps/props/forest-props.js` (`PLEAF`, `PGRS`, `PBARK`) |
| Names and categories in the editor's prop browser | `EDPN` (props), `EDVN` (vehicles), `EDCAT` in `editor/assets.js` |
| Building kit pieces: decals, areas, paths, effects (add one with `cmAddDec` / `cmAddArea` / `cmAddPath` / `cmAddFx`) | `world/kit-decals.js`, `kit-areas.js`, `kit-paths.js`, `kit-effects.js` |
| Special features (no-spawn, building interior, store, City Hall roof, road graph) and what the game does with them | `CMFEAT` in `world/kit-core.js`, `cmFeatHS` in `world/custom-maps.js` |
| Wall styles incl. windows, doorways, glass, bars | `world/kit-walls.js` (added to `CMWALL`) |
| Kit terrains (lawns, forest floor, pavers, floors, deep water…) | `CMTK` in `world/terrain-kit.js` |
| Kit props (signs with text, portraits, wrecks, office / school / bath rows…) | `maps/props/kit-props.js` |
| Openings the editor's Opening tool offers, room wall styles | `EDOPEN`, `EDROOMW` in `editor/kit-tools.js` |
| Starter prefabs | `CMPFS` in `editor/prefab-starter.js` |
| Blood colours, more blood, dead zombies (their zombie kinds), body parts, the blood trail path | `PDBLOOD` in `world/kit-decals.js`; `world/kit-gore.js` (`CMDZ`, `PDSKIN`, `PDSHIRT`, `PDPANTS`) |
| Time of day: the looks, which props give light | `CMLT`, `CMLP` in `world/kit-lighting.js` |
| Workshop sample maps | `CMSAMPLES` in `editor/samples.js` (files in `src/maps/samples/`) |

Values changed in the in-game **GAME BALANCE** menu only live on that device; use its *Copy changes as a list* button and ask Claude to make them permanent in these files.

## Custom maps (the Map Workshop)

**CREATE** on the main menu opens the Map Workshop (`editor/workshop.js`): your maps with thumbnails, search, new, edit, play, rename, duplicate, export, import and delete. The editor itself (`editor/editor.js`) is for mouse and keyboard; maps made with it play everywhere, split screen included.

* **Maps are data.** A custom map is a JSON file (format below). `cmRead` checks and loads one, `cmWrite` writes one, and `cmBuild` (`world/custom-maps.js`) turns it into a playable map the same way a `mapXxx()` function does: it sets `WW`/`WH`, paints `BG` with the real props (`OB`) and vehicles (`hwDraw`), fills `WL` (walls, water, solid props, `hwCol` for vehicles) and sets `HS` (player start, `HS.CZ` = spawn points and zones, which `spawnZ` uses).
* **Where they live.** On the device, in IndexedDB (`zombdash-maps`, see `world/map-store.js`), never in `S` or the online saves. Without IndexedDB they last until the page closes and the Workshop says so. The editor keeps a crash-safe draft of unsaved changes, offered back in the Workshop.
* **In the game.** Custom maps get no slot in `MP`. While the game runs, each saved map has a map key from 1000 up (`CMKEY`) and the playtest map is 900 (`CMPTK`); `mapId` holds that key and `build()` hands it to `cmBuild`. `cmIs(m)` tells them apart, `cmPT(m)` is the playtest, `cmIdOf(key)` / `cmKeyById(id)` go between keys and map ids. Free Play lists them after the built-in maps (`ORD`). Custom maps never touch `S.mp`.
* **Records on custom maps** (Free Play runs, never playtests):
  * **Best waves** are kept per map id in `S.ac.cmw` (`mBest`, `mapUnl` in `progress/survivor-unlocks.js`) and shown in the map select.
  * **Crash checkpoint:** `cpSave` writes `m:-1` and `cm:<map id>`; `cpMap(c)` finds the map again, and the checkpoint is only offered while that map is on the device.
  * **Leaderboards:** a custom-map score is posted as `map = 63` with the map's id in the `cmap` column (`olRow` in `online/supabase.js`, `CMLBM`). Everyone who has the same map file (same id) shares a board. "All maps" leaves map 63 out. The `cmap` column must exist on the server: run the current `docs/supabase-setup.sql` once (it is safe to run again); until then the server refuses custom-map scores and the built-in boards carry on as before.
* **Playtest** (`editor/playtest.js`) plays the edited map with the real game (`start()`), with saving switched off (`sv.off`); afterwards the account, best wave and settings are put back exactly, so a playtest earns nothing and writes no checkpoint or score.
* **Problems.** `cmLint` lists what the editor warns about, each with a `ref` to the thing it is about (the Problems tab jumps to it): no player start, the start or a spawn inside a wall, spawns zombies can't walk from to the player, things outside the map, missing props / vehicles / terrain.

### A campaign map with no survivor yet, and maps added to a finished section

* **No survivor yet.** A built-in campaign map with no entry in `MUN` (none now: the Black Iron Foundry, map 16, was one until Ken came and Zombville Stadium, map 17, until Buck came; `tests/suites/foundry.js` still checks it with Ken's entry taken out) has no wave-20 boss: `campNoBoss()` (`bosses/survivors.js`) is true, so `nextWave` lets wave 20 play like any wave (a regular boss wave), and when it is cleared `update.js` calls `campClear()`: "WAVE 20 SURVIVED!", `campRec(null)` marks the map beaten for everyone playing (the same notes as a survivor win, nobody recruited), and after 3.5 s (`CLR`) `campWin()` shows the end screen; `cwH`, `cMunT` and the split-screen lobby say no survivor holds out there yet. To give the map its survivor, add it to `UNM` and the fight takes over.
* **Maps added to a section later.** `secDone` would close the next section for players who had finished the old section. `SLATE = {16: [8, 2, 9, 10], 17: [11, 12, 13]}` (`campaign/sections.js`) names each new map and the maps its section had before; `slInit(A)` records once per map per account (`A.slt`, bit d = difficulty d) whether it had already beaten all of those, from its progress before its next win (`bmSet` calls it first) or the first time the section is checked. Such an account keeps the section finished (`secLate`), and the new map stays there to play. Split screen merges `A.slt` (`cMerge`). Save codes don't carry `A.slt`, so an imported code is judged by its progress when it is first used. (Until Nov 4, 2026 it was kept in `A.sl`, which is the mastery screen's Zombie-Slayer looks: the two shared slots 16 and 17, so it was moved and starts over.)

### Custom maps in the campaign (step 3)

* **Slots.** The `-1` entries in `SEC` are the free "Coming Soon" slots: 7 of them (Zombville 5, Countryside 4–5, Island 2–5; `ccFree()`). Custom maps never change `SEC`. When a built-in map takes a free slot (the Black Iron Foundry took slot 5 of Wrong Turn, Zombville Stadium slot 4 of Zombville), the slot goes in `CCWAS`, and `ccClean` moves a custom map stored there to the first free slot left (a later section first) with a note in the warnings (`CCMV`, shown with `CCW`); with no free slot it comes out of the campaign. A custom map goes into a slot from the Workshop (**campaign** on its row) or from the slot on the section map (**ADD A MAP**); the dialog is `editor/workshop-campaign.js`.
* **Device data, not save data.** Which map is in which slot, its boss, and which built-in maps are replaced live in IndexedDB next to the maps (`kv` record `campaign`, in memory as `CCS`), so they never reach `S` or the online save. A map is in one place at a time (one slot, or one replacement).
* **In a run** a slot map keeps its runtime key (≥1000) in `mapId`. `secOf()` returns its slot's section, so it gets that section's `ZCFG.camp` line-up and caps; campaign lives and difficulty work as on any campaign map, and `cmpI()` scales it like the toughest map of its section (`ccScaleIdx`). At wave 20 `svSpawn()` brings the boss picked for the slot (`cBossNow()`).
* **Bosses.** Only bosses whose fight works on any map are offered (`CCBOSS`, 14 of them: Ken and Buck too). Not offered (`CCNOT`): the Ice Cream Man and the Fire Chief (they drive the map's road graph `HS.RG`, and the Chief blasts into its buildings `HS.HO`), Penny (the Hometown Market shelves `HS.SHF` / store `HS.ST` and cart corrals `HS.CRL`), and the Mayor (City Hall's roof `HS.CH` and the cruiser on the road graph).
* **Progress.** Custom maps are recorded per account in `A.cmc = {<map id>: bits}` (bit d = beaten on difficulty d; harder counts for easier), never in the beaten-map masks `A.bm` (one bit per built-in map, 17 now; save codes write them in base 36, so more maps fit). `bBt` / `bmSet` / `mOpen` send custom keys there (`bmSet` also ignores anything outside the built-in map numbers). Slots are optional: `secDone` only counts built-in maps, so they never block the next section. Removing a map from its slot keeps its record. Beating the boss marks the map beaten and opens it in Free Play; the survivor gives up but is not recruited (that stays on their own map). A custom map that is in a slot is locked in Free Play until it is beaten there (`ccFreeOK`); maps that aren't in the campaign are always open.
* **Replacing a campaign map.** A custom map can be played instead of a built-in campaign map whose own boss works anywhere (`ccRepOK`: all but City Park, Downtown, Hometown Market and Main Street). Only the campaign is affected. When the run starts (`start` / `startMP` → `ccRunRep`) `mapId` becomes the custom map's key and `CREP = {o, id, key}` remembers the original, so none of the built-in map's own code runs; its section, boss, difficulty scaling and progress stay the original's (`cCampId()`). Leaving the run (`ccRunBack`, called from the menus, the campaign map and the lobby) puts the original back. Restoring is one click; replacing asks first.
* **Checkpoints** on a slot map store `cm` (its id) and are offered only while it is still in a slot; on a replaced map they store the original map number plus `cr` (the replacement's id) and are offered only while that replacement is still active.
* **Leaderboards:** campaign runs never post scores (`olRow` is Free Play only), so custom campaign maps and replaced maps post nothing.
* **Missing maps.** `ccCheck()` runs whenever the maps are (re)loaded: a map that is gone is taken out of the campaign (its slot shows Coming Soon again) with a warning (`CCW`, shown on the section map and in the Workshop); one that is still there but can't be opened keeps its slot, which shows Coming Soon until it's fixed. Deleting a map in the Workshop takes it out of the campaign.

### Layers, draw order and collision shapes (step 2)

* **Layers** (`d.layers`, defaults in `CMLAY`): Terrain and Roads & paths are tile layers (`d.ter`, `d.rtr`, always the bottom two); the rest are object layers (Buildings, Walls & collision, Environmental props, Interior props, Vehicles, Zombie spawns). Every prop, vehicle, wall and spawn marker has `ly`; new things go on the layer of their kind (`cmKindLy`) unless a layer is picked. Layers can be added, renamed, reordered, hidden and locked; deleting one moves its things to another layer or deletes them.
* **Draw order** (`cmDrawList`): by layer (bottom to top), then the object's draw order `z`, then depth (how far down it stands), then age. The editor and the game (`cmPaint`) use the same list. Hiding a layer (or one object, `hd`) only hides it in the editor; the game always paints and collides with everything.
* **Roads & paths** is a second tile layer painted over Terrain: an empty road tile shows the ground below. Overlays (blood, burn) are drawn with the terrain. Water on either layer blocks walking.
* **Solid** (`sol`): `true`/`false` overrides the default (walls and props with a base size in `OB` are solid, vehicles always). **Collision shapes** (`sh`) replace the picture's collision: `{t:'r',x,y,w,h}` a box or `{t:'c',x,y,r}` a circle, as offsets from the object's x,y. The game only has boxes, so `cmShapeBoxes` turns a circle into a stack of thin boxes inside it (strips about 8px high). Shapes stay upright; turning an object turns the shape's offset with it, and a quarter turn swaps a box's width and height. A solid prop with neither a base size nor a shape gets a strip along the bottom of its picture (`cmAutoBox`).
* **Locks:** a locked layer or a locked object (`lk`) can't be selected by box, moved, turned, deleted or painted. A locked object can still be clicked, to unlock it in the properties panel.
* **Editor code:** `editor/selection.js` has the selection, group moves and turns, the clipboard (`EDCB`), layer operations and shape editing; `editor/panels.js` the right-hand panel (Properties, Layers, Problems). Every change goes through the one history (`edMut` snapshots the objects it changes).

### Building kit (format version 3)

The kit lets custom maps be as detailed as the hand-coded maps. The whole format, with every piece and an example, is in **`docs/map-format.md`**; the audit of what the built-in maps needed is in `docs/map-editor-plan.md`.

* **Five kinds of pieces** besides props, vehicles and walls: **decals** (`d.obj` items with `dc`), **effects** (`d.obj` items with `fx`), **areas** (`d.areas`, boxes: floors, porches, docks, parking, roofs, fog…), **paths** (`d.paths`, a first point `x,y` and `pts` relative to it: roads, trails, fences, ponds) and **special features** (`d.feats`: boxes, or the road graph's `pts` and edges `e`). Registries: `CMDEC`/`CMDI`, `CMAREA`/`CMAI`, `CMPA`/`CMPAI`, `CMFX`/`CMFXI`, `CMFEAT`/`CMFEI` (`world/kit-core.js`); each entry is data plus drawing functions.
* **Drawing.** `cmPaintIt` sends each draw-list entry to `cmWallDraw`, `cmAreaDraw`, `cmPathDraw`, `cmDecDraw`, `cmFxBake` (an effect's still part) or the prop / vehicle drawing. Kit pieces of the same layer and order stack by `cmPri` (darkness, floors, rugs, decals, props, effects).
* **Collision** (`cmColl`): walls by style (`walk` styles such as doorways make no box; `fl` 2 styles such as fences and bars let bullets through), solid areas (`cmAreaBoxes`: roofs, the stadium, pools, the skyline band), paths (`cmPathBoxes`: fences as chains of boxes, ponds and streams as rows of see-through boxes), and walk areas (`dock`, `bridge`) that dry the water tiles under them and cut pond / stream boxes away (`cmWalkR`, `cmMinus`).
* **In the game.** `cmBuild` ends with `cmFeatHS(d)` and `HS.CX = cmFxData(d)`. `cmFeatHS` sets the same `HS` fields the built-in maps set: smoke effects → `SM`; `nospawn` → `HS.nx0…`, `HS.NS`, `NOGO` (and `cmSpawnAt` skips spawns inside them); `house` features and indoor floors → `HS.HO`; `roadgraph` → `HS.RG = {N, A}`; `cityhall` → `HS.CH`; `store` → `HS.ST`, its `gshelf` props → `HS.SHF`, `corral`/`cartrow` props → `HS.CRL`; `stree` props → `HS.TRK`. `HS.CX = {A, T, E, O}` holds the animated effects and areas (`cmFxAnim`, drawn under people next to the built-in maps' animations), the ones drawn over people (`cmFxTop`: fog, wisps, and the lines of power-line and bunting paths, `kmTopItems`), portrait eyes and the overhead props (`ov`: hanging signs, street banners; `cmOverhead` draws each from a picture made once, see-through while someone stands under it). While `cmBuild` paints the background `CMGP` is set, so overhead paths leave their lines out of it (only their shadow is painted; the editor draws them whole); both are called from `drawW` (`render/world-and-hud.js`) and only draw what is on screen.
* **Time of day** (`world/kit-lighting.js`): a map's `d.lt = {t, a}` (file `lighting`). `cmBuild` keeps `HS.LT = cmLightData(d)` (the time, the amount and the light sources `cmLightSrc` finds: light, flicker, fire, big fire, flare, glow, wisp, siren and hazard effects, lit-window decals, lamp / lot light / candle / lantern / fireplace / traffic light props, light props' lamp heads, room lights, and areas and paths whose kit entry has `lts`: the stands' exit lights, tents with their lights on, string lights). The times are day, sunrise, morning, dusk, night and `dark` ("Lights only": no sun and no moon, a near-black neutral, as at Zombville Stadium). `drawW` calls `cmLight()` after the world (and before the aim marker and HUD) when `cmLtOn()`: it fills a small light-map canvas (half the screen's resolution, a quarter in low-memory mode) with the time's colour mixed with white by the amount, adds a radial light per source on screen (plus every living player, burning ground and fireballs; sirens take turns, hazards blink, flames flicker), then multiplies the world by it and adds a faint coloured glow (`cmLightPaint`). Floating texts are then drawn on top (`ftTexts` in `game/pickups.js`). Lights that never change (no flicker, blink or siren, not a player's) are drawn once into a picture of the whole map, light and glow (`cmLtCache`, kept on `HS.LT.K`, at most 2048 px across); each frame copies its part and adds only the changing lights (`K.dyn`), so a map with a hundred lamps costs about the same as one with a few. The glow is only drawn once the light strength (`lit × amount`) is over 0.5: fainter, at dusk, it can't be seen and costs a full-screen blend. The editor previews it with the same function (`edDraw`, still picture, the player's light at the start) and map thumbnails are darkened too. The built-in maps drawn by their own code never have it; of the ones made from map files, the School is set at dusk.
* **Turned effects:** an effect's `r` (file `rot`) turns everything it draws (`fxTurn` in `cmFxBake`, `cmFxEd`, `cmFxAnim`, `cmFxTop`); light sources of sirens and hazards turn with it.
* **Decal options:** decals can have `opts` like effects (the dead zombie's kind, pool and mirror); `cmDecDraw` passes them, defaults filled in, as `f(g, v, K, t, O)`.
* **Animated props.** A kit prop with `an(o, t)` (the LED message trailer) is collected with the under-people effects in `cmFxData` and drawn each frame over its own picture in the ground.
* **Walk-behind.** `vehWrap` (`world/vehicles.js`) puts tall props on the walk-behind list: the old list plus every prop with `wb: 1` (kit and forest props), forwarding colour and text. A custom map's vehicle gets a walk-behind box that hugs it, turned or not (`cmCar`).
* **Light props and beams** (`maps/props/kit-props.js`, `world/kit-lighting.js`): a prop's `lt` lists its lamp heads `{dx, dy, r, w, a}` (`dx, dy` is where the lamp is in the picture, from the prop's foot, so a tower's beams start at the lamps on top); `cmLightSrc` turns each into a light source with a beam (`cw` half-width and `ca` direction, from the prop's turn), which `cmLightPaint` fills as a soft wedge. Props with `nr: 1` (poles, towers, tripods) keep their picture standing when turned: `cmPR(o)` gives the turn of a thing's picture and is used by the game (`cmProp`, `cmFoot`) and the editor (drawing, selection, hit tests). `edLtAim` shows a selected light's beams in the editor. A lamp head can carry a flicker kind (`f`): `ceilflk` and `wallflk` use `fault`, a failing bulb (`cmLtNow`: steady, with a short stutter every 3.5–9 s, its rhythm from the light's phase); flickering lights are never cached. **Hanging signs** (props with `ov: 1`: `hsign`, `haisle`) hang from the ceiling: `cmProp` paints only a faint shadow on the floor, `cmFxData` keeps them (`HS.CX.O`) and `cmOverhead` (`world/kit-effects.js`, from `cmFxTop`) draws each from a picture made once over players and zombies, fading it to see-through while anyone stands under it. Props marked `eo: 1` (the ceiling light) are drawn only by the editor: `cmProp` skips them, so the game and map thumbnails show just their light. A `roomlight` area becomes a box light source (`rect`), which `cmLightPaint` fills evenly with a short soft spill past its edges, so a whole room reads as lit. **Walls block light:** `cmLtBlk(d)` lists what stops light (solid wall pieces whose style has `fl: 0` and no `lp: 1` — so not windows, glass, fences, bars, hedges or invisible blockers — plus roof and stadium areas) in a 128 px grid; `cmLtVis` casts rays from a light to the corners of the walls in its reach (and round its edge) and gives the outline it can see (`vis`, 0 when no wall is in reach). `cmLightSrc` works it out once per light and keeps the walls on the list as `L.O`; `cmLightPaint` clips each light (and its glow) to its outline, and works out the outline every frame only for lights that move (players, fires). A room light keeps its whole box lit and only its spill is cut, so it leaves a room through doorways and windows.
* **Vehicle stripes:** a vehicle's `c2` (file `color2`) becomes `hwDraw`'s stripe colour `st` (trailers and semis; the editor's Stripe swatches); `"none"` draws no stripe (`trl`).
* **Editor** (`editor/kit-tools.js`, `editor/kit-view.js`): the Room tool (O: drag a rectangle → floor + walls in the chosen style with a doorway; Interior wall mode), Opening (D: click a wall → doorway, window, storefront glass, automatic doors, roll-up / garage door, bars or a gap; the wall is split, `edGapSplit`), Area (A), Path (T: click points, Enter / double-click to finish; Backspace, Esc), Feature (K) and Prefab (G) tools. A selected path or road graph shows point handles (drag; Alt+click deletes; double-click on the line adds). Areas and paths are cached as small pictures per piece in the editor (`edKitImg`). Every action is one undo step (`edApply` can also carry a tile patch). Seven left tabs: Terrain, Build, Paths, Props, Decals, Prefabs, Markers.
* **Prefabs** (`editor/prefabs.js`, starter set `editor/prefab-starter.js`): `edPfFrom` turns a selection (and optionally the tiles under it) into a prefab; `edPrefabPlace` places one as new, separate things with one undo step. Your prefabs live in IndexedDB (`kv` record `prefabs`).
* **Samples** (`editor/samples.js`): `CMSAMPLES` are map files built into the game, listed under "Sample maps" in the Workshop (**ADD TO MY MAPS** / **EDIT A COPY**). Built-in maps made from files are listed under "Built-in maps" (see below).
* **Checker:** `tools/check-map.js` loads the built game in Node and runs `cmRead` + `cmLint` plus authoring checks on map files.

### Built-in maps from map files (step 4)

Built-in maps are being converted one by one from map code (`mapXxx()`) to map files. A converted map keeps its number in `MP`, so its campaign slot, survivor boss, progress bitmasks, best waves, leaderboard board and checkpoints don't change.

* **`world/builtin-maps.js`:** `BIMF[mapId]` is the embedded map file (`suburb.json` for map 0, `warehouse.json` for map 1, `graveyard.json` for map 2, `school.json` for map 3, `highway.json` for map 8, `mansion.json` for map 9, `market.json` for map 14, `mainst.json` for map 15, `foundry.json` for map 16, `forest.json` for map 10, `downtown.json` for map 13, `stadium.json` for map 17, a new map); `bimDoc(m)` reads it with `cmRead` each time it is needed, so only the map being played stays in memory (a broken file throws: it is a build bug); `MP[m].f` is `()=>bimBuild(m)`, which calls `cmBuild`. So `build()` → `cmBuild` exactly as for a custom map, but `cmIs(m)` stays false and records use the built-in number. `HS.CM` (the map's id, here `builtin-suburb`) means "built from a map file": kit effects and time-of-day lighting check it. `cmBuild` also sets `HS.sp` from the spawn points, which the survivors' fallback position reads.
* **Boot order:** the first `build()` now runs at the end of `world/builtin-maps.js` (after the editor modules), because the Suburb needs the map loader, every kit registry and the kit props (`maps/props/kit-props.js`), which load long after `world/map-list-and-pathfinding.js`.
* **Editing:** the Workshop lists them under "Built-in maps" (`wsBuiltins`): **EDIT A COPY** / **ADD A COPY TO MY MAPS** (`wsBuiltin`) store your own copy with a new id; the built-in map only changes through `src/maps/*.json` in the repo.
* **Shared walk-behind pictures:** walk-behind entries with `sh: 1` (the forest trees' canopies, one canvas per size and shade from `subSpr` or the Enchanted Forest's `efSpr`, `kpWB` in `kit-props.js`) are not freed by `bgFree` when the next map is built.
* **Converted so far:** the Suburb (map 0), the Warehouse (map 1), the Graveyard (map 2, at night in a lightning storm: the old layout and its open space kept, with the glowing mausoleum pulsing and something moving behind its bars, an open-air crypt in the middle, the chapel's stained glass, bell tower and side door, dug-up graves with hands coming out, an interrupted funeral, the hearse, the EVERGREEN REST gate, the groundskeeper's shed, wisps and crows), the School (map 3), Deadway Highway (map 8, at dusk with more lights, effects and roadside detail, median light poles, sign gantries and an army roadblock), the Haunted Mansion (map 9, at night in a lightning storm, darker and redesigned: a secret room, a locked room, a grand ballroom wing, the family crypt, a hedge maze), Hometown Market (map 14, redesigned at the owner's request: truck route, docks side by side, a fuller store, new rooms; Penny's fight reads the `store` feature, its `gshelf` props and the corrals and cart rows outside it) and Main Street (map 15, redesigned at the owner's request: parking lots behind the stations, City Hall, the restaurants and urgent care, the park moved, houses all round the edge of town, a movie theater, a bank, a church, the railroad and depot, the festival; the Mayor's fight reads the `cityhall` feature and the `roadgraph`). The Enchanted Forest (map 10, Nov 4, 2026, at night: a misshapen oval trail as wide as the road loops round the map with short detours to the landmarks, the woods are solid `woods` shapes with the trees standing in them, the witch's cabin is a log cabin full of candles, iron lamps on the road, lanterns along the trail, a car crash, a tree down over one lane, a stream under a wooden bridge, fireflies, owls and wolves). Downtown Zombville (map 13, Nov 4, 2026, redone bigger at sunrise: two skyscrapers on superblocks, the front of a real-size stadium turned field hospital along the top, the front of Zombville General and its quarantine zone along the east side, military and police checkpoints at the edges, the elevated railway, crashes, blood and smashed windows). The Black Iron Foundry (map 16) was made as a map file from the start (the owner's new Wrong Turn map: a foggy foundry and fab shop at night). The houses' floor plans were generated (rooms in columns, furniture placed by a room-filling script that keeps doorways clear), so each is ordinary walls, floors and props in the file. `tests/suites/suburb.js`, `warehouse.js` and `school.js` check them against the old maps' collision (`tests/fixtures/*-walls.json`); the School keeps every old wall but on purpose has split offices, more desks and lights (dusk), so its test checks the old walls are all still there rather than an exact match.
* **Spawning:** `spBad(x,y)` (`game/waves-and-shop.js`) keeps random off-screen spawns out of every no-spawn zone of a map file (`HS.NS`, the zones with `skip` on; a zone at the map's edge also covers the strip just outside it); after 24 tries it falls back to a random allowed spot on the map's edge.
* **Doorways** (`cmDoors`, `cmDoorBlocks` in `world/map-schema.js`): openings are gaps of 20–140 px between solid walls in line, plus walk-through pieces (doorway, automatic doors, roll-up); a prop or vehicle within 24 px of one (by its collision, or its base when it isn't solid) is listed by `cmLint` (Problems tab, `tools/check-map.js`). Props with `dk: 1` (awnings, wall and exit lights, curtains) belong at doors and are left out.

### Custom map files

The full reference is **`docs/map-format.md`** (version 3, every piece, prefabs, the checker, a complete example). In short: a JSON file with `format: "zombdash-map"`, `version: 3`, size in 32px tiles (20×15 to 128×128), tile grids (`terrain`, `roads`, `overlay`: rows of legend letters), `layers`, `props`, `vehicles`, `walls`, `decals`, `effects`, `areas`, `paths`, `features`, `playerStart` and `zombieSpawns`. Positions are pixels. Unknown kinds load with a warning and are written back unchanged; a file with mistakes is refused with a list of what's wrong.

* **Upgrades:** version 1 files load as version 2 (every thing on the layer of its kind, an empty roads layer; `CMMIG[1]`), version 2 as version 3 (adds the Ground detail, Effects & lights and Special features layers; `CMMIG[2]`). Nothing else changes; saving writes version 3.
* A file without `layers` gets the 11 default layers.

## Modules (in load order)

### Core (`src/js/core/`)

| File | What's in it |
|---|---|
| `core/boot.js` | Canvas, screen rotation/resize, the save object S and sv() |
| `core/state.js` | Global game state: mode, players, zombies, bullets, wave counters, map state |
| `core/errors.js` | On-screen error reporting |
| `core/difficulty.js` | Difficulty levels and scaling |
| `core/main-loop.js` | Main loop and pointer/keyboard listeners |
| `core/start.js` | Starts the game |

### Audio (`src/js/audio/`)

| File | What's in it |
|---|---|
| `audio/sound.js` | Web Audio: music sequencer, every sound effect (SF), zombie voices, footstep surfaces |

### Data tables (`src/js/data/`)

| File | What's in it |
|---|---|
| `data/tables.js` | Core data: survivors (CH), weapons (WP), zombie and boss types (ZT) |

### Maps (`src/js/maps/`)

| File | What's in it |
|---|---|
| `maps/map-helpers.js` | Shared helpers of the built-in maps: walls with doorways (`hwall`, `vwall`), the pathfinding grid (`grid`), ground and checker floors, wall painting, trailers, parked cars, the round tree sprites (`subSpr`). The Suburb itself is `src/maps/suburb.json` |
| `maps/props/objects.js` | Prop library: object sprites (OB), fences, scatter, put() and paintDec() |
| `maps/props/houses.js` | Props of the built-in maps (school, office, store, farm and play pieces, beds, couches) and the wheel helper |
| `maps/props/school-objects.js` | School props: lockers, cracks, signs and more objects |
| `maps/old-west.js` | Old West map |
| `maps/props/furniture.js` | Furniture and garden props (sofas, kitchens, crops) |
| `maps/neighborhood.js` | Neighborhood map |
| `maps/military-camp-shared.js` | Shared pieces for Military Base and Campground |
| `maps/military-base.js` | Military Base map |
| `maps/campground.js` | Campground map |
| `maps/highway.js` | Top-down vehicles (`HWV` sizes, `hwDraw`, `hwCol` collision) shared by the map-file builder, the editor, other maps and the bosses (Deadway Highway itself is `src/maps/highway.json`) |
| `maps/urban.js` | Urban neighborhood map |
| `maps/city-park.js` | Zombville City Park map (its trees use the Enchanted Forest's canopy pictures, `efSpr`; `pkCR` smooths its trails, `pkCan` redraws its tree tops over people) |
| `maps/props/home-props.js` | House props for custom maps (kitchen, living room, bedroom, bathroom, garage), `obc()` for props that come in colours |
| `maps/props/forest-props.js` | Forest and farm props for custom maps: trees, long grass, ferns, reeds, crops, big rotting fallen trees |
| `maps/props/kit-graveyard.js` | The Graveyard's props: the glowing mausoleum, sarcophagi, the fire bowl, the funeral (canopy, casket, folding chairs, an umbrella), the gate (posts with lanterns, the arch with your text, iron gate leaves), small headstones, bare trees, a tipped wheelbarrow, a wooden arrow sign |
| `maps/props/kit-forest.js` | The Enchanted Forest's props: its teal and violet oaks and black pines (`eoak`, `eoakv`, `epine`, canopies from `efSpr`, shared with the City Park), glowing mushrooms, iron street lamps (one failing), lantern posts (lit, smashed, knocked over), the crossroads signpost, the stone chimney, the potion shelf, log-cabin corners, an oak fallen across a road |
| `maps/props/kit-downtown.js` | Downtown Zombville's props after the outbreak: police sawhorses, infection screening and field-hospital tents, cots, the watchtower, the stadium's gates and lettering, monument and quarantine and cardboard signs, the ER canopy, the missing-persons wall, the subway entrance, the elevated railway (pillars, track, train cars), the crashed helicopter and the same wreck on fire (`helixf`: `dtHeli` draws the scorched wreck, `dtHeliFire` is its `an`: firelight clipped to the body, glowing holes and cracks, flames out of the engine, cockpit, tail and along the hull, drawn with the shared `fxTk` / `fxBurn` / `fxLicks` from `world/kit-effects.js`), HELP on a roof, the flashing LED message trailer (`an`: drawn each frame), riot gear, suitcases |
| `maps/props/kit-stadium.js` | Zombville Stadium's props: goalposts, pylons, team benches, drinks tables, TV cameras, kicking nets; generators (`gen` puffs exhaust and blinks its panel each frame, `genx` has run dry), the diesel tank, mobile light towers (`ltower`, failing `ltowerf`, dead `ltowerx`, knocked over and still shining `ltowerd`), pop-up canopies (`canopy`, `canopyw`: overhead, fading while anyone is under them: `ovf` = anywhere on the footprint, `ova` = how far), gurneys, wheelchairs, crash carts, oxygen, biohazard bins, supply pallets and shelves, the command table, the patient board, privacy screens, water stations, portable toilets, crowd barriers, the video board (`vboard`: an emergency alert drawn each frame, `stBoardAn`) and the stadium's light banks |
| `maps/props/kit-foundry.js` | The Black Iron Foundry's props: the ladle of molten metal, forging and arc furnaces, the big forklift, welding tables and machines, steel stock, the bridge and gantry cranes (drawn over people, with a work light), high-bay lights |
| `maps/props/kit-props.js` | Building kit props: what the built-in maps drew in their own code (signs with your text, awnings, portraits, wrecks, containers, office / school / bath rows, rooftop units…) |

### World systems (`src/js/world/`)

| File | What's in it |
|---|---|
| `world/map-list-and-pathfinding.js` | The map list (MP), build() to load a map, zombie pathfinding flow field, wall push-out |
| `world/map-schema.js` | Custom map format: terrain (CMTER), overlays, wall styles, layers (CMLAY), cmRead / cmWrite with the v1 → v2 → v3 upgrades, collision and shapes (cmColl), draw order (cmDrawList), problem checks (cmLint) |
| `world/terrain-more.js` | More custom-map terrain: loop-pile carpet in seven colours, farm soil, road markings that join up |
| `world/terrain-kit.js` | Building kit terrain: the built-in maps' remaining ground textures, terrain groups, curbs where sidewalks meet roads |
| `world/kit-core.js` | Building kit core: registries for decals, areas, paths, effects and special features; shared geometry (curves, polygons, boxes along a line) |
| `world/kit-decals.js` | Decals: cracks, stains, skid marks, blood, leaves, painted words and arrows, shadows… |
| `world/kit-areas.js` | Areas: floors, rugs, porches, steps, docks, pools, parking, intersections, courts, roofs, the stadium, the skyline, fog and darkness; their collision |
| `world/kit-paths.js` | Paths: roads, highway lanes, trails, sidewalks, rails, streams, painted lines, fences and rails, ponds and patches; their collision; the road graph from roads |
| `world/kit-walls.js` | Wall styles: windows, storefront glass, doorways, automatic / roll-up / garage doors, bars, planks, metal, siding, stone, barricades, sound walls, hedges and fences |
| `world/kit-effects.js` | Effects: fountain spray, water, fire, the big fire (`blaze`: layered flames, licks, sparks, and black smoke drawn solid into its own picture so the puffs merge, then faded and laid over everyone), smoke, flickering and still lights, sirens, hazard blinkers, flares, glows, wisps, ducks; turning them (`fxTurn`); `cmFxData` / `cmFxAnim` / `cmFxTop` for the game |
| `world/kit-gore.js` | More blood (spray, smear, drops, big splatter, footprints, crawl marks), the blood trail path, dead zombies drawn from the zombie sprites, body parts |
| `world/kit-lighting.js` | Time-of-day lighting: the looks (`CMLT`), light sources (`cmLightSrc`), the light map (`cmLightPaint`), `cmLight` for the game |
| `world/kit-school.js` | The School's kit pieces: lockers, boards and cubbies along walls, counters (plain, sinks, towels), a kitchen line, the round plaza, a paver walkway, playground sand; the crest and lawn-bit decals; schoolyard grass |
| `world/kit-market.js` | Hometown Market's kit pieces: the market lawn terrain (its props are in `maps/props/kit-props.js`) |
| `world/kit-graveyard.js` | The Graveyard's kit pieces: the `doorshade` effect (a shape crossing behind a barred, glowing door), `hands` (hands clawing out of the ground), `crows` (they fly off with a caw when a player comes near and settle again later; their state is kept per effect in `GYST`), the `stainglass` wall style (its props are in `maps/props/kit-graveyard.js`) |
| `world/kit-forest.js` | The Enchanted Forest's kit pieces: the `woods` shape (dense woods, solid like a pond: people go round it, bullets pass) and the `logs` wall style (a log cabin's walls); effects `fireflies` (a blinking swarm that lights its spot faintly), `owl` (blinking eyes in the trees, hoots now and then: the `owl` sound) and `howl` (wolves far off: the `howl` sound) |
| `world/kit-downtown.js` | Downtown Zombville's kit pieces: the `arena` shape (a stadium's front, solid), `tape`, the `sunshadow` area (a long shadow in low sun), `sunbeam` and `spray` decals, effects `glint` (sun on tower glass), `pigeons` (scatter when you come near: the `flap` sound), `steam`, `litter` |
| `world/kit-stadium.js` | Zombville Stadium's kit pieces: the `bowl` area (the stands all round a field-level floor with round corners: rows of seats, aisles, entry-tunnel portals with exit lights, the padded wall and its ad boards, tunnels out at field level, a press box; solid; `stBowl` works out the plan once), the `gridiron` area (a football field), the `tent` area (a walk-in tent: canvas walls with doors that block walking but not bullets, a tarp floor; its roof is drawn over people (`arTentTop`) and fades while a player is inside or near, a little while a zombie is; its lights on, off or flickering), the `tarp` area, the `bulbs` path (string lights hung between poles, drawn over people, lighting the ground under them), decals `sleepbag`, `blanket`, `medlitter`, `chains`, `toy`. Areas and paths can give light (`lts(o, L)`, called by `cmLightSrc`) |
| `world/kit-foundry.js` | The Black Iron Foundry's kit pieces: the `molten` effect (bubbles that swell and pop with a bloop, a bright skin, embers) and the `weldarc` effect (bursts of blue-white light with sparks; its light uses the `weld` flicker, `fdWeld`) (its props are in `maps/props/kit-foundry.js`) |
| `world/kit-highway.js` | Deadway Highway's kit pieces: the highway verge terrain `grass_hwy` and the `headlights` effect (two beams and tail lights on a car; its props are in `maps/props/kit-props.js`) |
| `world/kit-mainst.js` | Main Street's kit pieces: power lines and festival bunting (paths whose lines the game draws over everyone; the background gets only their shadow), the Main Street lawn terrain (its props are in `maps/props/kit-props.js`) |
| `world/map-store.js` | Custom map storage on the device (IndexedDB) |
| `world/custom-maps.js` | Custom maps in the game: map keys, the Free Play list (CML), cmBuild(), painting in draw order, spawning from zones |
| `world/wall-index.js` | Fast wall lookup grid |
| `world/vehicles.js` | Vehicle drawing and walk-behind handling |

### Map Workshop (`src/js/editor/`)

| File | What's in it |
|---|---|
| `editor/assets.js` | The prop browser: names and categories for OB props and HWV vehicles, sprite and thumbnail cache |
| `editor/history.js` | The one undo/redo history |
| `editor/editor-view.js` | Drawing the editor: cached terrain chunks, props, walls, spawns, overlays, minimap, map thumbnails |
| `editor/editor.js` | The editor: layout, left panel, tools, mouse and keys, save, resize, playtest options |
| `editor/selection.js` | Multi-select, group move / turn / delete, copy / paste / duplicate, layer operations, solid and collision shapes |
| `editor/panels.js` | The right panel: Properties (one or several things), Layers, Problems |
| `editor/playtest.js` | Playtest with the real game, keeping nothing it earns |
| `editor/workshop.js` | The Map Workshop screen: list, new, open, rename, duplicate, delete, import / export, unsaved-changes recovery |
| `editor/workshop-campaign.js` | The campaign dialog: put a map in a free slot with a wave-20 boss, or play it instead of a campaign map (and restore) |
| `editor/kit-view.js` | Drawing kit pieces in the editor: cached area / path pictures, effect frames, fog overlays, special features, point handles, minimap marks |
| `editor/kit-tools.js` | The kit tools: Room, Opening, Area, Path (and road graph), Feature; their tabs, previews and property fields |
| `editor/lighting-panel.js` | The Map panel's Time of day choice and Amount slider (live, one undo step per drag), the editor preview switch |
| `editor/prefabs.js` | Prefabs: save a selection, place a prefab, the Prefabs tab, your prefabs on the device |
| `editor/prefab-starter.js` | The 33 starter prefabs, laid out after the built-in maps |
| `editor/samples.js` | Sample maps built into the Workshop (`CMSAMPLES`) |
| `world/builtin-maps.js` | Built-in maps made from map files (the Suburb, `src/maps/suburb.json`): `BIMF`, `bimBuild`, the Workshop's Built-in maps list (`wsBuiltins`), and the first map build at boot |

### Menus and screens (`src/js/ui/`)

| File | What's in it |
|---|---|
| `ui/core-ui.js` | UI helpers: show(), canvas painting for menus, skill tree data |
| `ui/nx-core.js` | Night Ops look for the new screens: the scaled 1280×720 stage (`nxWrap`, `--nxs`), icons, key hints, the shared top bar (`nxTop`: Back, where you are, Main Menu, settings), segmented choices, difficulty |
| `ui/hub.js` | The main menu: tab bar (Play, Loadout, Survivors, Progress, Workshop), the Play tab cards, and the frame that shows older screens under the tab bar (`HUBX`, `hubFrame`) |
| `ui/shop.js` | The single-player store between waves: Guns / Gear / Ammo / Health tabs, a grouped list, the picked item with stats against your gun, your loadout and START WAVE (`shopNX`, `SHX`) |
| `ui/run-screens.js` | Pause menu, the leave-the-run dialog (Main Menu and Campaign Map keep the run as a checkpoint; End Run finishes it), and the end-of-run screens with Main Menu / Campaign Map / Next buttons |
| `ui/lobby-screen.js` | The split-screen lobby on one screen (`lobbyNX`, called by `rL()`) |
| `ui/setup.js` | New game setup for Free Play on one screen (map strip, survivor grid, difficulty, start wave); Q/E, LB/RB and Esc for the new screens (`nxKey`, `nxPads`) |
| `ui/menus.js` | Name screen, main menu, options, pause |
| `ui/map-and-survivor-select.js` | play() / mapGo() / mapStep(), the survivor screen, map descriptions and thumbnails |
| `ui/armory.js` | Armory and challenge screens, gun progress in codes |

### Progression (`src/js/progress/`)

| File | What's in it |
|---|---|
| `progress/skills.js` | Skills and XP |
| `progress/weapon-levels.js` | Weapon levels and camos |
| `progress/challenges.js` | Daily and weekly challenges |
| `progress/mastery.js` | Survivor mastery, perks, titles, badges |
| `progress/survivor-unlocks.js` | Survivor unlocks per map |

### Gameplay (`src/js/game/`)

| File | What's in it |
|---|---|
| `game/waves-and-shop.js` | Run start, waves, the shop, game over, zombie spawning (spawnZ, mk) |
| `game/pickups.js` | Items on the ground, pickups, floating text |
| `game/combat.js` | Damage, explosions, acid, line of sight, targeting |
| `game/player.js` | Player input (keyboard, mouse, touch, controller) and player update |
| `game/update.js` | The main per-frame game update (zombies, bullets, waves) |
| `game/drop-table.js` | Drop chances per zombie / boss (DROPT, DROPG) |

### Drawing (`src/js/render/`)

| File | What's in it |
|---|---|
| `render/sprites.js` | Zombie and survivor sprite atlases + drawing, wave boss drawing |
| `render/world-and-hud.js` | Drawing the world and the HUD |
| `render/survivor-colours.js` | Survivor colour variants |
| `render/camos.js` | Camo pattern rendering; `gunOnly` / `paintGuns`: gun pictures without the survivor's arm (`canvas[data-gn]`, used by the store) |

### Split screen (`src/js/multiplayer/`)

| File | What's in it |
|---|---|
| `multiplayer/helpers.js` | Split screen: player setup, respawn, camera |
| `multiplayer/lobby.js` | Split-screen lobby |
| `multiplayer/shop-and-game-over.js` | Split-screen shop and game over |
| `multiplayer/split-screen-draw.js` | Split-screen viewports, minimap, HUD |
| `multiplayer/campaign-map-pick.js` | Split-screen campaign map picking |
| `campaign/custom-campaign.js` | Custom maps in the campaign: the free slots, their bosses, replacing a built-in map, custom-map progress (A.cmc) |

### Input (`src/js/input/`)

| File | What's in it |
|---|---|
| `input/controllers.js` | Gamepads and controller menu navigation |
| `input/aim-reticle.js` | Mouse / right-stick aiming reticle |

### Accounts (`src/js/accounts/`)

| File | What's in it |
|---|---|
| `accounts/profiles-and-codes.js` | Profiles and account transfer codes |

### Test mode tools (`src/js/dev/`)

| File | What's in it |
|---|---|
| `dev/test-code.js` | Test code entry, unlock-everything backup/restore |
| `dev/spawn-diagnostics.js` | Spawn diagnostics panel (test mode, PC) |
| `dev/test-switches.js` | Test mode on/off switches and infinite health |
| `dev/balance-editor.js` | GAME BALANCE editor and settings codes |

### Campaign (`src/js/campaign/`)

| File | What's in it |
|---|---|
| `campaign/modes.js` | Campaign / free play mode, map order, campaign end screens |
| `campaign/lives.js` | Campaign lives |
| `campaign/wave-replay.js` | A restarted wave replays the same zombies |
| `campaign/life-lost.js` | "You were eaten" screen |
| `campaign/sections.js` | Campaign sections (SEC) and progress |
| `campaign/map-screens.js` | Campaign map navigation (cMap, cGo, cPick, slots) and the painted world art (`cWorldArt`) |
| `campaign/world-map.js` | The campaign on one world map: whole-world view and a camera that zooms into a section with its neighbours still around it; pins, labels, the side panel |

### Bosses (`src/js/bosses/`)

| File | What's in it |
|---|---|
| `bosses/survivors.js` | Survivor bosses: stats (SVS), shared AI, the first survivors, drawing |
| `bosses/officer-ray.js` | Officer Ray boss |
| `bosses/girl-horseman-mechanic.js` | Abigail, the Headless Horseman, the Mechanic |
| `bosses/ice-cream-and-fire-chief.js` | Ice Cream Man and Fire Chief (vehicle bosses) |
| `bosses/penny-and-mayor.js` | Penny and the Mayor |
| `bosses/quarterback.js` | Buck the quarterback (Zombville Stadium's survivor, 18): the charge with a ghost football team in lanes beside him (`QBG`, `QBF`; their lanes drawn on the ground while they crouch, `qbDrawS`; each runner tackles for 2, `qbTackle`), the minigun that turns toward the player slowly (`qbMz`), the two-minute warning at half health, the ghostly copy of his frames (`qbGhostImg`), sounds |
| `bosses/ken.js` | Ken the welder (the Black Iron Foundry's survivor, 17): his MIG gun's lightning (survivor-boss bullets `ep` with `lb`, drawn as one bolt from the torch tip to the head until they hit; the whole bolt hits anyone it crosses, `knOn`), the black burn marks where they hit (`KSC`), three bolts at a time from half health, their light on dark maps (`knLights`), sounds |

### Tutorial (`src/js/tutorial/`)

| File | What's in it |
|---|---|
| `tutorial/tutorial.js` | Tutorial |

### Weapons (`src/js/weapons/`)

| File | What's in it |
|---|---|
| `weapons/ammo-and-inventory.js` | Inventory, ammo types (AMI), magazines (MAG), reloads, ammo HUD, reload sounds |
| `weapons/chickens.js` | The Crossbow's bolts and the Chicken Gun's rubber chickens: hunting, eating, ballooning, popping, blood splatters, their sounds |
| `weapons/bows-and-lightning.js` | The Blastbow's bolts that stick, blink faster and faster and blow up; Death Row's chain lightning; the Firebow's burning zombies; their drawing and sounds |
| `weapons/life-saver.js` | The Life Saver's hearts: flying through zombies, bouncing off walls, healing a friend or the shooter, reviving a friend who is down; drawing and sounds |
| `weapons/bubble-cannon.js` | The Bubble Cannon's bubbles: the burst, floating and drifting, bouncing off walls, popping in a water splash that hurts nearby zombies, wet patches; drawing and sounds |
| `weapons/fire-hose.js` | The Fire Hose: the cone of flame (damage while it touches, walls block it), the afterburn (using the Firebow's burning), flame puffs, the pilot light, the light it gives on dark maps (`fhLights`); sounds |
| `extras/extras.js` | Extras: store items that aren't guns, in their own slots (2 a player, apart from the 4 weapon slots): `EXI`, buying and selling, the store buttons and EXTRAS slots (single-player and split-screen stores), older saves |
| `extras/headlamp.js` | The Headlamp: on/off (F, controller B, the LIGHT button, the store), the strap and lamp drawn on the survivor's head, its beam as a light on dark maps (`hlLights`) and a faint beam cut by walls in daylight (`hlDraw`); sounds |

**Adding a gun.** A gun is its index in `WP`; give it an entry at the same index in `AMT`, `MAG`, `RLT`, `RLS`, `FSN` (`weapons/ammo-and-inventory.js`) and `MZ`, `FS` (`render/sprites.js`), and a frame in every survivor's `PS[ci].gun` (it is also the store and armory picture). Keep the arm pixels exactly as in the other gun frames, or `armMask` (camos) changes. Levels, camos, the store, the inventory and the GAME BALANCE guns tab pick it up by themselves. Gun progress codes accept 11 guns or more (`gDec`), and Outbreak stays at 11 Gold guns (`OBK`).

### Phones and saves (`src/js/system/`)

| File | What's in it |
|---|---|
| `system/phones-checkpoints-crashlog.js` | Low-memory mode, checkpoints, crash log |

### Online (`src/js/online/`)

| File | What's in it |
|---|---|
| `online/supabase.js` | Online accounts, cloud saves, leaderboards |

### Zombies (`src/js/zombies/`)

| File | What's in it |
|---|---|
| `zombies/spawn-system.js` | Zombie classes (ZC), caps and schedule (ZCFG), campaign sections, spawn manager |
| `zombies/special-behaviors.js` | Exploder, Healer and Rotwood behavior and drawing, split-screen kill cash |
| `zombies/spread.js` | Zombies fan out in open ground and push apart instead of chasing in single file (ZSPR, zSpreadA, zSep) |
| `zombies/wave-size.js` | Wave size formula and per-map % |

### Intro (`src/js/intro/`)

| File | What's in it |
|---|---|
| `intro/cutscene.js` | Opening cutscene |
