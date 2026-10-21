# Zombdash map editor: plan and handoff (agreed Oct 20, 2026)

The full wish list is the "Map Workshop" prompt the owner attaches. This file records how it fits the game and what **step 1** covers. Read `docs/ARCHITECTURE.md` too.

## Working on this repo
- **Where the code lives:** the source is in `src/`, split into 85 modules whose load order is in `src/js/modules.txt`.
  - `tools/build.js` builds `index.html`, which GitHub Pages serves at https://danikko2.github.io/Zombdash/.
  - A GitHub Action rebuilds `index.html` whenever `src/` changes.
- **Don't edit `index.html` by hand.** Before starting, run `node tools/build.js --check`. If it fails, someone edited `index.html` directly, and that change has to be moved into `src/` first.
- **Publishing each change:**
  1. Run `node tools/build.js`.
  2. Run `node tests/run.js` (21 suites, about 4 minutes). Two exceptions are expected:
     - `tutorial.js` camera zoom is a known failure.
     - The `campaign.js` Rusty check is flaky and retried automatically.
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
2. **Step 2:** multi-select, drag-box selection, copy/paste/duplicate, layers (hide/lock/reorder), properties panel, collision shapes independent of sprites, polish.
3. **Step 3:** campaign slots.
4. **Step 4:** editing existing maps as a base.
5. **Step 5:** gameplay pieces the owner picks (loot crates, doors, traps…).
