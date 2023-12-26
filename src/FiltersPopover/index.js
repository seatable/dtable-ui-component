import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, UncontrolledPopover } from 'reactstrap';
import { FILTER_COLUMN_OPTIONS, getValidFilters } from 'dtable-utils';
import isHotkey from 'is-hotkey';
import DTableAddTool from '../DTableAddTool';
import { getLocale } from '../lang';
import { getFilterByColumn } from './utils';
import FiltersList from './widgets/filter-list';
import { getEventClassName } from '../DTablePopover/utils';
import { EVENT_BUS_TYPE } from '../constants';
import eventBus from '../utils/event-bus';

import './index.css';

class FiltersPopover extends Component {

  static defaultProps = {
    filtersClassName: '',
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
  }

  setSelectStatus = (status) => {
    this.isSelectOpen = status;
  }

  hideDTablePopover = (e) => {
    if (this.dtablePopoverRef && !getEventClassName(e).includes('popover') && !this.dtablePopoverRef.contains(e.target)) {
      this.props.hidePopover(e);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  isNeedSubmit = () => {
    return this.props.isNeedSubmit;
  }

  onChange = (filters) => {
    if (this.isNeedSubmit()) {
      const isSubmitDisabled = false;
      this.setState({filters, isSubmitDisabled});
      return;
    }
    this.setState({filters}, () => {
      this.props.onChange({ filters, filter_conjunction: this.state.filterConjunction });
    });
  }

  deleteFilter = (filterIndex, scheduleUpdate) => {
    const filters = this.state.filters.slice(0);
    filters.splice(filterIndex, 1);
    if (filters.length === 0) {
      scheduleUpdate();
    }
    this.onChange(filters);
  }

  updateFilter = (filterIndex, updated) => {
    const filters = this.state.filters.slice(0);
    filters[filterIndex] = updated;
    this.onChange(filters);
  }

  updateFilterConjunction = (conjunction) => {
    if (this.props.isNeedSubmit) {
      const isSubmitDisabled = false;
      this.setState({ filterConjunction: conjunction, isSubmitDisabled });
      return;
    }
    this.setState({ filterConjunction: conjunction }, () => {
      this.props.onChange({ filters: this.state.filters, filter_conjunction: conjunction });
    });
  }

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
    this.onChange(filters);
  }

  onClosePopover = () => {
    this.props.onHide();
  }

  onSubmitFilters = () => {
    const { filters, filterConjunction } = this.state;
    this.props.onChange({ filters, filter_conjunction: filterConjunction });
    this.props.onHide();
  }

  onPopoverInsideClick = (e) => {
    e.stopPropagation();
  }

  render() {
    const { target, columns, isNeedSubmit, placement, collaborators, readOnly } = this.props;
    const { filters, filterConjunction, isSubmitDisabled } = this.state;
    const canAddFilter = columns.length > 0;
    return (
      <UncontrolledPopover
        placement={placement}
        isOpen={true}
        target={target}
        fade={false}
        hideArrow={true}
        className="filter-popover"
        boundariesElement={document.body}
      >
        {({ scheduleUpdate }) => (
          <div ref={ref => this.dtablePopoverRef = ref} onClick={this.onPopoverInsideClick} className={this.props.filtersClassName}>
            <FiltersList
              filterConjunction={filterConjunction}
              filters={filters}
              columns={columns}
              emptyPlaceholder={getLocale('No_filters')}
              updateFilter={this.updateFilter}
              deleteFilter={this.deleteFilter}
              updateFilterConjunction={this.updateFilterConjunction}
              collaborators={collaborators}
              readOnly={readOnly}
              scheduleUpdate={scheduleUpdate}
            />
            <DTableAddTool
              className={`popover-add-tool ${canAddFilter ? '' : 'disabled'}`}
              callBack={canAddFilter ? () => this.addFilter(scheduleUpdate) : () => {}}
              footerName={getLocale('Add_filter')}
              addIconClassName="popover-add-icon"
            />
            {isNeedSubmit && (
              <div className='filter-popover-footer'>
                <Button className='mr-2' onClick={this.onClosePopover}>{getLocale('Cancel')}</Button>
                <Button color="primary" disabled={isSubmitDisabled} onClick={this.onSubmitFilters}>{getLocale('Submit')}</Button>
              </div>
            )}
          </div>
        )}
      </UncontrolledPopover>
    );
  }
}

/**
 * filter data structure
 * let filter = {
 *  column_key: '',
 *  filter_predicate: '',
 *  filter_term: '',
 *  filter_term_modifier: '',
 * }
 */
FiltersPopover.defaultProps = {
  isReadonly: false,
  isNeedSubmit: false,
  placeholder: getLocale('No_filters'),
  target: 'dtable-filter-popover',
  placement: 'bottom-start',
  columns: [],
  filterConjunction: 'And',
  filters: [],
  value: { tables: [] },
};

FiltersPopover.propTypes = {
  isReadonly: PropTypes.bool,
  isNeedSubmit: PropTypes.bool,
  placeholder: PropTypes.string,
  textDefaultPredicate: PropTypes.string,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  placement: PropTypes.string,
  columns: PropTypes.array.isRequired,
  filterConjunction: PropTypes.string,
  filters: PropTypes.array,
  value: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FiltersPopover;
