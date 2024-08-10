const id = "EVENT_CUSTOM_SET_VARIABLE";
const groups = ["Plugin Pak", "EVENT_GROUP_VARIABLES"];
const name = "Custom Set Variable";

const fields = [
  {
    key: "variable",
    label: "Variable",
    type: "variable",
    defaultValue: "0", // This can be changed to a known variable for testing
  },
  {
    key: "value",
    label: "Value",
    type: "number",
    min: 0,
    max: 255,
    defaultValue: 0,
  },
];

const compile = (input, helpers) => {
  const { appendRaw } = helpers;

  // Set the value of a known variable directly
  appendRaw(`
    VM_SET_CONST ${input.variable}, ${input.value}
  `);
};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
  color: "variable",
};
