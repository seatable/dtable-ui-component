import {
  FILTER_PREDICATE_TYPE,
  FILTER_TERM_MODIFIER_TYPE,
  CellType,
  FORMULA_RESULT_TYPE,
  FILTER_CONJUNCTION_TYPE,
  FILTER_ERR_MSG,
} from 'dtable-utils';

const FORMULA_COLUMN_TYPES = [CellType.FORMULA, CellType.LINK_FORMULA];

const SPECIAL_TERM_TYPE = {
  CREATOR: 'creator',
  SINGLE_SELECT: 'single_select',
  MULTIPLE_SELECT: 'multiple_select',
  COLLABORATOR: 'collaborator',
  RATE: 'rate'
};

const SIMPLE_TEXT_INPUT_COLUMNS_MAP = {
  [CellType.TEXT]: true,
  [CellType.LONG_TEXT]: true,
  [CellType.GEOLOCATION]: true,
  [CellType.AUTO_NUMBER]: true,
  [CellType.EMAIL]: true,
  [CellType.URL]: true,
  [CellType.IMAGE]: true,
  [CellType.FILE]: true,
  [FORMULA_RESULT_TYPE.STRING]: true,
  [FORMULA_RESULT_TYPE.BOOL]: true,
};

const DATE_LABEL_MAP = {
  [FILTER_TERM_MODIFIER_TYPE.EXACT_DATE]: true,
  [FILTER_TERM_MODIFIER_TYPE.NUMBER_OF_DAYS_AGO]: true,
  [FILTER_TERM_MODIFIER_TYPE.NUMBER_OF_DAYS_FROM_NOW]: true,
  [FILTER_TERM_MODIFIER_TYPE.THE_NEXT_NUMBERS_OF_DAYS]: true,
  [FILTER_TERM_MODIFIER_TYPE.THE_PAST_NUMBERS_OF_DAYS]: true,
};

const ARRAY_PREDICATE = {
  [FILTER_PREDICATE_TYPE.IS_ANY_OF]: true,
  [FILTER_PREDICATE_TYPE.IS_NONE_OF]: true
};

const STRING_PREDICATE = {
  [FILTER_PREDICATE_TYPE.IS]: true,
  [FILTER_PREDICATE_TYPE.IS_NOT]: true
};

const DATE_EMPTY_LABEL_MAP = {
  [FILTER_PREDICATE_TYPE.EMPTY]: true,
  [FILTER_PREDICATE_TYPE.NOT_EMPTY]: true,
};

const MULTIPLE_SELECTOR_COLUMNS = [CellType.MULTIPLE_SELECT, CellType.COLLABORATOR, CellType.CREATOR, CellType.LAST_MODIFIER];

const FILTER_TERM_MODIFIER_SHOW = {
  'today': 'Today',
  'tomorrow': 'Tomorrow',
  'yesterday': 'Yesterday',
  'one_week_ago': 'One_week_ago',
  'one_week_from_now': 'One_week_from_now',
  'one_month_ago': 'One_month_ago',
  'one_month_from_now': 'One_month_from_now',
  'number_of_days_ago': 'Number_of_days_ago',
  'number_of_days_from_now': 'Number_of_days_from_now',
  'exact_date': 'Exact_date',
  'the_past_week': 'Last_week',
  'the_past_month': 'Last_month',
  'the_past_year': 'Last_year',
  'the_next_week': 'The_next_week',
  'the_next_month': 'The_next_month',
  'the_next_year': 'The_next_year',
  'the_next_numbers_of_days': 'The_next_numbers_of_days',
  'the_past_numbers_of_days': 'The_past_numbers_of_days',
  'this_week': 'This_week',
  'this_month': 'This_month',
  'this_year': 'This_year'
};

const FILTER_ACTION_TYPE = {
  DELETE: 'delete',
  ADD: 'add',
  UPDATE_FILTER_CONJUNCTION: 'update_filter_conjunction',
  UPDATE_FILTER: 'update_filter',
};

const FILTER_ERR_MSG_LIST = [
  FILTER_ERR_MSG.INVALID_FILTER,
  FILTER_ERR_MSG.INCOMPLETE_FILTER,
  FILTER_ERR_MSG.COLUMN_MISSING,
  FILTER_ERR_MSG.COLUMN_NOT_SUPPORTED,
  FILTER_ERR_MSG.UNMATCHED_PREDICATE,
  FILTER_ERR_MSG.UNMATCHED_MODIFIER,
  FILTER_ERR_MSG.INVALID_TERM,
];

const FILTER_OPERATION_TYPE = {
  MODIFY_CONJUNCTION: 'MODIFY_CONJUNCTION',
  DELETE_FILTER: 'DELETE_FILTER',
  UPDATE_FILTER: 'UPDATE_FILTER',
  ADD_FILTER: 'ADD_FILTER',
  MOVE_FILTER: 'MOVE_FILTER',
  MODIFY_CONJUNCTION_IN_GROUP: 'MODIFY_CONJUNCTION_IN_GROUP',
  ADD_FILTER_INTO_GROUP: 'ADD_FILTER_INTO_GROUP',
  DELETE_FILTER_IN_GROUP: 'DELETE_FILTER_IN_GROUP',
  UPDATE_FILTER_IN_GROUP: 'UPDATE_FILTER_IN_GROUP',
};

const INPUT_CMP_TYPE_MAP = {
  TEXT: 'text',
  NUMBER: 'number',
  DURATION: 'duration',
  CHECKBOX: 'checkbox',
};

const SUPPORT_CONJUNCTIONS = [FILTER_CONJUNCTION_TYPE.AND, FILTER_CONJUNCTION_TYPE.OR];

const EMPTY_PREDICATE = [FILTER_PREDICATE_TYPE.EMPTY, FILTER_PREDICATE_TYPE.NOT_EMPTY];

const DELETED_OPTION_BACKGROUND_COLOR = '#eaeaea';

const DELETED_OPTION_TIPS = 'deleted_option';

export {
  FORMULA_COLUMN_TYPES,
  SPECIAL_TERM_TYPE,
  SIMPLE_TEXT_INPUT_COLUMNS_MAP,
  DATE_LABEL_MAP,
  ARRAY_PREDICATE,
  STRING_PREDICATE,
  DATE_EMPTY_LABEL_MAP,
  MULTIPLE_SELECTOR_COLUMNS,
  FILTER_TERM_MODIFIER_SHOW,
  FILTER_ACTION_TYPE,
  SUPPORT_CONJUNCTIONS,
  EMPTY_PREDICATE,
  FILTER_ERR_MSG_LIST,
  FILTER_OPERATION_TYPE,
  INPUT_CMP_TYPE_MAP,
  DELETED_OPTION_BACKGROUND_COLOR,
  DELETED_OPTION_TIPS,
};
