import {
  CellType,
  FORMULA_RESULT_TYPE,
} from 'dtable-utils';

const NUMBER_TYPES = {
  'NUMBER': 'number',
  'NUMBER_WITH_COMMAS': 'number-with-commas',
  'PERCENT': 'percent',
  'YUAN': 'yuan',
  'EURO': 'euro',
  'DOLLAR': 'dollar',
  'CUSTOM_CURRENCY': 'custom_currency'
};

const DATE_TYPES = {
  'D/M/YYYY': 'D/M/YYYY',
  'D/M/YYYY HH:mm': 'D/M/YYYY HH:mm',
  'M/D/YYYY': 'M/D/YY',
  'M/D/YYYY HH:mm': 'M/D/YYYY HH:mm',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm': 'YYYY-MM-DD HH:mm',
};

const SIMPLE_CELL_COLUMNS = [
  CellType.TEXT,
  CellType.NUMBER,
  CellType.DATE,
  CellType.CTIME,
  CellType.MTIME,
  CellType.AUTO_NUMBER,
  CellType.URL,
  CellType.EMAIL,
  CellType.DURATION,
  CellType.CHECKBOX,
  CellType.RATE
];

const ARRAY_FORMAT_COLUMNS = [
  CellType.IMAGE,
  CellType.FILE,
  CellType.MULTIPLE_SELECT,
  CellType.COLLABORATOR
];

const SIMPLE_CELL_FORMULA_RESULTS = [
  FORMULA_RESULT_TYPE.NUMBER,
  FORMULA_RESULT_TYPE.STRING,
  FORMULA_RESULT_TYPE.DATE,
  FORMULA_RESULT_TYPE.BOOL,
];

export {
  CellType,
  NUMBER_TYPES,
  DATE_TYPES,
  FORMULA_RESULT_TYPE,
  SIMPLE_CELL_COLUMNS,
  ARRAY_FORMAT_COLUMNS,
  SIMPLE_CELL_FORMULA_RESULTS,
};
