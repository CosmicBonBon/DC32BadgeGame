const l10n = require("../helpers/l10n").default;

const id = "EVENT_DEFCON_IF_DEVICE_BADGE";
const groups = ["EVENT_GROUP_CONTROL_FLOW", "Defcon 32"];
const subGroups = {
  EVENT_GROUP_CONTROL_FLOW: "EVENT_GROUP_DEVICE",
  "Defcon 32": "EVENT_GROUP_CONTROL_FLOW",
};

const fields = [
  {
    key: "true",
    label: l10n("FIELD_TRUE"),
    description: l10n("FIELD_TRUE_DESC"),
    type: "events",
  },
  {
    key: "__collapseElse",
    label: l10n("FIELD_ELSE"),
    type: "collapsable",
    defaultValue: true,
    conditions: [
      {
        key: "__disableElse",
        ne: true,
      },
    ],
  },
  {
    key: "false",
    label: l10n("FIELD_FALSE"),
    description: l10n("FIELD_FALSE_DESC"),
    conditions: [
      {
        key: "__collapseElse",
        ne: true,
      },
      {
        key: "__disableElse",
        ne: true,
      },
    ],
    type: "events",
  },
];

const compile = (input, helpers) => {
  const {
    _addComment,
    _ifConst,
    _addCmd,
    _stackPushConst,
    _addNL,
    _compilePath,
    _jump,
    _label,
    getNextLabel,
  } = helpers;
  const truePath = input.true;
  const falsePath = input.__disableElse ? [] : input.false;

  const falseLabel = getNextLabel();
  const endLabel = getNextLabel();

  _addComment(`If Running On Def Con Badge`);
  _addCmd(`IDR_ADDR  = 0xFF7F`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd(`DAT0_ADDR = 0xFF7D`);
  _addCmd(`DAT1_ADDR = 0xFF7E`);
  _addNL();

  _addComment(`-- Verify IDR register reads 0x21`);
  _stackPushConst(0);
  _addCmd("VM_GET_UINT8", ".ARG0 IDR_ADDR");
  _ifConst(".NE", ".ARG0", "0x21", falseLabel, 1);
  _addNL();

  _addComment(`-- Write 0xF3 to CTL register`);
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR 0xF3");
  _addNL();

  _addComment(`-- Read DAT1:DAT0 as 16 bit and verify you see 0x446D`);
  _stackPushConst(0);
  _addCmd("VM_GET_INT16", ".ARG0 DAT0_ADDR");
  _ifConst(".NE", ".ARG0", "0x446D", falseLabel, 1);
  _addNL();

  _addComment(`-- Write 0xF4 to CTL register`);
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR 0xF4");
  _addNL();

  _addComment(`-- Read DAT1:DAT0 as 16 bit and verify you see 0x6974`);
  _stackPushConst(0);
  _addCmd("VM_GET_INT16", ".ARG0 DAT0_ADDR");
  _ifConst(".NE", ".ARG0", "0x6974", falseLabel, 1);
  _addNL();

  _addComment(`-- Write 0xF5 to CTL register`);
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR 0xF5");
  _addNL();

  _addComment(`-- Read DAT1:DAT0 as 16 bit and verify you see 0x7279`);
  _stackPushConst(0);
  _addCmd("VM_GET_INT16", ".ARG0 DAT0_ADDR");
  _ifConst(".NE", ".ARG0", "0x7279", falseLabel, 1);
  _addNL();

  _compilePath(truePath);
  _jump(endLabel);
  _label(falseLabel);
  _compilePath(falsePath);
  _label(endLabel);
  _addNL();
};

module.exports = {
  id,
  name: "If Running On Def Con Badge",
  groups,
  subGroups,
  fields,
  compile,
};
