const id = "FO_EVENT_SWAP_TILES_VAR";
const groups = ["Tiles"];
const name = "Swap Tiles Var";

const MAX_TILES = 50;
let initFade = false;

// conditions:
const advancedView = {
  key: "tabs",
  in: ["advanced"],
};
const defaultView = {
  key: "tabs",
  in: ["default"],
};
function collapseView(index){
  return {
    key: `collapseTile${index}`,
    ne: true
  }
}
function itemView(index){
  return {
    key: "items",
    gte: index,
  }
}

const fields = [

  // Tabs

  {
    key: "tabs",
    type: "tabs",
    defaultValue: "default",
    values: {
      default: "Default",
      advanced: "Advanced Settings",
    },
  },

  {
    label: "",
  },

  // advanced view fields //

  {
    key: "init",
    label: "Swap tiles after init fade",
    type: "checkbox",
    default: false,
    conditions: [advancedView],
  },

  {
    key: "override",
    label: "Override referencing and manually input fields",
    type: "checkbox",
    default: false,
    conditions: [advancedView],
  },

  {
    key: "references",
    label: "Add reference to tileset manually:",
    type: "references",
    conditions: [advancedView],
  },

  {
    key: "_tileset",
    label: "Copy and paste the above reference (e.x. ___bank_bg_name_tileset, _bg_name_tileset)",
    type: "text",
    defaultValue: "",
    flexBasis: "100%",
    conditions: [advancedView],
  },

  {
    key: "tileLength",
    label: "Length Of Tilemap (if not 160px)",
    description: "How many tiles your tilemap has in the X axis",
    type: "number",
    unitsDefault: "tiles",
    min: 0,
    width: "50%",
    defaultValue: 20,
    conditions: [advancedView],
  },

  // default view fields //

  {
    key: "tilemapName",
    label: "Tilemap",
    description: "The tilemap you want to swap tiles with",
    type: "background",
    flexBasis: "100%",
    conditions: [defaultView],
  },

  {
    key: "tilesize",
    label: "Tile Size",
    description: "Choose the size of the tiles you wish to swap.",
    type: "select",
    width: "50%",
    options: [
      [1, "8x8"],
      [2, "16x16"]
    ],
    defaultValue: 1,
    conditions: [defaultView],
  },

  {
    key: "frames",
    label: "Frames of animation",
    description: "How many frames the animation has. Choose 1 for a one time tileswap.",
    type: "number",
    min: 1,
    width: "50%",
    defaultValue: 1,
    conditions: [defaultView],
  },

  {
    key: "wait",
    label: "Frames between swaps if animating",
    type: "number",
    min: 0,
    width: "50%",
    defaultValue: 0,
    conditions: [defaultView],
  },

  {
    type: "break",
    conditions: [defaultView],
  },

  {
    key: "items",
    label: "Number of tiles to be swapped",
    description: "How many unique tiles to be swapped in one loop",
    type: "number",
    min: 1,
    max: MAX_TILES,
    defaultValue: 1,
    conditions: [defaultView],
  },

  // Array of tiles

  ...Array(MAX_TILES)
      .fill()
      .reduce((arr, _, i) => {
        const index = i + 1;
        arr.push(
          {
            key: `collapseTile${index}`,
            label: `Tile${index}`,
            conditions: [defaultView, itemView(index)],
            type: "collapsable",
          },
          {
            key: `tile${index}_x`,
            label: `Scene X`,
            type: "union",
            types: ["number", "variable"],
            defaultType: "number",
            min: 0,
            defaultValue: {
              number: 0,
              variable: "LAST_VARIABLE",
            },
            width: "50%",
            conditions: [defaultView, itemView(index), collapseView(index)],
          },

          {
            key: `tile${index}_y`,
            label: `Scene Y`,
            type: "union",
            types: ["number", "variable"],
            defaultType: "number",
            min: 0,
            defaultValue: {
              number: 0,
              variable: "LAST_VARIABLE",
            },
            width: "50%",
            conditions: [defaultView, itemView(index), collapseView(index)],
          },

          {
            type: "break",
            conditions: [defaultView, itemView(index), collapseView(index)],
          },

          {
            key: `swap${index}_x`,
            label: `Tileset X`,
            description: "X coordinate of the starting tile in the tileset you will be swapping to.",
            type: "union",
            types: ["number", "variable"],
            defaultType: "number",
            min: 0,
            unitsField: "tiles",
            defaultValue: {
              number: 0,
              variable: "LAST_VARIABLE",
            },
            width: "50%",
            conditions: [defaultView, itemView(index), collapseView(index)],
          },

          {
            key: `swap${index}_y`,
            label: `Tileset Y`,
            description: "Y coordinate of the starting tile in the tileset you will be swapping to.",
            type: "union",
            types: ["number", "variable"],
            defaultType: "number",
            min: 0,
            unitsField: "tiles",
            defaultValue: {
              number: 0,
              variable: "LAST_VARIABLE",
            },
            width: "50%",
            conditions: [defaultView, itemView(index), collapseView(index)],
          },

        );
        return arr;
      }, []),

];

const compile = (input, helpers) => {
  const { 
    appendRaw, 
    compileReferencedAssets, 
    _addComment,
    variableFromUnion,
    getVariableAlias,
    temporaryEntityVariable,
    wait,
    warnings,
    backgrounds
  } = helpers;

  // prep
  if (!input.tilemapName) warnings("Did you remember to set the tilemap?")
  const bg = backgrounds.find((background) => background.id === input.tilemapName);
  const tilemap = bg.symbol;
  
  const skipRow = input.tileLength == null ? bg.width : input.tileLength;
  const tilesize = input.tilesize;
  const frames = input.frames;
  const items = input.items;
  const overrideTileset = input.override ? true : false;
  initFade = input.init ? true : false;
  const replaceTile = overrideTileset ? 
        `VM_REPLACE_TILE .TILEID, ${input._tileset}, .SWAPID, ${tilesize}`
      : `VM_REPLACE_TILE .TILEID, ___bank_${tilemap}_tileset, _${tilemap}_tileset, .SWAPID, ${tilesize}`

  if(overrideTileset && (input._tileset == null || input._tileset == ""))
    warnings("Override is set but bank and tilesheet field is blank!\n" + replaceTile)

  if (input.references) {
    compileReferencedAssets(input.references);
  }
  
  // Start scripting

  _addComment("Swap Tiles");

  //push 4 values to stack
  appendRaw(`
    VM_PUSH_CONST 0 \n .SWAPX  = .ARG5
    VM_PUSH_CONST 0 \n .SWAPY  = .ARG4
    VM_PUSH_CONST 0 \n .TILEX  = .ARG3
    VM_PUSH_CONST 0 \n .TILEY  = .ARG2
    VM_PUSH_CONST 0 \n .TILEID = .ARG1
    VM_PUSH_CONST 0 \n .SWAPID = .ARG0`
  );

  for (let i = 0; i < frames; i++) {

    for(let j = 1; j <= items; j++){
      // assiging correct settings for all tiles

      const tileX = input[`tile${j}_x`];
      const tileY = input[`tile${j}_y`];
      const swapXUnion = input[`swap${j}_x`];
      const swapYUnion = input[`swap${j}_y`];

      

      if (tileX.type === "number" && tileY.type === "number") {  
        appendRaw(`VM_SET_CONST .TILEX, ${tileX.value}`);
        appendRaw(`VM_SET_CONST .TILEY, ${tileY.value}`);
      } else {
        appendRaw(`VM_SET .TILEX, ${getVariableAlias(variableFromUnion(tileX, temporaryEntityVariable(0)))}`)
        appendRaw(`VM_SET .TILEY, ${getVariableAlias(variableFromUnion(tileY, temporaryEntityVariable(0)))}`)
      } 
      
      appendRaw(`VM_GET_TILE_XY .TILEID, .TILEX, .TILEY`);

      // swap X and Y

      // if not variables, do const way
      if (swapXUnion.type === "number" && swapYUnion.type === "number") {  
          swapX = swapXUnion.value;
          swapY = swapYUnion.value;
          appendRaw(`VM_SET_CONST .SWAPID, ${swapY * skipRow + swapX + (tilesize * i)}`);
      } else {
        appendRaw(`VM_SET .SWAPX, ${getVariableAlias(variableFromUnion(swapXUnion, temporaryEntityVariable(0)))}`)
        appendRaw(`VM_SET .SWAPY, ${getVariableAlias(variableFromUnion(swapYUnion, temporaryEntityVariable(0)))}`)

        appendRaw(`
        VM_RPN
          .R_REF .SWAPY
          .R_INT8 ${skipRow} 
          .R_OPERATOR .MUL
          .R_REF .SWAPX
          .R_OPERATOR .ADD
          .R_INT8 ${tilesize}
          .R_INT8 ${i}
          .R_OPERATOR .MUL
          .R_OPERATOR .ADD
          .R_REF_SET .SWAPID
          .R_STOP
        `);
      }   

      appendRaw(replaceTile);
      if(tilesize == 2){
        appendRaw(`
        VM_RPN
          .R_REF .TILEY
          .R_INT16 1
          .R_OPERATOR .ADD
          .R_REF_SET .TILEY
          .R_REF .SWAPID
          .R_INT16 ${skipRow}
          .R_OPERATOR .ADD
          .R_REF_SET .SWAPID
          .R_STOP
        `);
        appendRaw(`VM_GET_TILE_XY .TILEID, .TILEX, .TILEY`);
        appendRaw(replaceTile);
        appendRaw(`
        VM_RPN
          .R_REF .TILEY
          .R_INT16 1
          .R_OPERATOR .SUB
          .R_REF_SET .TILEY
          .R_STOP
        `);
      }
    }
    if(input.wait != 0)
      wait(input.wait)
  }

  //clear stack
  appendRaw(`VM_POP 6`);

};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
  waitUntilAfterInitFade: initFade,
};