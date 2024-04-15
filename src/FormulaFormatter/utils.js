import { ARRAY_FORMAT_COLUMNS, SIMPLE_CELL_COLUMNS, SIMPLE_CELL_FORMULA_RESULTS } from '../constants';
import getPreviewContent from '../SimpleLongTextFormatter/normalize-long-text-value';

export function isSimpleCellFormatter(type) {
  return SIMPLE_CELL_COLUMNS.includes(type) || SIMPLE_CELL_FORMULA_RESULTS.includes(type);
}

export function isArrayFormatColumn(columnType) {
  return ARRAY_FORMAT_COLUMNS.includes(columnType);
}

export const isFunction = (functionToCheck) => {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export const isValidCellValue = (value) => {
  if (value === undefined) return false;
  if (value === null) return false;
  if (value === '') return false;
  if (JSON.stringify(value) === '{}') return false;
  if (JSON.stringify(value) === '[]') return false;
  return true;
};

export const isValidUrl = (url) => {
  const reg = /^(([-a-zA-Z0-9+.]+):\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

  return reg.test(url);
};

export const openUrlLink = (url) => {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
  document.body.removeChild(a);
};

export const getFormulaArrayValue = (value, isFlat = true) => {
  if (!Array.isArray(value)) {
    return [];
  }
  if (!isFlat) {
    return getTwoDimensionArrayValue(value);
  }
  return value.map(item => {
    if (Object.prototype.toString.call(item) !== '[object Object]' || !Object.prototype.hasOwnProperty.call(item, 'display_value')) {
      return item;
    }
    const { display_value } = item;
    if (!Array.isArray(display_value) || display_value.length === 0) {
      return display_value;
    }
    return display_value.map(i => {
      if (Object.prototype.toString.call(i) === '[object Object]') {
        if (!Object.prototype.hasOwnProperty.call(i, 'display_value')) {
          return i;
        }
        const { display_value } = i;
        return display_value;
      }
      return i;
    });
  }).flat().filter(item => isValidCellValue(item));
};

export const getTwoDimensionArrayValue = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map(item => {
    if (Object.prototype.toString.call(item) !== '[object Object]') {
      return item;
    }
    if (!Object.prototype.hasOwnProperty.call(item, 'display_value')) {
      return item;
    }
    const { display_value } = item;
    if (!Array.isArray(display_value) || display_value.length === 0) {
      return display_value;
    }
    return display_value.map(i => {
      if (Object.prototype.toString.call(i) === '[object Object]') {
        if (!Object.prototype.hasOwnProperty.call(i, 'display_value')) {
          return i;
        }
        const { display_value } = i;
        return display_value;
      }
      return i;
    });
  });
};

export const convertValueToDtableLongTextValue = (value) => {
  const valueType = Object.prototype.toString.call(value);
  if (value && valueType === '[object String]') {
    return getPreviewContent(value);
  }
  if (valueType === '[object Object]') {
    return value;
  }
  return '';
};
