import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FILTER_CONJUNCTION_TYPE, ValidateFilter } from 'dtable-utils';
import DTableCustomizeSelect from '../../DTableCustomizeSelect';
import FilterItem from './filter-item';
import FilterItemUtils from '../utils/filter-item-utils';
import { SUPPORT_CONJUNCTIONS } from '../constants';
import { getDefaultFilter } from '../utils';
import CommonAddTool from '../../DTableCommonAddTool';
import { getLocale } from '../../lang';

class FilterGroup extends Component {

  static defaultProps = {
    level: 1,
  };

  onSelectGroupConjunction = (conjunctionOption) => {
    const { filterConjunction } = this.props;
    const { filterConjunction: newConjunction } = conjunctionOption;
    if (newConjunction === filterConjunction) {
      return;
    }
    this.props.modifyFilterConjunction(newConjunction);
  };

  deleteFilterGroup = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    const { index } = this.props;
    this.props.deleteFilterGroup(index);
  };

  modifyConjunctionInGroup = (new_filter_conjunction) => {
    const { index } = this.props;
    this.props.modifyConjunctionInGroup(index, new_filter_conjunction);
  };

  addFilterIntoGroup = () => {
    const { columns, index } = this.props;
    const newFilter = getDefaultFilter(columns);
    if (!newFilter) {
      return;
    }
    this.props.addFilterIntoGroup(index, newFilter);
  };

  deleteFilterInGroup = (filter_index) => {
    const { index } = this.props;
    this.props.deleteFilterInGroup(index, filter_index);
  };

  updateFilterInGroup = (filter_index, new_filter) => {
    const { index } = this.props;
    this.props.updateFilterInGroup(index, filter_index, new_filter);
  };

  renderConjunction = () => {
    const { index, filterConjunction, conjunctionOptions } = this.props;
    switch (index) {
      case 0: {
        return null;
      }
      case 1: {
        const activeConjunction = FilterItemUtils.getActiveConjunctionOption(filterConjunction, conjunctionOptions);
        return (
          <DTableCustomizeSelect
            value={activeConjunction}
            options={conjunctionOptions}
            onSelectOption={this.onSelectGroupConjunction}
          />
        );
      }
      default: {
        return (
          <span className="selected-conjunction-show">{getLocale(filterConjunction)}</span>
        );
      }
    }
  };

  renderGroupFilters = () => {
    const {
      columns, conjunctionOptions, columnOptions, filter, index: groupIndex, collaborators, lang, userDepartmentIdsMap, departments, firstDayOfWeek
    } = this.props;
    const { filters: subFilters, filter_conjunction } = filter;
    const subFilterConjunction = SUPPORT_CONJUNCTIONS.includes(filter_conjunction) ? filter_conjunction : FILTER_CONJUNCTION_TYPE.AND;
    const subFiltersLength = Array.isArray(subFilters) ? subFilters.length : 0;
    if (subFiltersLength === 0) {
      return null;
    }
    return subFilters.map((currentFilter, subFilterIndex) => {
      const { column_key: sub_filter_column_key } = currentFilter;
      const { error_message } = ValidateFilter.validate(currentFilter, columns);
      const filterColumn = columns.find(column => column.key === sub_filter_column_key) || {};
      return (
        <FilterItem
          key={`filter-in-group-${groupIndex}-${subFilterIndex}`}
          isInModal={this.props.isInModal}
          lang={lang}
          index={subFilterIndex}
          filter={currentFilter}
          errorMessage={error_message}
          filterColumn={filterColumn}
          filterConjunction={subFilterConjunction}
          conjunctionOptions={conjunctionOptions}
          filterColumnOptions={columnOptions}
          collaborators={collaborators}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
          firstDayOfWeek={firstDayOfWeek}
          updateConjunction={this.modifyConjunctionInGroup}
          deleteFilter={this.deleteFilterInGroup}
          updateFilter={this.updateFilterInGroup}
        />
      );
    });
  };

  render() {
    const { level, index } = this.props;

    return (
      <div
        className={classnames(
          'filter-item',
          'filter-group',
          `level-${level}`,
        )}
      >
        <div className="delete-filter" onClick={this.deleteFilterGroup} role="button" tabIndex={0} aria-label={getLocale('Delete')}>
          <i aria-hidden="true" className="dtable-font dtable-icon-fork-number"></i>
        </div>
        <div className="filter-group-wrapper">
          <div className={classnames('filter-conjunction', { 'conjunction-text': index > 1 })}>
            {this.renderConjunction()}
          </div>
          <div className="filter-group-container">
            {this.renderGroupFilters()}
            <CommonAddTool
              className="group-filter-add-tool"
              callBack={this.addFilterIntoGroup}
              footerName={getLocale('Add_filter')}
              addIconClassName="popover-add-icon"
            />
          </div>
        </div>
      </div>
    );
  }
}

FilterGroup.propTypes = {
  lang: PropTypes.string,
  columns: PropTypes.array,
  index: PropTypes.number,
  isInModal: PropTypes.bool,
  level: PropTypes.number,
  filterConjunction: PropTypes.string,
  filter: PropTypes.object,
  conjunctionOptions: PropTypes.array,
  columnOptions: PropTypes.array,
  modifyFilterConjunction: PropTypes.func,
  deleteFilterGroup: PropTypes.func,
  addFilterIntoGroup: PropTypes.func,
  modifyConjunctionInGroup: PropTypes.func,
  deleteFilterInGroup: PropTypes.func,
  updateFilterInGroup: PropTypes.func,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  collaborators: PropTypes.array,
  firstDayOfWeek: PropTypes.string,
};

export default FilterGroup;
