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
  COLUMN: 'column',
};

export const DEFAULT_NUMBER_FORMAT = 'number';

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
