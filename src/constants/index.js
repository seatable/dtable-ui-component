import { CellType, FORMULA_RESULT_TYPE } from 'dtable-utils';
import keyCodes from './key-codes';

export const NUMBER_TYPES = {
  'NUMBER': 'number',
  'NUMBER_WITH_COMMAS': 'number-with-commas',
  'PERCENT': 'percent',
  'YUAN': 'yuan',
  'EURO': 'euro',
  'DOLLAR': 'dollar',
  'CUSTOM_CURRENCY': 'custom_currency'
};

export const DATE_TYPES = {
  'D/M/YYYY': 'D/M/YYYY',
  'D/M/YYYY HH:mm': 'D/M/YYYY HH:mm',
  'M/D/YYYY': 'M/D/YY',
  'M/D/YYYY HH:mm': 'M/D/YYYY HH:mm',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm': 'YYYY-MM-DD HH:mm',
};

export const SIMPLE_CELL_COLUMNS = [
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

export const ARRAY_FORMAT_COLUMNS = [
  CellType.IMAGE,
  CellType.FILE,
  CellType.MULTIPLE_SELECT,
  CellType.COLLABORATOR
];

export const SIMPLE_CELL_FORMULA_RESULTS = [
  FORMULA_RESULT_TYPE.NUMBER,
  FORMULA_RESULT_TYPE.STRING,
  FORMULA_RESULT_TYPE.DATE,
  FORMULA_RESULT_TYPE.BOOL,
];

export const EVENT_BUS_TYPE = {
  OPEN_SELECT: 'open-select',
};

export const DEFAULT_CHECKBOX_MARK_STYLE = { type: 'check', color: '#1DDD1D' };

export const ROW_EXPAND_FOCUS_STYLE = {
  border: '2px solid #3B88FD',
};

export const ROW_EXPAND_BTN_FOCUS_STYLE = {
  border: '2px solid #3B88FD',
};

export const FORMAT_REG_EXP_LIST = {
  'chinese_id_card': /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  'chinese_telephone_number': /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
};

export const DELETED_OPTION_BACKGROUND_COLOR = '#eaeaea';

export const DELETED_OPTION_TIPS = 'Deleted_option';

export const KeyCodes = keyCodes;

export const LONG_TEXT_EXCEED_LIMIT_MESSAGE = 'Long_text_exceed_limit_message';
export const LONG_TEXT_EXCEED_LIMIT_SUGGEST = 'Long_text_exceed_limit_suggest';

export const LONG_TEXT_LENGTH_LIMIT = 10 * 10000;

export const FILE_EDITOR_STATUS = {
  PREVIEWER: 'previewer',
  ADDITION: 'addition',
};
