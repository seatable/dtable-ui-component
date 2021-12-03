/* eslint-disable no-case-declarations */
import moment from 'moment';
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

NP.enableBoundaryChecking(false);

const _separatorMap = {
  'comma': ',',
  'dot': '.',
  'no': '',
  'space': ' ',
};

const _toThousands = (num, isCurrency, formatData) => {
  let { decimal = 'dot', thousands = 'no', precision = 2, enable_precision = false } = formatData || {};
  const decimalString = _separatorMap[decimal];
  const thousandsString = _separatorMap[thousands];
  let decimalDigits = enable_precision ? precision : _getDecimalDigits(num);
  let value = parseFloat(num.toFixed(decimalDigits));
  let integer = Math.trunc(value);
  let decimalValue = String(Math.abs(NP.minus(value, integer)).toFixed(decimalDigits)).slice(1);
  if (isCurrency) {
    if (decimalValue.length === 2) {
      decimalValue = decimalValue.padEnd(3, '0');
    } else {
      decimalValue = (decimalValue.substring(0, 3) || '.').padEnd(3, '0');
    }
    if (enable_precision) {
      decimalValue = precision === 0 ? '' : decimalValue.slice(0, precision + 1);
    }
  }
  decimalValue = decimalValue.replace(/./, decimalString);
  let result = [], counter = 0;
  integer = Object.is(integer, -0) ? ['-', '0'] : integer.toString().split('');
  for (var i = integer.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(integer[i]);
    if (!(counter % 3) && i !== 0) {
      result.unshift(thousandsString);
    }
  }
  return result.join('') + decimalValue;
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
  let type = Object.prototype.toString.call(value);
  if (type !== '[object Number]') {
    if (type === '[object String]' && value.startsWith('#')) {
      return value;
    }
    return null;
  }
  if (isNaN(value) || value === Infinity || value === -Infinity || (value + '').indexOf('e') > -1) return value + '';
  let { format = DEFAULT_NUMBER_FORMAT } = formatData || {};
  switch(format) {
    case 'number':
      return _toThousands(value, false, formatData);
    case 'percent': {
      return `${_toThousands(Number.parseFloat((value * 100).toFixed(8)), false, formatData)}%`;
    }
    case 'yuan':
      return `￥${_toThousands(value, true, formatData)}`;
    case 'dollar':
      return `$${_toThousands(value, true, formatData)}`;
    case 'euro':
      return `€${_toThousands(value, true, formatData)}`;
    case 'duration': {
      return getDurationDisplayString(value, formatData.duration_format);
    }
    default:
      return '' + value;
  }
};

export const formatStringToNumber = (value) => {
  let isIncludePercent = value.indexOf('%') > -1;
  let newData = parseFloat(value.replace(/[^.-\d]/g, ''));
  if (isIncludePercent && !isNaN(newData)) {
    return newData / 100;
  }
  return isNaN(newData) ? '' : newData;
};

export const formatNumberString = (value, format) => {
  let formattedValue = '';
  switch(format) {
    case NUMBER_TYPES.NUMBER:
    case NUMBER_TYPES.NUMBER_WITH_COMMAS:
      formattedValue = value.replace(/[^.-\d,]/g,'');
      break;
    case NUMBER_TYPES.PERCENT:
      formattedValue = value.replace(/[^.-\d,%]/g, '');
      break;
    case NUMBER_TYPES.YUAN:
      formattedValue = value.replace(/[^.-\d￥,]/g, '');
      break;
    case NUMBER_TYPES.DOLLAR:
      formattedValue = value.replace(/[^.-\d$,]/g, '');
      break;
    case NUMBER_TYPES.EURO:
      formattedValue = value.replace(/[^.-\d€,]/g, '');
      break;
    default:
      formattedValue = value.replace(/[^.-\d,]/g,'');
  }

  return formattedValue;
};

export const getDateDisplayString = (value, format) => {
  let formattedValue = '';
  if (!value) { // value === '', value === undefine, value === null
    return formattedValue;
  }
  const date = moment(value);
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

export const getDurationDisplayString = (value, duration_format) => {
  if (!value && value !== 0) return '';
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

  positiveValue = getMathRoundedDuration(positiveValue, duration_format);
  const decimalParts = (positiveValue + '').split('.');
  const decimalPartsLen = decimalParts.length;
  let decimal = 0;
  if (decimalPartsLen > 1) {
    decimal = decimalParts[decimalPartsLen - 1];
    decimal = decimal ? decimal - 0 : 0;
  }
  const decimalDigits = DURATION_DECIMAL_DIGITS[duration_format];
  const decimalSuffix = getDurationDecimalSuffix(duration_format, decimal);
  let displayString = value < 0 ? '-' : '';
  const hours = parseInt(positiveValue / 3600);
  let minutes = parseInt((positiveValue - hours * 3600) / 60);
  if (duration_format === DURATION_FORMATS_MAP.H_MM) {
    displayString += `${hours}:${minutes > 9 ? minutes : '0' + minutes}`;
    return displayString;
  }
  let seconds = Number.parseFloat((positiveValue - hours * 3600 - minutes * 60).toFixed(decimalDigits));
  if (hours > 0) {
    displayString += `${hours}:`;
    minutes = minutes > 9 ? minutes : `0${minutes}`;
  }
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  displayString += `${minutes}:${seconds}${decimalSuffix}`;
  return displayString;
};

const getMathRoundedDuration = (num, duration_format) => {
  const decimalDigits = DURATION_DECIMAL_DIGITS[duration_format];
  if (decimalDigits < 1) {
    return num;
  }
  const ratio = Math.pow(10, decimalDigits);
  return Math.round(num * ratio) / ratio;
};

const getDurationDecimalSuffix = (duration_format, decimal) => {
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
    return null;
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
