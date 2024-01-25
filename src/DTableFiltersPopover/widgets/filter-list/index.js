import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  CellType,
  FILTER_COLUMN_OPTIONS,
  FORMULA_COLUMN_TYPES_MAP,
  FORMULA_RESULT_TYPE,
  ValidateFilter,
} from 'dtable-utils';
import FilterItem from '../filter-item';
import { getColumnByKey, FilterItemUtils } from '../../utils';

import './index.css';

const propTypes = {
  isLocked: PropTypes.bool,
  className: PropTypes.string,
  roleId: PropTypes.string,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  filters: PropTypes.array,
  columns: PropTypes.array.isRequired,
  filterConjunction: PropTypes.string.isRequired,
  updateFilter: PropTypes.func.isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilterConjunction: PropTypes.func,
  emptyPlaceholder: PropTypes.string,
  value: PropTypes.object,
  collaborators: PropTypes.array,
  scheduleUpdate: PropTypes.func,
};

class FiltersList extends Component {

  constructor(props) {
    super(props);
    this.conjunctionOptions = null;
    this.columnOptions = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.columns !== this.props.columns) {
      this.columnOptions = null;
    }
  }

  updateFilter = (filterIndex, updatedFilter) => {
    if (!updatedFilter) return;
    this.props.updateFilter(filterIndex, updatedFilter);
  }

  deleteFilter = (index) => {
    const { scheduleUpdate } = this.props;
    this.props.deleteFilter(index, scheduleUpdate);
  };

  updateConjunction = (filterConjunction) => {
    this.props.updateFilterConjunction(filterConjunction);
  }

  getConjunctionOptions = () => {
    if (!this.conjunctionOptions) {
      this.conjunctionOptions = FilterItemUtils.generatorConjunctionOptions();
    }
    return this.conjunctionOptions;
  }

  getFilterColumns = () => {
    const { columns } = this.props;
    return columns.filter(column => {
      const { data } = column;
      let { type } = column;
      if (data && (type === CellType.LINK ||
        (FORMULA_COLUMN_TYPES_MAP[type] && data.result_type === FORMULA_RESULT_TYPE.ARRAY))
      ) {
        type = data.array_type;
      }
      return Object.prototype.hasOwnProperty.call(FILTER_COLUMN_OPTIONS, type);
    });
  }

  getColumnOptions = () => {
    if (!this.columnOptions) {
      const filterColumns = this.getFilterColumns();
      this.columnOptions = filterColumns.map(column => {
        return FilterItemUtils.generatorColumnOption(column);
      });
    }
    return this.columnOptions;
  }

  renderFilterItem = (filter, index, errMsg, filterColumn) => {
    const { filterConjunction, value, roleId, isLocked, collaborators, userDepartmentIdsMap, departments } = this.props;
    const conjunctionOptions = this.getConjunctionOptions();
    const columnOptions = this.getColumnOptions();
    return (
      <FilterItem
        key={index}
        isLocked={isLocked}
        roleId={roleId}
        index={index}
        filter={filter}
        errMsg={errMsg}
        filterColumn={filterColumn}
        filterConjunction={filterConjunction}
        conjunctionOptions={conjunctionOptions}
        filterColumnOptions={columnOptions}
        value={value}
        deleteFilter={this.deleteFilter}
        updateFilter={this.updateFilter}
        updateConjunction={this.updateConjunction}
        collaborators={collaborators}
        userDepartmentIdsMap={userDepartmentIdsMap}
        departments={departments}
      />
    );
  }

  render() {
    let { filters, className, emptyPlaceholder, columns } = this.props;
    const isEmpty = filters.length === 0;
    return (
      <div className={classnames('filters-list', {'empty-filters-container': isEmpty}, {[className]: className})}>
        {isEmpty && <div className="empty-filters-list">{emptyPlaceholder}</div>}
        {!isEmpty &&
          filters.map((filter, index) => {
            const { column_key } = filter;
            const { error_message } = ValidateFilter.validateColumn(column_key, columns);
            const filterColumn = getColumnByKey(column_key, columns) || {};
            return this.renderFilterItem(filter, index, error_message, filterColumn);
          })
        }
      </div>
    );
  }
}

FiltersList.propTypes = propTypes;

export default FiltersList;
