import { CellType, DEFAULT_DATE_FORMAT, FORMULA_COLUMN_TYPES_MAP, FORMULA_RESULT_TYPE } from 'dtable-utils';

export const isEnableCheckFormat = (column) => {
  if (!column) return false;
  const { data } = column;
  const { enable_check_format } = data || {};
  if (enable_check_format) return true;
  return false;
};

export const getDateColumnFormat = (column) => {
  const format = (column && column.data && column.data.format) ? column.data.format : DEFAULT_DATE_FORMAT;
  // Old Europe format is D/M/YYYY new format is DD/MM/YYYY
  return format;
};

export function isCheckboxColumn(column) {
  let { type, data } = column;
  if (FORMULA_COLUMN_TYPES_MAP[type]) {
    const { result_type, array_type } = data || {};
    if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
      return array_type === CellType.CHECKBOX;
    }
    return false;
  }
  return type === CellType.CHECKBOX;
}
