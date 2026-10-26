# Zombdash map files (format version 3)

A Zombdash map is one JSON file. The Map Workshop writes it (**export**), reads it (**IMPORT**), and the game plays it. Anything that writes this JSON makes a map, so a chat can build a map by writing the file directly. This page lists everything a file can hold, with examples.

**Checklist for writing a map by hand**
1. Write the JSON (start from the [complete example](#a-complete-example) below).
2. Check it: `node tools/build.js` once, then `node tools/check-map.js mymap.json`. Fix every error; read the warnings.
3. Look at it: import it in the Workshop (**IMPORT**), or render it the way the tests do.
4. To ship it with the game: put it in `src/maps/` and embed it with `{{json:maps/<file>.json}}` in a module (see `src/js/editor/samples.js`, which ships `src/maps/samples/town-block.zombdash-map.json` as a Workshop sample). A built-in map converted to a file is embedded in `BIMF` in `src/js/world/builtin-maps.js` (the Suburb is `src/maps/suburb.json`: a real, full-size example of the format).

## Basics

* **Units.** Positions and sizes are pixels. The map's top-left corner is `0,0`; x grows to the right, y grows down. Tiles are 32px, so a map of `width` × `height` tiles is `width*32` × `height*32` pixels. Turns (`rot`) are degrees, clockwise.
* **Size.** 20×15 up to 128×128 tiles.
* **Where things stand.** A prop's `x`,`y` is the middle of its base (where it touches the ground); taller pictures rise above that point. A vehicle's `x`,`y` is its centre. Walls, areas, zones and rectangle features are boxes: `x`,`y` is the top-left corner, `w`,`h` the size. Paths are lists of points.
* **Ids** are optional; the game adds them. Ids must be unique within the file (duplicates are renamed).
* **Unknown things are kept.** A kind the game doesn't know (a prop from a newer version, say) loads with a warning, isn't shown, and is written back unchanged. Unknown top-level fields are kept too.
* **Mistakes are refused.** A file with errors (a short terrain row, a path with one point, a box with no size…) is refused with a list of what is wrong, naming the entry (`"areas[3]" needs "kind", "x", "y" and a positive "w" and "h"`).
* **Versions.** Version 1 (step 1) and 2 (step 2) files load as version 3 (`CMMIG` in `world/map-schema.js`): version 2 → 3 only adds the three new layers. Saving writes version 3. A file from a newer game version is refused with a clear message.

## The top level

| Field | What it is |
|---|---|
| `format` | Always `"zombdash-map"`. |
| `version` | `3`. |
| `id`, `name`, `description` | The map's id (keeps its records and leaderboard together), name (up to 40 characters) and description (up to 240). |
| `tileSize` | `32`. |
| `width`, `height` | Size in tiles. |
| `ground` | The terrain everywhere `terrain` doesn't say otherwise (default `grass`). |
| `terrain`, `roads`, `overlay` | Tile grids (below). All optional. |
| `layers` | The layers, bottom to top. Optional: left out, you get the 11 default layers. |
| `props`, `vehicles`, `walls` | Things from the step 1–2 format. |
| `decals`, `effects`, `areas`, `paths`, `features` | The building kit (version 3). |
| `lighting` | Time of day: `{"time": "day" \| "morning" \| "dusk" \| "night", "amount": 0–1}` ([below](#time-of-day-lighting)). Left out: the map looks as painted. |
| `playerStart` | `{"x","y"}` where the run starts. Left out: the middle of the map (and the editor lists it as a problem). |
| `zombieSpawns` | `{"points":[{"x","y","enabled"}], "zones":[{"x","y","w","h","enabled"}]}`. With none, zombies come from off-screen as on the built-in maps. Spawns inside a no-spawn feature are skipped. |
| `created`, `updated` | ISO dates, written by the editor. |

## Tile grids: `terrain`, `roads`, `overlay`

```json
"terrain": { "legend": { "g": "grass", "a": "asphalt", "w": "water" },
             "rows": ["gggggaaaaa…", "…"] }
```
`rows` has `height` strings of `width` characters; each character is a key of `legend`. `roads` is a second tile layer over the terrain, and `overlay` holds blood, burn and road markings; in both, `.` means nothing there.

* **Terrain** (`CMTER`): `grass dirt asphalt concrete sidewalk sand gravel mud water wood tile soil`, carpet `carpet_grey carpet_dkgrey carpet_tan carpet_black carpet_red carpet_green carpet_blue`, and the kit terrains `grass_dark grass_dry grass_olive grass_park grass_school forest moss leaves lot asphalt_dark asphalt_worn runway cobble pavers brick_pave slabs rubber_blue rubber_red terrazzo plank_dark boards checker checker_red marble linoleum metal tile_blue tile_green tile_white charred hay water_deep pool`.
  * `water`, `water_deep` and `pool` block walking; bullets fly over them. Water draws a shoreline (wet sand on natural ground, a stone lip on paving) where it meets other ground.
  * Sidewalk-like terrains (`sidewalk`, `slabs`, `pavers`, `brick_pave`) draw a curb where they meet a road terrain (`asphalt`, `asphalt_dark`, `asphalt_worn`, `cobble`, `runway`), so painted streets get curbs that join up by themselves.
* **Overlays:** `blood burn`, and road markings `yline ydash wline wdash xwalk` (a marking joins up with the same marking on the next tile).

Tiles are best for big ground areas. For shapes that don't follow the grid (curved roads, ponds, parking lots, floors that don't line up with tiles) use [areas](#areas) and [paths](#paths).

## Layers

The defaults, bottom to top (`CMLAY`):

| id | Name | What goes there by default |
|---|---|---|
| `terrain` | Terrain | tiles |
| `roads` | Roads & paths | tiles |
| `ground` | Ground detail | decals, floor / ground / porch areas, roads, trails and shapes (paths that aren't fences) |
| `buildings` | Buildings | roofs, the stadium, the skyline; building props |
| `walls` | Walls & collision | walls, fence paths |
| `env` | Environmental props | outdoor props |
| `interior` | Interior props | furniture, kitchen, bath, shop props |
| `vehicles` | Vehicles | vehicles |
| `effects` | Effects & lights | effects, fog and darkness areas |
| `spawns` | Zombie spawns | spawn points and zones |
| `features` | Special features | special features (never drawn in the game) |

Leave out `layer` on a thing and it goes on the layer of its kind (`cmKindLy`). A file that lists `layers` must list every layer it uses; a thing on an unlisted layer gets a new layer of that id, with a warning. Layer entries: `{"id","name","kind":"tiles"|"objects","locked","editorHidden"}` (`tiles` only for `terrain` and `roads`).

**Draw order** (`cmDrawList`, the same in the editor and the game): by layer, then `order`, then a fixed stack for kit pieces of the same layer and order (darkness, then floors, rugs, decals, props, effects), then how far down the map a thing stands (lower things in front), then file order.

## Fields every thing can have

| Field | Meaning |
|---|---|
| `id` | Optional unique id. |
| `layer` | An object layer's id. Left out: the layer of its kind. |
| `order` | Draw order within the layer (higher is on top). |
| `solid` | `true`/`false` overrides the default (props with a base size, vehicles, walls, solid areas and fence paths are solid). Decals and effects are never solid. |
| `shape` | Props and vehicles only: a collision shape instead of the picture's, `{"type":"rect","x","y","w","h"}` or `{"type":"circle","x","y","r"}`, offsets from its `x`,`y`. |
| `locked`, `editorHidden` | Editor-only: can't be moved / hidden in the editor. The game always draws everything. |

## Props

```json
{ "kind": "sofa3", "x": 240, "y": 360, "rot": 0, "color": "#4a5a7a" }
{ "kind": "storesign", "x": 600, "y": 300, "text": "HOMETOWN MARKET" }
```
* `kind` is a key of `OB`. The editor's prop browser lists every one with its name and category (`EDPN` in `editor/assets.js`); `tests/suites/building-kit.js` checks that every prop the 16 built-in maps place is there.
* `color` (`#rrggbb`) for props that come in colours (69 of them; the editor shows swatches). Left out, the first colour.
* `text` for props that show words; `|` starts a second line. Props with text, with their length limit and default: `signboard` (22, "SIGN"), `hwsign` (30, "EXIT 13|GRAVEYARD"), `dirsign` (30, "ZOMBDASH SCHOOL|1 MILE", the second line gets an arrow), `billboard` (40, "VISIT|ZOMBVILLE"), `arrowsign` (30, "MANSION|CITY", one line per arrow), `streetsign` (16, "MAIN ST"), `pricesign` (14, "GAS & GO"), `awning` (24, "SHOP"), `storesign` (24), `aislesign` (10), `deptsign` (20), `nameplate` (26, "CITY HALL"), `archway` (40, "ZOMBDASH|CAMPGROUND"), `gatearch` (24, "REST IN PEACE").
* `var` (0–1) picks one of a prop's small random variations (left out: chosen from its position).
* **Kit props** (`maps/props/kit-props.js`) are things the built-in maps used to draw in their own code: signs (above), `stopsign`, `portrait` (its eyes follow the nearest player in the game; the colour picks the painting: lady, gentleman, bride, ghoul, landscape or slashed), `chandelier` (fallen), `deadtwist`, `canopytree`, `blackpine`, `jet`, `planebody`, `planetail`, `planewing`, `heliwreck`, `container`, `boomgate`, `campring`, `coffin`, `opengrave`, `dirtpile`, `officedesk`, `chalkb`, `cubby`, `wclock`, `poster`, `lockrow`, `stalls`, `showers`, `cafeteria`, `acunit`, `wtank`, `fireesc`, `elevator`, `micro`, `coffeetable`, `garageshelf`, `tpole`, `bollard`.
* **The Suburb's pieces** (also kit props): `foak` / `fpine` forest trees (their `var` picks the size and shade: `var = (size step × 3 + shade) / 100`, oak sizes 0–12, pine 0–11, shade 0–2; the trunk is see-through like a fence, so bullets fly through the woods), `ytree` yard tree, `ftrunk` fallen tree (`var = (length step 0–10 × 9 + leaf pattern 0–8) / 100`), `sstump` splintered stump, `smallcar` small crashed car (*colour*; its base is the middle of its back edge), `chopper` crashed helicopter (solid body), `dirsign` direction sign, `hplant` house plant seen from above, `flamp` floor lamp seen from above (gives light at night), `curtain` curtains for a window (*colour*).
* **The Warehouse's pieces:** `wcont` small shipping container (*colour*), `guardbooth`, `lotgate` gate post with a short arm reaching left, `deskpc` desk with a computer, `ochair` office chair from above, `fcab` grey filing cabinet, `sinkrow` washroom counter with two sinks (`var` ≥ 0.5 puts the mirror on the left), `wc` toilet from above, `lockstrip` five lockers from above (`var` ≥ 0.5: wider, shallower lockers), `exitsign` green exit light, `dirsign2` direction sign with the arrow on the left (30, "HIGHWAY|ENTRANCE"), `firebarrel` burning barrel from above, `btable` break-room table.
* **The School's pieces:** `stall` toilet stall divider (4×56, solid; turn it 90° to run left–right; *colour*), `banner` wall banner with words (24, "HOME OF THE ZOMBIES"; *colour*), `wcsign` restroom sign over a door (*colour*: boys, girls, all), `sclock` small wall clock seen from above; plus the areas `lockers`, `board`, `cubbies`, `counter`, `kline`, `plaza`, `walkway`, `sandlot` and the decals `crest`, `lawnbit` (below).
* **Lights** (the Lights group in the prop browser): `spotlight`, `floodlight` (pole with two lamps), `floodtower` (light tower), `walllight`, `worklight` (tripod), `searchlight`, `ceillight` (ceiling light, seen from above; glows all round); plus `lamp`, `plight`, `flamp`, `lantern`, `exitsign`, `firebarrel`. Their *colour* is the light's colour. Spot lights, flood lights and the others in the first list shine a **beam**: turned 0 it points down the screen, and `rot` aims it. Poles, towers, tripods and the searchlight keep standing when turned (only the beam turns). Each beam starts at its lamp (the lamps at the top of a pole, tower or tripod). Walls stop light, beams included. Beams light the ground at dusk and night ([lighting](#time-of-day-lighting)); the editor draws a selected light's beams as a dashed outline.
* **Doorways stay clear:** the checker and the editor's Problems list warn about any prop or vehicle within 24 px of a doorway (a gap of 20–140 px between walls in line, or a doorway / automatic door / roll-up piece): solid ones by their collision, others by their base. Awnings, wall lights, exit lights and curtains belong at doors and are left out.
* **Walk-behind:** tall props (trees, lamps, signs, poles, shelves, the big vehicles…) are drawn in front of a player who walks behind them, as on the built-in maps.
* Store features use `gshelf` (grocery shelves that Penny knocks over), `corral` and `cartrow` (cart corrals she sends carts from). Street trees `stree` stop the Fire Chief's hose.

## Vehicles

```json
{ "kind": "police", "x": 640, "y": 480, "rot": 90, "color": "#26262c", "damaged": true }
{ "kind": "ftruck", "x": 300, "y": 900, "rot": 0, "text": "TACO LOCO" }
```
`kind`: `hatch sedan suv pickup van limo police amb fire bus semi cab trailer hmv mtruck taxi ftruck` (`hatch` is the parked car of the Warehouse and Neighborhood lots, 88×36). `color2` is the stripe colour of a `trailer` or `semi` (`"none"`: no stripe; left out: picked from its place). `rot` turns it (at 0 it lies left to right). `color` repaints cars; `damaged` dents and cracks them. `text` (up to 16) is the name on a `trailer`'s or food truck's (`ftruck`) roof. Vehicles are solid along their real outline and people walk behind them.

## Walls

```json
{ "x": 157, "y": 157, "w": 326, "h": 6, "style": "siding", "color": "#8fb4d8" }
```
A wall is a box. Building walls on the built-in maps are 6px thick, centred on the room's edge (see [recipes](#recipes)).

| Style | Behaviour |
|---|---|
| `wall` `brick` `concrete` `wood` `plank` `metal` `siding` `stone` `barricade` `soundwall` | Solid, stop bullets. `plank` and `siding` take a `color`. |
| `window` `window_b` (boarded) `window_x` (broken) `glass` (storefront) | Solid and stop bullets, like the windows on the built-in maps (`window` takes a trim `color`). |
| `garage` | A closed garage door: solid (takes a `color`). |
| `door` (threshold) `autodoor` (automatic doors) `rollup` (open roll-up door) | Openings you walk through: not solid. `rollup` takes a `color`. |
| `fence` `ironfence` `picketwall` `wirewall` `bars` (cell bars) | Block walking, bullets pass (see-through). |
| `hedgewall` | Blocks walking and bullets, you can't see through. |
| `hidden` | An invisible blocker. |

A wall with an opening is three walls: the wall on each side and the opening between them (the editor's Opening tool does this split for you).

## Decals

Flat pictures on the ground: never solid, drawn under props.
```json
{ "kind": "skid", "x": 470, "y": 596, "rot": 12, "scale": 1.3, "opacity": 0.8 }
{ "kind": "text", "x": 300, "y": 644, "text": "SLOW", "color": "#ffffff" }
```
Fields: `kind`, `x`,`y` (the centre), `rot`, `scale` (0.25–4), `opacity` (0.05–1), `color` (decals marked *colour*), `text` (decals marked *text*), `options` (decals that have options: the dead zombie), `var` (0–1, a variation).

| Group | Decals (size in px at scale 1) |
|---|---|
| Wear & tear | `lotspeck` 52×6 (a lot bit: `var` < 0.35 a dark streak, longer with a bigger `var`; < 0.7 a grey chip; else a yellow paint chip), `crack` 70×30, `crack_big` 90×70, `crack_grass` 70×34, `oil` 60×34, `stain` 50×30, `patch` 60×40, `pothole` 46×30, `manhole` 26×26, `drain` 30×14, `puddle` 64×32 |
| Crash & fire | `skid` 120×26, `scorch` 100×60, `scorchround` 300×300 (round scorched ground), `glass` 54×40, `debris` 80×50, `tiremarks` 110×20, `ash` 70×44 |
| Blood (all *colour*: `#7a1414` fresh red, `#560c12` dark red, `#4e2e1c` dried brown, `#4e6a1e` zombie green, `#26201c` black ooze; any `#rrggbb` works) | `blood` 44×34 splat, `bloodpool` 70×40, `bloodtrail` 120×24, `handprint` 44×30, `bloodspray` 84×40 (a spray from the left end), `bloodsmear` 76×32, `blooddrips` 54×40, `bloodsplash` 96×74 (big splatter), `bloodfoot` 124×30 (bloody footprints), `bloodcrawl` 124×40 (crawl marks with handprints) |
| Bodies & body parts | `deadz` 68×48 dead zombie *colour* (the blood pool), `zarm` 48×20 severed arm, `zhand` 22×16 hand, `zhead` 28×28 head (arm, hand and head: *colour* = skin: `#7aa85a` zombie green, `#a8b86a` pale green, `#9aa0a0` grey, `#c89a7a` human, `#7a6a9a` bruised), `zleg` 58×22 leg (*colour* = trousers), `ztorso` 46×38 torso (*colour* = shirt), `guts` 58×34 (*colour* = blood), `bones` 58×36, `skull` 22×22, `ribcage` 38×30, `sheetbody` 70×30 covered body, `bodybag` 70×26 |
| Nature | `speck` 10×10 (one grass bit: `var` < 0.4 a flower, its colour from the first decimal; < 0.7 a tuft; else a pebble), `lawnbit` 10×8 (the School's: `var` < 0.4 a tuft, < 0.7 a paper scrap, else a twig), `leaves` 70×50 *colour*, `twigs` 56×36, `moss` 60×40, `wildflowers` 54×34, `grasspatch` 44×26, `mud` 60×36, `dirtpatch` 80×44, `lily` 50×34, `rocks` 50×30 |
| Paint & markings | `text` 160×28 *colour, text 24*, `arrow` 70×26 *colour*, `arrow_turn` 50×60 *colour*, `stopline` 80×8 *colour*, `handicap` 46×88, `hazard` 100×12, `safety` 120×6 *colour*, `number` 30×30 *colour, text 4*, `graffiti` 70×30 *colour, text 12*, `crest` 84×84 school crest (*text 2*, the letter; option `sm` 0/1 the school's name under it) |
| Shadows & light | `shadow` 70×34, `treeshadow` 90×50, `lightpatch` 60×44 *colour*, `stainedglass` 50×40 |
| Spooky | `chalk` 124×124 (chalk circle), `scrawl` 140×24 *colour, text 20*, `cobweb` 32×32, `footprints` 90×22 *colour* |
| Litter & other | `paper` 50×34, `bullets` 40×30, `drag` 110×20, `mat` 36×16 *colour, text 8* (door mat), `threshold` 52×8 |

**The dead zombie** (`deadz`) is a real zombie from the game, lying down. Its `options`: `z` which zombie, `"0"` walker, `"1"` runner, `"2"` brute, `"3"` lab coat, `"4"` big blue, `"5"` little blue, `"9"` bones, `"10"` toxic, `"11"` spitter, `"18"` exploder, `"19"` healer (default `"0"`); `pool` 0/1 a pool of blood under it (1); `flip` 0/1 mirrored (0). Turn it with `rot` so it lies any way.
```json
{ "kind": "deadz", "x": 1172, "y": 846, "rot": 12, "color": "#560c12", "options": { "z": "11", "pool": 1 } }
{ "kind": "zarm", "x": 1240, "y": 852, "rot": 40, "color": "#a8b86a" }
```

## Effects

Animated or lit things, drawn by the game every frame (the editor shows a still frame).
```json
{ "kind": "siren", "x": 520, "y": 300, "options": { "m": "police" } }
{ "kind": "flicker", "x": 240, "y": 190, "color": "#c8e0ff", "size": 0.8, "options": { "flame": 0 } }
```
Fields: `kind`, `x`,`y`, `rot` (degrees: everything the effect draws turns with it, so hazard blinkers and sirens line up with a turned vehicle; a turned siren's two lamps light the ground where they are), `size` (0.25–4), `color` (where noted), `options`.

| Kind | What it does | Options |
|---|---|---|
| `fountain` | Animated fountain spray and ripples (put it on a `fntn` prop) | |
| `water` | Glints moving on water | |
| `fire` | Flames with a warm glow (burning wrecks, barrels, campfires) | `glow` 0/1 |
| `smoke` | A smoke point: the game's smoke plume (`SM`), as on the built-in maps | |
| `flicker` | A flickering light pool (candles, fireplaces, bad lamps), *colour* | `flame` 0/1 (a little flame) |
| `light` | A still light pool (street lamps), *colour*; baked into the ground | |
| `siren` | Flashing emergency lights | `m`: `police`, `amb`, `fire` |
| `hazard` | Hazard blinkers | |
| `flare` | A burning road flare | |
| `glow` | A glowing pulse (mushrooms, crystals), *colour* | |
| `wisp` | Will-o'-wisps floating above the players, *colour* | |
| `ducks` | Ducks paddling about (on ponds) | |

## Areas

Boxes with a size: floors, porches, parking stalls, roofs on solid buildings, effect zones.
```json
{ "kind": "floor", "x": 160, "y": 160, "w": 320, "h": 224, "color": "#9a6a3c", "options": { "pt": "plank", "in": 1 } }
{ "kind": "roof", "x": 900, "y": 100, "w": 300, "h": 220, "text": "CITY HALL", "options": { "s": "slate", "dome": 1 } }
```
Fields: `kind`, `x`,`y`,`w`,`h`, `color`, `color2` (the second colour, e.g. a checker floor's other squares, a rug's border), `text`, `options`. Areas are not solid unless the table says so. Each kind has a smallest size (the checker warns below it).

| Kind | What it is | Options (defaults) |
|---|---|---|
| `floor` | A room floor, *colour + colour2* (as small as 4×4, for wallpaper borders and strips) | `pt` pattern: `check tile plank board carpet marble plain concrete terrazzo metal charred` (check); `vert` 0/1 planks run up-down; `in` 0/1 indoor (1): indoor floors count as building interiors for the bosses |
| `rug` | A rug with a border, *colour + colour2* | `pat` 0/1 pattern, `fringe` 0/1 |
| `rugr` | A round rug, *colour + colour2* | |
| `porch` | Porch / deck boards, *colour* | `posts` 0/1 |
| `steps` | Steps, *colour + colour2* | `dir` `n s w e` (which way is up), `runner` 0/1 |
| `dock`, `bridge` | Boards you can walk on over water: water tiles under them are dry and ponds / streams are cut away, *colour* | |
| `pool` | A swimming pool with a coping: solid, as on Main Street, *colour + colour2*, min 40×40 | |
| `canopy` | A gas station canopy you walk under, *colour*, `text` (24), min 60×60 | |
| `paving` | A paved patch | `s` `asphalt concrete slabs gravel dirt sand grass turf` (turf: a dark lawn); `cracks` 0/1; `curb` 0/1 |
| `parking` | Parking stall lines, *colour*, min 40×40 | `rows` `auto 1 2`; `sw` stall width 36–80 (50); `num` 0/1 numbers |
| `junction` | A road crossing with zebra crosswalks and stop lines (put it where two roads cross), min 60×60 | `cn ce cs cw` 0/1 crosswalk on each side; `stop` 0/1; `s` `asphalt dark` |
| `zebra` | A crosswalk, *colour* | |
| `hazardband` | Yellow and black hazard stripes | `st` `diag blocks` (diag: slanted stripes; blocks: squares along the band, as at the Warehouse's doors) |
| `court` | A basketball court, *colour* (lines), min 120×80 | `s` `none asphalt wood blue` |
| `helipad` | A helipad, min 60×60 | |
| `sandbox`, `splash` (splash pad with animated jets), `garden` (crop bed) | Park and yard ground | |
| `roof` | A roof on a solid building block (solid; blocks bullets), *colour + colour2*, `text` (30, a name plate) | `s` `flat tower brick shingle slate metal`; `det` 0/1 rooftop detail (AC units, tanks, window lights on towers); `dome` 0/1 clock dome; `pad` 0/1 helipad; `cross` 0/1 red cross (clinic) |
| `stadium` | The stadium: a solid ellipse with seats, field and scoreboard, *colour + colour2*, `text` (24), min 300×200 | `dome` 0/1 |
| `skyline` | A city skyline backdrop behind a blocked band (see-through blocker), min 100×60 | `wall` `concrete hedge`; `graf` 0/1 graffiti |
| `fog` | Drifting fog over everything in the box (game only; the editor shows a tinted box), *colour* | `s` strength 0.3–3 |
| `lockers` | Lockers along a wall, seen from above (one every 14 px; a box wider than tall runs left–right), *colour* | |
| `board` | A board or poster on a wall: chalkboard, whiteboard, cork board or a poster colour (*colour*) | `marks` 0/1 (1) writing on it |
| `cubbies` | A cubby shelf on a wall: 12 px cubbies with coloured bags | |
| `counter` | A counter seen from above (solid), *colour* (grey, wood, white, steel) | `st` `plain sinks towels` (plain) |
| `kline` | A kitchen line: ovens and steam tables in a row, one every 60 px | |
| `plaza` | A round plaza: paver rings and spokes, a stone border and a ring of grass, *colour* (min 80×80) | `beds` 0/1 (1) four flower beds |
| `walkway` | A paver walkway with a stone edge, *colour* | |
| `sandlot` | Playground sand whose edge breaks up into the grass (up to 46 px past the box) | `tufts` 0/1 (1) grass tufts inside the edge |
| `roomlight` | Room lights: at dusk and night the whole box is lit evenly, as if every light in the room is on, with a soft spill past its edges; paints nothing by day. *colour* (warm white, cool white, fluorescent, dim yellow) | `s` brightness 0.3–1.5 (1) |
| `dark` | Darkness over the box (a dark interior), *colour* | `s` 0.05–0.8 (0.25) |
| `shade` | Canopy shade under trees | |
| `mowed` | Light mowing stripes over a lawn (20 px stripes every 40 px), min 40×40 | |

Walk-in buildings never get a roof (the player has to see inside): put `roof` areas only on solid blocks, as the built-in maps do.

## Paths

Lines through points: roads, trails, fences, ponds. Coordinates are absolute map pixels.
```json
{ "kind": "road", "points": [[0, 608], [600, 608], [900, 700]], "width": 128, "options": { "cl": "double", "lanes": 2 } }
{ "kind": "picket", "points": [[128, 448], [128, 128], [512, 128], [512, 448]], "color": "#f8f6ee" }
{ "kind": "pond", "points": [[960, 160], [1120, 140], [1190, 250], [1060, 330], [950, 260]] }
```
Fields: `kind`, `points` (2–400 `[x, y]`; shapes need 3), `width`, `color`, `sharp` (`true` straight corners, `false` a smooth curve through the points; fences and lines are sharp by default, everything else curves), `options`.

| Kind | What it is | Width (default, usual range) | Options (defaults) |
|---|---|---|---|
| `road` | A road with curbs and centre lines | 128, 40–360 | `cl` centre line `dash double solid white none` (dash); `lanes` 1–4 per side; `edge` 0/1 white edge lines; `curb` 0/1 (1); `ends` `flat round both` (round = a cul-de-sac / dead end); `s` `asphalt dark worn` |
| `highway` | Highway lanes or a ramp, with rumble strips | 204, 84–420 | `lanes` 1–6 (3); `rumble` 0/1 |
| `cobble` | A cobbled road | 120, 40–240 | |
| `trail` | A dirt trail, *colour* | 30, 10–120 | |
| `gravelpath` | A gravel path | 34, 12–120 | |
| `walk` | A sidewalk / front walk with slab joints, *colour* | 40, 16–140 | |
| `boardwalk` | Boards, *colour* | 44, 16–140 | `rail` 0/1 |
| `rails` | A railroad track | 60, 40–90 | |
| `stream` | A stream (blocks walking, bullets fly over) | 60, 20–200 | |
| `line` | A painted line, *colour* | 4, 2–16 | `st` `solid dash double` |
| `skid`, `ruts` | Long skid marks, wheel ruts | 14, 40 | |
| `bloodline` | A blood trail along the points (a smear with drops along it), *colour* (the blood colours) | 10, 3–40 | |
| `chain` `iron` `picket` `woodfence` `wire` `guardrail` `median` | Fences and rails: block walking, bullets pass. `picket` and `woodfence` take a *colour* | 6 (median 20) | |
| `hedge` | A hedge, *colour*: blocks walking and bullets | 18, 10–40 | |
| `sandbags`, `stonewall` | Low walls: block walking and bullets | 14 | |
| `brickwall` | A curving brick wall: solid | 10, 6–30 | |
| `pond` | A pond / lake with a shore (blocks walking, bullets fly over) | | `lily` 0/1, `reeds` 0/1 |
| `beach` `clearing` `mosspatch` `dirtpatch` `gravelpatch` `asphaltpatch` `flowerbed` | Ground patches of any shape (`asphaltpatch` has `curb` 0/1) | | |

Roads join up where they overlap; put a `junction` area over a crossing for crosswalks and stop lines. For a T, end one road at the edge of the other.

## Time of day (lighting)
```json
"lighting": { "time": "night", "amount": 0.75 }
```
The game draws the light over the whole world every frame, so a map can be played in the morning, by day, at dusk or at night. `amount` (0–1) is how strong it is: 0 looks exactly as painted. The editor's Map panel (nothing selected) has the same choice and an **Amount** slider that changes the view live.

| `time` | Look | Default amount |
|---|---|---|
| `day` | Bright midday sun; more adds warm sunlight | 0.5 |
| `morning` | Soft, warm early light with a haze; lights show a little | 0.6 |
| `dusk` | Orange-pink evening light; lights glow | 0.7 |
| `night` | Dark blue; only lights light the ground | 0.75 |

* **What gives light** (more the darker it is): `light` effects (light pools), `flicker` (flickers), `fire`, `flare`, `glow` and `wisp` effects, `siren` (the two lamps take turns, in their colours), `hazard` (blinks), `lightpatch` decals (lit windows), and the props `lamp` (street lamp), `plight` (lot light), `candle`, `lantern`, `bfplace` (fireplace), `flamp` (floor lamp), `exitsign`, `firebarrel`, the beam lights (`spotlight`, `floodlight`, `floodtower`, `walllight`, `worklight`, `searchlight`), `ceillight`, `roomlight` areas (a whole room with the lights on) and `tlight` (traffic light, a little). Every player carries a soft light, so night maps stay playable; burning ground and fireballs light up too.
* **What stops light:** solid walls (every wall style except windows, storefront glass, fences, cell bars, hedges and invisible blockers) and roofs (solid buildings). A light lights only what it can see past them, so a lamp beside a building doesn't light the inside and a wall throws a shadow; light gets out of a room through its doorways and windows. A light fixed on a wall (a wall light, an exit sign) isn't stopped by that wall. Players' lights are stopped by walls too.
* An unknown `time` loads with a warning and the map shows in daylight; `amount` is kept between 0 and 1.
* It is drawn after the world and before the HUD; floating texts stay readable on top. Without multiply blending (very old browsers) the map shows as painted.

## Special features

Map systems the game reads. They are never drawn in the game; the editor shows them as tinted boxes or lines you can move and resize.
```json
{ "kind": "store", "x": 1248, "y": 224, "w": 512, "h": 380 }
{ "kind": "roadgraph", "nodes": [[0, 608], [832, 608], [1280, 608]], "edges": [[0, 1], [1, 2]] }
```

| Kind | What the game does with it |
|---|---|
| `nospawn` (box) | Zombies never appear inside it: zombies coming from off-screen keep out of the first one (`HS.nx0…`) and of every one with `skip` on (a zone touching the map's edge also covers the strip just outside it, where they start), and spawn points or zones inside a `skip` zone are skipped; all of them with `nogo` on go into `NOGO`. Options: `skip` 0/1 (1) skip spawn points and zones inside it; `nogo` 0/1 (1) bosses don't land inside it. The Suburb uses `skip: 0, nogo: 0`: its box only stops zombies coming from off-screen. The School covers its woods with `skip: 1, nogo: 0` zones. |
| `menuview` (box) | Where the camera looks while the map is shown behind the menus (the middle of the box, `HS.cx`/`HS.cy`). |
| `house` (box) | A building interior (`HS.HO`): bosses that look for players inside buildings check these. Indoor `floor` areas count too, so you rarely need this. |
| `store` (box) | Penny's store (`HS.ST`): the `gshelf` props inside it are the shelves she knocks over (`HS.SHF`); every `corral` / `cartrow` prop on the map sends carts (`HS.CRL`). |
| `cityhall` (box) | City Hall's roof (`HS.CH`): the Mayor stands at the top middle. |
| `roadgraph` (`nodes`, `edges`) | The boss road graph (`HS.RG`): where the ice cream truck, the fire engine and the police cruiser can drive. Nodes are map points, edges are pairs of node numbers. The editor's **Build road graph from roads** button (Markers tab) makes one from the map's roads. |

Bosses that need these (the Ice Cream Man, the Fire Chief, Penny, the Mayor) still can't be picked for custom maps in the campaign; the features are there for the step 4 conversions of the maps they belong to.

## Collision at a glance

| Blocks walking and bullets | Blocks walking, bullets pass | Walk through |
|---|---|---|
| Walls (incl. windows, storefront glass, closed garage doors), solid props, vehicles, roofs, the stadium, pools, hedges, low stone walls, sandbags, brick walls | Water tiles, ponds, streams, fences, rails, cell bars, the skyline band | Doorways, automatic doors, open roll-up doors, floors, rugs, porches, docks and bridges, decals, effects, roads and every other path |

## Recipes

**A room.** For a floor box `x,y,w,h` and 6px walls: north `{x-3, y-3, w+6, 6}`, south `{x-3, y+h-3, w+6, 6}`, west `{x-3, y+3, 6, h-6}`, east `{x+w-3, y+3, 6, h-6}`. Doorways are 44px (`door`), garage doors 72–80, windows 40.
```json
{ "kind": "floor", "x": 160, "y": 160, "w": 320, "h": 224, "color": "#9a6a3c", "options": { "pt": "plank", "in": 1 } }
{ "x": 157, "y": 157, "w": 326, "h": 6, "style": "siding" }
{ "x": 157, "y": 381, "w": 143, "h": 6, "style": "siding" },
{ "x": 300, "y": 381, "w": 44,  "h": 6, "style": "door" },
{ "x": 344, "y": 381, "w": 139, "h": 6, "style": "siding" }
{ "x": 157, "y": 163, "w": 6, "h": 218, "style": "siding" }
{ "x": 477, "y": 163, "w": 6, "h": 218, "style": "siding" }
```
**A shop.** `brick` walls, a `glass` front with `autodoor` in the middle, a `tile` floor, `gshelf` rows, `checkout`, `fridge`, an `awning` prop with the shop's name in front, a `store` feature over it if Penny's attacks should work there.

**A crossroads.** Two `road` paths that cross, a `junction` area on the crossing (as big as the road is wide), `sidewalk` road tiles (or `walk` paths) along both, `tlight` / `stopsign` / `streetsign` props on the corners, a `roadgraph` feature if a truck boss should drive there.

**A parking lot.** A `paving` area (`curb` on), a `parking` area inside it, cars with `rot` 90 or 270 in the stalls, `plight` lamps with `light` effects, `oil` decals, `cart` props.

**A crash.** Vehicles with `damaged`, turned across the road; `skid` decals behind them, `glass` and `debris` around, a `fire` and a `smoke` effect on one, a `siren` on a police car, `cone` props.

**A spooky interior.** A `dark` area over the room, `flicker` effects (with `flame`) by the candles, `cobweb` and `blood` decals, a `fog` area outside; or the whole map at `night`.

**An aftermath.** `deadz` decals of different zombie kinds (turned, some mirrored, some without their pool), `zarm` / `zleg` / `zhead` / `guts` near them, a `bloodline` path where one was dragged, `bloodspray` and `bloodsplash` around them, `bloodfoot` leading away; a `sheetbody` or `bodybag` by a `siren` police car.

## A complete example

Checked by `tests/suites/building-kit.js` (it must load with no problems), so it stays correct.

<!-- example map: start -->
```json
{
  "format": "zombdash-map", "version": 3,
  "name": "Corner Lot", "description": "A house by a crossroads, a little parking lot and a pond.",
  "tileSize": 32, "width": 40, "height": 30, "ground": "grass",
  "roads": { "legend": { "s": "sidewalk" }, "rows": [
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    "ssssssssssssssssssssssssssssssssssssssss",
    "........................................",
    "........................................",
    "........................................",
    "........................................",
    "ssssssssssssssssssssssssssssssssssssssss",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s...........",
    ".......................s....s..........."] },
  "areas": [
    { "kind": "floor", "x": 160, "y": 160, "w": 320, "h": 224, "color": "#9a6a3c", "options": { "pt": "plank", "in": 1 } },
    { "kind": "floor", "x": 320, "y": 160, "w": 160, "h": 112, "color": "#e8e8e4", "color2": "#2a2c32", "options": { "pt": "check", "in": 1 } },
    { "kind": "rug", "x": 190, "y": 280, "w": 100, "h": 70 },
    { "kind": "porch", "x": 290, "y": 384, "w": 64, "h": 28 },
    { "kind": "junction", "x": 768, "y": 544, "w": 128, "h": 128 },
    { "kind": "paving", "x": 960, "y": 704, "w": 300, "h": 230, "options": { "s": "asphalt", "cracks": 1, "curb": 1 } },
    { "kind": "parking", "x": 975, "y": 720, "w": 270, "h": 190, "options": { "rows": "2", "sw": 54 } },
    { "kind": "dock", "x": 1050, "y": 236, "w": 36, "h": 84 }
  ],
  "walls": [
    { "x": 157, "y": 157, "w": 73, "h": 6, "style": "siding", "color": "#8fb4d8" },
    { "x": 230, "y": 157, "w": 40, "h": 6, "style": "window" },
    { "x": 270, "y": 157, "w": 213, "h": 6, "style": "siding", "color": "#8fb4d8" },
    { "x": 157, "y": 381, "w": 143, "h": 6, "style": "siding", "color": "#8fb4d8" },
    { "x": 300, "y": 381, "w": 44, "h": 6, "style": "door" },
    { "x": 344, "y": 381, "w": 139, "h": 6, "style": "siding", "color": "#8fb4d8" },
    { "x": 157, "y": 163, "w": 6, "h": 218, "style": "siding", "color": "#8fb4d8" },
    { "x": 477, "y": 163, "w": 6, "h": 77, "style": "siding", "color": "#8fb4d8" },
    { "x": 477, "y": 240, "w": 6, "h": 40, "style": "window" },
    { "x": 477, "y": 280, "w": 6, "h": 101, "style": "siding", "color": "#8fb4d8" },
    { "x": 317, "y": 163, "w": 6, "h": 27, "style": "wall" },
    { "x": 317, "y": 190, "w": 6, "h": 44, "style": "door" },
    { "x": 317, "y": 234, "w": 6, "h": 41, "style": "wall" },
    { "x": 323, "y": 269, "w": 154, "h": 6, "style": "wall" }
  ],
  "props": [
    { "kind": "sofa3", "x": 240, "y": 360, "color": "#4a5a7a" },
    { "kind": "coffeetable", "x": 240, "y": 318 },
    { "kind": "tvs_tv", "x": 240, "y": 196 },
    { "kind": "bookshelf", "x": 186, "y": 196 },
    { "kind": "kfridge", "x": 360, "y": 200 },
    { "kind": "kc_long", "x": 405, "y": 192 },
    { "kind": "kc_range", "x": 454, "y": 194 },
    { "kind": "ktable", "x": 410, "y": 252 },
    { "kind": "plant", "x": 466, "y": 372 },
    { "kind": "canopytree", "x": 600, "y": 230 },
    { "kind": "canopytree", "x": 90, "y": 470 },
    { "kind": "lamp", "x": 720, "y": 520 },
    { "kind": "streetsign", "x": 952, "y": 520, "text": "ELM ST" },
    { "kind": "stopsign", "x": 744, "y": 700 },
    { "kind": "awning", "x": 1110, "y": 700, "text": "PARKING", "color": "#2f6fd0" }
  ],
  "vehicles": [
    { "kind": "sedan", "x": 1002, "y": 766, "rot": 90, "color": "#c0392b" },
    { "kind": "pickup", "x": 1110, "y": 766, "rot": 90, "color": "#2f6fd0" },
    { "kind": "van", "x": 1164, "y": 864, "rot": 270, "color": "#d8d8d4" },
    { "kind": "sedan", "x": 560, "y": 608, "rot": 20, "color": "#2f8a4a", "damaged": true }
  ],
  "paths": [
    { "kind": "road", "points": [[0, 608], [1280, 608]], "width": 128 },
    { "kind": "road", "points": [[832, 0], [832, 960]], "width": 128 },
    { "kind": "walk", "points": [[322, 412], [322, 512]], "width": 32 },
    { "kind": "picket", "points": [[128, 448], [128, 128], [512, 128], [512, 448]] },
    { "kind": "pond", "points": [[960, 160], [1120, 140], [1190, 250], [1060, 330], [950, 260]] },
    { "kind": "trail", "points": [[560, 300], [650, 270], [740, 284]], "width": 26 }
  ],
  "decals": [
    { "kind": "mat", "x": 322, "y": 398, "text": "HOME" },
    { "kind": "skid", "x": 470, "y": 596, "rot": 12, "scale": 1.3 },
    { "kind": "scorch", "x": 560, "y": 622 },
    { "kind": "glass", "x": 600, "y": 630 },
    { "kind": "crack", "x": 200, "y": 580, "rot": 30 },
    { "kind": "oil", "x": 1060, "y": 860, "opacity": 0.7 },
    { "kind": "manhole", "x": 832, "y": 760 },
    { "kind": "leaves", "x": 610, "y": 250, "color": "#c8782a" },
    { "kind": "text", "x": 300, "y": 644, "text": "SLOW", "color": "#ffffff", "scale": 0.8 }
  ],
  "effects": [
    { "kind": "fire", "x": 560, "y": 604 },
    { "kind": "smoke", "x": 560, "y": 594 },
    { "kind": "light", "x": 720, "y": 500 },
    { "kind": "ducks", "x": 1100, "y": 210 },
    { "kind": "flicker", "x": 240, "y": 190, "options": { "flame": 0 }, "color": "#c8e0ff", "size": 0.8 }
  ],
  "features": [
    { "kind": "roadgraph", "nodes": [[0, 608], [832, 608], [1280, 608], [832, 0], [832, 960]], "edges": [[0, 1], [1, 2], [3, 1], [1, 4]] }
  ],
  "playerStart": { "x": 650, "y": 720 },
  "zombieSpawns": {
    "points": [ { "x": 16, "y": 608 }, { "x": 1264, "y": 608 }, { "x": 832, "y": 16 }, { "x": 832, "y": 944 } ],
    "zones": [ { "x": 40, "y": 700, "w": 300, "h": 200 } ]
  }
}
```
<!-- example map: end -->

## Checking a map: `tools/check-map.js`

```
node tools/check-map.js map.json [more.json …]   # a report per file
node tools/check-map.js --strict map.json        # warnings count as errors
node tools/check-map.js --json map.json          # the results as JSON
```
It runs the real game code from the built `index.html` (run `node tools/build.js` after changing `src/`), so it knows exactly the terrains, props, vehicles, wall styles and kit pieces the game knows. The exit code is 1 when a file has errors.

* **Errors:** the game would refuse the file (not JSON, wrong format, newer version, bad sizes, short rows, broken entries).
* **Warnings:** it loads, but something won't show or won't work: missing props / vehicles / terrain / kit pieces, a dead zombie kind that doesn't exist, `options` on decals that have none, a `lighting.amount` outside 0–1, the player start or a spawn inside something solid, spawns zombies can't walk from to the player, things outside the map, misspelt or out-of-range `options`, colours that aren't `#rrggbb`, `text` on things that show none or too long, areas smaller than their kind needs, odd path widths, `options` on decals, ids used twice.
* **Notes:** worth a look (e.g. a `color` on a prop that comes in one look).

## Prefabs

Prefabs are reusable groups for the editor (**Prefabs** tab). They are not part of map files: placing one adds ordinary things (walls, floors, props, decals…) with new ids, and nothing links them to the prefab afterwards.

* **The starter set** (`editor/prefab-starter.js`, 33 prefabs) is laid out after the built-in maps: rooms (`s_living` furnished living room, `s_kitchen`, `s_bedroom`, `s_bathroom`, `s_garage`, `s_office`, `s_diner`, `s_classroom`), buildings (`s_smallhouse`, `s_familyhouse`, `s_cornerstore`, `s_gasstation`, `s_cellblock`, `s_barracks`, `s_cabin`, `s_hangar`, `s_barn`, `s_cityhall` with the City Hall roof feature, `s_tower` skyscraper block), street (`s_carrow` parked car row, `s_crash` crash scene, `s_busstop`, `s_foodtrucks`, `s_checkpoint`), outdoors (`s_campsite`, `s_playground`, `s_picnic`, `s_fountain`, `s_pondspot`, `s_tentcamp` army tents) and spooky (`s_graveplot`, `s_mausoleum`, `s_chapel`).
* **Your prefabs** are kept on the device (IndexedDB, `kv` record `prefabs`), for every map.
* **Their shape** (in memory): `{id, n: name, cat: group, d: description, w, h, items: [{t, o}], tiles?}`. `t` is the kind of thing (`o` prop / vehicle / decal / effect, `w` wall, `a` area, `l` path, `f` feature, `s` spawn point, `z` spawn zone) and `o` the thing in the game's short form, positioned from the prefab's top-left corner: props `{k, x, y, r, c, tx}`, vehicles `{veh, x, y, r, c}`, decals `{dc, x, y, r, sc, op, c, tx}`, effects `{fx, x, y, sc, c, o}`, walls `{x, y, w, h, s, c}`, areas `{a, x, y, w, h, c, c2, tx, o}`, paths `{p, x, y, pts (relative to x,y), w, c, o}`. `tiles` = `{tw, th, ter, roads, overlay}`, tile grids like the map file's (`.` = leave the tile as it is); prefabs with tiles are placed on whole tiles. To add a starter prefab, write it with the helpers in `prefab-starter.js` (`p`, `v`, `w`, `a`, `l`, `d`, `x`, `f`, `room`).
