const id = "EVENT_SCENE_INIT";
const groups = ["EVENT_GROUP_SCENE", "EVENT_GROUP_INIT"];
const name = "Scene Init";

const fields = [];

const compile = (input, helpers) => {
  const { appendRaw } = helpers;

  appendRaw(`
    // Verify Badge Hardware
    VM_SET_CONST 15, 0

    VM_GET_UINT8 16, 0xFF7F
    VM_IF_CONST .NE, 16, 0x21, _label_end_0, 0

    VM_SET_CONST_UINT8 0xFF7F, 0xF3
    VM_GET_UINT16 16, 0xFF7D
    VM_IF_CONST .NE, 16, 0x446D, _label_end_0, 0

    VM_SET_CONST_UINT8 0xFF7F, 0xF4
    VM_GET_UINT16 16, 0xFF7D
    VM_IF_CONST .NE, 16, 0x6974, _label_end_0, 0

    VM_SET_CONST_UINT8 0xFF7F, 0xF5
    VM_GET_UINT16 16, 0xFF7D
    VM_IF_CONST .NE, 16, 0x7279, _label_end_0, 0

    VM_SET_CONST 15, 1

    _label_end_0:
  `);
};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
  color: "scene",
};
