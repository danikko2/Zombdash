# Zombdash map editor: plan and handoff (agreed Oct 20, 2026)

The full wish list is the "Map Workshop" prompt the owner attaches. This file records how it fits the game and what each step covers (steps 1–3 are done). Read `docs/ARCHITECTURE.md` too.

## Working on this repo
- **Where the code lives:** the source is in `src/`, split into 101 modules whose load order is in `src/js/modules.txt`.
  - `tools/build.js` builds `index.html`, which GitHub Pages serves at https://danikko2.github.io/Zombdash/.
  - A GitHub Action rebuilds `index.html` whenever `src/` changes.
- **Don't edit `index.html` by hand.** Before starting, run `node tools/build.js --check`. If it fails, someone edited `index.html` directly, and that change has to be moved into `src/` first.
- **Publishing each change:**
  1. Run `node tools/build.js`.
  2. Run `node tests/run.js` (23 suites, about 4½ minutes). Two exceptions are expected:
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
  - `SEC` (`campaign/sections.js`) has 5 sections. `-1` marks the **9** free "Coming Soon" slots (an earlier version of this file said 7): Wrong Turn 5, Zombville 4–5, Countryside 4–5, Island 2–5.
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

   - **Added after step 2 (Oct 22, 2026, owner's request):** carpet terrain in grey, dark grey, tan, black, red, green and blue (a loop-pile texture drawn from the owner's carpet photo), farm soil, road markings (yellow line, yellow dashed, white line, white dashed, crosswalk) that join up with their neighbours, 40 house props (kitchen counters, sinks, stoves, fridges, cabinets in several sizes, islands, kitchen tables, nightstands, dressers, TV stands, TVs, a brick fireplace, showers, garage cabinets, couches), 24 forest and farm props (oak, big oak, maple, birch, spruce, giant pine, willow, big dead tree, young tree, long grass, ferns, cattails, big rotting fallen trees, crop rows) and **prop colours**: props that come in colours show swatches plus a custom colour picker, stored as the prop's `color`. Built-in maps are unchanged.
3. **Step 3:** custom maps in the campaign.
   - **Slots:** a custom map can go into any of the 9 free Coming Soon slots, from the Workshop (**campaign** on the map's row) or from the slot on the section map (**ADD A MAP**). It shows there with its name, a postcard of its thumbnail and a generic landmark (signpost, tent, campfire), and can be moved or removed. Works in single player and in the split-screen campaign map picker.
   - **Wave-20 boss:** picked when assigning, from the 12 bosses whose fight works on any map.
   - **Section rules:** the section's zombie line-up and caps (`ZCFG.camp`), campaign difficulty scaling (like the toughest map in the section), lives, waves 1–20 ending in the boss.
   - **Progress:** stored per account in `A.cmc` by the map's string id, never in the beaten-map bitmasks. Slots are optional and never block the next section. Removing a map keeps its record.
   - **Free Play:** a map in a slot opens in Free Play once beaten there; maps not in the campaign stay open.
   - **Replace a campaign map:** "play this instead of …" for a built-in campaign map, with a confirmation; progress, section, boss and difficulty stay the original's; one-click restore.
   - **Compatibility:** checkpoints and crash resume work on slot maps and replaced maps; campaign runs never post leaderboard scores; a map that is deleted or can't be opened puts its slot back to Coming Soon with a warning.
   - **Status: done (Oct 22, 2026).** How it works is in `docs/ARCHITECTURE.md` ("Custom maps in the campaign"); `tests/suites/custom-campaign.js` covers it (103 checks). The map format is unchanged (still version 2): slots and replacements are device data in IndexedDB, not part of the map file.
   - **Decisions made while building it:**
     - **Bosses not offered**, because their fights need their own map: the **Ice Cream Man**, Scoops (drives the truck along City Park's road graph `HS.RG`; without one it can't move), the **Fire Chief**, Chief Mac (the fire engine drives Downtown's road graph and blasts into its buildings), **Penny** (her attacks dump the Hometown Market's shelves and send carts from its corrals), the **Mayor** (watches from City Hall's roof while his cruiser drives Main Street's road graph). Officer Ray, Abigail, the Headless Horseman and Rusty work anywhere (Ray vaults over whatever solid things the map has; Rusty's grenades for players hiding in houses just don't happen on maps without houses).
     - **Reward:** beating the boss marks the map beaten on that difficulty (✓ on the campaign map), opens it in Free Play, and gives the run's usual XP and Zombie Pts. The survivor gives up ("See you out there!") but doesn't join: everyone is recruited on their own map, so a custom map can't skip ahead in the story, and no extra currency is handed out, because anyone can make an easy map.
     - **Replacing** only affects the campaign (Free Play keeps the original map), and isn't offered for City Park, Downtown, Hometown Market or Main Street, whose bosses need those maps.
     - A map is in one place at a time: one slot, or replacing one map.
     - Slot assignments are per device (shared by the accounts on it); progress is per account.
     - The Free Play leaderboards for custom maps (added at the owner's request in step 2) are unchanged; campaign runs, custom or not, never post scores.
4. **Step 4:** editing existing maps as a base.
5. **Step 5:** gameplay pieces the owner picks (loot crates, doors, traps…).
