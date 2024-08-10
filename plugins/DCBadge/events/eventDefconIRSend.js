const {
  precompileScriptValue,
  optimiseScriptValue,
} = require("shared/lib/scriptValue/helpers");

const id = "EVENT_DEFCON_IR_SEND";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "Infrared",
};

const fields = [
  {
    key: "value",
    label: "Send Value (8-bit)",
    type: "value",
    defaultValue: {
      type: "number",
      value: 0,
    },
  },
];

export const toHex = (n) =>
  "0x" + n.toString(16).toUpperCase().padStart(2, "0");

const compile = (input, helpers) => {
  const {
    _addComment,
    _addCmd,
    _addNL,
    _declareLocal,
    _localRef,
    _performFetchOperations,
    _performValueRPN,
    _rpn,
  } = helpers;

  _addComment(`Def Con IR Send Byte`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd(`DAT0_ADDR = 0xFF7D`);

  const valueRef = _declareLocal("val", 1, true);

  const [rpnOps, fetchOps] = precompileScriptValue(
    optimiseScriptValue(input.value),
    "value"
  );

  const localsLookup = _performFetchOperations(fetchOps);
  _addComment(`-- Get Value To Send`);
  let rpn = _rpn();
  _performValueRPN(rpn, rpnOps, localsLookup);
  rpn.refSet(_localRef(valueRef));
  rpn.stop();

  _addCmd("VM_SET_UINT8", "DAT0_ADDR", _localRef(valueRef));
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0xC1");
  _addNL();
};

module.exports = {
  id,
  name: "Def Con IR Send Byte",
  groups,
  subGroups,
  fields,
  compile,
};
