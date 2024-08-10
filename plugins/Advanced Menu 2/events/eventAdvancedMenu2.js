const id = "BR_EVENT_ADVANCED_MENU";
const groups = ["B-Sides", "EVENT_GROUP_DIALOGUE"];
const name = "Display Advanced Menu 2.0";

const MAX_OPTIONS = 16;

const wrap8Bit = (val) => (256 + (val % 256)) % 256;

const decOct = (dec) => wrap8Bit(dec).toString(8).padStart(3, "0");

const fields = [].concat(
  [
    {
      key: "variable",
      label: "Select a Variable",
      type: "variable",
      defaultValue: "LAST_VARIABLE",
    },
    {
      key: "__scriptTabs",
      type: "tabs",
      defaultValue: "items",
      values: {
        items: "Options",
        text: "Layout",
        },
       
    
       
    },
      
  ],
  // Layout tab
  [
    {
      key: `width`,
      label: "Box Width (tiles)",
      type: "number",
      min: 1,
      max: 20,
      width: "50%",
      defaultValue: 20,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
        
      ],
    },
    {
      key: `height`,
      label: "Box Height (tiles)",
      type: "number",
      min: 1,
      max: 18,
      width: "50%",
      defaultValue: 5,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
      ],
    },
    {
      key: `boxX`,
      label: "Box Position X (tiles)",
      type: "number",
      min: 1,
      max: 20,
      width: "25%",
      defaultValue: 4,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
      ],
    },
    {
      key: `boxY`,
      label: "Box Position Y (tiles)",
      type: "number",
      min: 1,
      max: 18,
      width: "25%",
      defaultValue: 6,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
      ],
    },
    {
      key: `showBorder`,
      label: "Show Border",
      type: "checkbox",
      defaultValue: true,
      width: "50%",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
            },
          ],
    },
    {
      key: `clearPrevious`,
      label: "Clear Previous Content",
      type: "checkbox",
      defaultValue: true,
      width: "50%",
      conditions: [
          {
            key: "__scriptTabs",
            in: ["text"],
          },
                  ],
    },
    {
      key: `showActors`,
      label: "Show Actors",
      type: "checkbox",
      defaultValue: false,
      width: "50%",
      conditions: [
          {
            key: "__scriptTabs",
            in: ["text"],
          },
                  ],
    },
  ],
  // Items tab
  [ 
    {
      key: "items",
      label: "Number of options",
      type: "number",
      min: 2,
      max: MAX_OPTIONS,
      defaultValue: 2,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["items"],
        },
      ],
    },
      
    {
      type: "break",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["items"],
        },
        
      ],
    },
    ...Array(MAX_OPTIONS)
      .fill()
      .reduce((arr, _, i) => {
        const idx = i + 1;
        arr.push(
          {
            type: "break",
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              
              
                        ],
          },
          {
            key: `__collapseCase$${idx}`,
            label: `Option ${idx}`,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
          key: "__scriptTabs",
          in: ["items"],
        },
              ],
              type: "collapsable",
              defaultValue: false,
      
      
          },
          {
            key: `option_${idx}_text`,
            type: "text",
            label: `Set variable to '${idx}' if`,
            placeholder: `Item ${idx}`,
            defaultValue: "",
            flexBasis: "100%",
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            key: `option${idx}_x`,
            label: "Text X Position (tiles)",
            type: "number",
            min: 0,
            max: 20,
            width: "50%",
            defaultValue: 0,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            key: `option${idx}_y`,
            label: "Text Y Position (tiles)",
            type: "number",
            min: 0,
            max: 18,
            width: "50%",
            defaultValue: 0,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            type: "break",
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            key: `option${idx}_l`,
            label: "On Left select option",
            type: "number",
            min: 0,
            max: MAX_OPTIONS,
            width: "50%",
            defaultValue: 0,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            key: `option${idx}_r`,
            label: "On Right select option",
            type: "number",
            min: 0,
            max: MAX_OPTIONS,
            width: "50%",
            defaultValue: 0,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            key: `option${idx}_u`,
            label: "On Up select option",
            type: "number",
            min: 0,
            max: MAX_OPTIONS,
            width: "50%",
            defaultValue: 0,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          {
            key: `option${idx}_d`,
            label: "On Down select option",
            type: "number",
            min: 0,
            max: MAX_OPTIONS,
            width: "50%",
            defaultValue: 0,
            conditions: [
              {
                key: "items",
                gte: idx,
              },
              {
                key: "__scriptTabs",
                in: ["items"],
              },
              {
                key: `__collapseCase$${idx}`,
                ne: true,
              },
            ],
          },
          
        );
        return arr;
      }, []),
  ],
  
);

const compile = (input, helpers) => {
  const {
    appendRaw,
    _addComment,
    _overlayMoveTo,
    _loadStructuredText,
    _overlayClear,
    _overlayWait,
    _choice,
    _menuItem,
    _displayText,
    _boxX,
    _boxY,
    getVariableAlias,
    _addNL,
    _showActorsOnOverlay,
  } = helpers;

  let str = "";
  Array(input.items)
    .fill()
    .map((_, i) => {
      const idx = i + 1;
      const itemText = input[`option_${idx}_text`];
      const fieldX = input[`option${idx}_x`] || 0;
      const fieldY = input[`option${idx}_y`] || 0;

      const x = decOct(2 + fieldX);
      const y = decOct(1 + fieldY);

      if (itemText) {
        str += `\\003\\${x}\\${y}${itemText}`;
      }
    });

  const menuWidth = input.width || 7;
  const menuHeight = input.height || 5;
  const boxX = input.boxX || 6;
  const boxY = input.boxY || 4;
  const showActors = input.showActors;
  const variableAlias = getVariableAlias(input.variable);
  const showBorder = input.showBorder;


  const speedIn = `.OVERLAY_SPEED_INSTANT`;
  const speedOut = `.OVERLAY_SPEED_INSTANT`;

  const instantTextSpeedCode = `\\001\\1`;
  

  _addComment("Advanced Menu");

if (input.clearPrevious) {
appendRaw(`; Copy the background tiles to the overlay
                                    VM_PUSH_CONST 0
                                    VM_PUSH_CONST 0
                                    VM_GET_INT16  .ARG1, _scroll_x
                                    VM_GET_INT16  .ARG0, _scroll_y      

                                    VM_RPN
                                      .R_INT8 0
                                      .R_INT8 0
                                      .R_INT8 20
                                      .R_INT8 18

                                      .R_INT8 0
                                      .R_REF  .ARG1
                                      .R_INT16 8
                                      .R_OPERATOR  .DIV
                                      .R_OPERATOR .MAX

                                      .R_INT8 0
                                      .R_REF  .ARG0
                                      .R_INT16 8
                                      .R_OPERATOR  .DIV
                                      .R_OPERATOR .MAX

                                      .R_STOP

                                    VM_OVERLAY_SET_SUBMAP_EX  .ARG5

                                    VM_POP  8
                                    `);
                               }
appendRaw(`VM_SET_CONST_UINT8 _show_actors_on_overlay, ${input.showActors ? 1 : 0}`);
  _overlayMoveTo(0,0,".OVERLAY_SPEED_INSTANT");

  _loadStructuredText(`${instantTextSpeedCode}${str}`);

  _overlayClear(boxX, boxY, menuWidth, menuHeight, ".UI_COLOR_WHITE", input.showBorder
      );
  

  _overlayMoveTo(0, 0, speedIn);

  _displayText();

  _overlayWait(true, [".UI_WAIT_WINDOW", ".UI_WAIT_TEXT"]);

  _choice(variableAlias, [".UI_MENU_CANCEL_B"], input.items);

  Array(input.items)
    .fill()
    .map((_, i) => {
      const clampItem = (i) => Math.min(i || 0, input.items);

      const idx = i + 1;
      const fieldX = input[`option${idx}_x`] || 0;
      const fieldY = input[`option${idx}_y`] || 0;
      const left = clampItem(input[`option${idx}_l`]);
      const right = clampItem(input[`option${idx}_r`]);
      const up = clampItem(input[`option${idx}_u`]);
      const down = clampItem(input[`option${idx}_d`]);

      _menuItem(fieldX, fieldY, left, right, up, down);
    });

  _overlayMoveTo(0, 0, speedOut);
  _overlayWait(true, [".UI_WAIT_WINDOW", ".UI_WAIT_TEXT"]);

  _overlayMoveTo(0, 18, ".OVERLAY_SPEED_INSTANT");

//disable sprites on overlay when menu closes
appendRaw(`VM_SET_CONST_UINT8 _show_actors_on_overlay, 0`);
  _addNL();
};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
  waitUntilAfterInitFade: true,
};
