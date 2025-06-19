import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  checkIsFilterGroup,
  ValidateFilter,
} from 'dtable-utils';
import FilterItemUtils from '../../utils/filter-item-utils';
import FilterItem from '../filter-item';
import { applyFilterOperation, getColumnByKey, getFilterColumns } from '../../utils';
import { FILTER_OPERATION_TYPE } from '../../constants';
import FilterGroup from '../filter-group';

import './index.css';

const propTypes = {
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  lang: PropTypes.string,
  filters: PropTypes.array,
  columns: PropTypes.array.isRequired,
  filterConjunction: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
  emptyPlaceholder: PropTypes.string,
  collaborators: PropTypes.array,
  isInModal: PropTypes.bool,
  firstDayOfWeek: PropTypes.string,
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

  modifyFilterConjunction = (new_filter_conjunction) => {
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.MODIFY_CONJUNCTION,
      filter_conjunction,
      filters,
      payload: {
        new_filter_conjunction,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  updateFilter = (filter_index, new_filter) => {
    if (!new_filter) return;
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.UPDATE_FILTER,
      filter_conjunction,
      filters,
      payload: {
        filter_index,
        new_filter,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  deleteFilter = (filter_index) => {
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.DELETE_FILTER,
      filter_conjunction,
      filters,
      payload: {
        filter_index,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  moveFilter = ({ source_filter_index, target_filter_index, source_group_index, target_group_index }) => {
    if (source_filter_index === target_filter_index && source_group_index === target_group_index) {
      return;
    }
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.MOVE_FILTER,
      filter_conjunction,
      filters,
      payload: {
        source_filter_index,
        target_filter_index,
        source_group_index,
        target_group_index,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  modifyConjunctionInGroup = (group_index, new_filter_conjunction) => {
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.MODIFY_CONJUNCTION_IN_GROUP,
      filter_conjunction,
      filters,
      payload: {
        group_index,
        new_filter_conjunction,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  addFilterIntoGroup = (group_index, filter) => {
    if (!filter) return;
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.ADD_FILTER_INTO_GROUP,
      filter_conjunction,
      filters,
      payload: {
        group_index,
        filter,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  deleteFilterInGroup = (group_index, filter_index) => {
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.DELETE_FILTER_IN_GROUP,
      filter_conjunction,
      filters,
      payload: {
        group_index,
        filter_index,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  updateFilterInGroup = (group_index, filter_index, new_filter) => {
    if (!new_filter) return;
    const { filterConjunction: filter_conjunction, filters } = this.props;
    const { filter_conjunction: next_filter_conjunction, filters: next_filters } = applyFilterOperation({
      type: FILTER_OPERATION_TYPE.UPDATE_FILTER_IN_GROUP,
      filter_conjunction,
      filters,
      payload: {
        group_index,
        filter_index,
        new_filter,
      }
    });
    this.props.updateFilters({ filter_conjunction: next_filter_conjunction, filters: next_filters });
  };

  getConjunctionOptions = () => {
    if (!this.conjunctionOptions) {
      this.conjunctionOptions = FilterItemUtils.generatorConjunctionOptions();
    }
    return this.conjunctionOptions;
  };

  getColumnOptions = () => {
    const { columns } = this.props;
    if (!this.columnOptions) {
      const filterColumns = getFilterColumns(columns);
      this.columnOptions = filterColumns.map(column => {
        return FilterItemUtils.generatorColumnOption(column);
      });
    }
    return this.columnOptions;
  };

  renderFilter = (filter, index, filterColumn) => {
    const { filterConjunction, isInModal, columns, collaborators, userDepartmentIdsMap, departments, lang, firstDayOfWeek, readOnly } = this.props;
    const conjunctionOptions = this.getConjunctionOptions();
    const columnOptions = this.getColumnOptions();

    if (checkIsFilterGroup(filter)) {
      return (
        <FilterGroup
          key={`filter-group-${index}`}
          isInModal={isInModal}
          lang={lang}
          columns={columns}
          index={index}
          filterConjunction={filterConjunction}
          filter={filter}
          conjunctionOptions={conjunctionOptions}
          columnOptions={columnOptions}
          collaborators={collaborators}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
          firstDayOfWeek={firstDayOfWeek}
          readOnly={readOnly}
          modifyFilterConjunction={this.modifyFilterConjunction}
          deleteFilterGroup={this.deleteFilter}
          addFilterIntoGroup={this.addFilterIntoGroup}
          modifyConjunctionInGroup={this.modifyConjunctionInGroup}
          deleteFilterInGroup={this.deleteFilterInGroup}
          updateFilterInGroup={this.updateFilterInGroup}
        />
      );
    }

    const { error_message } = ValidateFilter.validate(filter, columns);
    return (
      <FilterItem
        key={index}
        isInModal={isInModal}
        lang={lang}
        index={index}
        filter={filter}
        errMsg={error_message}
        filterColumn={filterColumn}
        filterConjunction={filterConjunction}
        conjunctionOptions={conjunctionOptions}
        filterColumnOptions={columnOptions}
        collaborators={collaborators}
        userDepartmentIdsMap={userDepartmentIdsMap}
        departments={departments}
        deleteFilter={this.deleteFilter}
        updateFilter={this.updateFilter}
        updateConjunction={this.modifyFilterConjunction}
        firstDayOfWeek={firstDayOfWeek}
        readOnly={readOnly}
      />
    );
  };

  render() {
    let { filters, className, emptyPlaceholder, columns } = this.props;
    const isEmpty = filters.length === 0;
    return (
      <div className={classnames('dtable-ui-filters-list', { 'empty-filters-container': isEmpty }, { [className]: className })}>
        {isEmpty && <div className="empty-filters-list">{emptyPlaceholder}</div>}
        {!isEmpty &&
          filters.map((filter, index) => {
            const { column_key } = filter;
            const filterColumn = getColumnByKey(column_key, columns) || {};
            return this.renderFilter(filter, index, filterColumn);
          })
        }
      </div>
    );
  }
}

FiltersList.propTypes = propTypes;

export default FiltersList;
