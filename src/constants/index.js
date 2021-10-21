import * as CellType from './cell-types';

export const NUMBER_TYPES = {
  'NUMBER': 'number',
  'NUMBER_WITH_COMMAS': 'number-with-commas',
  'PERCENT': 'percent',
  'YUAN': 'yuan',
  'EURO': 'euro',
  'DOLLAR': 'dollar'
};

export const DATE_TYPES = {
  'D/M/YYYY': 'D/M/YYYY',
  'D/M/YYYY HH:mm': 'D/M/YYYY HH:mm',
  'M/D/YYYY': 'M/D/YY',
  'M/D/YYYY HH:mm': 'M/D/YYYY HH:mm',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm': 'YYYY-MM-DD HH:mm',
}

export const FORMULA_RESULT_TYPE = {
  NUMBER: 'number',
  STRING: 'string',
  DATE: 'date',
  BOOL: 'bool',
  ARRAY: 'array',
};

export const SIMPLE_CELL_COLUMNS = [
  CellType.TEXT,
  CellType.NUMBER,
  CellType.DATE,
  CellType.CTIME,
  CellType.MTIME,
  CellType.GEOLOCATION,
  CellType.AUTO_NUMBER,
  CellType.URL,
  CellType.EMAIL,
  CellType.DURATION,
  CellType.CHECKBOX,
  CellType.RATE
];

export const ARRAY_FORMAL_COLUMNS = [CellType.IMAGE, CellType.FILE, CellType.MULTIPLE_SELECT, CellType.COLLABORATOR];

export const SIMPLE_CELL_FORMULA_RESULTS = [
  FORMULA_RESULT_TYPE.NUMBER,
  FORMULA_RESULT_TYPE.STRING,
  FORMULA_RESULT_TYPE.DATE,
  FORMULA_RESULT_TYPE.BOOL,
];

export const COLLABORATOR_COLUMN_TYPES = [
  CellType.COLLABORATOR,
  CellType.CREATOR,
  CellType.LAST_MODIFIER
];

export const ARRAY_FORMAL_COLUMNS_TYPES = [
  CellType.IMAGE,
  CellType.FILE,
  CellType.MULTIPLE_SELECT,
  CellType.COLLABORATOR
];

export const DEFAULT_NUMBER_FORMAT = 'number';

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export const DURATION_FORMATS_MAP = {
  H_MM: 'h:mm',
  H_MM_SS: 'h:mm:ss',
};

export const DURATION_FORMATS = [
  {name: DURATION_FORMATS_MAP.H_MM, type: DURATION_FORMATS_MAP.H_MM},
  {name: DURATION_FORMATS_MAP.H_MM_SS, type: DURATION_FORMATS_MAP.H_MM_SS}
];

export const DURATION_ZERO_DISPLAY = {
  [DURATION_FORMATS_MAP.H_MM]: '0:00',
  [DURATION_FORMATS_MAP.H_MM_SS]: '0:00',
};

export const DURATION_DECIMAL_DIGITS = {
  [DURATION_FORMATS_MAP.H_MM]: 0,
  [DURATION_FORMATS_MAP.H_MM_SS]: 0,
};
