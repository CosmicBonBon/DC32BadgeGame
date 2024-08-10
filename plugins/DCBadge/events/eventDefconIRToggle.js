const id = "EVENT_DEFCON_IR_TOGGLE";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "Infrared",
};

const fields = [
  {
    key: `mode`,
    label: `IR Mode`,
    type: "togglebuttons",
    options: [
      [0, "Off"],
      [1, "TX"],
      [2, "RX"],
    ],
    defaultValue: 0,
    allowNone: false,
  },
];

export const toHex = (n) =>
  "0x" + n.toString(16).toUpperCase().padStart(2, "0");

const compile = (input, helpers) => {
  const { _addComment, _addCmd, _addNL } = helpers;

  _addComment(`Def Con IR Toggle`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd(`DAT0_ADDR = 0xFF7D`);
  _addCmd("VM_SET_CONST_UINT8", "DAT0_ADDR", toHex(input.mode));
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0xC0");
  _addNL();
};

module.exports = {
  id,
  name: "Def Con IR Toggle",
  groups,
  subGroups,
  fields,
  compile,
};
