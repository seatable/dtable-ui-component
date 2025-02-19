import { ARRAY_FORMAT_COLUMNS, SIMPLE_CELL_COLUMNS, SIMPLE_CELL_FORMULA_RESULTS } from '../constants';
import getPreviewContent from '../SimpleLongTextFormatter/normalize-long-text-value';

export function isSimpleCellFormatter(type) {
  return SIMPLE_CELL_COLUMNS.includes(type) || SIMPLE_CELL_FORMULA_RESULTS.includes(type);
}

export function isArrayFormatColumn(columnType) {
  return ARRAY_FORMAT_COLUMNS.includes(columnType);
}

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
