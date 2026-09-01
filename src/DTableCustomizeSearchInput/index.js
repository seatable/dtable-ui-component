import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DTableIcon from '../DTableIcon';

import './index.css';

const propTypes = {
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  wait: PropTypes.number,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  isClearable: PropTypes.bool,
  clearValue: PropTypes.func,
  clearClassName: PropTypes.string,
  value: PropTypes.string,
};

class DTableCustomizeSearchInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.value || '',
    };
    this.isComposing = false;
    this.timer = null;
    this.inputRef = null;
  }

  componentDidMount() {
    if (this.props.autoFocus && this.inputRef && this.inputRef !== document.activeElement) {
      setTimeout(() => {
        this.inputRef.focus();
      }, 0);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.clearChangeTimer();
      this.setState({ searchValue: nextProps.value });
    }
  }

  componentWillUnmount() {
    this.clearChangeTimer();
    this.inputRef = null;
  }

  handleCompositionStart = () => {
    this.isComposing = true;
  };

  clearChangeTimer = () => {
    if (this.timer === null) return;
    clearTimeout(this.timer);
    this.timer = null;
  };

  scheduleSearchChange = (searchValue) => {
    const { onChange, wait = 100 } = this.props;
    this.timer = setTimeout(() => {
      this.timer = null;
      onChange(searchValue.trim());
    }, wait);
  };

  handleInputChange = (event) => {
    const searchValue = event.target.value || '';
    this.clearChangeTimer();
    this.setState({ searchValue });
    if (this.isComposing) return;
    this.scheduleSearchChange(searchValue);
  };

  handleCompositionEnd = (event) => {
    this.isComposing = false;
    this.handleInputChange(event);
  };

  clearSearch = (event) => {
    event && event.stopPropagation && event.stopPropagation();
    const { clearValue } = this.props;
    this.clearChangeTimer();
    this.setState({ searchValue: '' }, () => {
      clearValue && clearValue();
    });
  };

  setFocus = (isSelectAllText) => {
    if (this.inputRef === document.activeElement) return;
    this.inputRef.focus();
    if (isSelectAllText) {
      const txtLength = this.state.searchValue.length;
      this.inputRef.setSelectionRange(0, txtLength);
    }
  };

  renderClear = () => {
    const { isClearable, clearClassName } = this.props;
    const { searchValue } = this.state;
    if (!isClearable || !searchValue) return null;

    return (
      <span className={classnames('clear-icon-x', clearClassName)} onClick={this.clearSearch}>
        <DTableIcon symbol="close" color='var(--bs-icon-color)'/>
      </span>
    );
  };

  render() {
    const { placeholder, autoFocus, className, onKeyDown, disabled = false, style = {} } = this.props;
    const { searchValue } = this.state;

    return (
      <Fragment>
        <input
          type="text"
          name="search-input"
          value={searchValue}
          className={classnames('select-search-control', className)}
          onChange={this.handleInputChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onCompositionStart={this.handleCompositionStart}
          onCompositionEnd={this.handleCompositionEnd}
          onKeyDown={onKeyDown}
          disabled={disabled}
          style={style}
          ref={ref => this.inputRef = ref}
        />
        {this.renderClear()}
      </Fragment>
    );
  }
}

DTableCustomizeSearchInput.propTypes = propTypes;

export default DTableCustomizeSearchInput;
