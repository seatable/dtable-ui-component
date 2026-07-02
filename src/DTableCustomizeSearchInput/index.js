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
    this.isInputtingChinese = false;
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
      this.setState({ searchValue: nextProps.value });
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    this.inputRef = null;
  }

  onCompositionStart = () => {
    this.isInputtingChinese = true;
  };

  onChange = (e) => {
    this.timer && clearTimeout(this.timer);
    const { onChange, wait = 100 } = this.props;
    let text = e.target.value;
    this.setState({ searchValue: text || '' }, () => {
      if (this.isInputtingChinese) return;
      this.timer = setTimeout(() => {
        onChange && onChange(this.state.searchValue.trim());
      }, wait);
    });
  };

  onCompositionEnd = (e) => {
    this.isInputtingChinese = false;
    this.onChange(e);
  };

  clearSearch = (e) => {
    e && e.stopPropagation && e.stopPropagation();
    const { clearValue } = this.props;
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
        <DTableIcon symbol="close" color='var(--bs-icon-secondary-color)'/>
      </span>
    );
  };

  render() {
    const { placeholder, autoFocus, className, onKeyDown, disabled = false, style = {}, isClearable, isMultiple = false } = this.props;
    const { searchValue } = this.state;
    const inputWidth = (isClearable && searchValue && !isMultiple) ? 'calc(100% - 40px)' : '100%';
    style.width = inputWidth;

    return (
      <Fragment>
        <input
          type="text"
          name="search-input"
          value={searchValue}
          className={classnames('select-search-control', className)}
          onChange={this.onChange}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onCompositionStart={this.onCompositionStart}
          onCompositionEnd={this.onCompositionEnd}
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
