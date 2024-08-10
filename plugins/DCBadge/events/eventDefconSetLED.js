const {
  precompileScriptValue,
  optimiseScriptValue,
} = require("shared/lib/scriptValue/helpers");

const id = "EVENT_DEFCON_SET_LED";
const groups = ["Defcon 32"];
const subGroups = {
  "Defcon 32": "LEDs",
};

// Define basic colors and their hue ranges
const hues = [
  { name: 'red', min: 0, max: 5 },
  { name: 'red-orange', min: 6, max: 13 },
  { name: 'orange-red', min: 14, max: 19 },
  { name: 'orange', min: 20, max: 30 },
  { name: 'orange-yellow', min: 31, max: 42 },
  { name: 'yellow-orange', min: 43, max: 54 },
  { name: 'yellow', min: 55, max: 65 },
  { name: 'yellow-green', min: 66, max: 90 },
  { name: 'green-yellow', min: 91, max: 114 },
  { name: 'green', min: 115, max: 125 },
  { name: 'green-teal', min: 126, max: 139 },
  { name: 'teal-green', min: 140, max: 153 },
  { name: 'teal', min: 154, max: 164 },
  { name: 'teal-cyan', min: 165, max: 169 },
  { name: 'cyan-teal', min: 170, max: 174 },
  { name: 'cyan', min: 175, max: 185 },
  { name: 'cyan-blue', min: 225, max: 240 },
  { name: 'blue-cyan', min: 241, max: 210 },
  { name: 'blue', min: 211, max: 245 },
  { name: 'blue-purple', min: 246, max: 254 },
  { name: 'purple-blue', min: 255, max: 262 },
  { name: 'purple', min: 263, max: 273 },
  { name: 'purple-magenta', min: 274, max: 284 },
  { name: 'magenta-purple', min: 285, max: 294 },
  { name: 'magenta', min: 295, max: 305 },
  { name: 'magenta-red', min: 306, max: 330 },
  { name: 'red-magenta', min: 331, max: 354 },
  { name: 'red', min: 355, max: 360 }
];
// Define brightness levels
const brightnessLevels = [
  { name: 'very dim', min: 0, max: 30 },
  { name: 'dim', min: 31, max: 99 },
  { name: '', min: 100, max: 140 },
  { name: 'bright', min: 140, max: 200 },
  { name: 'very bright', min: 201, max: 255 }
];

// Define saturation levels
const saturationLevels = [
  { name: 'white', min: 0, max: 33 },
  { name: 'pale', min: 34, max: 66 },
  { name: '', min: 67, max: 100 }
];

// Function to convert RGB to HSV and get the hue, saturation, and brightness
function rgbToHsv(R, G, B) {
  R /= 255;
  G /= 255;
  B /= 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const d = max - min;
  let h, s, v = max;

  if (max === min) {
      h = 0; // achromatic
  } else {
      switch (max) {
          case R: h = (G - B) / d + (G < B ? 6 : 0); break;
          case G: h = (B - R) / d + 2; break;
          case B: h = (R - G) / d + 4; break;
      }
      h *= 60;
  }

  s = max === 0 ? 0 : d / max * 100;
  v = v * 100;

  return { h, s, v };
}

// Function to determine the brightness level
function getBrightness(v) {
  for (const level of brightnessLevels) {
      if (v >= level.min && v <= level.max) {
          return level.name;
      }
  }
  return 'unknown';
}

// Function to determine the saturation level
function getSaturation(s) {
  for (const level of saturationLevels) {
      if (s >= level.min && s <= level.max) {
          return level.name;
      }
  }
  return 'unknown';
}

// Main function to get the color name, brightness, and saturation descriptor
function getColorDescription(R, G, B) {
  if (R === 0 && G === 0 && B === 0) return 'off';

  const { h, s, v } = rgbToHsv(R, G, B);

  // Check for desaturation
  if (s === 0) {
      const brightness = getBrightness(v);
      return `${brightness} white`;
  }

  // Find the hue name
  let hueName = 'unknown';
  for (const hueRange of hues) {
      if ((hueRange.min <= h && h <= hueRange.max) || (hueRange.min <= h && hueRange.max >= 360)) {
          hueName = hueRange.name;
          break;
      }
  }

  // Get brightness and saturation
  const brightness = getBrightness(v);
  const saturation = getSaturation(s);

  return `${brightness} ${saturation} ${hueName}`;
}



const fields = [
  {
    key: `leds`,
    label: `LEDs`,
    type: "togglebuttons",
    options: [
      [0, "1"],
      [1, "2"],
      [2, "3"],
      [3, "4"],
      [4, "5"],
      [5, "6"],
      [6, "7"],
      [7, "8"],
      [8, "9"],
      ["all", "All"],
    ],
    defaultValue: "all",
    allowMultiple: true,
    flexBasis: "100%",
    postUpdateFn: (newArgs, prevArgs) => {
      // If selected "all" then deselect others
      if (newArgs.leds.includes("all") && !prevArgs.leds.includes("all")) {
        return {
          ...newArgs,
          leds: newArgs.leds.filter((a) => a === "all"),
        };
      }
      // If was on "all" but selected another, deselect "all"
      if (
        prevArgs.leds.includes("all") &&
        newArgs.leds.some((a) => a !== "all")
      ) {
        return {
          ...newArgs,
          leds: newArgs.leds.filter((a) => a !== "all"),
        };
      }
      return newArgs;
    },
  },
  {
    label: "255 for a color is BRIGHT!! 56 is acceptable game play max, 128 for wearable max.",
    flexBasis: "100%",
  },
  {
    label: "To change a bunch of LED colors at once, only check Sync LEDs after the last call. Sync pushes all the LED updates out to the hardware.", 
    flexBasis: "100%",
  },
  {
    key: "red",
    label: "Red",
    type: "value",
    min: 0,
    max: 255,
    defaultValue: {
      type: "number",
      value: 56,
    },
    flexBasis: "calc(25% - 10px)",
  },
  {
    key: "green",
    label: "Green",
    type: "value",
    min: 0,
    max: 255,
    defaultValue: {
      type: "number",
      value: 56,
    },
    flexBasis: "calc(25% - 10px)",
  },
  {
    key: "blue",
    label: "Blue",
    type: "value",
    min: 0,
    max: 255,
    defaultValue: {
      type: "number",
      value: 56,
    },
    flexBasis: "calc(25% - 10px)",
  },
  {
    key: "sync",
    type: "checkbox",
    label: "Sync LEDs",
    defaultValue: true,
    flexBasis: "calc(25% - 10px)",
  },
  {
    label: "If you set a duration, and don't check 'Turn off after duration' they won't turn off unless you change them manually in another LED call. This can be good to add a pause between multiple LED calls without having LEDs blink off and back on.",
    flexBasis: "100%"
  },
  {
    label: "If duration is 0 there is no wait between calls.",
    flexBasis: "100%"
  },
  {
    key: "duration",
    label: "Duration (frames)",
    type: "number",
    min: 0,
    max: 10000,
    defaultValue: 0,
    flexBasis: "calc(100% - 220px)",
  },
  {
    key: "off_after_duration",
    type: "checkbox",
    label: "Turn off after duration",
    defaultValue: true,
    flexBasis: "200px",
  },
  {
    label: "",
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
    _rpn,
    _performFetchOperations,
    _performValueRPN,
    _declareLocal,
    _localRef,
    wait
  } = helpers;

  _addComment(`Def Con Set LEDs`);
  _addCmd(`DAT0_ADDR = 0xFF7D`);
  _addCmd(`CTL_ADDR  = 0xFF7F`);

  const redValueRef = _declareLocal("red_val", 1, true);
  const greenValueRef = _declareLocal("green_val", 1, true);
  const blueValueRef = _declareLocal("blue_val", 1, true);

  const [rpnOpsRed, fetchOpsRed] = precompileScriptValue(
    optimiseScriptValue(input.red),
    "red"
  );
  const [rpnOpsGreen, fetchOpsGreen] = precompileScriptValue(
    optimiseScriptValue(input.green),
    "green"
  );
  const [rpnOpsBlue, fetchOpsBlue] = precompileScriptValue(
    optimiseScriptValue(input.blue),
    "blue"
  );

  const localsLookup = _performFetchOperations([
    ...fetchOpsRed,
    ...fetchOpsGreen,
    ...fetchOpsBlue,
  ]);

  _addComment(`-- Get RGB Values`);
  let rpn = _rpn();
  _performValueRPN(rpn, rpnOpsRed, localsLookup);
  rpn.refSet(_localRef(redValueRef));

  _performValueRPN(rpn, rpnOpsGreen, localsLookup);
  rpn.refSet(_localRef(greenValueRef));

  _performValueRPN(rpn, rpnOpsBlue, localsLookup);
  rpn.refSet(_localRef(blueValueRef));

  rpn.stop();

  const leds = Array(9)
    .fill()
    .map((_, i) => i)
    .filter((led) => {
      if (input.leds.includes("all")) {
        return true;
      }
      return input.leds.includes(led);
    });

  _addCmd("VM_SET_UINT8", "DAT0_ADDR", _localRef(redValueRef));
  leds.forEach((led) => {
    _addDefconCmd(_addCmd, led, 0x1);
  });
  _addCmd("VM_SET_UINT8", "DAT0_ADDR", _localRef(greenValueRef));
  leds.forEach((led) => {
    _addDefconCmd(_addCmd, led, 0x0);
  });
  _addCmd("VM_SET_UINT8", "DAT0_ADDR", _localRef(blueValueRef));
  leds.forEach((led) => {
    _addDefconCmd(_addCmd, led, 0x2);
  });

  if (input.sync) {
    _addComment(`-- Sync LEDs`);
    _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0x90");
  }

  if(input.duration > 0)
  {
    _addComment(`-- Wait duration and disable LEDs`);
    wait(input.duration);

    if (input.off_after_duration) 
    {
      _addComment("-- Turn LEDs off after duration ");
      _addCmd("VM_SET_UINT8", "DAT0_ADDR", 0);
      leds.forEach((led) => {
        _addDefconCmd(_addCmd, led, 0x1);
      });
      _addCmd("VM_SET_UINT8", "DAT0_ADDR", 0);
      leds.forEach((led) => {
        _addDefconCmd(_addCmd, led, 0x0);
      });
      _addCmd("VM_SET_UINT8", "DAT0_ADDR", 0);
      leds.forEach((led) => {
        _addDefconCmd(_addCmd, led, 0x2);
      });
  
      _addComment(`-- Sync LEDs OFF`);
      _addCmd("VM_SET_CONST_UINT8", "CTL_ADDR", "0x90");
    }
  }

  _addNL();
};



const autoLabel = (fetchArg, input) => {
  let name = "Badge LEDs";

  if (input.red !== undefined) {
    name += ' | (' + input.red.value + ',' + input.green.value + ',' + input.blue.value + ')'

    name += ' ' + getColorDescription(input.red.value, input.green.value, input.blue.value);
  }

  if (input.sync === true) {
    name += ' | SYNC';
  }

  if (input.duration !== undefined && input.duration > 0) {
    name += ' | ' + input.duration + ' frames'
  }

  if (input.off_after_duration === true) {
    name += ' | OFF'
  }

  return name;
};

module.exports = {
  id,
  autoLabel,
  groups,
  subGroups,
  fields,
  compile,
};
