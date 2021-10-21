import { ARRAY_FORMAL_COLUMNS, SIMPLE_CELL_COLUMNS, SIMPLE_CELL_FORMULA_RESULTS } from '../constants';

export function isSimpleCellFormatter(type) {
  return SIMPLE_CELL_COLUMNS.includes(type) ||
    SIMPLE_CELL_FORMULA_RESULTS.includes(type);
}

export function isArrayFormalColumn(columnType) {
  return ARRAY_FORMAL_COLUMNS.includes(columnType);
}
