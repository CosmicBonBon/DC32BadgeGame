const id = "EVENT_SET_ALL_LEDS";
const groups = ["EVENT_GROUP_HARDWARE", "EVENT_GROUP_VARIABLES"];
const name = "Set All LEDs";

const fields = [
  {
    key: "red",
    label: "Red Intensity",
    type: "number",
    min: 0,
    max: 255,
    step: 1,
    defaultValue: 255
  },
  {
    key: "green",
    label: "Green Intensity",
    type: "number",
    min: 0,
    max: 255,
    step: 1,
    defaultValue: 255
  },
  {
    key: "blue",
    label: "Blue Intensity",
    type: "number",
    min: 0,
    max: 255,
    step: 1,
    defaultValue: 255
  }
];

const compile = (input, helpers) => {
  const { appendRaw } = helpers;

  const red = input.red;
  const green = input.green;
  const blue = input.blue;

  appendRaw(`
    VM_SET_CONST 1, ${green}
    VM_SET_CONST_UINT8 0xFF7D, 1
    VM_SET_CONST_UINT8 0xFF7F, 0x00

    VM_SET_CONST 1, ${red}
    VM_SET_CONST_UINT8 0xFF7D, 1
    VM_SET_CONST_UINT8 0xFF7F, 0x01

    VM_SET_CONST 1, ${blue}
    VM_SET_CONST_UINT8 0xFF7D, 1
    VM_SET_CONST_UINT8 0xFF7F, 0x02

    VM_SET_CONST_UINT8 0xFF7F, 0x09
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
