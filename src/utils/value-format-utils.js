import moment from 'moment';
import NP from './number-precision';
import { 
  NUMBER_TYPES, 
  DEFAULT_NUMBER_FORMAT, 
  DURATION_FORMATS_MAP, 
  DURATION_FORMATS, 
  DURATION_ZERO_DISPLAY, 
  DURATION_DECIMAL_DIGITS } from './constants';

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

export const formatNumberToString = (value, formatData) => {
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
  let formatedValue = '';
  switch(format) {
    case NUMBER_TYPES.NUMBER:
    case NUMBER_TYPES.NUMBER_WITH_COMMAS:
      formatedValue = value.replace(/[^.-\d,]/g,'');
      break;
    case NUMBER_TYPES.PERCENT:
      formatedValue = value.replace(/[^.-\d,%]/g, '');
      break;
    case NUMBER_TYPES.YUAN:
      formatedValue = value.replace(/[^.-\d￥,]/g, '');
      break;
    case NUMBER_TYPES.DOLLAR:
      formatedValue = value.replace(/[^.-\d$,]/g, '');
      break;
    case NUMBER_TYPES.EURO:
      formatedValue = value.replace(/[^.-\d€,]/g, '');
      break;
    default:
      formatedValue = value.replace(/[^.-\d,]/g,'');
  }

  return formatedValue;
}

export const formatDateToString = (value, format) => {
  let formatedValue = ''
  if (!value) { // value === '', value === undefine, value === null
    return formatedValue;
  }
  const date = moment(value);
  if (!date.isValid()) return value;
  switch(format) {
    case 'D/M/YYYY':
    case 'DD/MM/YYYY':
      const formatValue = date.format('YYYY-MM-DD');
      const formatValueList = formatValue.split('-');
      return `${formatValueList[2]}/${formatValueList[1]}/${formatValueList[0]}`;
    case 'D/M/YYYY HH:mm':
    case 'DD/MM/YYYY HH:mm':
      const formatValues = date.format('YYYY-MM-DD HH:mm');
      const formatValuesList = formatValues.split(' ')
      const formatDateList = formatValuesList[0].split('-');
      return `${formatDateList[2]}/${formatDateList[1]}/${formatDateList[0]} ${formatValuesList[1]}`;
    case 'M/D/YYYY':
      return date.format('M/D/YYYY');
    case 'M/D/YYYY HH:mm':
      return date.format('M/D/YYYY HH:mm');
    case 'YYYY-MM-DD':
      return date.format('YYYY-MM-DD');
    case 'YYYY-MM-DD HH:mm':
      return date.format('YYYY-MM-DD HH:mm');
    default:
      return value;
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
}

const getMathRoundedDuration = (num, duration_format) => {
  const decimalDigits = DURATION_DECIMAL_DIGITS[duration_format];
  if (decimalDigits < 1) {
    return num;
  }
  const ratio = Math.pow(10, decimalDigits);
  return Math.round(num * ratio) / ratio;
}

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
}

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
