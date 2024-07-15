const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i;

const rgbaRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i;

export const hexToRgba = (color) => {
  if (rgbaRegex.test(color)) return color;
  let r;
  let g;
  let b;
  let a = 1;
  const hex = color.replace(/^#/, '');
  if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = hex.length === 8 ? Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100 : 1;
  } else if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    throw new Error('Invalid HEX color.');
  }

  return { r, g, b, a };
};

export const rgbaToHex = (color, isNeedPrefix = true, isNeedAlpha = true) => {
  if (hexRegex.test(color)) return color;
  const { r, g, b, a } = color;
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  const alpha = a !== undefined && a !== 1 ? toHex(Math.round(a * 255)) : '';

  return `${isNeedPrefix ? '#' : ''}${toHex(r)}${toHex(g)}${toHex(b)}${isNeedAlpha ? alpha : ''}`;
};

export const isLightColor = (color) => {
  if (color.startsWith('#')) color = color.slice(1);
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const a = color.length === 8 ? parseInt(color.substring(6, 8), 16) / 255 : 1;
  const bgColor = { r: 255, g: 255, b: 255 };

  const mixedR = Math.round((1 - a) * bgColor.r + a * r);
  const mixedG = Math.round((1 - a) * bgColor.g + a * g);
  const mixedB = Math.round((1 - a) * bgColor.b + a * b);
  const luminance = 0.2126 * mixedR + 0.7152 * mixedG + 0.0722 * mixedB;

  return luminance > 128;
};

export const getInitialHexVal = (hex) => {
  let hexVal = hex.slice(1); // Remove #
  if (hexVal.length > 6) {
    hexVal = hexVal.slice(0, 6);
  }

  return hexVal;
};

export const toPercentage = (number) => {
  if (number < 0 || number > 1) {
    return null;
  }
  return Math.round(number * 100);
};
