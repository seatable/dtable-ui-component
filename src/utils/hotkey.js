import isHotkey from 'is-hotkey';

const isModC = isHotkey('mod+c');
const isModS = isHotkey('mod+s');
const isModZ = isHotkey('mod+z');
const isModL = isHotkey('mod+l');
const isModF = isHotkey('mod+f');
const isModP = isHotkey('mod+p');
const isModG = isHotkey('mod+g');
const isModDot = isHotkey('mod+.');
const isModComma = isHotkey('mod+,');
const isModSlash = isHotkey('mod+/');
const isModBackslash = isHotkey('mod+\'');
const isModSemicolon = isHotkey('mod+;');
const isModUp = isHotkey('mod+up');
const isModDown = isHotkey('mod+down');
const isModLeft = isHotkey('mod+left');
const isModRight = isHotkey('mod+right');
const isModShiftZ = isHotkey('mod+shift+z');
const isModShiftG = isHotkey('mod+shift+g');
const isModOptionR = isHotkey('mod+option+r');
const isModOptionE = isHotkey('mod+option+e');
const isModShiftDot = isHotkey('mod+shift+.');
const isModShiftComma = isHotkey('mod+shift+,');
const isShiftEnter = isHotkey('shift+enter');
const isShiftModEnter = isHotkey('shift+mod+enter');
const isOptPageup = isHotkey('opt+pageup');
const isOptPagedown = isHotkey('opt+pagedown');
const isSpace = isHotkey('space');
const isEsc = isHotkey('esc');
const isEnter = isHotkey('enter');

export {
  isModC, isModS, isModZ, isModL, isModF, isModP, isModG, isModDot, isModComma, isModUp, isModDown, isModLeft, isModRight, isModShiftZ,
  isShiftEnter, isModShiftG, isModShiftDot, isModShiftComma, isModSlash, isModBackslash, isModSemicolon, isShiftModEnter,
  isOptPageup, isOptPagedown, isSpace, isEnter, isModOptionR, isEsc, isModOptionE,
};
