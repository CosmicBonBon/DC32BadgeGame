const id = "EVENT_DEFCON_READ_IMU";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "EVENT_GROUP_DEVICE",
};

const fields = [
  {
    key: `axis`,
    label: `IMU Axis`,
    type: "togglebuttons",
    options: [
      [4, "X"],
      [5, "Y"],
      [6, "Z"],
    ],
    defaultValue: 4,
    allowNone: false,
  },
  {
    key: "variable",
    label: "Write Value To Variable",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
    flexBasis: 0,
    minWidth: 150,
  },
  {
    key: "errorVariable",
    label: "Write Error Code To Variable",
    type: "variable",
    defaultValue: "T0",
    flexBasis: 0,
    minWidth: 150,
  },
  {
    key: "retries",
    label: "Max Retries",
    type: "number",
    min: 0,
    width: "50%",
    defaultValue: 30,
  },
];

export const toHex = (n) =>
  "0x" + n.toString(16).toUpperCase().padStart(2, "0");

const _addDefconCmd = (_addCmd, cmd, subcmd = 0) => {
  _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", toHex((cmd << 4) + subcmd));
};

const compile = (input, helpers) => {
  const {
    _addComment,
    _addCmd,
    _addNL,
    _ifConst,
    _label,
    _rpn,
    _setConst,
    _declareLocal,
    _localRef,
    _jump,
    getNextLabel,
  } = helpers;

  const imuValueRef = _declareLocal("imu_value", 1, true);
  const retryCounterRef = _declareLocal("retry_counter", 1, true);

  const readLabel = getNextLabel();
  const errorLabel = getNextLabel();
  const endLabel = getNextLabel();
  const retryLabel = getNextLabel();

  console.log(
    fields
      .find((f) => f.key === "axis")
      .options.find((o) => o[0] === input.axis)?.[1]
  );
  const axisLabel = fields
    .find((f) => f.key === "axis")
    .options.find((o) => o[0] === input.axis)?.[1];
  _addComment(`Def Con Read IMU Axis ${axisLabel}`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);
  _addCmd(`DAT0_ADDR = 0xFF7D`);
  _addCmd(`DAT1_ADDR = 0xFF7E`);

  _addComment(`-- Set retry counter`);
  _setConst(_localRef(retryCounterRef), input.retries ?? 30);

  _addComment(`-- Start IMU read`);
  _addDefconCmd(_addCmd, 0x0a, input.axis);

  _label(retryLabel);
  _addComment(`-- Read DAT1:DAT0 as 16 bit`);
  _addCmd("VM_GET_INT16", _localRef(imuValueRef), "DAT0_ADDR");

  // Bitwise comparison to check top bit
  _addComment(`-- Check top bit to determine if read is complete`);
  _rpn() //
    .ref(_localRef(imuValueRef))
    .int16("0x8000")
    .operator(".B_AND")
    .stop();
  _ifConst(".NE", ".ARG0", "0x00", readLabel, 1);

  // Read not ready, check if should retry
  _addComment(`-- Check if can retry`);
  _ifConst(".EQ", _localRef(retryCounterRef), "0x00", errorLabel, 0);

  _addComment(`-- retries = retries - 1`);
  _rpn() //
    .ref(_localRef(retryCounterRef))
    .int8(1)
    .operator(".SUB")
    .refSet(_localRef(retryCounterRef))
    .stop();

  _jump(retryLabel);

  _label(errorLabel);
  _addComment(`-- No more retries, set error variable to 1`);
  _rpn() //
    .int8(1)
    .refSetVariable(input.errorVariable)
    .stop();

  _jump(endLabel);

  _label(readLabel);

  // Write error bit to variable
  _addComment(`-- Write error bit to variable`);
  _rpn() //
    .ref(_localRef(imuValueRef))
    .int16("0x4000")
    .operator(".B_AND")
    .int16(14)
    .operator(".SHR") // Shift right
    .refSetVariable(input.errorVariable)
    .stop();

  // Write lower 12 bits to variable
  _addComment(`-- Write lower 12 bits to variable`);
  _rpn() //
    .ref(_localRef(imuValueRef))
    .int16("0x0FFF")
    .operator(".B_AND")
    .refSetVariable(input.variable)
    .stop();

  _label(endLabel);

  _addNL();
};

module.exports = {
  id,
  name: "Def Con Read IMU",
  groups,
  subGroups,
  fields,
  compile,
};
