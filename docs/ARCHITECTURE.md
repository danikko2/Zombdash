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
| `src/js/**` | The game, split into 94 modules (listed below). The Map Workshop is in `src/js/editor/`, the custom map format and loader in `src/js/world/`. |
| `src/assets/sprites/` | `zombies.png` (zombie atlas) and `survivors.png` (player atlas). Frame positions are in `ZS` / `PS` in `render/sprites.js`. |
| `src/assets/thumbs/map-NN.jpg` | Map preview pictures; `NN` is the map's number in `MP`. |
| `src/assets/sounds/` | Recorded reload sounds (everything else is synthesized in `audio/sound.js`). |
| `tools/build.js` | The build (Node, no packages needed). |
| `tests/run.js`, `tests/suites/` | Automated tests that load the real game in Node with a fake browser. |
| `docs/` | This file, the map editor plan (`map-editor-plan.md`) and the Supabase setup SQL for online accounts. |

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
| Campaign sections and map order | `SEC` in `campaign/sections.js`, `CORD` in `campaign/modes.js` |
| Skill tree | `SKB` in `ui/core-ui.js` |
| Online accounts / leaderboards | `online/supabase.js` and `docs/supabase-setup.sql` |
| Test code and its switches | `dev/test-code.js`, `dev/test-switches.js`, `dev/balance-editor.js` |
| Terrain types for custom maps (add one with `cmAddTer`) | `CMTER` in `world/map-schema.js` |
| Blood / burn overlays, wall styles for custom maps | `CMOVL`, `CMWALL` in `world/map-schema.js` |
| Names and categories in the editor's prop browser | `EDPN` (props), `EDVN` (vehicles), `EDCAT` in `editor/assets.js` |

Values changed in the in-game **GAME BALANCE** menu only live on that device; use its *Copy changes as a list* button and ask Claude to make them permanent in these files.

## Custom maps (the Map Workshop)

**CREATE** on the main menu opens the Map Workshop (`editor/workshop.js`): your maps with thumbnails, search, new, edit, play, rename, duplicate, export, import and delete. The editor itself (`editor/editor.js`) is for mouse and keyboard; maps made with it play everywhere, split screen included.

* **Maps are data.** A custom map is a JSON file (format below). `cmRead` checks and loads one, `cmWrite` writes one, and `cmBuild` (`world/custom-maps.js`) turns it into a playable map the same way a `mapXxx()` function does: it sets `WW`/`WH`, paints `BG` with the real props (`OB`) and vehicles (`hwDraw`), fills `WL` (walls, water, solid props, `hwCol` for vehicles) and sets `HS` (player start, `HS.CZ` = spawn points and zones, which `spawnZ` uses).
* **Where they live.** On the device, in IndexedDB (`zombdash-maps`, see `world/map-store.js`), never in `S` or the online saves. Without IndexedDB they last until the page closes and the Workshop says so. The editor keeps a crash-safe draft of unsaved changes, offered back in the Workshop.
* **In the game.** Custom maps get no slot in `MP`. While the game runs, each saved map has a map key from 1000 up (`CMKEY`) and the playtest map is 900 (`CMPTK`); `mapId` holds that key and `build()` hands it to `cmBuild`. `cmIs(m)` tells them apart. Free Play lists them after the built-in maps (`ORD`). Custom maps never touch `S.mp`, the leaderboards, the crash checkpoint or the per-map records.
* **Playtest** (`editor/playtest.js`) plays the edited map with the real game (`start()`), with saving switched off (`sv.off`); afterwards the account, best wave and settings are put back exactly, so a playtest earns nothing.
* **Problems.** `cmLint` lists what the editor warns about: a blocked player start, spawns inside walls or unable to reach the player, unknown props or terrain.

### Custom map files

Anything that writes this JSON makes a map; import it with **IMPORT** in the Workshop. Pixels for positions, tiles of 32px for the size.

```json
{
  "format": "zombdash-map", "version": 1,
  "name": "Gas Station", "description": "Pumps, a shop and a parking lot.",
  "tileSize": 32, "width": 40, "height": 30,
  "ground": "grass",
  "terrain": { "legend": { "g": "grass", "a": "asphalt", "w": "water" },
               "rows": ["gggggaaaaa…", "…"] },
  "overlay": { "legend": { "b": "blood", "x": "burn" }, "rows": ["....b…", "…"] },
  "props":    [ { "kind": "crate", "x": 400, "y": 300, "rot": 0 } ],
  "vehicles": [ { "kind": "sedan", "x": 640, "y": 480, "rot": 90, "color": "#c0392b", "damaged": true } ],
  "walls":    [ { "x": 0, "y": 0, "w": 200, "h": 8, "style": "brick" } ],
  "playerStart": { "x": 640, "y": 560 },
  "zombieSpawns": { "points": [ { "x": 40, "y": 40, "enabled": true } ],
                    "zones":  [ { "x": 900, "y": 600, "w": 200, "h": 150, "enabled": true } ] }
}
```

* `width` × `height` is 20×15 up to 128×128 tiles. `terrain.rows` has `height` strings of `width` characters, each a key of its `legend`; leave `terrain` out for plain `ground` everywhere. `overlay` is optional, `.` means nothing.
* Terrain: `grass dirt asphalt concrete sidewalk sand gravel mud water wood tile` (water blocks walking, bullets fly over it). Overlays: `blood burn`. Wall styles: `wall brick concrete wood` (stop bullets), `fence` (see-through), `hidden` (an invisible blocker).
* A prop's `kind` is a key of `OB` (the editor's prop browser shows them all), its `x`,`y` is the middle of its base; props with a collision size in `OB` are solid. A vehicle's `kind` is a key of `HWV` (`sedan suv pickup van limo police amb fire bus semi cab trailer hmv mtruck`), its `x`,`y` is its centre. `rot` is in degrees.
* `id`s are optional (they are added). Fields the game doesn't know are kept and written back. A file with mistakes is refused with a list of what's wrong, and nothing is changed.

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
| `maps/suburb.js` | Suburb map (map 0) and shared wall helpers |
| `maps/warehouse.js` | Warehouse map |
| `maps/graveyard.js` | Graveyard map |
| `maps/props/objects.js` | Prop library: object sprites (OB), fences, scatter, put() and paintDec() |
| `maps/props/houses.js` | House builder used by several maps |
| `maps/props/school-objects.js` | School props: lockers, cracks, signs and more objects |
| `maps/school.js` | School map |
| `maps/old-west.js` | Old West map |
| `maps/props/furniture.js` | Furniture and garden props (sofas, kitchens, crops) |
| `maps/neighborhood.js` | Neighborhood map |
| `maps/military-camp-shared.js` | Shared pieces for Military Base and Campground |
| `maps/military-base.js` | Military Base map |
| `maps/campground.js` | Campground map |
| `maps/suburb-details.js` | Suburb forests, crash lane, detailed houses |
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

### World systems (`src/js/world/`)

| File | What's in it |
|---|---|
| `world/map-list-and-pathfinding.js` | The map list (MP), build() to load a map, zombie pathfinding flow field, wall push-out |
| `world/map-schema.js` | Custom map format: terrain (CMTER), overlays, wall styles, cmRead / cmWrite, collision (cmColl), problem checks (cmLint) |
| `world/map-store.js` | Custom map storage on the device (IndexedDB) |
| `world/custom-maps.js` | Custom maps in the game: map keys, the Free Play list (CML), cmBuild(), spawning from zones |
| `world/wall-index.js` | Fast wall lookup grid |
| `world/vehicles.js` | Vehicle drawing and walk-behind handling |

### Map Workshop (`src/js/editor/`)

| File | What's in it |
|---|---|
| `editor/assets.js` | The prop browser: names and categories for OB props and HWV vehicles, sprite and thumbnail cache |
| `editor/history.js` | The one undo/redo history |
| `editor/editor-view.js` | Drawing the editor: cached terrain chunks, props, walls, spawns, overlays, minimap, map thumbnails |
| `editor/editor.js` | The editor: layout, panels, tools, mouse and keys, save, resize, playtest options |
| `editor/playtest.js` | Playtest with the real game, keeping nothing it earns |
| `editor/workshop.js` | The Map Workshop screen: list, new, open, rename, duplicate, delete, import / export, unsaved-changes recovery |

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
