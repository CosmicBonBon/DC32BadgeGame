const id = "EVENT_READ_IMU_DATA";
const groups = ["EVENT_GROUP_HARDWARE", "EVENT_GROUP_VARIABLES"];
const name = "Read IMU Data";

const fields = [
  {
    key: "varX",
    label: "Variable X",
    type: "variable",
    defaultValue: "LAST_VARIABLE"
  },
  {
    key: "varY",
    label: "Variable Y",
    type: "variable",
    defaultValue: "LAST_VARIABLE"
  },
  {
    key: "varZ",
    label: "Variable Z",
    type: "variable",
    defaultValue: "LAST_VARIABLE"
  }
];

const compile = (input, helpers) => {
  const { appendRaw, getVariableAlias } = helpers;

  const varX = getVariableAlias(input.varX);
  const varY = getVariableAlias(input.varY);
  const varZ = getVariableAlias(input.varZ);

  appendRaw(`
    VM_SET_CONST_UINT8 0xFF7F, 0x4A
    VM_GET_UINT16 ${varX}, 0xFF7D

    VM_SET_CONST_UINT8 0xFF7F, 0x5A
    VM_GET_UINT16 ${varY}, 0xFF7D

    VM_SET_CONST_UINT8 0xFF7F, 0x6A
    VM_GET_UINT16 ${varZ}, 0xFF7D
  `);
};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
  color: "hardware",
};
