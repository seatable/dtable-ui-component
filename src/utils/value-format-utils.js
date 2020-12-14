import NP from 'number-precision';
import { NUMBER_TYPES, DATE_TYPES } from './constants';
import DEFAULT_NUMBER_FORMAT from './constants';

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
  if (Object.prototype.toString.call(value) !== '[object Number]') return null;
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

  let newValue = value.split(' ');
  let cellDate = newValue[0].split('-');
  switch(format) {
    case DATE_TYPES['D/M/YYYY']:
      formatedValue = `${Number(cellDate[2])}/${Number(cellDate[1])}/${cellDate[0]}`;
      break;
    case DATE_TYPES['D/M/YYYY HH:mm']:
      formatedValue = `${Number(cellDate[2])}/${Number(cellDate[1])}/${cellDate[0]}`;
      if (newValue[1]) {
        formatedValue = `${formatedValue} ${newValue[1]}` 
      }
      break;
    case DATE_TYPES['M/D/YYYY']:
      formatedValue = `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]}`;
      break;
    case DATE_TYPES['M/D/YYYY HH:mm']:
      formatedValue = `${Number(cellDate[1])}/${Number(cellDate[2])}/${cellDate[0]}`;
      if (newValue[1]) {
        formatedValue = `${formatedValue} ${newValue[1]}`;
      }
      break;
    case DATE_TYPES['YYYY-MM-DD']:
      formatedValue = `${cellDate[0]}-${cellDate[1]}-${cellDate[2]}`;
      break;
    case DATE_TYPES['YYYY-MM-DD HH:mm']:
      formatedValue = value;
      break;
    default:
      formatedValue = value;
  }

  return formatedValue;
};