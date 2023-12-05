import React, { Component } from 'react';
import SelectOptionGroup from '../SelectOptionGroup';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import '../assets/css/DTableCustomSelect.css';

class DTableCustomizeSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowSelectOptions: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onMousedown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMousedown);
  }

  onSelectToggle = (event) => {
    event.preventDefault();
    /*
      if select is showing, click events do not need to be monitored by other click events,
      so it can be closed when other select is clicked.
    */
    if (this.state.isShowSelectOptions) event.nativeEvent.stopImmediatePropagation();
    let eventClassName = event.target.className;
    if (this.props.isLocked || eventClassName.indexOf('option-search-control') > -1 || eventClassName === 'option-group-search') return;
    //Prevent closing by pressing the spacebar in the search input
    if (event.target.value === '') return;
    this.setState({
      isShowSelectOptions: !this.state.isShowSelectOptions
    });
  }

  onMousedown = (event) => {
    if (this.props.isShowSelected && event.target.className.includes('icon-fork-number')) {
      return;
    }
    if (!this.selector.contains(event.target)) {
      this.closeSelect();
    }
  }

  closeSelect = () => {
    this.setState({isShowSelectOptions: false});
  }

  getSelectedOptionTop = () => {
    if (!this.selector) return 38;
    const { height } = this.selector.getBoundingClientRect();
    return height;
  }

  getFilterOptions = (searchValue) => {
    const { options, searchable } = this.props;
    if (!searchable) return options || [];
    const validSearchVal = searchValue.trim().toLowerCase();
    if (!validSearchVal) return options || [];
    return options.filter(option => {
      const { value, name } = option;
      if (typeof name === 'string') {
        return name.toLowerCase().indexOf(validSearchVal) > -1;
      }
      if (typeof value === 'object') {
        return value.columnOption && value.columnOption.name.toLowerCase().indexOf(validSearchVal) > -1;
      }
      return false;
    });
  }

  render() {
    let { className, value, options, placeholder, searchable, searchPlaceholder, noOptionsPlaceholder, isLocked } = this.props;
    return(
      <div
        ref={(node) => this.selector = node}
        className={classnames('dtable-select custom-select',
          {'focus': this.state.isShowSelectOptions},
          {'disabled': isLocked},
          className
        )}
        onClick={this.onSelectToggle}>
        <div className="selected-option">
          {value.label ? (
            <span className="selected-option-show">{value.label}</span>
          ) : (
            <span className="select-placeholder">{placeholder}</span>
          )}
          {!isLocked && <i className="dtable-font dtable-icon-drop-down"></i>}
        </div>
        {this.state.isShowSelectOptions && (
          <SelectOptionGroup
            value={value}
            isShowSelected={this.props.isShowSelected}
            top={this.getSelectedOptionTop()}
            options={options}
            onSelectOption={this.props.onSelectOption}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            noOptionsPlaceholder={noOptionsPlaceholder}
            closeSelect={this.closeSelect}
            getFilterOptions={this.getFilterOptions}
            supportMultipleSelect={this.props.supportMultipleSelect}
          />
        )}
      </div>
    );
  }
}

DTableCustomizeSelect.propTypes = {
  className: PropTypes.string,
  value: PropTypes.object,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onSelectOption: PropTypes.func,
  isLocked: PropTypes.bool,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  noOptionsPlaceholder: PropTypes.string,
  supportMultipleSelect: PropTypes.bool,
  isShowSelected: PropTypes.bool,
};

export default DTableCustomizeSelect;
