import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { ChromePicker } from 'react-color';
import { isEmpty } from 'dtable-utils';
import { getLocale } from '../lang';
import ClickOutside from '../ClickOutside';
import { hexToRgba, rgbaToHex, getInitialHexVal, toPercentage, isLightColor } from './utils';
import ColorPickerPortal from './color-picker-portal';

import './index.css';

const DEFAULT_COLORS = [
  '#ffffff',
  '#f5f5f5',
  '#eef6f9',
  '#333333',
  '#ff0000',
  '#ffff00',
  '#0000ff',
  '#00ff00'
];

const COLOR_PICKER_MODE = {
  HEX: 'hex',
  RGBA: 'rgba',
};

const RGB_COLORS_MAP = {
  RED: 'r',
  GREEN: 'g',
  BLUE: 'b',
};

const LOCAL_STORAGE_KEY = 'dtable-color-picker';

const DTableColorPicker = forwardRef((props, ref) => {
  const { onToggle, popoverStyle, color, defaultColors, useProtal, target, scrollContainerId, throttleDelay = 20 } = props;
  const initialRgbaColor = hexToRgba(color);
  const [value, setValue] = useState(initialRgbaColor);
  const [hexVal, setHexVal] = useState(getInitialHexVal(color));
  const [alphaVal, setAlphaVal] = useState(toPercentage(initialRgbaColor.a));
  const [redVal, setRedVal] = useState(initialRgbaColor.r);
  const [greenVal, setGreenVal] = useState(initialRgbaColor.g);
  const [blueVal, setBlueVal] = useState(initialRgbaColor.b);
  const [colorMode, setColorMode] = useState(COLOR_PICKER_MODE.HEX); // hex or rgb
  const colorPickerRef = useRef(null);
  let currentUsedColors = [];
  const currentUsedColorsStr = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    currentUsedColors = currentUsedColorsStr ? JSON.parse(currentUsedColorsStr) : [];
  } catch (error) {
    console.error('Error parsing current used colors from localStorage:', error);
  }

  useEffect(() => {
    const colorBarElement = document.querySelector('.chrome-picker > div:last-of-type > .flexbox-fix:first-of-type');
    if (colorBarElement) {
      colorBarElement.classList.add('color-bar');
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getHeight: () => colorPickerRef.current ? colorPickerRef.current.offsetHeight : 0
  }));

  const onChangeChromePicker = (newColor) => {
    const rgba = newColor.rgb;
    rgba.a = Math.round(rgba.a * 100) / 100;
    const transferedHex = rgbaToHex(rgba);
    const hexVal = transferedHex.substring(1, 7);
    const { r, g, b, a } = rgba;
    setAlphaVal(toPercentage(a));
    updateValue(rgba);
    if (colorMode === COLOR_PICKER_MODE.HEX) {
      setHexVal(hexVal);
    } else {
      setRedVal(r);
      setGreenVal(g);
      setBlueVal(b);
    }
  };

  const onChangeMode = () => {
    let newMode;
    if (colorMode === COLOR_PICKER_MODE.HEX) {
      newMode = COLOR_PICKER_MODE.RGBA;
      const rgba = hexToRgba(color);
      const { r, g, b } = rgba;
      setRedVal(r);
      setGreenVal(g);
      setBlueVal(b);
    } else {
      newMode = COLOR_PICKER_MODE.HEX;
      const hexVal = rgbaToHex(value, false, false);
      setHexVal(hexVal);
    }
    setColorMode(newMode);
  };

  const onChangeHex = (e) => {
    const hex = e.target.value;
    setHexVal(hex);
  };

  const onHexInputBlur = () => {
    const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i;
    if (!hexRegex.test(hexVal)) {
      const validHex = rgbaToHex(value, false);
      setHexVal(validHex);
      return;
    }
    let newHexVal = hexVal;
    if (newHexVal.length === 3) {
      newHexVal = newHexVal.split('').map(char => char + char).join('');
    }
    setHexVal(newHexVal);
    const { r, g, b } = hexToRgba(newHexVal);
    const newValue = { r, g, b, a: value.a };
    updateValue(newValue);
  };

  const onChangeAlpha = (e) => {
    const regex = /^(\d+|\d+%)?$/;
    const alphaVal = e.target.value.trim().replace('%', '');
    if (!regex.test(alphaVal)) return;
    setAlphaVal(alphaVal);
  };

  const onChangeRgb = (e, specColor) => {
    let newVal = e.target.value;
    const regex = /^[0-9]*$/;
    if (!regex.test(newVal)) return;
    if (newVal) newVal = parseInt(newVal);
    switch (specColor) {
      case RGB_COLORS_MAP.RED: {
        setRedVal(newVal);
        break;
      }
      case RGB_COLORS_MAP.GREEN: {
        setGreenVal(newVal);
        break;
      }
      case RGB_COLORS_MAP.BLUE: {
        setBlueVal(newVal);
        break;
      }
      default: break;
    }
  };

  const onRgbInputBlur = (specColor) => {
    let val = redVal;
    let setSpecColor = setRedVal;
    if (specColor === RGB_COLORS_MAP.GREEN) {
      val = greenVal;
      setSpecColor = setGreenVal;
    } else if (specColor === RGB_COLORS_MAP.BLUE) {
      val = blueVal;
      setSpecColor = setBlueVal;
    }
    if (isEmpty(val) || val < 0 || val > 255) {
      setSpecColor(value[specColor]);
      return;
    }
    const newValue = { ...value, [specColor]: val };
    updateValue(newValue);
  };

  const updateValue = (newValue) => {
    setValue(newValue);
    const submitHex = rgbaToHex(newValue);
    props.onSubmit(submitHex);
  };

  const onAlphaInputBlur = () => {
    if (isEmpty(alphaVal) || alphaVal < 0 || alphaVal > 100) {
      setAlphaVal(toPercentage(value.a));
      return;
    }
    const newValue = { ...value, a: parseFloat(alphaVal) / 100 };
    updateValue(newValue);
  };

  const onKeyDown = (event, callBack) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.blur();
      callBack && callBack();
    }
  };

  const onSelectDefaultColor = (color) => {
    const rgba = hexToRgba(color);
    const { r, g, b, a } = rgba;
    const alphaVal = toPercentage(a);
    if (colorMode === COLOR_PICKER_MODE.RGBA) {
      setRedVal(r);
      setGreenVal(g);
      setBlueVal(b);
    }
    setHexVal(color.slice(1, 7));
    setAlphaVal(alphaVal);
    updateValue(rgba);
  };

  const onClosePopover = () => {
    if (currentUsedColors.length >= 8) currentUsedColors.pop();
    const hex = rgbaToHex(value);
    if (!currentUsedColors.includes(hex)) {
      currentUsedColors.unshift(hex);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentUsedColors));
    }
    onToggle();
  };

  const renderDefaultContainer = () => {
    const colors = defaultColors ? defaultColors.slice(0, 8) : DEFAULT_COLORS;
    return (
      <div className="default-color-setting">
        <span>{getLocale('Default')}</span>
        <div className="default-colors-container d-flex mt-2 mb-2">
          {colors.map((color, index) => {
            const isLight = isLightColor(color);
            return (
              <div
                className={`color-item mr-2 ${isLight ? '' : 'dark'}`}
                onClick={() => onSelectDefaultColor(color)}
                key={`default-color-${index}`}
              >
                <span className="colorinput-color d-flex align-items-center justify-content-center" style={{ backgroundColor: color }}>
                  {color === `${rgbaToHex(value)}` && alphaVal === 100 &&
                    <i className="dtable-icon-color-check dtable-font dtable-icon-check-mark"></i>
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCustomContainer = () => {
    return (
      <>
        <span>{getLocale('Custom')}</span>
        <ChromePicker
          className="mt-2"
          color={value}
          onChange={onChangeChromePicker}
        />
        <div className={`color-setting d-flex align-items-center ${colorMode}`}>
          <span className="mode-btn d-flex" onClick={onChangeMode}>
            {colorMode === COLOR_PICKER_MODE.HEX ? 'HEX' : 'RGB'}
            <i className="dtable-font dtable-icon-right"></i>
          </span>
          {colorMode === COLOR_PICKER_MODE.HEX ? renderHexContainer() : renderRgbContainer()}
          <Input
            className="alpha-input"
            type="text"
            value={alphaVal + '%'}
            onBlur={onAlphaInputBlur}
            onKeyDown={(e) => onKeyDown(e, onAlphaInputBlur)}
            onChange={onChangeAlpha}
          />
        </div>
      </>
    );
  };

  const renderHexContainer = () => {
    return (
      <div className="hex-container ml-2">
        <span>#</span>
        <Input
          className="hex-input"
          type="text"
          value={hexVal}
          onBlur={onHexInputBlur}
          onKeyDown={(e) => onKeyDown(e, onHexInputBlur)}
          onChange={onChangeHex}
        />
      </div>
    );
  };

  const renderRgbContainer = () => {
    return (
      <div className='rgb-container'>
        <span>R</span>
        <Input
          className="rgb-input"
          type="text"
          value={redVal}
          onBlur={() => onRgbInputBlur(RGB_COLORS_MAP.RED)}
          onChange={(e) => onChangeRgb(e, RGB_COLORS_MAP.RED)}
        />
        <span>G</span>
        <Input
          className="rgb-input"
          type="text"
          value={greenVal}
          onBlur={() => onRgbInputBlur(RGB_COLORS_MAP.GREEN)}
          onChange={(e) => onChangeRgb(e, RGB_COLORS_MAP.GREEN)}
        />
        <span>B</span>
        <Input
          className="rgb-input"
          type="text"
          value={blueVal}
          onBlur={() => onRgbInputBlur(RGB_COLORS_MAP.BLUE)}
          onChange={(e) => onChangeRgb(e, RGB_COLORS_MAP.BLUE)}
        />
      </div>
    );
  };

  const renderUsedContainer = () => {
    return (
      <div className="current-used-container mt-2">
        <span>{getLocale('Recently_used')}</span>
        <div className="current-used-colors d-flex mt-2">
          {currentUsedColors.length > 0 ?
            <>
              {currentUsedColors.map((color, index) => {
                const isLight = isLightColor(color);
                return (
                  <div
                    className={`color-item mr-2 ${isLight ? '' : 'dark'}`}
                    onClick={() => onSelectDefaultColor(color)}
                    key={`default-color-${index}`}
                  >
                    <span
                      className="colorinput-color d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: color }}
                    >
                    </span>
                  </div>
                );
              })}
            </> :
            <div className="blank-placeholder d-flex align-items-center justify-content-center">
              <span>/</span>
            </div>
          }
        </div>
      </div>
    );
  };

  const colorPicker = (
    <ClickOutside onClickOutside={onClosePopover}>
      <div style={popoverStyle} ref={colorPickerRef} className="dtable-color-picker">
        {renderDefaultContainer()}
        {renderCustomContainer()}
        {renderUsedContainer()}
      </div>
    </ClickOutside>
  );

  if (useProtal && target && scrollContainerId) {
    return (
      <ColorPickerPortal
        target={target}
        scrollContainerId={scrollContainerId}
        throttleDelay={throttleDelay}
      >
        {colorPicker}
      </ColorPickerPortal>
    );
  }

  return (
    <>
      {colorPicker}
    </>
  );
});

DTableColorPicker.propTypes = {
  color: PropTypes.string.isRequired, // hex format
  defaultColors: PropTypes.array,
  popoverStyle: PropTypes.object,
  onToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  useProtal: PropTypes.bool,
  target: PropTypes.object,
  scrollContainerId: PropTypes.string,
  throttleDelay: PropTypes.number,
};

DTableColorPicker.defaultProps = {
  color: '#ffffff',
};

export default DTableColorPicker;
