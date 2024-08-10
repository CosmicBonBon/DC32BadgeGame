const id = "EVENT_DEFCON_POWER_OFF";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "Emulator",
};

const fields = [
  {
    label: "Power Off Device",
  },
];

const compile = (input, helpers) => {
  const { _addComment, _addCmd, _addNL } = helpers;

  _addComment(`Def Con Power Off Device`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0xB1");
  _addNL();
};

module.exports = {
  id,
  name: "Def Con Power Off Device",
  groups,
  subGroups,
  fields,
  compile,
};
