const id = "BR_EVENT_ADVANCED_DIALOGUE_vB";
const groups = ["B-Sides", "EVENT_GROUP_DIALOGUE"];
const name = "Display Advanced Dialogue Version B";

const wrap8Bit = (val) => (256 + (val % 256)) % 256;

const decOct = (dec) => wrap8Bit(dec).toString(8).padStart(3, "0");

const fields = [].concat(
  [
    
    {
      key: "__scriptTabs",
      type: "tabs",
      defaultValue: "text",
      values: {
        text: "Text",
        layout: "Layout",
      },
    },
  ],
  // Layout tab
  [
    {
      type: "group",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["layout"],
        },
      ],
      fields: [
        {
          key: `boxHeight`,
          label: "Box Height",
          type: "number",
          min: 1,
          max: 18,
          width: "50%",
          defaultValue: 4,
        },
        
        {
          key: `boxWidth`,
          label: "Box Width",
          type: "number",
          min: 1,
          max: 21,
          width: "50%",
          defaultValue: 6,
        },
        {
          key: `boxX`,
          label: "Box Position X",
          type: "number",
          min: -1,
          max: 19,
          width: "50%",
          defaultValue: 4,
        },
        {
          key: `boxY`,
          label: "Box Position Y",
          type: "number",
          min: -1,
          max: 17,
          width: "50%",
          defaultValue: 4,
        },
      ],
    },
    
    
    {
      type: "group",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["layout"],
        },
      ],
      fields: [
        {
          key: `showBorder`,
          label: "Show Border",
          type: "checkbox",
          defaultValue: "true",
          width: "50%",
          conditions: [
            {
              key: "__scriptTabs",
              in: ["layout"],
            },
          ],
        },
        {
          key: `showActors`,
          label: "Show Actors",
          type: "checkbox",
          defaultValue: "true",
          width: "50%",
          conditions: [
            {
              key: "__scriptTabs",
              in: ["layout"],
            },
          ],
        },
        {
          key: `clearPrevious`,
          label: "Clear Previous Content",
          type: "checkbox",
          defaultValue: "true",
          width: "50%",
          conditions: [
            {
              key: "__scriptTabs",
              in: ["layout"],
            },
          ],
        },
        {
          key: `textInv`,
          label: "Invert font",
          type: "checkbox",
          defaultValue: "false",
          width: "50%",
          conditions: [
            {
              key: "__scriptTabs",
              in: ["layout"],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["layout"],
        },
      ],
      fields: [
        {
          key: `textX`,
          label: "Text X Position",
          type: "number",
          min: 0,
          max: 20,
          defaultValue: 1,
        },
        {
          key: `textY`,
          label: "Text Y Position",
          type: "number",
          min: 0,
          max: 18,
          defaultValue: 1,
        },
        
      ],
    },
    {
      key: `closeWhen`,
      label: "Close When...",
      type: "select",
      defaultValue: "key",
      options: [
        ["key", "Button Pressed"],
        ["text", "Text Finishes"],
        ["notModal", "Never (Non-Modal)"],
      ],
      conditions: [
        {
          key: "__scriptTabs",
          in: ["layout"],
        },
      ],
    },
    
    {
      key: "closeButton",
      type: "togglebuttons",
      options: [
        ["a", "A"],
        ["b", "B"],
        ["any", "Any"],
      ],
      allowNone: false,
      defaultValue: "a",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["layout"],
        },
        {
          key: "closeWhen",
          eq: "key",
        },
      ],
    },
  ],
  // Text tab
  [
    {
      key: "text",
      type: "textarea",
      placeholder: "Text...",
      multiple: true,
      defaultValue: "",
      flexBasis: "100%",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
      ],
    },
    {
      key: "avatarId",
      type: "avatar",
      toggleLabel: "Add Avatar",
      label: "Avatar",
      defaultValue: "",
      optional: true,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
      ],
    },
  ]
);

const compile = (input, helpers) => {
  const {
    _addComment,
    _overlayMoveTo,
    _loadStructuredText,
    _overlayClear,
    _overlayWait,
    _displayText,
    appendRaw,
    _addNL,
    _stackPop,
  } = helpers;



  const textX = input.textX === null ? 1 : input.textX;
  const textY = input.textY === null ? 1 : input.textY;
  const boxWidth = input.boxWidth;
  const boxHeight = input.boxHeight;
  
  const boxX = input.boxX;
  const boxY = input.boxY;
  const isModal = input.closeWhen !== "notModal";

  console.log(input);
  console.log(boxHeight, boxWidth, textX, textY, boxX, boxY);

  const speedIn = `.OVERLAY_SPEED_INSTANT`;
  const speedOut = `.OVERLAY_OUT_SPEED`;

  const textInputs = Array.isArray(input.text) ? input.text : [input.text];
  const avatarId = input.avatarId;

  const initialNumLines = textInputs.map(
    (textBlock) => textBlock.split("\n").length
  );


  const x = decOct(1 + textX + (avatarId ? 3 : 0));
  const y = decOct(1 + textY);
  const textPosSequence = `\\003\\${x}\\${y}`;
  const textInverted = `\\007\\002`;
  _addComment("Advanced Text Dialogue");

  textInputs.forEach((text, textIndex) => {
    let avatarIndex = undefined;
    if (avatarId) {
      const { avatars } = helpers;
      avatarIndex = avatars.findIndex((a) => a.id === avatarId);
      if (avatarIndex < 0) {
        avatarIndex = undefined;
      }
    }

    let endDelaySequence = "";
    if (input.closeWhen === "text") {
      endDelaySequence = `\\001\\${decOct(8)}\\001\\${decOct(6)}`;
    } else if (textIndex !== textInputs.length - 1) {
      endDelaySequence = `\\001\\${decOct(7)}`;
    }
    {
    //if (input.textInv = false) {
    _loadStructuredText(
      `${textPosSequence}${text}${endDelaySequence}`, avatarIndex, boxHeight
    );
    } if (input.textInv){
      _loadStructuredText(
      `${textInverted}${textPosSequence}${text}${endDelaySequence}`, avatarIndex, boxHeight
    );
  }

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
    _overlayClear(
        boxX,
        boxY,
        boxWidth,
        boxHeight,
        ".UI_COLOR_WHITE",
        input.showBorder
      );

    if (textIndex === 0) {
      _overlayMoveTo(0, 0, ".OVERLAY_SPEED_INSTANT");
    }

    //appendRaw(
    //  `VM_OVERLAY_SET_SCROLL   ${textX + (avatarId ? 3 : 0)}, ${textY}, ${
    //    (input.showBorder ? 19 : boxWidth) - (avatarId ? 3 : 0) - textX
    //  }, ${boxHeight}, .UI_COLOR_WHITE`
    //);

    _displayText();


      const waitFlags = [".UI_WAIT_WINDOW", ".UI_WAIT_TEXT"];
      if (input.closeWhen === "key") {
        console.log("BUTTON", input.closeButton);
        if (input.closeButton === "a") {
          waitFlags.push(".UI_WAIT_BTN_A");
        }
        if (input.closeButton === "b") {
          waitFlags.push(".UI_WAIT_BTN_B");
        }
        if (input.closeButton === "any") {
          waitFlags.push(".UI_WAIT_BTN_ANY");
        }
      }
      _overlayWait(isModal, waitFlags);
    

    if (textIndex === textInputs.length - 1) {
      if (isModal) {
        _overlayMoveTo(0 , 18, ".OVERLAY_SPEED_INSTANT");
        _overlayWait(isModal, [".UI_WAIT_WINDOW", ".UI_WAIT_TEXT"]);
      }
    }
  });

 

  
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
