import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { Button, UncontrolledPopover } from 'reactstrap';
import { FILTER_COLUMN_OPTIONS, getValidFilters } from 'dtable-utils';
import CommonAddTool from '../DTableCommonAddTool';
import { getEventClassName } from '../utils/utils';
import { getFilterByColumn } from './utils';
import FiltersList from './widgets/filter-list';
import eventBus from '../utils/event-bus';
import { EVENT_BUS_TYPE } from '../constants';
import { getLocale } from '../lang';

import './index.css';

/**
 * filter = {
 *  column_key: '',
 *  filter_predicate: '',
 *  filter_term: '',
 *  filter_term_modifier: '',
 * }
 */
class DTableFiltersPopover extends Component {

  static defaultProps = {
    className: '',
    readOnly: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      filters: getValidFilters(props.filters, props.columns),
      filterConjunction: props.filterConjunction || 'And',
    };
    this.isSelectOpen = false;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideDTablePopover, true);
    document.addEventListener('keydown', this.onHotKey);
    this.unsubscribeOpenSelect = eventBus.subscribe(EVENT_BUS_TYPE.OPEN_SELECT, this.setSelectStatus);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideDTablePopover, true);
    document.removeEventListener('keydown', this.onHotKey);
    this.unsubscribeOpenSelect();
  }

  onHotKey = (e) => {
    if (isHotkey('esc', e) && !this.isSelectOpen) {
      e.preventDefault();
      this.props.hidePopover();
    }
  };

  setSelectStatus = (status) => {
    this.isSelectOpen = status;
  };

  hideDTablePopover = (e) => {
    if (this.dtablePopoverRef && !getEventClassName(e).includes('popover') && !this.dtablePopoverRef.contains(e.target)) {
      this.props.hidePopover(e);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  isNeedSubmit = () => {
    return this.props.isNeedSubmit;
  };

  update = (filters) => {
    if (this.isNeedSubmit()) {
      const isSubmitDisabled = false;
      this.setState({ filters, isSubmitDisabled });
      return;
    }
    this.setState({ filters }, () => {
      const update = { filters, filter_conjunction: this.state.filterConjunction };
      this.props.update(update);
    });
  };

  deleteFilter = (filterIndex, scheduleUpdate) => {
    const filters = this.state.filters.slice(0);
    filters.splice(filterIndex, 1);
    if (filters.length === 0) {
      scheduleUpdate();
    }
    this.update(filters);
  };

  updateFilter = (filterIndex, updated) => {
    const filters = this.state.filters.slice(0);
    filters[filterIndex] = updated;
    this.update(filters);
  };

  updateFilterConjunction = (conjunction) => {
    if (this.isNeedSubmit()) {
      const isSubmitDisabled = false;
      this.setState({ filterConjunction: conjunction, isSubmitDisabled });
      return;
    }
    this.setState({ filterConjunction: conjunction }, () => {
      const update = { filters: this.state.filters, filter_conjunction: conjunction };
      this.props.update(update);
    });
  };

  addFilter = (scheduleUpdate) => {
    let { columns } = this.props;
    let defaultColumn = columns[0];
    if (!FILTER_COLUMN_OPTIONS[defaultColumn.type]) {
      defaultColumn = columns.find((c) => FILTER_COLUMN_OPTIONS[c.type]);
    }
    if (!defaultColumn) return;
    let filter = getFilterByColumn(defaultColumn);
    const filters = this.state.filters.slice(0);
    if (filters.length === 0) {
      scheduleUpdate();
    }
    filters.push(filter);
    this.update(filters);
  };

  onClosePopover = () => {
    this.props.hidePopover();
  };

  onSubmitFilters = () => {
    const { filters, filterConjunction } = this.state;
    const update = { filters, filter_conjunction: filterConjunction };
    this.props.update(update);
    this.props.hidePopover();
  };

  onPopoverInsideClick = (e) => {
    e.stopPropagation();
  };

  render() {
    const { target, columns, className, userDepartmentIdsMap, departments, lang, readOnly, firstDayOfWeek } = this.props;
    const { filters, filterConjunction } = this.state;
    const canAddFilter = columns.length > 0;
    return (
      <UncontrolledPopover
        placement="auto-start"
        isOpen={true}
        target={target}
        fade={false}
        hideArrow={true}
        className="dtable-filter-popover"
        boundariesElement={document.body}
      >
        {({ update: scheduleUpdate }) => (
          <div ref={ref => this.dtablePopoverRef = ref} onClick={this.onPopoverInsideClick} className={className}>
            <FiltersList
              filterConjunction={filterConjunction}
              filters={filters}
              columns={columns}
              emptyPlaceholder={getLocale('No_filters')}
              collaborators={this.props.collaborators}
              readOnly={readOnly}
              scheduleUpdate={scheduleUpdate}
              userDepartmentIdsMap={userDepartmentIdsMap}
              departments={departments}
              lang={lang}
              updateFilter={this.updateFilter}
              deleteFilter={this.deleteFilter}
              updateFilterConjunction={this.updateFilterConjunction}
              firstDayOfWeek={firstDayOfWeek}
            />
            <CommonAddTool
              className={`popover-add-tool ${canAddFilter ? '' : 'disabled'}`}
              callBack={canAddFilter ? () => this.addFilter(scheduleUpdate) : () => {}}
              footerName={getLocale('Add_filter')}
              addIconClassName="popover-add-icon"
            />
            {this.isNeedSubmit() && (
              <div className='dtable-filter-popover-footer'>
                <Button className='mr-2' onClick={this.onClosePopover}>{getLocale('Cancel')}</Button>
                <Button color="primary" disabled={this.state.isSubmitDisabled} onClick={this.onSubmitFilters}>{getLocale('Submit')}</Button>
              </div>
            )}
          </div>
        )}
      </UncontrolledPopover>
    );
  }
}

DTableFiltersPopover.propTypes = {
  isNeedSubmit: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  lang: PropTypes.string,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  columns: PropTypes.array.isRequired,
  filterConjunction: PropTypes.string,
  filters: PropTypes.array,
  collaborators: PropTypes.array,
  hidePopover: PropTypes.func,
  update: PropTypes.func,
  firstDayOfWeek: PropTypes.string,
};

export default DTableFiltersPopover;
