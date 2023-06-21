import { CellType } from '../constants';
import { isArrayFormalColumn } from './utils';
import NP from './number-precision';
import DateUtils from './date-utils';
import { DURATION_FORMATS_MAP, DURATION_FORMATS, DURATION_ZERO_DISPLAY, DURATION_DECIMAL_DIGITS } from './column-data-constants';
import { FORMULA_RESULT_TYPE } from './formula-constants';

NP.enableBoundaryChecking(false);

const DEFAULT_NUMBER_FORMAT = 'number';

const COLLABORATOR_COLUMN_TYPES = [
  CellType.COLLABORATOR,
  CellType.CREATOR,
  CellType.LAST_MODIFIER
];

const DOWNLOAD_NAME_COLUMN_TYPES = [
  CellType.TEXT,
  CellType.NUMBER,
  CellType.DATE,
  CellType.COLLABORATOR,
  CellType.CREATOR,
  CellType.AUTO_NUMBER
];

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
  if ((num + '').indexOf('e') > -1) {
    if (num < 1 && num > -1) {
      const decimalDigits = enable_precision ? precision : 8;
      return num.toFixed(decimalDigits);
    }
    return num;
  }
  const decimalDigits = enable_precision ? precision : _getDecimalDigits(num);
  let value = parseFloat(num.toFixed(decimalDigits));
  const isMinus = value < 0;
  let integer = Math.trunc(value);
  // format decimal value
  let decimalValue = String(Math.abs(NP.minus(value, integer)).toFixed(decimalDigits)).slice(1);
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
  let type = Object.prototype.toString.call(value);
  if (type !== '[object Number]') {
    if (type === '[object String]' && value.startsWith('#')) {
      return value;
    }
    return null;
  }
  if (isNaN(value) || value === Infinity || value === -Infinity) return value + '';
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
    case 'custom_currency': {
      return `${formatData.currency_symbol || ''}${_toThousands(value, true, formatData)}`;
    }
    default:
      return '' + value;
  }
};

const getCollaboratorsName = (value, collaborators) => {
  if (Array.isArray(value) && value.length > 0 && Array.isArray(collaborators)) {
    let collaboratorsName = [];
    value.forEach(item => {
      let collaborator = collaborators.find(c => c.email === item);
      if (collaborator) {
        collaboratorsName.push(collaborator.name);
      }
    });
    return collaboratorsName.join(',');
  }
  return '';
};

const getOptionName = (options, targetOptionID) => {
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

const getLongtextDisplayString = (value) => {
  let { text } = value || {};
  if (!text) {
    return null;
  }
  return text;
};

export const getCellDisplayValue = (record, column, collaborators) => {
  const { type, data, key } = column;
  if (!DOWNLOAD_NAME_COLUMN_TYPES.includes(type)) return '';
  const cellValue = record[key];
  switch(type) {
    case CellType.NUMBER: {
      return getNumberDisplayString(cellValue, data);
    }
    case CellType.DATE: {
      if (!cellValue || typeof cellValue !== 'string') return '';
      const { format } = data || {};
      return DateUtils.format(cellValue, format);
    }
    case CellType.COLLABORATOR: {
      if (!Array.isArray(cellValue)) return '';
      return getCollaboratorsName(cellValue, collaborators);
    }
    case CellType.CREATOR:
    case CellType.LAST_MODIFIER: {
      if (!cellValue) return '';
      if (cellValue === 'anonymous') return cellValue;
      return getCollaboratorsName([cellValue], collaborators);
    }
    case CellType.SINGLE_SELECT: {
      if (!data) return '';
      const { options } = data;
      return getOptionName(options, cellValue);
    }
    case CellType.MULTIPLE_SELECT: {
      if (!data) return '';
      let { options = [] } = data;
      return getMultipleOptionName(options, cellValue);
    }
    case CellType.FORMULA:
    case CellType.LINK_FORMULA: {
      return getFormulaDisplayString(cellValue, data, collaborators);
    }
    case CellType.LONG_TEXT: {
      return getLongtextDisplayString(cellValue);
    }
    case CellType.DURATION: {
      return getDurationDisplayString(cellValue, data);
    }
    case CellType.CTIME:
    case CellType.MTIME: {
      return DateUtils.format(cellValue.replace('T', ' ').replace('Z', ''), 'YYYY-MM-DD HH:MM:SS');
    }
    default: {
      return cellValue ? cellValue + '' : '';
    }
  }
};

const getFormulaDisplayString = (cellValue, columnData, collaborators) => {
  if (!columnData) return null;
  const { result_type } = columnData;
  if (result_type === FORMULA_RESULT_TYPE.NUMBER) {
    return getNumberDisplayString(cellValue, columnData);
  }
  if (result_type === FORMULA_RESULT_TYPE.DATE) {
    const { format } = columnData;
    return DateUtils.format(cellValue, format);
  }
  if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
    const { array_type, array_data } = columnData;
    if (!array_type) {
      return null;
    }
    if (COLLABORATOR_COLUMN_TYPES.includes(array_type)) {
      return cellValue;
    }
    if (isArrayFormalColumn(array_type) && Array.isArray(cellValue)) {
      return cellValue.map((val) => {
        return getCellDisplayValue(
          {'FORMULA_ARRAY': val  },
          { type: 'array_type', key: 'FORMULA_ARRAY', data: array_data },
          collaborators
        );
      }).join(', ');
    }

    return getCellDisplayValue(
      {'FORMULA_ARRAY': cellValue},
      { type: 'array_type', key: 'FORMULA_ARRAY', data: array_data },
      collaborators,
    );
  }
  if (Object.prototype.toString.call(cellValue) === '[object Boolean]') {
    return cellValue + '';
  }
  return cellValue;
};


function getMathRoundedDuration(num, duration_format) {
  const decimalDigits = DURATION_DECIMAL_DIGITS[duration_format];
  if (decimalDigits < 1) {
    return num;
  }
  const ratio = Math.pow(10, decimalDigits);
  return Math.round(num * ratio) / ratio;
}

function getDurationDecimalSuffix(duration_format, decimal) {
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
