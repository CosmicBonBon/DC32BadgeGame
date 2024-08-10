const id = "EVENT_DEFCON_EMU_EXIT";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "Emulator",
};

const fields = [
  {
    label: "Exit Emulation Into Main Menu",
  },
];

const compile = (input, helpers) => {
  const { _addComment, _addCmd, _addNL } = helpers;

  _addComment(`Def Con Exit To Menu`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0xB0");
  _addNL();
};

module.exports = {
  id,
  name: "Def Con Exit To Menu",
  groups,
  subGroups,
  fields,
  compile,
};
