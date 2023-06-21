import { CellType } from '../constants';

export const FORMULA_RESULT_TYPE = {
  NUMBER: 'number',
  STRING: 'string',
  DATE: 'date',
  BOOL: 'bool',
  ARRAY: 'array',
};

export const FORMULA_COLUMN_TYPES = [
  CellType.FORMULA,
  CellType.LINK_FORMULA
];
