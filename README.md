# Zombdash

A pixel-art top-down zombie survival game by Doorhouse Games.

Play it at https://danikko2.github.io/Zombdash/

## Working on the game

The game is built from the files in `src/` into the single file `index.html` that GitHub Pages serves.

* **Edit `src/`, not `index.html`.** When you change a file in `src/` on GitHub, the *Build index.html* action rebuilds `index.html` automatically.
* Build yourself with Node: `node tools/build.js`. Run the tests with `node tests/run.js`.
* [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains the folders, every module, and where to change weapons, zombies, drops, waves and more.
