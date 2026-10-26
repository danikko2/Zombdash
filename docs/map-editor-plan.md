# Zombdash map editor: plan and handoff (agreed Oct 20, 2026)

The full wish list is the "Map Workshop" prompt the owner attaches. This file records how it fits the game and what each step covers (steps 1–3 and the building kit are done; step 4, converting the built-in maps, is under way: the Suburb and the Warehouse are converted). Read `docs/ARCHITECTURE.md` and `docs/map-format.md` too.

## Working on this repo
- **Where the code lives:** the source is in `src/`, split into 116 modules whose load order is in `src/js/modules.txt`. Map files that ship with the game are in `src/maps/`.
  - `tools/build.js` builds `index.html`, which GitHub Pages serves at https://danikko2.github.io/Zombdash/.
  - A GitHub Action rebuilds `index.html` whenever `src/` changes.
- **Don't edit `index.html` by hand.** Before starting, run `node tools/build.js --check`. If it fails, someone edited `index.html` directly, and that change has to be moved into `src/` first.
- **Publishing each change:**
  1. Run `node tools/build.js`.
  2. Run `node tests/run.js` (29 suites, about 3 minutes). Every suite must pass; two checks are random and retried automatically:
     - The `campaign.js` Rusty check is flaky and retried automatically.
     - The `balance-editor-and-test-switches.js` ground-limit check fails about 1 run in 20 on the original game too (a kill can add two drops when one slot is left), so it is retried automatically as well.
     - The old `tutorial.js` camera zoom failure is fixed (Oct 25, 2026): the suite plays at phone size, where the tutorial doesn't zoom because the house already fills the screen (by design); the test now expects that on a phone and checks the zoom in and out on a desktop screen.
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
- **Existing maps (revised Oct 22, 2026):** the owner's main goal is that Claude builds maps and the owner then opens them in the editor for small tweaks. So step 4 **converts** the built-in maps into the editor's map format, one section at a time, instead of the earlier "base picture + walls" idea. Every map, old or new, ends up fully editable object by object. From now on, new maps Claude builds are made directly in the editor format.
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
4. **Step 4 (revised Oct 22, 2026):** convert the built-in maps into the editor's format so they are fully editable.
   - **Kit first:** before converting a map, check what it needs that the editor can't place yet (for example windows and doorways in walls, walk-behind tall objects and roofs, building floors, special road pieces, animated props) and add those as real editor pieces. **Done (Oct 23, 2026):** see "Building kit" below; the audit after it is the checklist, and "What each map still needs" lists what is left per map.
   - **Map-specific systems** stay attached to the map as named "special features" saved in the map file, which the editor shows and lets you move but not redesign. Examples: fountains and other animations, the Mayor's City Hall roof, boss road graphs for the Ice Cream Man, Fire Chief and police car, Penny's shelves and corrals, walk-behind bridges, no-spawn zones.
   - **Order:** convert one section at a time (Hometown first), about 1–2 maps per chat. Each converted map is checked side by side with the original (screenshots), playtested (walls, zombie paths, spawns, its survivor boss) and only then replaces the code-drawn version.
   - **Shipping:** converted maps are stored as `src/maps/*.json` and embedded by `tools/build.js`. The step 1 note says the loader is ready and the build needs to embed the files.
   - **Progress safety:** a converted map keeps its map number, campaign slot, boss, progress and leaderboard board, so players' progress is untouched.
   - **Small differences are allowed:** a converted map may look slightly different in painted details. The layout, walls, spawns and gameplay must match.
   - **Converted:** the **Suburb** (map 0), Oct 24, 2026, the **Warehouse** (map 1), Oct 25, 2026, and the **School** (map 3), Oct 26, 2026: see "Step 4 conversions" below.
5. **Step 5:** gameplay pieces the owner picks (loot crates, doors, traps…).

## Building kit (done Oct 23, 2026)
The editor can now build maps as detailed as the hand-coded ones. Map format version 3 (`docs/map-format.md` has every piece with examples; `docs/ARCHITECTURE.md` "Building kit" has how it works).

- **What's in it:**
  - **Buildings:** the Room tool (drag a rectangle: a floor plus walls in the chosen style with a doorway; Interior wall mode), the Opening tool (click a wall: doorway, window, boarded / broken window, storefront glass, automatic doors, open roll-up door, closed garage door, cell bars, or a plain gap), 25 wall styles, porches, steps, docks and bridges over water, pools, a gas station canopy, roofs on solid blocks (flat, skyscraper tower, brick, shingle, slate, metal; rooftop detail, clock dome, helipad, clinic cross, a name plate), the stadium and the city skyline.
  - **Roads and ground:** road paths (centre lines, 1–4 lanes, edge lines, curbs, round ends for cul-de-sacs and dead ends; curve them by adding points), highway lanes and ramps with rumble strips, cobbled roads, intersections with crosswalks and stop lines, crosswalks, parking stalls (rows, stall width, numbers), paved patches with curbs, sidewalks, trails, gravel paths, boardwalks, railroad tracks, streams, painted lines, ponds and lakes with shores, lily pads and reeds, ground patches of any shape, courts, helipads, sandboxes, splash pads, crop beds, and 31 more terrains (every ground texture of the built-in maps). Sidewalk terrains get curbs where they meet road terrains; water gets a shoreline.
  - **Decals:** 51 (wear, crash, blood, nature, paint and markings with your own words, shadows and light, spooky, litter), turned and sized freely.
  - **Effects:** fountain spray, water glints, fire, smoke (the game's smoke points), flickering and still light pools, emergency lights, hazard blinkers, flares, glows, wisps, ducks; fog, darkness and canopy-shade areas.
  - **Special features:** no-spawn zone, building interior, store (Penny), City Hall roof (Mayor), boss road graph (drawn like a path, or made from the road paths with "Build road graph from roads"). They set the same `HS` fields the built-in maps set.
  - **Props:** 48 kit props for what the maps drew in their own code (signs with your text, awnings, portraits whose eyes follow you, plane and helicopter wrecks, containers, office / school / bath rows, rooftop units…); taxi and food truck vehicles; text on trailers and food trucks. Every prop and vehicle placed on the 16 maps is in the asset browser with a name and category (checked by a test).
  - **Prefabs:** save a selection (optionally with the ground under it) and place it again from the Prefabs tab as separate, ordinary things. 33 starter prefabs from the built-in maps' layouts: furnished living room, kitchen, bedroom, bathroom, garage, office, diner, classroom, small house, family house, corner store, gas station, police cell block, barracks, cabin, hangar, barn, City Hall, skyscraper block, parked car row, crash scene, bus stop, food trucks, checkpoint, campsite, playground, picnic area, fountain plaza, fishing pond, army tent camp, graveyard plot, mausoleum, chapel.
  - **For Claude:** `docs/map-format.md` (the whole format, with a complete example that a test keeps correct) and `node tools/check-map.js file.json` (errors, missing assets, misspelt options, unreachable spawns and other problems; `--strict`, `--json`).
  - **Demo:** "Elm & 3rd (kit demo)", a town block (furnished house, corner market, crossroads, parking lot, park with a pond and fountain, decals and effects), ships as a sample in the Workshop (`src/maps/samples/town-block.zombdash-map.json`, embedded by `tools/build.js`, which now also understands `{{json:…}}`).
  - **Tests:** `tests/suites/building-kit.js` (147 checks): the format and the v2 → v3 upgrade, drawing and collision of every piece, the Room / Opening / Area / Path / point-editing / Feature tools with undo, decals and effects, prefabs (save, place, undo, every starter prefab), effects and features in a real run, the checker, the demo map (loads clean, builds, playtest with zombies), the asset browser, walk-behind.
- **How to use it:**
  - **Room tool (O, Build tab):** pick the wall style, floor pattern and colours and which side gets the doorway, then drag a rectangle. Switch to *Interior wall* and drag a line inside a room for a wall (with a doorway in its middle when *Doorway in the middle* is ticked).
  - **Openings (D):** pick a kind and width on the left and click a wall; clicking an opening with another kind changes it, *Opening* removes it.
  - **Areas (A) and paths (T):** pick a piece in the Build or Paths tab. Areas: drag a box. Paths: click points, then Enter or double-click (clicking the first point closes a shape; Backspace takes a point back, Esc cancels). Select a path to drag its points; Alt+click removes one, double-click on the line adds one.
  - **Decals and effects (Decals tab):** pick one and click to place; R turns, [ and ] size the next one; selected ones get size, opacity, colour, text and options in the right panel.
  - **Prefabs (G, Prefabs tab):** click one and click the map. To make your own, select things (drag a box), press *Save selection as prefab…*, name it and pick a group.
  - **Special features (K, Markers tab):** pick one; for the box kinds drag a box. For the *Boss road graph*, click points like a path (Enter finishes; a road that starts on a node joins it), or press *Build road graph from roads* in the Markers tab.
- **Decisions:**
  - **Format version 3**, with automatic upgrade of version 1 and 2 files (it only adds the Ground detail, Effects & lights and Special features layers). Built-in maps, progress and saved maps are unchanged. A file without `layers` now gets the default layers (it used to get them one by one with warnings).
  - **Windows stop bullets,** as on the built-in maps (their windows are painted on solid walls); cell bars and fences let bullets through.
  - **No roof hiding:** no built-in map hides a roof when you walk in. Walk-in buildings have no roof; roofs only go on solid blocks; tall things use walk-behind (now also every kit and forest tree, sign and lamp).
  - **Pools are solid,** like Main Street's.
  - Effects are drawn by the game only while on screen; areas and paths are baked into the map picture like the built-in maps' painting. A 128×96 map (the demo four times: 736 objects, 224 walls) loads in about 0.4 s and runs at 60 fps in Chromium; low-memory mode works as before (the picture is halved).
- **Partly done / not covered:**
  - Enchanted Forest's canopy layer that hides players under the trees (`HS.FS`): the kit has walk-behind trees and a canopy-shade area, not a full canopy over players.
  - The Haunted Mansion's grand staircase: build it from Steps areas (with a runner) and walls.
  - Highway gore chevrons: use Hazard stripes decals. Light beams: only light pools.
  - The second spawn list some maps have (`HS.sp2`): use spawn points and zones.
  - Bosses that need these features (Ice Cream Man, Fire Chief, Penny, Mayor) still aren't offered for custom campaign maps; the features are there for the conversions.

### Added after the kit (Oct 23, 2026, owner's request)
- **Blood:** five blood colours on every blood decal (fresh, dark, dried, zombie green, black ooze), six more blood decals (spray, smear, drops, big splatter, bloody footprints, crawl marks) and a blood trail path.
- **Bodies:** a dead zombie decal that draws a real zombie sprite lying down (11 zombie kinds, pool of blood, mirror), and body parts: arm, leg, head, hand, torso, guts, bones, skull, rib cage, covered body, body bag. They are decals: flat, never solid, turned and sized freely. Decals can now have options (`options` in the file).
- **Time of day:** Off, Morning, Day, Dusk or Night with an Amount slider (0–100%) in the Map panel, shown live in the editor and drawn by the game every frame: lamps, light effects, fires, sirens, hazards, glows, lit windows and the players light the ground. Stored as `"lighting"` in the map file (format still version 3).
- **Turning effects:** effects have a turn (`rot`), so hazard blinkers and sirens line up with the vehicle they are on (R in the editor, or Turn in the panel).
- The demo map's hazard lights now match the crashed car, with a dead zombie and an arm beside it. Tests: `tests/suites/gore-and-lighting.js`.
- **Lights at the lamp, room lights (Oct 26, 2026):** the flood light pole, light tower, work light and searchlight beams now start at the lamps in the picture instead of the foot of the pole. New `ceillight` prop (round ceiling fixture, light all round) and `roomlight` area (Effects group) that lights a whole room evenly in a chosen colour and brightness.
- **Walls block light (Oct 26, 2026):** lights, beams, room-light spill and players' lights stop at solid walls and roofs, so walls throw shadows; windows, glass, fences and doorways let light through. Each still light's outline is worked out once when the map is built.
- **Lights (Oct 25, 2026):** spot light, flood light on a pole, light tower, wall light, work light on a tripod and searchlight props, each shining a beam in its colour at dusk and night; R turns the beam (poles, towers and tripods stay standing). Lamps, lot lights, floor lamps, lanterns, exit lights and burning barrels are in the same new Lights group. Tests: `tests/suites/gore-and-lighting.js`.

## Building kit audit (Oct 23, 2026): what the 16 built-in maps draw or do, and the kit piece for it
This is the checklist for the step 4 conversions. Maps: **Su** Suburb, **Wa** Warehouse, **Gr** Graveyard, **Sc** School, **OW** Old West, **Ne** Neighborhood, **MB** Military Base, **Ca** Campground, **Hw** Deadway Highway, **HM** Haunted Mansion, **EF** Enchanted Forest, **Ur** Urban Outskirts, **CP** City Park, **Dt** Downtown, **Mk** Hometown Market, **MS** Main Street. Every prop in `OB` (259 before the kit) and every vehicle in `HWV` (14) was already in the asset browser; everything below was drawn by map code or done by map systems. ✓ = a kit piece reproduces it; ◐ = approximated.

### A. Buildings and walls
| What the maps do | Maps | Kit piece |
|---|---|---|
| Room shells: 6px walls around rooms with door gaps (26–60px), interior walls with doorways | every map with buildings | ✓ Room tool, Interior wall, `door` openings |
| Wall looks: plank / board walls | Ne, Ca, EF, OW | ✓ `plank` (any colour), `wood` |
| Wall looks: metal hangar walls, whitewashed / coloured siding, brick | MB, OW, MS, Dt | ✓ `metal`, `siding` (any colour), `brick`, `stone`, `concrete` |
| Glass storefront walls (still stop bullets) | Dt, MS, Mk | ✓ `glass` |
| Windows painted on walls (glass, broken, boarded, with shutters); the wall still stops bullets | Su, Sc, MB, Ca, HM, Ur, Mk, MS | ✓ `window` (trim colour), `window_x`, `window_b` |
| See-through bars (sheriff's and police cells) | OW, MS | ✓ `bars` |
| Doorway thresholds, door mats, automatic doors | Su, Mk | ✓ `door`, `autodoor`, `threshold` and `mat` decals |
| Roll-up dock / fire-bay doors over an open gap, closed garage doors | Mk, MS, Su | ✓ `rollup` (walk through), `garage` (solid) |
| Plank barricade walls with gaps | Ne | ✓ `barricade` |
| Room floors: checker in any two colours, 12px tiles with grout, planks, marble, terrazzo, linoleum, charred floor, stained carpet | all | ✓ `floor` area patterns, floor terrains, `stain` decals |
| Rugs and runners with borders, round rugs | Su, Gr, Sc, HM | ✓ `rug`, `rugr` |
| Porches and decks, boardwalks, docks cut out of water, steps, the grand staircase | MS, OW, Ca, CP, Gr, HM | ✓ `porch`, `boardwalk`, `dock`, `bridge`, `steps`; ◐ grand staircase |
| Roofs painted on solid blocks: skyscrapers (window lights, roof grid, AC units, helipad), apartment roofs (brick, water tanks), City Hall (slate, clock dome, name plate), decorative house roofs, clinic cross | Dt, MS, Ne | ✓ `roof` area (`tower`, `brick`, `slate`, `shingle`… + detail, dome, helipad, cross, name plate); prefabs `s_tower`, `s_cityhall` |
| The stadium (solid ellipse, seats, field, scoreboard, dome) | Dt | ✓ `stadium` |
| Gas station canopy (walked under, painted on the ground) | MS | ✓ `canopy`; prefab `s_gasstation` |
| Large buildings: hangars, barracks, chapel, crypt, church / saloon / stables, cabins, shower house, witch's cabin, restrooms, market, fire station, police station, gas station, guard booths | MB, Gr, OW, Ca, EF, CP, Mk, MS, Wa | ✓ Room tool + roofs + props; prefabs `s_hangar`, `s_barracks`, `s_chapel`, `s_mausoleum`, `s_barn`, `s_cabin`, `s_cornerstore`, `s_cellblock`, `s_gasstation`, `s_checkpoint` |
| City skyline backdrop behind a blocked band (sound wall) | Ur, CP | ✓ `skyline`, `soundwall` |
| Walk-in buildings never get a roof: roofs only sit on solid blocks, and tall things use walk-behind instead | all | ✓ same rule (no roof hiding) |

### B. Roads and ground
| What the maps do | Maps | Kit piece |
|---|---|---|
| Straight roads with curbs, sidewalks, dashed / double yellow centre lines, white lane and edge lines | Su, Wa, Sc, Ne, MB, Hw, Ur, CP, Dt, Mk, MS | ✓ `road` path, sidewalk terrains with automatic curbs, `walk`, `line` |
| Intersections with zebra crosswalks and stop lines | Ur, Dt, MS | ✓ `junction`, `zebra`, `stopline` |
| Cul-de-sac (round road end) | Ne | ✓ `road` with `ends: round` |
| Highway: 8 lanes, rumble strips, concrete median, guard rails, curved exit ramp, gore chevrons | Hw | ✓ `highway`, `median`, `guardrail`, curved paths; ◐ gore chevrons (`hazard` decals) |
| Curved roads: sine cobbled road, drive loop | EF, CP | ✓ `cobble`, curved `road` |
| Parking lots: stall lines, loading bays with numbers, arrows, handicap stalls, aisle lines | Wa, Gr, Sc, Ca, CP, Mk, MS | ✓ `parking` (numbers), `arrow`, `handicap`, `number`, `line` |
| Driveways, alleys, front walks, sidewalks with slab joints | Su, Ne, Sc, Ur, Dt, Mk, MS | ✓ `paving`, `walk`, `slabs` |
| Curved dirt trails, gravel paths, forest paths, wagon ruts, railroad track | Su, Ca, EF, CP, HM, OW | ✓ `trail`, `gravelpath`, `ruts`, `rails` |
| Lake with a curved shoreline, beach and reeds; ponds with mud / sand shore, lily pads and reeds (water blocks walking, bullets fly over) | Ca, CP | ✓ `pond` (lily pads, reeds), `beach`, water terrain shorelines |
| Pools, splash pad, sandbox, basketball court, helipads, runway markings | MS, CP, Sc, MB | ✓ `pool`, `splash`, `sandbox`, `court`, `helipad`, `runway` terrain + `line` |
| Ground textures: forest floor with litter, mossy clearings, dark spooky lawn, dry and olive grass, mown stripes, worn asphalt, cobbles, pavers, slab grid, rubber playground surface, gravel drive, hangar metal floor, runway | Su, EF, Gr, HM, MB, Ur, CP, MS, Sc, Dt | ✓ kit terrains (`forest`, `moss`, `grass_dark`, `grass_dry`, `grass_olive`, `grass_park`, `asphalt_worn`, `cobble`, `pavers`, `slabs`, `rubber_*`, `metal`, `runway`…), shape patches |

### C. Detail and decals
| What the maps do | Maps | Kit piece |
|---|---|---|
| Cracks, oil stains, blood trails, puddles, stains | most | ✓ `crack*`, `oil`, `bloodtrail`, `puddle`, `stain` |
| Skid marks, scorch rings, glass and debris around wrecks | Su, MB, Hw | ✓ `skid` (decal and path), `scorch`, `glass`, `debris`, `tiremarks` |
| Leaf litter, twigs, moss, rocks, mushrooms | Su, HM, EF | ✓ `leaves`, `twigs`, `moss`, `rocks`; mushroom props |
| Potholes with water, manholes, drains, grass in cracks, dirt patches | Ur, Dt, Su, Sc, MB | ✓ `pothole`, `manhole`, `drain`, `crack_grass`, `dirtpatch` |
| Graffiti, chalk circle and scrawled words, cobwebs | Ur, HM | ✓ `graffiti`, `chalk`, `scrawl`, `cobweb` |
| Painted words and arrows on the ground (DOCK 1, FOOD TRUCKS ONLY, STOP, IN / OUT), hazard stripes, yellow safety lines | Wa, Sc, CP, Mk | ✓ `text`, `arrow`, `arrow_turn`, `hazard`, `hazardband`, `safety` |
| Shadows under props and vehicles | all | ✓ `shadow`, `treeshadow` |

### D. Effects
| What the maps do | Maps | Kit piece |
|---|---|---|
| Animated fountain spray and ripples; splash-pad jets and bucket dump; ducks on ponds | Sc, CP | ✓ `fountain`, `splash` area, `ducks` |
| Flashing police / ambulance / fire lights, hazard blinkers, road flares, burning wrecks | Hw | ✓ `siren` (police, ambulance, fire), `hazard`, `flare`, `fire` |
| Campfire and burning-barrel flames with a warm glow | Ca, Wa | ✓ `fire` |
| Flickering candle / fireplace / lamp light pools; light pools and beams | HM, Gr | ✓ `flicker`, `light`; ◐ beams |
| Portrait eyes that follow the player | HM | ✓ `portrait` prop |
| Glowing mushrooms, will-o'-wisps | EF | ✓ `glow`, `wisp` |
| Drifting fog over the grounds; a dark tint baked over an interior | HM | ✓ `fog`, `dark` |
| Smoke points (`SM`) | Su, Wa, OW, Ne, MB, Ca, Hw, EF, Ur | ✓ `smoke` |
| Tree canopies drawn over players (forest canopy grids, walk-behind trees) | Su, Sc, EF, CP, HM, Hw | ✓ walk-behind trees, `shade`; ◐ the full forest canopy layer |

### E. Vehicles and walk-behind
| What the maps do | Maps | Kit piece |
|---|---|---|
| Cars painted by map code (parked top-down cars) | Su, Ne, Ca | ✓ vehicles with colours |
| Food trucks with names on the roof, taxis with roof signs | CP, Dt | ✓ `ftruck` (text), `taxi` |
| Fighter jets, crashed cargo plane, downed helicopter | MB, Su | ✓ `jet`, `planebody`, `planetail`, `planewing`, `heliwreck` |
| Semi trailers with names on the roof | Wa, Mk | ✓ `trailer` text |
| Walk-behind for tall props (`vehWrap` list); the new house / forest props weren't on it | all | ✓ `wb: 1` props |

### F. Props drawn by map code
| What the maps do | Maps | Kit piece |
|---|---|---|
| Painted furniture: counters, stove, sink, microwave, fridge, sofa, armchair, TV, coffee table, garage shelf, workbench, beds, dressers | Su, Ne | ✓ house props, `micro`, `coffeetable`, `garageshelf` |
| Office desks with monitors, filing cabinets, toilet stall rows, sinks, lockers rows, shower rows | Wa, Sc, MB, Ca | ✓ `officedesk`, `lockrow`, `stalls`, `showers` |
| Chalkboards, cubbies, clocks, posters, cafeteria counter | Sc | ✓ `chalkb`, `cubby`, `wclock`, `poster`, `cafeteria` |
| Coffins, open grave with dirt pile, stone gate arch, signposts with arrows | Gr, HM, EF | ✓ `coffin`, `opengrave`, `dirtpile`, `gatearch`, `arrowsign` |
| Highway signs, billboards, shop signs, awnings, name plates, aisle and department signs, price sign, name boards | Wa, Sc, Hw, Dt, Mk, MS, all | ✓ `hwsign`, `billboard`, `storesign`, `awning`, `nameplate`, `aislesign`, `deptsign`, `pricesign`, `signboard`, `streetsign`, `stopsign` (your text) |
| Campfire stone ring, log archway with a sign, boom gates, shipping containers | Ca, Wa, MB | ✓ `campring`, `archway`, `boomgate`, `container` |
| Portraits, fallen chandelier, twisted dead trees, spooky and park canopy trees, forest trees | HM, EF, CP, Su, Hw | ✓ `portrait`, `chandelier`, `deadtwist`, `canopytree`, `blackpine`, forest props |
| AC units, water tanks, fire escapes | Dt | ✓ `acunit`, `wtank`, `fireesc`, `elevator` |

### G. Special features (map systems)
| What the maps do | Maps | Kit piece |
|---|---|---|
| Boss road graphs `HS.RG` (ice cream truck, fire engine, police cruiser) | CP, Dt, MS | ✓ `roadgraph` feature |
| Street trees that stop the fire hose `HS.TRK` | Dt | ✓ `stree` props (automatic) |
| City Hall roof spot `HS.CH` | MS | ✓ `cityhall` feature |
| Store rectangle, shelves and cart corrals `HS.ST` / `HS.SHF` / `HS.CRL` | Mk | ✓ `store` feature + `gshelf`, `corral`, `cartrow` props |
| Building interiors `HS.HO` (bosses look for players inside) | EF, Ur, CP, Dt, Mk, MS | ✓ `house` feature, indoor floors |
| No-spawn rectangle `HS.nx0…` and no-go areas `NOGO` | HM, Mk, Ca, CP | ✓ `nospawn` feature |
| Spawn point lists `HS.sp` / `HS.sp2` | most | ✓ spawn points and zones; ◐ the second list |
| Map-only animation data (`HS.MN`, `HS.FS`, `HS.HL`, `HS.HB`, `HS.PK`) and School's own walk-behind pass | HM, EF, CP, Hw, Sc | ✓ `fog` / `flicker` / `portrait` (MN), `siren` (HL), `fire` (HB), `ducks` (PK), walk-behind props (School); ◐ the forest canopy (FS): the Suburb's woods use walk-behind forest trees (`foak`, `fpine`) |

## Step 4 conversions

### Suburb (map 0): converted Oct 24, 2026
- **The file:** `src/maps/suburb.json` (72×57 tiles; 1,405 props of which 1,240 forest trees, 3 vehicles, 136 walls, 145 decals, 35 areas, 35 paths, 3 effects, 106 spawn points, a no-spawn box and a menu view). It loads through the same loader as custom maps (`world/builtin-maps.js`: `MP[0].f = () => bimBuild(0)`), keeps map number 0 and so its campaign slot, survivor boss (Bill), progress, best waves, leaderboard board and checkpoints. `mapSuburb()`, `maps/suburb-details.js`, `mkHouse`, `subSign`, `subCan` and the map-0 branch of `paintDec` are gone; the shared helpers moved to `maps/map-helpers.js` (with `subSpr`, which the Highway, the School and the forest trees use).
- **Same layout:** every coordinate is absolute and taken from the old map (a capture of its `WL`, trees, props, spawns and `HS`), so the middle house stays exactly where `tutGeo()` expects it; the tutorial is unchanged. The old collision is kept as `tests/fixtures/suburb-walls.json`; the converted map matches it pixel for pixel except 3 forest trunks that stood 2–4 px off the left edge and now stand on it.
- **Editing:** the Workshop lists it under **Built-in maps**: EDIT A COPY / ADD A COPY TO MY MAPS make your own copy with a new id; the built-in Suburb only changes through the repo.
- **Kit pieces added for it:** props `foak` / `fpine` (forest trees: see-through trunks, one shared walk-behind canopy picture per size and shade), `ytree` (yard tree), `ftrunk` (fallen tree), `sstump` (splintered stump), `smallcar` (small crashed car), `chopper` (crashed helicopter, only its body walk-behind), `dirsign` (direction sign with your text and an arrow), `hplant` (house plant from above), `flamp` (floor lamp, gives light), `curtain`; decals `speck` (grass bits) and `scorchround`; areas `mowed` (lawn stripes); paths `forest` (forest floor shape, with a churned-earth style) and grass `clearing` patches that paint real grass; features `menuview` (menu camera) and `nospawn` options `skip` / `nogo`; props can have a collision flag (`cf: 2` = see-through); floors can be as small as 4×4. No prefabs were added (the houses are laid out piece by piece).
- **Engine changes:** the first map build at boot moved to the end of `world/builtin-maps.js` (the Suburb needs the loader and the kit props, which load late); `HS.CM` now means "built from a map file" (kit effects and lighting check it); `cmBuild` sets `HS.sp`; `bgFree` no longer frees shared walk-behind pictures (`sh: 1`); a custom map's turned vehicle gets a walk-behind box that hugs it instead of a square.
- **Checks done before the swap:** side-by-side pictures of the whole map, each house, the street, the crash lane, both forests and the sign; the wall comparison above; all 106 spawns reach the player (path search from the start); campaign waves 1–19 played three times with zombies walking into the house (99.7% reached the player; the 2–3 that didn't were big zombies jammed in a doorway, as on the old map), the wave-20 survivor boss and the progress after it; a Free Play run (best wave, leaderboard board 0, checkpoint as map 0); the tutorial; split screen; low-memory mode; performance (below). `tests/suites/suburb.js` repeats these (waves 1–4 and 19 by default; `SUBURB_FULL=1 node tests/suites/suburb.js index.html` plays all of 1–19, about 8 minutes). The same playtest on the old map code (the last `index.html` before the swap) gave the same picture: a couple of big zombies (brutes, big blues) can jam in the front doorway on both; spitters and healers keep their distance on both; Bill took up to ~30 s to reach the player in the house on both.
- **Performance and memory** (Chromium, 1280×800, five spots): frames 1.9 ms on average instead of 3.0 ms (the canopy is no longer redrawn every frame), the map builds in 0.15 s instead of 0.6 s, the JS heap is the same (10.4 MB vs 10.6 MB). Canvas memory is 0.4 MB higher (16.8 vs 16.3 MB; low-memory mode 4.8 vs 4.4 MB): the map is 4 px wider and 24 px taller (whole tiles), and the cars, sedans, bookshelves and helicopter body are walk-behind pictures.
- **Visible differences** (allowed by "small differences"): the trails and the clearings' edges are smooth curves instead of 8 px steps; the trails have a lighter middle and stop a little before the forest edge; the crosswalk bars are thinner lines; furniture uses the kit props (beds with red covers, kit kitchen counters and stove, sink under the west window instead of a cabinet line across the back wall, grey garage cabinet and tool chest, tire stack, kit TV stands, coffee tables and sofas); wall pieces have the kit's lighter top edge; windows are 6 px kit windows; gate posts are siding pieces; the road edge lines and dashes have slightly different lengths; the 14 small dark streaks on the road and the debris bits by the crashed cars are gone (the road has its own speckle); splinters along the crash lane are small twig decals; the garage cars are kit sedans; the forest canopy hides a player standing behind a tree instead of every player under any canopy; the camera stops 24 px lower at the bottom edge.

### Warehouse (map 1): converted Oct 25, 2026
- **The file:** `src/maps/warehouse.json` (57×57 tiles on the new grey `lot` terrain; 95 props, 45 vehicles (34 trailers, 11 parked cars), 28 walls, 222 decals, 13 areas, 109 paths (lot and road markings), the burning barrel's smoke, a no-spawn box and a menu view; no spawn points, so zombies still come from off-screen as before). Same loader and records as the Suburb (`BIMF[1]`); map 1 keeps its campaign slot (third in Hometown), its survivor boss, progress, best waves, leaderboard board and checkpoints. `maps/warehouse.js`, `whSign` and the map-1 branch of `paintDec` are gone.
- **Collision:** identical to the old map, box for box (141 boxes), kept as `tests/fixtures/warehouse-walls.json`. Every doorway (the four ways in, the office door, six office doors) is clear: no prop stands in one.
- **New kit pieces for it:** props `wcont` (small container), `guardbooth`, `lotgate`, `deskpc`, `ochair`, `fcab`, `sinkrow`, `wc`, `lockstrip`, `exitsign`, `dirsign2`, `firebarrel`, `btable`; the `hatch` vehicle (the old lots' parked car); a stripe colour for trailers and semis (`color2`, Stripe swatches in the editor, including no stripe; the Warehouse's trailers have none, at the owner's request); terrain `lot`; paving surface `turf` (dark lawn); hazard band style `blocks`; decal `lotspeck`. Lights (owner's request): `spotlight`, `floodlight`, `floodtower`, `walllight`, `worklight`, `searchlight`, with beams that turn with the prop, and a Lights group in the prop browser.
- **Checks:** before/after pictures of the whole lot, the building, the offices, the gate, the three trailer lots, the parked cars, the containers, the barrel and the sign; the collision comparison; every open spot on the map's edges reaches the player; campaign waves 1–19 played on both the old and the new map (every zombie reached the player on both) and the survivor boss (it fights from about 250 px once it sees the player, on both); Free Play; split screen; low-memory mode; performance: frames the same (about 1.3 ms), canvas memory 0.4 MB higher (the map is 24 px bigger each way: whole tiles), 0.2 MB higher in low-memory mode.
- **Visible differences:** trailers are the kit trailer, 12 px longer (same collision, set by a shape), and plain: no coloured stripe (owner's request, Oct 25, 2026); walls are kit concrete walls (lighter top edge, joints every 48 px); the road's dashes and lane lines have the kit line's spacing; the lot numbers and STOP are kit text decals (a slightly different font); oil stains are kit oil decals; the office plants are round house plants seen from above; the vertical locker row is 2 px wider.

### School (map 3): converted Oct 26, 2026
- **The file:** `src/maps/school.json` (69×57 tiles on the new `grass_school` terrain; 772 props, 136 walls, 166 decals, 3 effects (the fountain spray, smoke from the bus and the kitchen), 92 areas, 49 paths, 11 features: the building's no-spawn box, nine boxes over the woods, a menu view; no spawn points). `BIMF[3]`; map 3 keeps its campaign slot (second in Hometown), its survivor boss, progress, best waves, leaderboard board and checkpoints. `maps/school.js`, `maps/school-details.js` (its own walk-behind pass `schFg`, the fountain animation `schAnim`, the woods check `schWd`), the map-3 branch of `paintDec` and the map-3 exceptions in `build()` and `vehFg` are gone; `fgRe` (vehicles.js) is the old `schRe`.
- **Changed on purpose (owner's request):** the three top classrooms have 16 desks each (was 6–7) and the big classroom 20 (was 10), in rows with aisles of at least 28 px; the three long offices (410 px deep) are now eight rooms: a reception with a counter and waiting chairs, a short corridor to the back door with the principal's and the counselor's offices off it, a nurse's office and a records room, the teachers' lounge and a janitor's closet (new walls and five new doors); more detail (a sixth cafeteria table instead of the odd desk, vending machines and a milk cooler, bins, office furniture, wall clocks); windows let into the outside walls (the old map only painted them on) and lights: ceiling lights and room lights in every room and hall, exit lights inside the eight outside doors and wall lights outside them, flood lights on the court, lot lights, lamps; the School is set at **dusk** (`lighting: dusk, 0.55`).
- **Collision:** every old wall is still there (windows are wall pieces too); the new office walls, the moved trophy case and the extra desks and tables are the only new blocks; tree trunks stay see-through. Kept as `tests/fixtures/school-walls.json`. No prop stands in any of its doorways.
- **New kit pieces for it** (`world/kit-school.js`, `maps/props/kit-props.js`): areas `lockers`, `board` (chalkboard, whiteboard, cork, posters), `cubbies`, `counter` (solid; plain, sinks, towel dispensers), `kline` (kitchen line), `plaza` (round plaza with flower beds), `walkway`, `sandlot` (playground sand with a ragged edge); props `stall` (toilet stall divider), `banner`, `wcsign` (restroom sign), `sclock` (small wall clock); decals `crest`, `lawnbit`; terrain `grass_school`; forest trees go up to the School's shade-tree sizes (oak `var` steps 0–12, pine 0–11).
- **Game changes that came with it:** random off-screen spawns now keep out of every no-spawn zone of a map file (not only the first), a zone at the map's edge also covers the strip just outside it, and after 24 tries a zombie starts at a random allowed spot on the edge (`spBad`); the woods behind the School use this. Lights that never change are drawn once into a picture of the whole map (`cmLtCache`), and the glow is only drawn when the light strength is over 0.5: the School's frames went from about 18 ms to 7 ms in the software-rendered test browser (2 ms with the lights off; the old map was 2 ms).
- **Checks:** before/after pictures of every part of the map; dusk and night pictures; every room reachable; zombies never come out of the woods; campaign waves 1–19 (every zombie reached the player) and the survivor boss; Free Play; split screen; low-memory mode; the Workshop copy.
- **Visible differences:** the court is the kit court (keys and three-point arcs); the sidewalk is kit slabs (speckled); the wall clocks, posters, lockers and chalkboards are kit pieces drawn like the old ones; the commons' terrazzo flecks are gone; the trees are the forest kit trees (the same pictures).

### Doorways (Oct 25, 2026, owner's request)
No prop may block a doorway. `cmDoorBlocks` finds props and vehicles within 24 px of an opening (solid ones by their collision, others by their base) and the Problems list and `tools/check-map.js` warn about them. Fixed on the Suburb: the dressers now stand against the bedroom side walls, the hall plants moved away from the bedroom and garage doors, the garage cabinet, tool chest and tires moved out of the house door and the garage opening, the stove and fridge moved off the back doors, one kitchen table moved 4 px, and the trash can by the middle house's back door moved 10 px (the only collision change; the Suburb test allows it). Fixed on the Elm & 3rd sample and on the example in `docs/map-format.md` too. Both converted maps' tests check it.

### Lessons for the next maps
- **Capture first.** Run the old map once and dump `WL`, the tree and prop lists (wrap `paintDec`), spawns and `HS` to JSON; generate the map file from that capture plus the map's formulas with a small script, then compare `cmColl(doc)` with the old `WL` (rasterise both with a 0.2 px tolerance: the 0.1 px rounding of the file flips edge pixels otherwise). Keep the old collision as a test fixture before deleting the map code.
- **Keep absolute coordinates** and round the map size up to whole tiles; nothing else needs moving.
- **Flags:** old walls without a flag and with flag 1 behave the same in the game; flag 2 (see-through) must stay 2: use fence styles or `cf: 2` props.
- **Painted furniture had no collision:** make furniture props `solid: false`, or zombie paths change.
- **Indoor floors** (`in: 1`) add building interiors for the bosses: use `in: 0` when the old map had no `HS.HO`.
- **No-spawn boxes** on the old maps only filter the off-screen spawn point; use `skip: 0` / `nogo: 0` when the map's spawn points sit inside the box or `NOGO` was empty.
- **Thousands of props are fine** if their walk-behind pictures are shared (`kpWB` with `sh: 1`); a canvas per tree would cost tens of MB.
- **In Node tests, don't give the player a huge max health:** the HUD draws one heart per point (a million hearts made each tick take 4 s). Mark the account `tut: 1` before starting a campaign run on map 0, or the tutorial starts instead.
- **Watch the boot order:** anything the boot build needs must be loaded before `world/builtin-maps.js` runs it.
- **Check doorways while laying out furniture:** run `node tools/check-map.js` (or look at the Problems tab); copy the old positions, then move anything it lists.
- **Paint order matters:** things the old map painted before a floor (oil stains under the building) must be left out or they show on top of the floor; floors painted after a bigger floor need a higher `order`.
- **A prop's default `var` is random:** set `var` on props whose look depends on it (the locker rows).
- **Boss checks:** some survivor bosses fight from a distance; compare a boss's behaviour with the old map before calling a difference a bug (the same playtest can run on the last `index.html` from git).
- **Free Play needs the map unlocked** in a browser check (`S.ac.cp = 8`), or `start()` quietly plays the Suburb.
- **Survivor bosses dodge:** clear `iv` (short invulnerability) before a test's knock-out hit, or the hit is blocked now and then.
- **Lots of lights cost a full-screen blend or two, not one per light:** still lights are cached; keep flickering ones few.
- **A map with woods along an edge:** cover them with no-spawn zones (`skip` on); a zone touching the edge covers the strip just outside it too.

## What each map still needs before converting
Everything else on each map can be built with the kit; the conversion still has to be laid out, compared side by side and playtested (walls, zombie paths, spawns, its survivor boss).

| Map | Still needs / watch out for |
|---|---|
| Suburb | **Converted (Oct 24, 2026).** |
| Warehouse | **Converted (Oct 25, 2026).** |
| Graveyard | Nothing new (chapel and mausoleum prefabs are a start; the mausoleum glow is a `glow` effect). |
| School | **Converted (Oct 26, 2026).** |
| Old West | Nothing new (barn prefab for the stables, `bars` for the sheriff). |
| Neighborhood | Nothing new (cul-de-sac = road with round end; decorative house roofs only on solid blocks). |
| Military Base | Nothing new (hangar, barracks, tent camp, checkpoint prefabs). |
| Campground | Nothing new. |
| Deadway Highway | Gore chevrons as hazard decals; a second spawn list as spawn points. |
| Haunted Mansion | The grand staircase from steps areas; candles = `flicker`, fog = `fog`, inside = `nospawn`. |
| Enchanted Forest | The canopy layer that hides players (`HS.FS`): the Suburb showed walk-behind trees work (shared canopy pictures, `kpWB`); its trees need their own kit tree props in the forest's colours. |
| Urban Outskirts | Nothing new. |
| City Park | Nothing new (road graph for the Ice Cream Man; splash pad, ponds, ducks). |
| Downtown | Second spawn list as spawn points; lobbies with the Room tool next to tower roofs; street trees `stree`. |
| Hometown Market | Nothing new (store feature, shelves, corrals, no-spawn). |
| Main Street | Nothing new (City Hall prefab with the roof feature, road graph for the Mayor's cruiser, pools, canopy). |
