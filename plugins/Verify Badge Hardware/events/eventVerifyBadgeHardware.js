const id = "EVENT_VERIFY_BADGE_HARDWARE";
const groups = ["EVENT_GROUP_HARDWARE", "EVENT_GROUP_VARIABLES"];
const name = "Verify Badge Hardware";

const fields = [
  {
    key: "verify",
    label: "Verify Badge Hardware",
    type: "checkbox",
    defaultValue: true,
  },
];

const compile = (input, helpers) => {
  const { appendRaw } = helpers;

  appendRaw(`
    VM_SET_CONST 15, 0

    VM_GET_UINT8 16, 0xFF7F
    VM_IF_CONST .NE, 16, 0x21, label_end, 0

    VM_SET_CONST_UINT8 0xFF7F, 0xF3
    VM_GET_UINT16 16, 0xFF7D
    VM_IF_CONST .NE, 16, 0x446D, label_end, 0

    VM_SET_CONST_UINT8 0xFF7F, 0xF4
    VM_GET_UINT16 16, 0xFF7D
    VM_IF_CONST .NE, 16, 0x6974, label_end, 0

    VM_SET_CONST_UINT8 0xFF7F, 0xF5
    VM_GET_UINT16 16, 0xFF7D
    VM_IF_CONST .NE, 16, 0x7279, label_end, 0

    VM_SET_CONST 15, 1

    label_end:
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
