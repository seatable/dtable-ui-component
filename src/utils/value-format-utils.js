/* eslint-disable no-case-declarations */
import dayjs from 'dayjs';
import NP from './number-precision';
import {
  CellType,
  NUMBER_TYPES,
  DEFAULT_NUMBER_FORMAT,
  DURATION_FORMATS_MAP,
  DURATION_FORMATS,
  DURATION_ZERO_DISPLAY,
  DURATION_DECIMAL_DIGITS,
  FORMULA_RESULT_TYPE,
  COLLABORATOR_COLUMN_TYPES,
  ARRAY_FORMAL_COLUMNS_TYPES,
  DEFAULT_DATE_FORMAT
} from '../constants';
import { getFloatNumber } from './utils';

NP.enableBoundaryChecking(false);

const _separatorMap = {
  'comma': ',',
  'dot': '.',
  'no': '',
  'space': ' ',
};

/**
 * @param {string} value
 * e.g. removeZerosFromEnd('0.0100') // '0.01'
 */
const removeZerosFromEnd = (value) => {
  if (value.endsWith('0')) {
    return value.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
  }
  return value;
};

const _toThousands = (num, isCurrency, formatData) => {
  let { decimal = 'dot', thousands = 'no', precision = 2, enable_precision = false } = formatData || {};
  const decimalString = _separatorMap[decimal];
  const thousandsString = _separatorMap[thousands];
  if ((num + '').indexOf('e') > -1) {
    if (num < 1 && num > -1) {
      // 1.convert to non-scientific number
      let numericString = num.toFixed(enable_precision ? precision : 8);

      // 2.remove 0 from end of the number which not set precision. e.g. 0.100000
      if (!enable_precision) {
        numericString = removeZerosFromEnd(numericString);
      }

      // 3.remove minus from number which equal to 0. e.g. '-0.00'
      if (parseFloat(numericString) === 0) {
        return numericString.startsWith('-') ? numericString.substring(1) : numericString;
      }
      return numericString;
    }
    return num;
  }
  const decimalDigits = enable_precision ? precision : _getDecimalDigits(num);
  let value = parseFloat(num.toFixed(decimalDigits));
  const isMinus = value < 0;
  let integer = Math.trunc(value);
  // format decimal value
  let decimalValue = String(Math.abs(NP.minus(value, integer)).toFixed(decimalDigits)).slice(1);
  if (!enable_precision) {
    decimalValue = removeZerosFromEnd(decimalValue);
  }
  if (isCurrency) {
    if (!enable_precision) {
      if (decimalValue.length === 2) {
        decimalValue = decimalValue.padEnd(3, '0');
      } else {
        decimalValue = (decimalValue.substring(0, 3) || '.').padEnd(3, '0');
      }
    }
  }
  decimalValue = decimalValue.replace(/./, decimalString);
  // format integer value
  let result = [], counter = 0;
  integer = Math.abs(integer).toString();
  for (var i = integer.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(integer[i]);
    if (!(counter % 3) && i !== 0) {
      result.unshift(thousandsString);
    }
  }
  return (isMinus ? '-' : '') + result.join('') + decimalValue;
};

const _getDecimalDigits = (num) => {
  if (Number.isInteger(num)) {
    return 0;
  }
  let valueArr = (num + '').split('.');
  let digitsLength = valueArr[1] ? valueArr[1].length : 8;
  return digitsLength > 8 ? 8 : digitsLength;
};

export const getNumberDisplayString = (value, formatData) => {
  // formatData: old version maybe 'null'
  const type = Object.prototype.toString.call(value);
  if (type !== '[object Number]') {
    // return formula internal errors directly.
    if (type === '[object String]' && value.startsWith('#')) {
      return value;
    }
    return '';
  }
  if (isNaN(value) || value === Infinity || value === -Infinity) return value + '';
  const { format = DEFAULT_NUMBER_FORMAT } = formatData || {};
  switch(format) {
    case NUMBER_TYPES.NUMBER: {
      return _toThousands(value, false, formatData);
    }
    case NUMBER_TYPES.PERCENT: {
      return `${_toThousands(Number.parseFloat((value * 100).toFixed(8)), false, formatData)}%`;
    }
    case NUMBER_TYPES.YUAN: {
      return `￥${_toThousands(value, true, formatData)}`;
    }
    case NUMBER_TYPES.DOLLAR: {
      return `$${_toThousands(value, true, formatData)}`;
    }
    case NUMBER_TYPES.EURO: {
      return `€${_toThousands(value, true, formatData)}`;
    }
    case 'duration': {
      return getDurationDisplayString(value, formatData);
    }
    case NUMBER_TYPES.CUSTOM_CURRENCY: {
      if (formatData.currency_symbol_position === 'after') {
        return `${_toThousands(value, true, formatData)}${formatData.currency_symbol || ''}`;
      } else {
        return `${formatData.currency_symbol || ''}${_toThousands(value, true, formatData)}`;
      }
    }
    default:
      return '' + value;
  }
};

export const formatStringToNumber = (numberString, formatData) => {
  let { format, decimal, thousands, enable_precision, precision } = formatData || {};
  let value = numberString;
  if (decimal && thousands && decimal === 'comma') {
    if (thousands === 'dot') {
      value = value.replace(/,/, '@');
      value = value.replace(/\./g, ',');
      value = value.replace(/@/, '.');
    } else {
      value = value.replace(/\./g, '');
      value = value.replace(/,/, '.');
    }
  }
  value = getFloatNumber(value, format);
  if (enable_precision && value) {
    if (format === 'percent') {
      precision += 2;
    }
    value = Number(parseFloat(value).toFixed(precision));
  }
  return value;
};

export const replaceNumberNotAllowInput = (value, format = DEFAULT_NUMBER_FORMAT, currency_symbol = null) => {
  if (!value) {
    return '';
  }
  value = value.replace(/。/g, '.');
  switch(format) {
    case NUMBER_TYPES.NUMBER:
    case NUMBER_TYPES.NUMBER_WITH_COMMAS: {
      return value.replace(/[^.-\d,]/g,'');
    }
    case NUMBER_TYPES.PERCENT: {
      return value.replace(/[^.-\d,%]/g, '');
    }
    case NUMBER_TYPES.YUAN: {
      return value.replace(/[^.-\d¥￥,]/g, '');
    }
    case NUMBER_TYPES.DOLLAR: {
      return value.replace(/[^.-\d$,]/g, '');
    }
    case NUMBER_TYPES.EURO: {
      return value.replace(/[^.-\d€,]/g, '');
    }
    case NUMBER_TYPES.CUSTOM_CURRENCY: {
      // eslint-disable-next-line
      const reg = new RegExp('[^.-\d' + currency_symbol + ',]', 'g');
      return value.replace(reg, '');
    }
    default:
      return value.replace(/[^.-\d,]/g, '');
  }
};

export const getDateDisplayString = (value, format) => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  const date = dayjs(value);
  if (!date.isValid()) return value;
  switch(format) {
    case 'D/M/YYYY':
    case 'DD/MM/YYYY':
      // no-case-declarations
      const formatValue = date.format('YYYY-MM-DD');
      const formatValueList = formatValue.split('-');
      return `${formatValueList[2]}/${formatValueList[1]}/${formatValueList[0]}`;
    case 'D/M/YYYY HH:mm':
    case 'DD/MM/YYYY HH:mm':
      const formatValues = date.format('YYYY-MM-DD HH:mm');
      const formatValuesList = formatValues.split(' ');
      const formatDateList = formatValuesList[0].split('-');
      return `${formatDateList[2]}/${formatDateList[1]}/${formatDateList[0]} ${formatValuesList[1]}`;
    case 'M/D/YYYY':
    case 'M/D/YYYY HH:mm':
    case 'YYYY-MM-DD':
    case 'YYYY-MM-DD HH:mm':
    case 'DD.MM.YYYY':
    case 'DD.MM.YYYY HH:mm':
      return date.format(format);
    default:
      return date.format('YYYY-MM-DD');
  }
};

const _getMathRoundedDuration = (num, duration_format) => {
  const decimalDigits = DURATION_DECIMAL_DIGITS[duration_format];
  if (decimalDigits < 1) {
    return num;
  }
  const ratio = Math.pow(10, decimalDigits);
  return Math.round(num * ratio) / ratio;
};

const _getDurationDecimalSuffix = (duration_format, decimal) => {
  if (duration_format === DURATION_FORMATS_MAP.H_MM_SS_S) {
    return decimal === 0 ? '.0' : '';
  } else if (duration_format === DURATION_FORMATS_MAP.H_MM_SS_SS) {
    if (decimal === 0) {
      return '.00';
    } else if (decimal < 10) {
      return '0';
    }
  } else if (duration_format === DURATION_FORMATS_MAP.H_MM_SS_SSS) {
    if (decimal === 0) {
      return '.000';
    } else if (decimal < 10) {
      return '00';
    } else if (decimal < 100) {
      return '0';
    }
  }
  return '';
};

export const getDurationDisplayString = (value, data) => {
  if (!value && value !== 0) return '';
  let { duration_format } = data || {};
  duration_format = duration_format || DURATION_FORMATS_MAP.H_MM;
  if (DURATION_FORMATS.findIndex((format) => format.type === duration_format) < 0) {
    return '';
  }
  if (value === 0) {
    return DURATION_ZERO_DISPLAY[duration_format];
  }
  const includeDecimal = duration_format.indexOf('.') > -1;
  let positiveValue = Math.abs(value);
  if (!includeDecimal) {
    positiveValue = Math.round(positiveValue);
  }

  positiveValue = _getMathRoundedDuration(positiveValue, duration_format);
  const decimalParts = (positiveValue + '').split('.');
  const decimalPartsLen = decimalParts.length;
  let decimal = 0;
  if (decimalPartsLen > 1) {
    decimal = decimalParts[decimalPartsLen - 1];
    decimal = decimal ? decimal - 0 : 0;
  }
  const decimalDigits = DURATION_DECIMAL_DIGITS[duration_format];
  const decimalSuffix = _getDurationDecimalSuffix(duration_format, decimal);
  let displayString = value < 0 ? '-' : '';
  let hours = parseInt(positiveValue / 3600);
  let minutes = parseInt((positiveValue - hours * 3600) / 60);
  if (duration_format === DURATION_FORMATS_MAP.H_MM) {
    displayString += `${hours}:${minutes > 9 ? minutes : '0' + minutes}`;
    return displayString;
  }
  let seconds = Number.parseFloat((positiveValue - hours * 3600 - minutes * 60).toFixed(decimalDigits));
  minutes = minutes > 9 ? minutes : `0${minutes}`;
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  displayString += `${hours}:${minutes}:${seconds}${decimalSuffix}`;
  return displayString;
};

export const getOptionName = (options, targetOptionID) => {
  if (!targetOptionID || !options || !Array.isArray(options)) return null;
  let option = options.find(option => option.id === targetOptionID);
  return option ? option.name : null;
};

export const getMultipleOptionName = (options, cellVal) => {
  if (!cellVal || !options || !Array.isArray(options)) return null;
  let selectedOptions = options.filter((option) => cellVal.includes(option.id));
  if (selectedOptions.length === 0) return null;
  return selectedOptions.map((option) => option.name).join(', ');
};

export const getLongtextDisplayString = (value) => {
  let { text } = value || {};
  if (!text) {
    return null;
  }
  return text;
};

export const getCollaboratorsName = (collaborators, cellVal) => {
  if (cellVal) {
    let collaboratorsName = [];
    cellVal.forEach((v) => {
      let collaborator = collaborators.find(c => c.email === v);
      if (collaborator) {
        collaboratorsName.push(collaborator.name);
      }
    });
    if (collaboratorsName.length === 0) {
      return null;
    }
    return collaboratorsName.join(', ');
  }
  return null;
};

export const getGeolocationDisplayString = (value, columnData) => {
  const { geo_format } = columnData || {};
  const cellValue = value || {};
  if (!value) {
    return '';
  }
  if (geo_format === 'lng_lat' && value.lng && value.lat) {
    return `${cellValue.lng}, ${cellValue.lat}`;
  }
  if (geo_format === 'country_region' && cellValue.country_region) {
    return value.country_region || '';
  }

  const { province, city, district, detail } = cellValue;
  if (geo_format === 'province') {
    return `${province || ''}`;
  }

  if (geo_format === 'province_city') {
    return `${province || ''}${city || ''}`;
  }

  return `${province || ''}${city || ''}${district || ''}${detail || ''}`;
};

export const getFormulaDisplayString = (cellValue, columnData, { collaborators = [] } = {}) => {
  if (!columnData) {
    return null;
  }
  const { result_type } = columnData;
  if (result_type === FORMULA_RESULT_TYPE.NUMBER) {
    return getNumberDisplayString(cellValue, columnData);
  }
  if (result_type === FORMULA_RESULT_TYPE.DATE) {
    const { format } = columnData;
    return getDateDisplayString(cellValue, format);
  }
  if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
    const { array_type, array_data } = columnData;
    if (!array_type) {
      return null;
    }
    if (COLLABORATOR_COLUMN_TYPES.includes(array_type)) {
      return cellValue;
    }
    if (ARRAY_FORMAL_COLUMNS_TYPES.indexOf(array_type) < 0 && Array.isArray(cellValue)) {
      return cellValue.map((val) => {
        return getCellValueDisplayString(
          val,
          array_type,
          { data: array_data, collaborators }
        );
      }).join(', ');
    }

    return getCellValueDisplayString(
      cellValue,
      array_type,
      { data: array_data, collaborators }
    );
  }
  if (Object.prototype.toString.call(cellValue) === '[object Boolean]') {
    return cellValue + '';
  }
  return cellValue;
};

export function getCellValueDisplayString(cellValue, type, { data, collaborators = [] } = {}) {
  let newData = data || {};
  switch (type) {
    case CellType.GEOLOCATION: {
      return getGeolocationDisplayString(cellValue, data);
    }
    case CellType.SINGLE_SELECT: {
      if (!data) return '';
      let { options } = newData;
      return getOptionName(options, cellValue);
    }
    case CellType.MULTIPLE_SELECT: {
      if (!data) return '';
      let { options } = newData;
      return getMultipleOptionName(options, cellValue);
    }
    case CellType.FORMULA:
    case CellType.LINK_FORMULA: {
      return getFormulaDisplayString(cellValue, newData, { collaborators});
    }
    case CellType.LONG_TEXT: {
      return getLongtextDisplayString(cellValue);
    }
    case CellType.NUMBER: {
      return getNumberDisplayString(cellValue, newData);
    }
    case CellType.DATE: {
      let { format = DEFAULT_DATE_FORMAT } = newData || {};
      return getDateDisplayString(cellValue, format);
    }
    case CellType.CREATOR:
    case CellType.LAST_MODIFIER: {
      return cellValue === 'anonymous' ? cellValue : getCollaboratorsName(collaborators, [cellValue]);
    }
    case CellType.COLLABORATOR: {
      return getCollaboratorsName(collaborators, cellValue);
    }
    case CellType.DURATION: {
      return getDurationDisplayString(cellValue, data);
    }
    default: {
      return cellValue ? cellValue + '' : '';
    }
  }
}
