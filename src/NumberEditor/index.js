import React from 'react';
import PropTypes from 'prop-types';
import { replaceNumberNotAllowInput, getNumberDisplayString, DEFAULT_NUMBER_FORMAT, formatStringToNumber } from 'dtable-utils';
import { KeyCodes } from '../constants';
import { isMac } from '../utils/utils';

class NumberEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.value === 0 ? props.value : '',
    };
  }

  onChange = (event) => {
    const { data } = this.props.column; // data maybe 'null'
    const format = (data && data.format) ? data.format : DEFAULT_NUMBER_FORMAT;
    let currency_symbol = null;
    if (data && data.format === 'custom_currency') {
      currency_symbol = data['currency_symbol'];
    }
    const initValue = event.target.value.trim();

    // Prevent the repetition of periods bug in the Chinese input method of the Windows system
    if (!isMac() && initValue.indexOf('.。') > -1) return;
    let value = replaceNumberNotAllowInput(initValue, format, currency_symbol);
    if (value === this.state.value) {
      return;
    }
    this.setState({ value });
  };

  onKeyDown = (event) => {
    let { selectionStart, selectionEnd, value } = event.currentTarget;
    if (event.keyCode === KeyCodes.Enter || event.keyCode === KeyCodes.Esc) {
      event.preventDefault();
      this.onBlur();
      if (this.props.selectDownCell) this.props.selectDownCell();
    } else if ((event.keyCode === KeyCodes.LeftArrow && selectionStart === 0) ||
      (event.keyCode === KeyCodes.RightArrow && selectionEnd === value.length)
    ) {
      event.stopPropagation();
    }
  };

  getValue = () => {
    const value = this.getInputNode().value;
    const { column } = this.props;
    return formatStringToNumber(value, column.data);
  };

  getInputNode = () => {
    if (!this.input) return null;
    if (this.input.tagName === 'INPUT') {
      return this.input;
    }
    return this.input.querySelector('input:not([type=hidden])');
  };

  onBlur = () => {
    this.props.isInModal ? this.props.onCommit(this.getValue()) : this.props.onBlur();
  };

  setInputRef = (input) => {
    this.input = input;
    return this.input;
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  componentDidMount() {
    if (this.props.isInModal) {
      this.input.focus();
    }
    const { data = {} } = this.props.column;
    let { value } = this.state;
    value = getNumberDisplayString(value, data) || '';
    this.setState({ value });
  }

  render() {
    const { isInModal } = this.props;
    let style = isInModal ? { textAlign: 'left', width: '320px' } : { textAlign: 'right' };
    return (
      <input
        ref={this.setInputRef}
        type="text"
        className="form-control"
        value={this.state.value}
        onBlur={this.onBlur}
        onPaste={this.onPaste}
        onCut={this.onCut}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        style={style}
      />
    );
  }
}

NumberEditor.propTypes = {
  isInModal: PropTypes.bool,
  column: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBlur: PropTypes.func,
  onCommit: PropTypes.func,
  selectDownCell: PropTypes.func,
};

export default NumberEditor;
