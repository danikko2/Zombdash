# Zombdash map editor: plan and handoff (agreed Oct 20, 2026)

The full wish list is the "Map Workshop" prompt the owner attaches. This file records how it fits the game and what each step covers (steps 1 and 2 are done). Read `docs/ARCHITECTURE.md` too.

## Working on this repo
- **Where the code lives:** the source is in `src/`, split into 96 modules whose load order is in `src/js/modules.txt`.
  - `tools/build.js` builds `index.html`, which GitHub Pages serves at https://danikko2.github.io/Zombdash/.
  - A GitHub Action rebuilds `index.html` whenever `src/` changes.
- **Don't edit `index.html` by hand.** Before starting, run `node tools/build.js --check`. If it fails, someone edited `index.html` directly, and that change has to be moved into `src/` first.
- **Publishing each change:**
  1. Run `node tools/build.js`.
  2. Run `node tests/run.js` (22 suites, about 4½ minutes). Two exceptions are expected:
     - `tutorial.js` camera zoom is a known failure.
     - The `campaign.js` Rusty check is flaky and retried automatically.
     - The `balance-editor-and-test-switches.js` ground-limit check fails about 1 run in 20 on the original game too (a kill can add two drops when one slot is left), so it is retried automatically as well.
  3. Commit and push to `main`.
  4. Republish the Claude artifact https://claude.ai/artifact/TaVtECV5xr3R3ae4mR8yWC with the built `index.html`. Read the artifact first.
- The owner asked not to get usage or cost updates.

## How the game works today
- **Maps are code, not data.** Each map is a function, `mapXxx()`, listed in `MP` in `src/js/world/map-list-and-pathfinding.js`. When it runs, it:
  - sets the world size `WW`/`WH`;
  - paints the ground and props into one big background canvas `BG`;
  - pushes collision walls `[x,y,w,h]` into `WL`;
  - sets the house/spawn info object `HS` (player start, optional spawn points `HS.sp`, no-spawn rectangle `HS.nx0`…).
- **Loading and movement:**
  - `build()` loads a map.
  - Zombies follow a flow field built from the walls (`bfs`/`dirTo`).
  - `push()` keeps everything out of walls.
  - `wlBuild`/`wlAt` in `world/wall-index.js` are the spatial index for walls.
- **Props:**
  - There are 195 drawn props in `OB` (`src/js/maps/props/objects.js` and the files after it). They are placed with `put(DEC,'kind',x,y)` and painted with `paintDec`.
  - There are about 15 vehicle kinds (`HWV`), drawn via `vDraw` (`world/vehicles.js`, `maps/highway.js`).
- **Low-memory mode:** on phones it halves the background canvas (`system/phones-checkpoints-crashlog.js`).
- **Campaign:**
  - `SEC` (`campaign/sections.js`) has 5 sections. `-1` marks the 7 free "Coming Soon" slots.
  - Each campaign map has a survivor boss (`MUN`, `SVS` in `bosses/survivors.js`) and a landmark on the painted world map (`CLM` in `campaign/map-screens.js`).
  - Beating a map in the campaign opens it in Free Play.
- **Saves:** `localStorage.deadyard` (`S`) plus Supabase online saves of the main account. Custom maps must stay out of both, in IndexedDB.

## Agreed decisions
- **Existing maps:** they can't become fully editable without rebuilding each as data. "Edit an existing map" (a later step) means loading the built map as base picture + walls + spawns, editing on top, and saving as a copy.
- **Terrain:** a new tile terrain set is needed: grass, dirt, asphalt, concrete, sidewalk, sand, gravel, mud, water (blocks walking), wood floor, tile floor, plus blood and burn overlays. The registry must be easy to extend.
- **Asset browser:** it uses only the real `OB` props and `HWV` vehicles, no fake entries.
- **No placeholder markers:** loot containers, traps, objectives, extraction/trigger zones, opening doors, breakable barricades, roof hiding and turrets have no gameplay yet. They are not added until they're built as real features.
- **Campaign:** a custom map can fill a "Coming Soon" slot using an existing survivor boss (step 3).
- **Where custom maps live:** custom maps live on the device (IndexedDB), with JSON export/import. To ship one to everyone, it gets added to `src/` (e.g. `src/maps/*.json`, loaded by the same loader). Claude should be able to author maps as JSON too.
- **Platform:** the editor is for desktop mouse and keyboard. Custom maps are playable everywhere, including split screen.

## Step plan
1. **Step 1:**
   - A **Create** button under Play on the main menu.
   - The **Map Workshop**: new / open / rename / duplicate / delete / search, with thumbnails.
   - **New map:** name, description, width/height, default terrain.
   - **Editor canvas:** pan, zoom toward the cursor, grid and snapping, minimap.
   - **Terrain:** brush with size, eraser, fill, rectangle, eyedropper.
   - **Props and vehicles:** place, select, move, rotate and delete them from a searchable browser with thumbnails.
   - **Walls:** draw and erase wall rectangles with a collision overlay. Solid props add their wall automatically.
   - **Markers:** the player start, zombie spawn points and zones.
   - **History:** one shared undo/redo history.
   - **Saving:** IndexedDB save, JSON export/import, versioned schema v1 with validation.
   - **Playtest:** uses the real engine and returns to the editor with the session intact.
   - **Free Play:** custom maps appear in the Free Play map select.
   - **Code location:** new modules under `src/js/editor/` and the map loader under `src/js/world/`, all listed in `modules.txt`.
   - **Tests:** a new suite in `tests/suites/` for the editor and the loader. All existing suites must stay green.
   - **Status: done (Oct 21, 2026).** How it works is in `docs/ARCHITECTURE.md` ("Custom maps"); `tests/suites/map-editor.js` covers it (104 checks).
   - **Decisions made while building it:**
     - Tiles are 32px; maps are 20×15 to 128×128 tiles. The file format is JSON with terrain as rows of letters, so maps are easy to write by hand.
     - Custom maps don't get a slot in `MP`: in a running game they have map keys from 1000 (playtest: 900), and `S.mp` never holds one.
     - Free Play runs on custom maps earn XP, Zombie Pts and challenge progress like any Free Play run. (Since step 2 they also get leaderboards, the crash checkpoint and best waves: see step 2.)
     - Playtest is a sandbox: survivor, start wave and difficulty are picked in a small dialog, and nothing the run earns is kept.
     - Wall styles: wall, brick, concrete, wood (stop bullets), chain-link fence (see-through) and an invisible blocker. Water blocks walking but not bullets.
     - Props turn in 15° steps; a turned solid prop collides with the box around its turned base.
     - Spawn points and zones that are on replace the off-screen spawning, preferring ones out of the player's sight (as `HS.sp` does); with none, zombies spawn as on the built-in maps.
     - Unsaved changes are kept as a draft in IndexedDB and offered back in the Workshop.
     - On touch-only devices the Workshop still plays, imports, exports and deletes maps; editing needs a mouse and keyboard.
   - **Not in step 1:** shipping maps to everyone from `src/maps/*.json` (the loader is ready for it; `tools/build.js` needs to embed the files). A 128×128 map with ~2,000 props takes about 2 seconds to load into a run.
2. **Step 2:**
   - **Multi-select:** Shift+click adds or removes, dragging a box selects what is fully inside it; move, turn, delete and change the layer of the whole selection.
   - **Copy / paste / duplicate:** Ctrl+C, Ctrl+X, Ctrl+V (at the mouse), Ctrl+D (one grid step away) for props, vehicles, walls, spawn points and zones, and mixed groups.
   - **Layers:** the defaults (Terrain, Roads & paths, Buildings, Walls & collision, Environmental props, Interior props, Vehicles, Zombie spawns); add, rename, delete (with a warning and a choice to move or delete what's on it), reorder, hide, lock, move things between layers. Layer order is the draw order in the editor and in the game; hiding is editor-only.
   - **Properties panel:** position, turn, layer, draw order, solid, collision shape, lock, hide; with several selected, only the values they share show (others say "mixed").
   - **Collision shapes:** Auto (the picture's), box or circle per prop or vehicle, edited with handles on the map, shown with a coloured overlay, and used for real collision and zombie paths.
   - **Problems panel:** no player start, start or spawn inside a wall, spawns zombies can't walk from, things outside the map, missing props / vehicles / terrain; clicking one goes to it.
   - **Polish:** tooltips with shortcuts, a saved / unsaved indicator, a warning before leaving with unsaved changes, Esc cancels the current drag or tool, and keys never move a player while the editor is open.
   - **Custom maps in the records (owner's request):** Free Play runs on custom maps now get leaderboards, the crash checkpoint and per-map best waves. Playtests still get none of them.
   - **Status: done (Oct 21, 2026).** `tests/suites/map-editor.js` covers steps 1 and 2 (236 checks). The format is now version 2; version 1 files and saved maps are upgraded on load, keeping everything.
   - **Decisions made while building it:**
     - **Circles are approximated:** the game's collision is boxes only, so a circle shape becomes a stack of thin upright boxes inside the circle (about 8px tall each). Box shapes stay upright too, even on a turned prop; turning the prop turns the shape's position around it, and a quarter turn swaps its width and height.
     - Roads & paths is a second tile layer over Terrain; blood and burn overlays always go with Terrain. Terrain and Roads stay the two bottom layers and can't be deleted.
     - Locked things can still be clicked (so they can be unlocked from the properties panel) but not moved, turned, deleted or box-selected. A locked layer can't be painted, and nothing is pasted into it.
     - A group turned with the "↺ group 90°" / "↻ group 90°" buttons turns a quarter at a time around its middle; walls and zones swap width and height.
     - **Leaderboards for custom maps need a one-time server change:** the owner must run the current `docs/supabase-setup.sql` in Supabase (it adds the `cmap` column; safe to run again). Until then custom-map scores are refused by the server and nothing else changes. Custom maps share board `map = 63` and are told apart by the map's id, so everyone who imported the same file shares a board; "All maps" leaves them out.
     - A crash checkpoint on a custom map remembers the map's id and is only offered while that map is on the device.

3. **Step 3:** campaign slots.
4. **Step 4:** editing existing maps as a base.
5. **Step 5:** gameplay pieces the owner picks (loot crates, doors, traps…).
