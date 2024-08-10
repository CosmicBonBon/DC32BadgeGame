const id = "EVENT_DEFCON_IR_RECEIVE";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "Infrared",
};

const fields = [
  {
    key: "variable",
    label: "Write Value To Variable",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
    flexBasis: 0,
    minWidth: 150,
  },
  {
    key: "statusVariable",
    label: "Write Status Code To Variable",
    type: "variable",
    defaultValue: "T0",
    flexBasis: 0,
    minWidth: 150,
  },
];

export const toHex = (n) =>
  "0x" + n.toString(16).toUpperCase().padStart(2, "0");

const compile = (input, helpers) => {
  const { _addComment, _addCmd, _addNL, getVariableAlias } = helpers;

  _addComment(`Def Con IR Receive Byte`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd(`DAT0_ADDR = 0xFF7D`);
  _addCmd(`DAT1_ADDR = 0xFF7E`);

  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0xC2");
  _addCmd("VM_GET_UINT8", getVariableAlias(input.variable), "DAT0_ADDR");
  _addCmd("VM_GET_UINT8", getVariableAlias(input.statusVariable), "DAT1_ADDR");

  _addNL();
};

module.exports = {
  id,
  name: "Def Con IR Receive Byte",
  groups,
  subGroups,
  fields,
  compile,
};
