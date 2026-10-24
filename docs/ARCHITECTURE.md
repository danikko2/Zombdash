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
| `src/js/**` | The game, split into 117 modules (listed below). The Map Workshop is in `src/js/editor/`, the custom map format, loader and building kit in `src/js/world/`. |
| `src/maps/` | Map files that ship with the game, embedded by the build with `{{json:maps/<file>}}`: `suburb.json` is the Suburb (map 0, a built-in map made from a file, see "Built-in maps from map files"); `samples/town-block.zombdash-map.json` is the Workshop's sample map. |
| `src/assets/sprites/` | `zombies.png` (zombie atlas) and `survivors.png` (player atlas). Frame positions are in `ZS` / `PS` in `render/sprites.js`. |
| `src/assets/thumbs/map-NN.jpg` | Map preview pictures; `NN` is the map's number in `MP`. |
| `src/assets/sounds/` | Recorded reload sounds (everything else is synthesized in `audio/sound.js`). |
| `tools/build.js` | The build (Node, no packages needed). |
| `tools/check-map.js` | The map checker: `node tools/check-map.js map.json` reports errors, missing assets and other problems in map files (see `docs/map-format.md`). |
| `tests/run.js`, `tests/suites/` | Automated tests that load the real game in Node with a fake browser. `tests/fixtures/suburb-walls.json` is the old Suburb's collision, start, spawns and no-spawn box, which `tests/suites/suburb.js` checks the converted map against. |
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
| What each zombie / boss drops and how often | `DROPT`, `DROPG` in `game/drop-table.js` |
| Zombie tiers, special/ranged caps, new-type schedule, campaign sections | `ZC`, `ZCFG` in `zombies/spawn-system.js` |
| Exploder, Healer, Rotwood tuning | `ZX`, `ZH`, `ZR` in `zombies/spawn-system.js` |
| How many zombies per wave (formula and per-map %) | `ZWN`, `ZMAPM` in `zombies/wave-size.js` |
| Survivor boss health and speed | `SVS` in `bosses/survivors.js` |
| Easy / Normal / Hard multipliers | `core/difficulty.js` |
| Map list and names | `MP` in `world/map-list-and-pathfinding.js`; descriptions `MPD` in `ui/map-and-survivor-select.js` |
| The Suburb's layout (houses, furniture, forests, roads, spawns) | `src/maps/suburb.json` (a map file: edit a copy in the Workshop, export it, and replace the file; check it with `tools/check-map.js` and `tests/suites/suburb.js`) |
| Campaign sections and map order | `SEC` in `campaign/sections.js`, `CORD` in `campaign/modes.js` |
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

### Custom maps in the campaign (step 3)

* **Slots.** The `-1` entries in `SEC` are the free "Coming Soon" slots: 9 of them (Wrong Turn 5, Zombville 4–5, Countryside 4–5, Island 2–5; `ccFree()`). `SEC` itself never changes. A custom map goes into a slot from the Workshop (**campaign** on its row) or from the slot on the section map (**ADD A MAP**); the dialog is `editor/workshop-campaign.js`.
* **Device data, not save data.** Which map is in which slot, its boss, and which built-in maps are replaced live in IndexedDB next to the maps (`kv` record `campaign`, in memory as `CCS`), so they never reach `S` or the online save. A map is in one place at a time (one slot, or one replacement).
* **In a run** a slot map keeps its runtime key (≥1000) in `mapId`. `secOf()` returns its slot's section, so it gets that section's `ZCFG.camp` line-up and caps; campaign lives and difficulty work as on any campaign map, and `cmpI()` scales it like the toughest map of its section (`ccScaleIdx`). At wave 20 `svSpawn()` brings the boss picked for the slot (`cBossNow()`).
* **Bosses.** Only bosses whose fight works on any map are offered (`CCBOSS`). Not offered (`CCNOT`): the Ice Cream Man and the Fire Chief (they drive the map's road graph `HS.RG`, and the Chief blasts into its buildings `HS.HO`), Penny (the Hometown Market shelves `HS.SHF` / store `HS.ST` and cart corrals `HS.CRL`), and the Mayor (City Hall's roof `HS.CH` and the cruiser on the road graph).
* **Progress.** Custom maps are recorded per account in `A.cmc = {<map id>: bits}` (bit d = beaten on difficulty d; harder counts for easier), never in the 16-bit masks `A.bm`. `bBt` / `bmSet` / `mOpen` send custom keys there (`bmSet` also ignores anything outside the built-in map numbers). Slots are optional: `secDone` only counts built-in maps, so they never block the next section. Removing a map from its slot keeps its record. Beating the boss marks the map beaten and opens it in Free Play; the survivor gives up but is not recruited (that stays on their own map). A custom map that is in a slot is locked in Free Play until it is beaten there (`ccFreeOK`); maps that aren't in the campaign are always open.
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
* **In the game.** `cmBuild` ends with `cmFeatHS(d)` and `HS.CX = cmFxData(d)`. `cmFeatHS` sets the same `HS` fields the built-in maps set: smoke effects → `SM`; `nospawn` → `HS.nx0…`, `HS.NS`, `NOGO` (and `cmSpawnAt` skips spawns inside them); `house` features and indoor floors → `HS.HO`; `roadgraph` → `HS.RG = {N, A}`; `cityhall` → `HS.CH`; `store` → `HS.ST`, its `gshelf` props → `HS.SHF`, `corral`/`cartrow` props → `HS.CRL`; `stree` props → `HS.TRK`. `HS.CX = {A, T, E}` holds the animated effects and areas (`cmFxAnim`, drawn under people next to the built-in maps' animations), the ones drawn over people (`cmFxTop`: fog, wisps) and portrait eyes; both are called from `drawW` (`render/world-and-hud.js`) and only draw what is on screen.
* **Time of day** (`world/kit-lighting.js`): a map's `d.lt = {t, a}` (file `lighting`). `cmBuild` keeps `HS.LT = cmLightData(d)` (the time, the amount and the light sources `cmLightSrc` finds: light, flicker, fire, flare, glow, wisp, siren and hazard effects, lit-window decals, lamp / lot light / candle / lantern / fireplace / traffic light props). `drawW` calls `cmLight()` after the world (and before the aim marker and HUD) when `cmLtOn()`: it fills a small light-map canvas (half the screen's resolution, a quarter in low-memory mode) with the time's colour mixed with white by the amount, adds a radial light per source on screen (plus every living player, burning ground and fireballs; sirens take turns, hazards blink, flames flicker), then multiplies the world by it and adds a faint coloured glow (`cmLightPaint`). Floating texts are then drawn on top (`ftTexts` in `game/pickups.js`). The editor previews it with the same function (`edDraw`, still picture, the player's light at the start) and map thumbnails are darkened too. Built-in maps never have it.
* **Turned effects:** an effect's `r` (file `rot`) turns everything it draws (`fxTurn` in `cmFxBake`, `cmFxEd`, `cmFxAnim`, `cmFxTop`); light sources of sirens and hazards turn with it.
* **Decal options:** decals can have `opts` like effects (the dead zombie's kind, pool and mirror); `cmDecDraw` passes them, defaults filled in, as `f(g, v, K, t, O)`.
* **Walk-behind.** `vehWrap` (`world/vehicles.js`) puts tall props on the walk-behind list: the old list plus every prop with `wb: 1` (kit and forest props), forwarding colour and text.
* **Editor** (`editor/kit-tools.js`, `editor/kit-view.js`): the Room tool (O: drag a rectangle → floor + walls in the chosen style with a doorway; Interior wall mode), Opening (D: click a wall → doorway, window, storefront glass, automatic doors, roll-up / garage door, bars or a gap; the wall is split, `edGapSplit`), Area (A), Path (T: click points, Enter / double-click to finish; Backspace, Esc), Feature (K) and Prefab (G) tools. A selected path or road graph shows point handles (drag; Alt+click deletes; double-click on the line adds). Areas and paths are cached as small pictures per piece in the editor (`edKitImg`). Every action is one undo step (`edApply` can also carry a tile patch). Seven left tabs: Terrain, Build, Paths, Props, Decals, Prefabs, Markers.
* **Prefabs** (`editor/prefabs.js`, starter set `editor/prefab-starter.js`): `edPfFrom` turns a selection (and optionally the tiles under it) into a prefab; `edPrefabPlace` places one as new, separate things with one undo step. Your prefabs live in IndexedDB (`kv` record `prefabs`).
* **Samples** (`editor/samples.js`): `CMSAMPLES` are map files built into the game, listed under "Sample maps" in the Workshop (**ADD TO MY MAPS** / **EDIT A COPY**). Built-in maps made from files are listed under "Built-in maps" (see below).
* **Checker:** `tools/check-map.js` loads the built game in Node and runs `cmRead` + `cmLint` plus authoring checks on map files.

### Built-in maps from map files (step 4)

Built-in maps are being converted one by one from map code (`mapXxx()`) to map files. A converted map keeps its number in `MP`, so its campaign slot, survivor boss, progress bitmasks, best waves, leaderboard board and checkpoints don't change.

* **`world/builtin-maps.js`:** `BIMF[mapId]` is the embedded map file (`{{json:maps/suburb.json}}` for map 0); `bimDoc(m)` reads it once with `cmRead` (a broken file throws: it is a build bug); `MP[m].f` is `()=>bimBuild(m)`, which calls `cmBuild`. So `build()` → `cmBuild` exactly as for a custom map, but `cmIs(m)` stays false and records use the built-in number. `HS.CM` (the map's id, here `builtin-suburb`) means "built from a map file": kit effects and time-of-day lighting check it. `cmBuild` also sets `HS.sp` from the spawn points, which the survivors' fallback position reads.
* **Boot order:** the first `build()` now runs at the end of `world/builtin-maps.js` (after the editor modules), because the Suburb needs the map loader, every kit registry and the kit props (`maps/props/kit-props.js`), which load long after `world/map-list-and-pathfinding.js`.
* **Editing:** the Workshop lists them under "Built-in maps" (`wsBuiltins`): **EDIT A COPY** / **ADD A COPY TO MY MAPS** (`wsBuiltin`) store your own copy with a new id; the built-in map only changes through `src/maps/*.json` in the repo.
* **Shared walk-behind pictures:** walk-behind entries with `sh: 1` (the forest trees' canopies, one canvas per size and shade from `subSpr`, `kpWB` in `kit-props.js`) are not freed by `bgFree` when the next map is built.
* **Converted so far:** the Suburb (map 0). `tests/suites/suburb.js` checks it against the old map's collision (`tests/fixtures/suburb-walls.json`).

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
| `maps/warehouse.js` | Warehouse map |
| `maps/graveyard.js` | Graveyard map |
| `maps/props/objects.js` | Prop library: object sprites (OB), fences, scatter, put() and paintDec() |
| `maps/props/houses.js` | Props of the built-in maps (school, office, store, farm and play pieces, beds, couches) and the wheel helper |
| `maps/props/school-objects.js` | School props: lockers, cracks, signs and more objects |
| `maps/school.js` | School map |
| `maps/old-west.js` | Old West map |
| `maps/props/furniture.js` | Furniture and garden props (sofas, kitchens, crops) |
| `maps/neighborhood.js` | Neighborhood map |
| `maps/military-camp-shared.js` | Shared pieces for Military Base and Campground |
| `maps/military-base.js` | Military Base map |
| `maps/campground.js` | Campground map |
| `maps/school-details.js` | School extra detail and walk-behind objects |
| `maps/highway.js` | Deadway Highway map |
| `maps/haunted-mansion.js` | Haunted Mansion map |
| `maps/enchanted-forest.js` | Enchanted Forest map |
| `maps/urban.js` | Urban neighborhood map |
| `maps/city-park.js` | Zombville City Park map |
| `maps/downtown.js` | Downtown Zombville map |
| `maps/graveyard-details.js` | Graveyard extras |
| `maps/hometown-market.js` | Hometown Market map |
| `maps/main-street.js` | Hometown Main Street map |
| `maps/props/home-props.js` | House props for custom maps (kitchen, living room, bedroom, bathroom, garage), `obc()` for props that come in colours |
| `maps/props/forest-props.js` | Forest and farm props for custom maps: trees, long grass, ferns, reeds, crops, big rotting fallen trees |
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
| `world/kit-effects.js` | Effects: fountain spray, water, fire, smoke, flickering and still lights, sirens, hazard blinkers, flares, glows, wisps, ducks; turning them (`fxTurn`); `cmFxData` / `cmFxAnim` / `cmFxTop` for the game |
| `world/kit-gore.js` | More blood (spray, smear, drops, big splatter, footprints, crawl marks), the blood trail path, dead zombies drawn from the zombie sprites, body parts |
| `world/kit-lighting.js` | Time-of-day lighting: the looks (`CMLT`), light sources (`cmLightSrc`), the light map (`cmLightPaint`), `cmLight` for the game |
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
| `ui/menus.js` | Name screen, main menu, options, pause |
| `ui/map-and-survivor-select.js` | Map select, survivor select, map descriptions and thumbnails |
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
| `render/camos.js` | Camo pattern rendering |

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
| `campaign/map-screens.js` | Campaign world/section map screens and their painted art |

### Bosses (`src/js/bosses/`)

| File | What's in it |
|---|---|
| `bosses/survivors.js` | Survivor bosses: stats (SVS), shared AI, the first survivors, drawing |
| `bosses/officer-ray.js` | Officer Ray boss |
| `bosses/girl-horseman-mechanic.js` | Abigail, the Headless Horseman, the Mechanic |
| `bosses/ice-cream-and-fire-chief.js` | Ice Cream Man and Fire Chief (vehicle bosses) |
| `bosses/penny-and-mayor.js` | Penny and the Mayor |

### Tutorial (`src/js/tutorial/`)

| File | What's in it |
|---|---|
| `tutorial/tutorial.js` | Tutorial |

### Weapons (`src/js/weapons/`)

| File | What's in it |
|---|---|
| `weapons/ammo-and-inventory.js` | Inventory, ammo types (AMI), magazines (MAG), reloads, ammo HUD, reload sounds |

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
| `zombies/wave-size.js` | Wave size formula and per-map % |

### Intro (`src/js/intro/`)

| File | What's in it |
|---|---|
| `intro/cutscene.js` | Opening cutscene |
