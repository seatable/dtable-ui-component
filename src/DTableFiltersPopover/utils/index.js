import {
  FILTER_PREDICATE_TYPE,
  FILTER_COLUMN_OPTIONS,
  filterTermModifierNotWithin,
  filterTermModifierIsWithin,
  CellType,
  isDateColumn,
  isNumericColumn,
  FORMULA_RESULT_TYPE,
  FILTER_CONJUNCTION_TYPE,
  COLLABORATOR_COLUMN_TYPES,
  DATE_COLUMN_OPTIONS,
  FORMULA_COLUMN_TYPES_MAP,
} from 'dtable-utils';
import FilterItemUtils from './filter-item-utils';
import {
  ARRAY_PREDICATE,
  STRING_PREDICATE,
  DATE_EMPTY_LABEL_MAP,
  FILTER_OPERATION_TYPE,
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
  if (FORMULA_COLUMN_TYPES_MAP[type]) {
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
  return Object.assign({}, filter, { filter_term: filterTerm });
};

export const getUpdatedFilterBySelectSingle = (filter, columnOption) => {
  let new_filter_term;
  // if predicate is any of / is none of, filter_term is array; else filter_term is string
  if (ARRAY_PREDICATE[filter.filter_predicate]) {
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
  return Object.assign({}, filter, { filter_term: new_filter_term });
};

export const getUpdatedFilterBySelectMultiple = (filter, columnOption) => {
  let filterTerm = filter.filter_term ? filter.filter_term : [];
  let index = filterTerm.indexOf(columnOption.id);
  if (index > -1) {
    filterTerm.splice(index, 1);
  } else {
    filterTerm.push(columnOption.id);
  }
  return Object.assign({}, filter, { filter_term: filterTerm });
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
  return Object.assign({}, filter, { filter_term: filterTerm });
};

export const getUpdatedFilterByRate = (filter, value) => {
  if (filter.filter_term === value) {
    return null;
  }
  return Object.assign({}, filter, { filter_term: value });
};

export const getColumnOptions = (column) => {
  const { type, data } = column;
  if (FORMULA_COLUMN_TYPES_MAP[type]) {
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
  } else if (isNumericColumn({ type: array_type })) {
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

export const getFilterByColumn = (column, filter = {}) => {
  let { type: columnType, data: columnData } = column;
  let { filterPredicateList } = getColumnOptions(column);
  if (!filterPredicateList) return;
  let filterPredicate = filterPredicateList[0];

  let updatedFilter = Object.assign({}, filter, { column_key: column.key, filter_predicate: filterPredicate });

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
  if (FORMULA_COLUMN_TYPES_MAP[columnType]) {
    const newUpdatedFilter = getFormulaColumnFilter(column, filter);
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
      const newUpdatedFilter = getFilterByColumn(linkedColumn, filter) || {};
      if (newUpdatedFilter) {
        updatedFilter.filter_term = newUpdatedFilter.filter_term;
      }
    }
    return updatedFilter;
  }

  return updatedFilter;
};

export const getFormulaColumnFilter = (column, filter) => {
  const { data } = column;
  let { result_type, array_type, array_data } = data || {};
  if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
    const linkedColumn = { key: column.key, type: array_type, data: array_data };
    return getFilterByColumn(linkedColumn, filter);
  }
  // result_type: string | number | bool | date
  if (result_type === FORMULA_RESULT_TYPE.BOOL) {
    array_type = CellType.CHECKBOX;
  }
  if (result_type === FORMULA_RESULT_TYPE.STRING) {
    array_type = CellType.TEXT;
  }
  const linkedColumn = { key: column.key, type: array_type, data: array_data };
  return getFilterByColumn(linkedColumn, filter);
};

// file, image : not support
// text, long-text, number, single-select, date, ctime, mtime, formula, link, geolocation : string
// checkbox : boolean
// multiple-select, collaborator, creator, last modifier : array

export const getUpdatedFilterByColumn = (filters, filterIndex, column) => {
  const filter = filters[filterIndex];
  if (filter.column_key === column.key) {
    return;
  }
  return getFilterByColumn(column, filter);
};

export const getUpdatedFilterByPredicate = (filter, column, filterPredicate) => {
  let updatedFilter = Object.assign({}, filter, { filter_predicate: filterPredicate });
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

export const getColumnByKey = (columnKey, columns) => {
  if (!Array.isArray(columns) || !columnKey) return null;
  return columns.find(column => column.key === columnKey);
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

export const getDefaultFilter = (columns) => {
  if (!columns) return null;
  let defaultColumn = columns[0];
  if (!FILTER_COLUMN_OPTIONS[defaultColumn.type]) {
    defaultColumn = columns.find((c) => FILTER_COLUMN_OPTIONS[c.type]);
  }
  if (!defaultColumn) return null;
  return getFilterByColumn(defaultColumn);
};

export const getDefaultFilterGroup = (columns) => {
  const defaultFilter = getDefaultFilter(columns);
  if (!defaultFilter) {
    return null;
  }
  const filters = [defaultFilter];
  return {
    filter_conjunction: FILTER_CONJUNCTION_TYPE.AND,
    filters,
  };
};

export const getFormulaAndLinkFilters = (filters, columns) => {
  let formulaFilters = [];
  filters.forEach(filter => {
    const filterColumn = columns.find(column => column.key === filter?.column_key);
    const { type } = filterColumn;
    if (FORMULA_COLUMN_TYPES_MAP[type] || type === CellType.LINK) {
      formulaFilters.push(filter);
    }
  });
  return formulaFilters;
};

export const getFilterColumns = (columns) => {
  return columns.filter(column => {
    const { data, type } = column;
    if (data && (type === CellType.LINK ||
      (FORMULA_COLUMN_TYPES_MAP[type] && data.result_type === FORMULA_RESULT_TYPE.ARRAY))
    ) {
      return Object.prototype.hasOwnProperty.call(FILTER_COLUMN_OPTIONS, data.array_type);
    }
    return Object.prototype.hasOwnProperty.call(FILTER_COLUMN_OPTIONS, type);
  });
};

export const applyFilterOperation = (operation) => {
  const { type, filter_conjunction, filters, payload } = operation;

  switch (type) {
    case FILTER_OPERATION_TYPE.MODIFY_CONJUNCTION: {
      const { new_filter_conjunction } = payload;
      return {
        filter_conjunction: new_filter_conjunction,
        filters,
      };
    }
    case FILTER_OPERATION_TYPE.DELETE_FILTER: {
      const { filter_index } = payload;
      let updatedFilters = [...filters];
      if (!updatedFilters[filter_index]) {
        return { filter_conjunction, filters };
      }
      updatedFilters.splice(filter_index, 1);
      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    case FILTER_OPERATION_TYPE.UPDATE_FILTER: {
      const { filter_index, new_filter } = payload;
      let updatedFilters = [...filters];
      if (!updatedFilters[filter_index]) {
        return { filter_conjunction, filters };
      }
      updatedFilters[filter_index] = new_filter;
      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    case FILTER_OPERATION_TYPE.MOVE_FILTER: {
      const { source_filter_index, target_filter_index, source_group_index, target_group_index } = payload;
      const isFromFilterGroup = typeof source_group_index === 'number';
      const isToFilterGroup = typeof target_group_index === 'number';
      let updatedFilters = [...filters];

      // move filter(not in group) or filter-group over filter(not in group) or filter-group
      if (!isFromFilterGroup && !isToFilterGroup) {
        const movedFilter = updatedFilters[source_filter_index];
        if (!movedFilter) {
          return { filter_conjunction, filters };
        }
        updatedFilters.splice(source_filter_index, 1);
        updatedFilters.splice(target_filter_index, 0, movedFilter);
        return {
          filter_conjunction,
          filters: updatedFilters,
        };
      }

      // source
      let sourceFilters = null;
      if (isFromFilterGroup) {
        const filterGroup = updatedFilters[source_group_index];
        const subFilters = filterGroup && filterGroup.filters;
        sourceFilters = subFilters;
      } else {
        sourceFilters = updatedFilters;
      }

      // target
      let targetFilters = null;
      if (isToFilterGroup) {
        const filterGroup = updatedFilters[target_group_index];
        const subFilters = filterGroup && filterGroup.filters;
        targetFilters = subFilters;
      } else {
        targetFilters = updatedFilters;
      }

      const movedFilter = sourceFilters && sourceFilters[source_filter_index];
      if (!movedFilter || !targetFilters) {
        return { filter_conjunction, filters };
      }

      let targetIndex = target_filter_index;
      if ((isFromFilterGroup || isToFilterGroup) && source_group_index !== target_group_index) {
        targetIndex = target_filter_index + 1;
      }
      sourceFilters.splice(source_filter_index, 1);
      targetFilters.splice(targetIndex, 0, movedFilter);

      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    case FILTER_OPERATION_TYPE.ADD_FILTER_INTO_GROUP: {
      const { filter, group_index } = payload;
      let updatedFilters = [...filters];
      let updatedFilterGroup = updatedFilters[group_index];
      if (!updatedFilterGroup) {
        return { filter_conjunction, filters };
      }
      if (!Array.isArray(updatedFilterGroup.filters)) {
        updatedFilterGroup.filters = [filter];
      } else {
        updatedFilterGroup.filters.push(filter);
      }
      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    case FILTER_OPERATION_TYPE.MODIFY_CONJUNCTION_IN_GROUP: {
      const { group_index, new_filter_conjunction } = payload;
      let updatedFilters = [...filters];
      let updatedFilterGroup = updatedFilters[group_index];
      if (!updatedFilterGroup) {
        return { filter_conjunction, filters };
      }
      updatedFilterGroup.filter_conjunction = new_filter_conjunction;
      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    case FILTER_OPERATION_TYPE.DELETE_FILTER_IN_GROUP: {
      const { group_index, filter_index } = payload;
      let updatedFilters = [...filters];
      let updatedFilterGroup = updatedFilters[group_index];
      if (!updatedFilterGroup || !updatedFilterGroup.filters || !updatedFilterGroup.filters[filter_index]) {
        return { filter_conjunction, filters };
      }
      let subFilters = [...updatedFilterGroup.filters];
      subFilters.splice(filter_index, 1);
      updatedFilterGroup.filters = subFilters;
      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    case FILTER_OPERATION_TYPE.UPDATE_FILTER_IN_GROUP: {
      const { group_index, filter_index, new_filter } = payload;
      let updatedFilters = [...filters];
      let updatedFilterGroup = updatedFilters[group_index];
      if (!updatedFilterGroup || !updatedFilterGroup.filters || !updatedFilterGroup.filters[filter_index]) {
        return { filter_conjunction, filters };
      }
      let subFilters = [...updatedFilterGroup.filters];
      subFilters[filter_index] = new_filter;
      updatedFilterGroup.filters = subFilters;
      return {
        filter_conjunction,
        filters: updatedFilters,
      };
    }
    default: {
      return { filter_conjunction, filters };
    }
  }
};

export const getCollaboratorUpdatedFilterTerm = (filterTerm, collaborator) => {
  let newFilterTerm = filterTerm ? filterTerm.slice(0) : [];
  const selectedEmail = collaborator.email;
  const index = newFilterTerm.indexOf(selectedEmail);
  if (index > -1) {
    newFilterTerm.splice(index, 1);
  } else {
    newFilterTerm.push(selectedEmail);
  }
  return newFilterTerm;
};

export const getCreatorUpdatedFilterTerm = (filterTerm, filterPredicate, collaborator) => {
  const multipleSelectType = [FILTER_PREDICATE_TYPE.CONTAINS, FILTER_PREDICATE_TYPE.NOT_CONTAIN];
  let newFilterTerm = filterTerm;
  if (multipleSelectType.includes(filterPredicate)) {
    newFilterTerm = newFilterTerm ? newFilterTerm.slice(0) : [];
    const selectedEmail = collaborator.email;
    const index = newFilterTerm.indexOf(selectedEmail);
    if (index > -1) {
      newFilterTerm.splice(index, 1);
    } else {
      newFilterTerm.push(selectedEmail);
    }
  } else {
    if (newFilterTerm[0] === collaborator.email) {
      return newFilterTerm;
    }
    newFilterTerm = [collaborator.email];
  }
  return newFilterTerm;
};

export const getFilterConfigOptions = (column) => {
  const { type, data } = column;
  if (FORMULA_COLUMN_TYPES_MAP[type]) {
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

export const getMultipleSelectUpdatedFilterTerm = (filterTerm, option) => {
  let newFilterTerm = filterTerm || [];
  const index = newFilterTerm.indexOf(option.id);
  if (index > -1) {
    newFilterTerm.splice(index, 1);
  } else {
    newFilterTerm.push(option.id);
  }
  return newFilterTerm;
};

export const getSingleSelectUpdatedFilterTerm = (filterTerm, filterPredicate, option) => {
  let newFilterTerm;

  // if predicate is any of / is none of, filter_term is array; else filter_term is string
  if (ARRAY_PREDICATE[filterPredicate]) {
    newFilterTerm = Array.isArray(filterTerm) ? [...filterTerm] : [];
    const index = newFilterTerm.indexOf(option.id);
    if (index === -1) {
      newFilterTerm.push(option.id);
    } else {
      newFilterTerm.splice(index, 1);
    }
  } else {
    newFilterTerm = option.id;
  }
  return newFilterTerm;
};

export {
  FilterItemUtils,
};
