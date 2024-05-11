import {
  FILTER_PREDICATE_TYPE,
  FILTER_COLUMN_OPTIONS,
  filterTermModifierNotWithin,
  filterTermModifierIsWithin,
  CellType,
  isDateColumn,
  isNumericColumn,
  FORMULA_RESULT_TYPE,
  COLLABORATOR_COLUMN_TYPES,
  DATE_COLUMN_OPTIONS,
  FORMULA_COLUMN_TYPES_MAP,
  DEFAULT_DATE_FORMAT,
} from 'dtable-utils';
import FilterItemUtils from './filter-item-utils';
import {
  FORMULA_COLUMN_TYPES,
  SPECIAL_TERM_TYPE,
  ARRAY_PREDICATE,
  STRING_PREDICATE,
  DATE_EMPTY_LABEL_MAP,
  MULTIPLE_SELECTOR_COLUMNS,
} from '../constants';

const isArrayFilterTermByArrayType = (array_type) => {
  return COLLABORATOR_COLUMN_TYPES.includes(array_type) ||
    array_type === CellType.SINGLE_SELECT ||
    array_type === CellType.MULTIPLE_SELECT;
};

export const isFilterTermArray = (column, filterPredicate) => {
  const { type, data } = column;
  if (MULTIPLE_SELECTOR_COLUMNS.includes(type)) {
    return true;
  }
  if (type === CellType.SINGLE_SELECT && [FILTER_PREDICATE_TYPE.IS_ANY_OF, FILTER_PREDICATE_TYPE.IS_NONE_OF].includes(filterPredicate)) {
    return true;
  }
  if (FORMULA_COLUMN_TYPES.includes(type)) {
    const { result_type, array_type } = data || {};
    if (result_type !== FORMULA_RESULT_TYPE.ARRAY) return false;
    return isArrayFilterTermByArrayType(array_type);
  }
  if (type === CellType.LINK) {
    const { array_type } = data || {};
    return isArrayFilterTermByArrayType(array_type);
  }
  return false;
};

export const getUpdatedFilterByCreator = (filter, collaborator) => {
  const multipleSelectType = [FILTER_PREDICATE_TYPE.CONTAINS, FILTER_PREDICATE_TYPE.NOT_CONTAIN];
  let { filter_predicate, filter_term: filterTerm } = filter;
  if (multipleSelectType.includes(filter_predicate)) {
    filterTerm = filterTerm ? filter.filter_term.slice(0) : [];
    let selectedEmail = collaborator.email;
    let collaborator_index = filterTerm.indexOf(selectedEmail);
    if (collaborator_index > -1) {
      filterTerm.splice(collaborator_index, 1);
    } else {
      filterTerm.push(selectedEmail);
    }
  } else {
    if (filterTerm[0] === collaborator.email) {
      return;
    }
    filterTerm = [collaborator.email];
  }
  return Object.assign({}, filter, {filter_term: filterTerm});
};

export const getUpdatedFilterBySelectSingle = (filter, columnOption) => {
  let new_filter_term;
  // if predicate is any of / is none of, filter_term is array; else filter_term is string
  if (filter.filter_predicate === FILTER_PREDICATE_TYPE.IS_ANY_OF || filter.filter_predicate === FILTER_PREDICATE_TYPE.IS_NONE_OF) {
    new_filter_term = Array.isArray(filter.filter_term) ? [...filter.filter_term] : [];
    const index = new_filter_term.indexOf(columnOption.id);
    if (index === -1) {
      new_filter_term.push(columnOption.id);
    } else {
      new_filter_term.splice(index, 1);
    }
  } else {
    new_filter_term = columnOption.id;
  }
  return Object.assign({}, filter, {filter_term: new_filter_term});
};

export const getUpdatedFilterBySelectMultiple = (filter, columnOption) => {
  let filterTerm = filter.filter_term ? filter.filter_term : [];
  let index = filterTerm.indexOf(columnOption.id);
  if (index > -1) {
    filterTerm.splice(index, 1);
  } else {
    filterTerm.push(columnOption.id);
  }
  return Object.assign({}, filter, {filter_term: filterTerm});
};

export const getUpdatedFilterByCollaborator = (filter, collaborator) => {
  let filterTerm = filter.filter_term ? filter.filter_term.slice(0) : [];
  let selectedEmail = collaborator.email;
  let collaborator_index = filterTerm.indexOf(selectedEmail);
  if (collaborator_index > -1) {
    filterTerm.splice(collaborator_index, 1);
  } else {
    filterTerm.push(selectedEmail);
  }
  return Object.assign({}, filter, {filter_term: filterTerm});
};

export const getUpdatedFilterByRate = (filter, value) => {
  if (filter.filter_term === value) {
    return;
  }
  return Object.assign({}, filter, {filter_term: value});
};

export const getColumnOptions = (column) => {
  const { type, data } = column;
  if (FORMULA_COLUMN_TYPES.includes(type)) {
    return getFormulaColumnFilterOptions(column);
  }
  if (type === CellType.LINK) {
    const { array_type } = data || {};
    if (array_type === FORMULA_RESULT_TYPE.BOOL) {
      return FILTER_COLUMN_OPTIONS[CellType.CHECKBOX];
    }
    if (array_type === FORMULA_RESULT_TYPE.STRING) {
      return FILTER_COLUMN_OPTIONS[CellType.TEXT];
    }
    return getFilterOptionsByArrayType(array_type);
  }
  return FILTER_COLUMN_OPTIONS[type] || {};
};

const getFormulaColumnFilterOptions = (column) => {
  const { data } = column;
  const { result_type, array_type } = data || {};
  if (result_type === FORMULA_RESULT_TYPE.BOOL) {
    return FILTER_COLUMN_OPTIONS[CellType.CHECKBOX];
  }
  if (result_type === FORMULA_RESULT_TYPE.STRING) {
    return FILTER_COLUMN_OPTIONS[CellType.TEXT];
  }
  if ([FORMULA_RESULT_TYPE.NUMBER, FORMULA_RESULT_TYPE.DATE].includes(result_type)) {
    return FILTER_COLUMN_OPTIONS[result_type];
  }
  if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
    return getFilterOptionsByArrayType(array_type);
  }
  return FILTER_COLUMN_OPTIONS[CellType.TEXT];
};

const getFilterOptionsByArrayType = (array_type) => {
  if (!array_type) {
    return {};
  }
  let checkType = array_type;
  if (COLLABORATOR_COLUMN_TYPES.includes(array_type)) {
    checkType = CellType.COLLABORATOR;
  } else if (array_type === CellType.SINGLE_SELECT || array_type === CellType.DEPARTMENT_SINGLE_SELECT) {
    checkType = CellType.MULTIPLE_SELECT;
  } else if (DATE_COLUMN_OPTIONS.includes(array_type)) {
    checkType = CellType.DATE;
  } else if (isNumericColumn({type: array_type})) {
    checkType = CellType.NUMBER;
  }

  // only support: is
  if (checkType === CellType.CHECKBOX || checkType === CellType.BOOL) {
    return FILTER_COLUMN_OPTIONS[CellType.CHECKBOX];
  }

  let filterOptions = FILTER_COLUMN_OPTIONS[checkType] || FILTER_COLUMN_OPTIONS[CellType.TEXT];
  let { filterPredicateList } = filterOptions;
  if (filterPredicateList && !filterPredicateList.includes(FILTER_PREDICATE_TYPE.EMPTY)) {
    filterPredicateList.push(FILTER_PREDICATE_TYPE.EMPTY);
  }
  if (filterPredicateList && !filterPredicateList.includes(FILTER_PREDICATE_TYPE.NOT_EMPTY)) {
    filterPredicateList.push(FILTER_PREDICATE_TYPE.NOT_EMPTY);
  }
  return filterOptions;
};

export const getFilterByColumn = (column, value, { textDefaultPredicate } = {}, filter = {}) => {
  let { type: columnType, data: columnData } = column;
  let { filterPredicateList } = getColumnOptions(column, value);
  if (!filterPredicateList) return;
  let filterPredicate = filterPredicateList[0];
  if (textDefaultPredicate && columnType === CellType.TEXT && filterPredicateList.includes(textDefaultPredicate)) {
    filterPredicate = textDefaultPredicate;
  }

  let updatedFilter = Object.assign({}, filter, {column_key: column.key, filter_predicate: filterPredicate});

  // text | number | long-text | url | email
  // auto-number | geolocation | duration
  updatedFilter.filter_term = '';

  // checkbox
  if (columnType === CellType.CHECKBOX) {
    updatedFilter.filter_term = false;
    return updatedFilter;
  }
  // rate
  if (columnType === CellType.RATE) {
    const { rate_max_number } = columnData;
    updatedFilter.filter_term = rate_max_number;
    return updatedFilter;
  }
  // single-select | multiple-select | collaborators | creator | last-modifier
  if (isFilterTermArray(column, filterPredicate)) {
    updatedFilter.filter_term = [];
    return updatedFilter;
  }
  // date | ctime | mtime
  if (isDateColumn(column)) {
    let filterTermModifier = filterPredicate === FILTER_PREDICATE_TYPE.IS_WITHIN ? filterTermModifierIsWithin[0] : filterTermModifierNotWithin[0];
    updatedFilter.filter_term_modifier = filterTermModifier;
    updatedFilter.filter_term = '';
    return updatedFilter;
  }
  // formula | link-formula
  if (FORMULA_COLUMN_TYPES.includes(columnType)) {
    const newUpdatedFilter = getFormulaColumnFilter(column, value, filter);
    if (newUpdatedFilter) {
      updatedFilter.filter_term = newUpdatedFilter.filter_term;
    }
    return updatedFilter;
  }
  // link
  if (columnType === CellType.LINK) {
    let { array_type, array_data } = columnData || {};
    if (array_type) {
      if (array_type === FORMULA_RESULT_TYPE.BOOL) {
        array_type = CellType.CHECKBOX;
      }
      if (array_type === FORMULA_RESULT_TYPE.STRING) {
        array_type = CellType.TEXT;
      }
      const linkedColumn = { key: column.key, type: array_type, data: array_data };
      const newUpdatedFilter = getFilterByColumn(linkedColumn, value, filter) || {};
      if (newUpdatedFilter) {
        updatedFilter.filter_term = newUpdatedFilter.filter_term;
      }
    }
    return updatedFilter;
  }

  return updatedFilter;
};

export const getFormulaColumnFilter = (column, value, filter) => {
  const { data } = column;
  let { result_type, array_type, array_data } = data || {};
  if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
    const linkedColumn = { key: column.key, type: array_type, data: array_data };
    return getFilterByColumn(linkedColumn, value, filter);
  }
  // result_type: string | number | bool | date
  if (result_type === FORMULA_RESULT_TYPE.BOOL) {
    array_type = CellType.CHECKBOX;
  }
  if (result_type === FORMULA_RESULT_TYPE.STRING) {
    array_type = CellType.TEXT;
  }
  const linkedColumn = { key: column.key, type: array_type, data: array_data };
  return getFilterByColumn(linkedColumn, value, filter);
};

// file, image : not support
// text, long-text, number, single-select, date, ctime, mtime, formula, link, geolocation : string
// checkbox : boolean
// multiple-select, collaborator, creator, last modifier : array

export const getUpdatedFilterByColumn = (filters, value, filterIndex, column) => {
  const filter = filters[filterIndex];
  if (filter.column_key === column.key) {
    return;
  }
  return getFilterByColumn(column, value, filter);
};

export const getUpdatedFilterByPredicate = (filter, column, filterPredicate) => {
  let updatedFilter = Object.assign({}, filter, {filter_predicate: filterPredicate});
  let { type: columnType } = column;
  if (columnType === CellType.CHECKBOX) {
    updatedFilter.filter_term = false;
    return updatedFilter;
  }
  if ([CellType.SINGLE_SELECT, CellType.DEPARTMENT_SINGLE_SELECT].includes(columnType)) {
    if (ARRAY_PREDICATE[filterPredicate]) {
      if (ARRAY_PREDICATE[filter.filter_predicate] !== ARRAY_PREDICATE[filterPredicate]) {
        updatedFilter.filter_term = [];
      }
    } else if (STRING_PREDICATE[filterPredicate]) {
      if (STRING_PREDICATE[filter.filter_predicate] !== STRING_PREDICATE[filterPredicate]) {
        updatedFilter.filter_term = '';
      }
    } else {
      updatedFilter.filter_term = '';
    }
    return updatedFilter;
  }
  if ([CellType.CREATOR, CellType.LAST_MODIFIER].includes(columnType)) {
    if (STRING_PREDICATE[filter.filter_predicate] !== STRING_PREDICATE[filterPredicate]
      || filterPredicate === FILTER_PREDICATE_TYPE.INCLUDE_ME
    ) {
      updatedFilter.filter_term = [];
    }
  }
  if (isFilterTermArray(column, filterPredicate)) {
    if (DATE_EMPTY_LABEL_MAP[filterPredicate] || filterPredicate === FILTER_PREDICATE_TYPE.INCLUDE_ME) {
      updatedFilter.filter_term = [];
    }
    return updatedFilter;
  }
  if (isDateColumn(column)) {
    let filterTermModifier = filterPredicate === FILTER_PREDICATE_TYPE.IS_WITHIN ? filterTermModifierIsWithin[0] : filterTermModifierNotWithin[0];
    updatedFilter.filter_term_modifier = filterTermModifier;
    return updatedFilter;
  }

  return updatedFilter;
};

export const getUpdatedFilterByTermModifier = (filters, filterIndex, filterTermModifier) => {
  const filter = filters[filterIndex];
  if (filter.filter_term_modifier === filterTermModifier) {
    return;
  }
  return Object.assign({}, filter, {filter_term_modifier: filterTermModifier});
};

export const getUpdatedFilterByNormalTerm = (filters, column, filterIndex, event) => {
  const filter = filters[filterIndex];
  let filterTerm;
  if (column.type === CellType.CHECKBOX) {
    filterTerm = event.target.checked;
  } else {
    filterTerm = event.target.value;
  }
  if (filter.filter_term === filterTerm) {
    return;
  }
  return Object.assign({}, filter, {filter_term: filterTerm});
};

export const getUpdatedFilterBySpecialTerm = (filters, filterIndex, type, value) => {
  const filter = filters[filterIndex];
  switch (type) {
    case SPECIAL_TERM_TYPE.CREATOR: {
      return getUpdatedFilterByCreator(filter, value);
    }
    case SPECIAL_TERM_TYPE.SINGLE_SELECT: {
      return getUpdatedFilterBySelectSingle(filter, value);
    }
    case SPECIAL_TERM_TYPE.MULTIPLE_SELECT: {
      return getUpdatedFilterBySelectMultiple(filter, value);
    }
    case SPECIAL_TERM_TYPE.COLLABORATOR: {
      return getUpdatedFilterByCollaborator(filter, value);
    }
    case SPECIAL_TERM_TYPE.RATE: {
      return getUpdatedFilterByRate(filter, value);
    }
    default: {
      break;
    }
  }
};

export const getColumnByKey = (columns, columnKey) => {
  if (!Array.isArray(columns) || !columnKey ) return null;
  return columns.find(column => column.key === columnKey);
};

export const isCheckboxColumn = (column) => {
  let { type, data } = column;
  if (FORMULA_COLUMN_TYPES_MAP[type]) {
    const { result_type, array_type } = data || {};
    if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
      return array_type === CellType.CHECKBOX;
    }
    return false;
  }
  return type === CellType.CHECKBOX;
};

export const getDateColumnFormat = (column) => {
  const format = (column && column.data && column.data.format) ? column.data.format : DEFAULT_DATE_FORMAT;
  // Old Europe format is D/M/YYYY new format is DD/MM/YYYY
  return format;
};

const getMediaUrl = () => {
  return window?.dtable?.mediaUrl || window?.dtablePluginConfig?.mediaUrl || '/media/';
};

export const generateDefaultUser = (name) => {
  const mediaUrl = getMediaUrl();
  const defaultAvatarUrl = `${mediaUrl}avatars/default.png`;
  return {
    name,
    email: name,
    avatar_url: defaultAvatarUrl,
  };
};

export {
  FilterItemUtils,
};
