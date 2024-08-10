const fs = require("fs");

const projectFile = process.argv[2];

if (!projectFile) {
  console.log(`Missing project file`);
  console.log(`usage: node migrate-player-palettes.js [projectfile]`);
  process.exit();
}

const file = JSON.parse(fs.readFileSync(projectFile, "utf-8"));

const updatedFile = {
  ...file,
  spriteSheets: file.spriteSheets.map((spriteSheet) => {
    if (!spriteSheet.name.startsWith("player")) {
      return spriteSheet;
    }
    return {
      ...spriteSheet,
      states: spriteSheet.states.map((state) => {
        return {
          ...state,
          animations: state.animations.map((animation) => {
            return {
              ...animation,
              frames: animation.frames.map((frame) => {
                return {
                  ...frame,
                  tiles: frame.tiles.map((tile) => {
                    return {
                      ...tile,
                      paletteIndex: 7,
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };
  }),
};

fs.writeFileSync(projectFile, JSON.stringify(updatedFile, null, 4));
console.log("Updated!");
