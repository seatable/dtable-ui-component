import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FILTER_CONJUNCTION_TYPE, getValidFilters } from 'dtable-utils';
import CommonAddTool from '../DTableCommonAddTool';
import { getDefaultFilter, getDefaultFilterGroup } from './utils';
import FiltersList from './widgets/filter-list';
import DTablePopover from '../DTablePopover';
import { SUPPORT_CONJUNCTIONS } from './constants';
import { getLocale } from '../lang';

import './index.css';

/**
 * filter data structure
 * let filter = {
 *  column_key: '',
 *  filter_predicate: '',
 *  filter_term: '',
 *  filter_term_modifier: '',
 * }
 */
class DTableFiltersPopover extends Component {

  static defaultProps = {
    className: '',
    placement: 'auto-start',
    isSupportAdvanced: false,
  };

  constructor(props) {
    super(props);
    const { filterConjunction, filters, columns, isNeedSubmit } = props;
    this.state = {
      filters: getValidFilters(filters, columns),
      filterConjunction: SUPPORT_CONJUNCTIONS.includes(filterConjunction) ? filterConjunction : FILTER_CONJUNCTION_TYPE.AND,
      isSubmitDisabled: true,
    };
    this.isNeedSubmit = isNeedSubmit;
  }

  updateFilters = ({ filter_conjunction, filters }) => {
    const filterConjunction = filter_conjunction || this.state.filterConjunction;
    if (this.isNeedSubmit) {
      const isSubmitDisabled = false;
      this.setState({ filters, filterConjunction, isSubmitDisabled });
      return;
    }
    this.setState({ filters, filterConjunction }, () => {
      this.props.update({ filters, filter_conjunction: filterConjunction });
    });
  };

  addFilter = () => {
    const { columns } = this.props;
    const { filters } = this.state;
    const newFilter = getDefaultFilter(columns);
    if (!newFilter) {
      return;
    }
    this.updateFilters({ filters: [...filters, newFilter] });
  };

  addFilterGroup = () => {
    const { columns } = this.props;
    const { filters } = this.state;
    const newFilterGroup = getDefaultFilterGroup(columns);
    if (!newFilterGroup) {
      return;
    }
    this.updateFilters({ filters: [...filters, newFilterGroup] });
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
    const { target, columns, placement, isSupportAdvanced, departments, lang, readOnly, userDepartmentIdsMap, firstDayOfWeek } = this.props;
    const { filters, filterConjunction } = this.state;
    const canAddFilter = columns.length > 0;
    return (
      <DTablePopover
        target={target}
        placement={placement}
        popoverClassName="dtable-ui-filter-popover"
        hideDTablePopover={this.props.hidePopover}
        hideDTablePopoverWithEsc={this.props.hidePopover}
        boundariesElement={document.body}
      >
        <div ref={ref => this.dtablePopoverRef = ref} onClick={this.onPopoverInsideClick} className={this.props.className}>
          <FiltersList
            isInModal
            filterConjunction={filterConjunction}
            filters={filters}
            columns={columns}
            emptyPlaceholder={getLocale('No_filters')}
            collaborators={this.props.collaborators}
            readOnly={readOnly}
            userDepartmentIdsMap={userDepartmentIdsMap}
            departments={departments}
            lang={lang}
            firstDayOfWeek={firstDayOfWeek}
            updateFilters={this.updateFilters}
          />
          {!isSupportAdvanced && !readOnly &&
            <CommonAddTool
              className={`popover-add-tool ${canAddFilter ? '' : 'disabled'}`}
              callBack={canAddFilter ? () => this.addFilter() : () => {}}
              footerName={getLocale('Add_filter')}
              addIconClassName="popover-add-icon"
            />
          }
          {isSupportAdvanced && !readOnly &&
            <div className="add-buttons">
              <div
                className="btn-add-filter mr-4"
                onClick={canAddFilter ? () => this.addFilter() : () => {}}
                role="button"
                tabIndex={0}
                aria-label={getLocale('Add_filter')}
              >
                <i aria-hidden="true" className="dtable-font dtable-icon-add-table popover-add-icon"></i>
                <span className="add-new-option">{getLocale('Add_filter')}</span>
              </div>
              <div
                className="btn-add-filter-group"
                onClick={canAddFilter ? () => this.addFilterGroup() : () => {}}
                role="button"
                tabIndex={0}
                aria-label={getLocale('Add_filter_group')}
              >
                <i aria-hidden="true" className="dtable-font dtable-icon-add-table popover-add-icon"></i>
                <span className="add-new-option">{getLocale('Add_filter_group')}</span>
              </div>
            </div>
          }
          {this.isNeedSubmit &&
            <div className='filter-popover-footer'>
              <Button disabled={readOnly} className='mr-2' onClick={this.onClosePopover}>{getLocale('Cancel')}</Button>
              <Button disabled={this.state.isSubmitDisabled || readOnly} color="primary" onClick={this.onSubmitFilters}>{getLocale('Submit')}</Button>
            </div>
          }
        </div>
      </DTablePopover>
    );
  }
}

DTableFiltersPopover.propTypes = {
  isNeedSubmit: PropTypes.bool,
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
  placement: PropTypes.string,
  isSupportAdvanced: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default DTableFiltersPopover;
