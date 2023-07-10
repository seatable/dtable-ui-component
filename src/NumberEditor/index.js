import React from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import {
  getNumberDisplayString,
  formatStringToNumber,
  replaceNumberNotAllowInput,
} from 'dtable-utils';
import { NUMBER_TYPES } from '../constants';
import { isMac } from '../utils/utils';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
};

class NumberEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: '',
  }

  constructor(props) {
    super(props);
    let { value, column } = this.props;
    let dataFormat = column.data && column.data.format;
    this.dataFormat = dataFormat || NUMBER_TYPES.NUMBER;
    let initValue = getNumberDisplayString(value, column.data);     // format the number to display

    this.state = {
      inputValue: initValue,
      textValue: initValue,
      isEditorShow: false,
    };
  }

  onEditorHandle = () => {
    if (this.props.isReadOnly) {
      return;
    }
    this.setState({
      isEditorShow: true,
      inputValue: this.state.textValue
    }, () => {
      this.input.focus();
    });
  }

  onCommit = () => {
    let updated = {};
    let { column } = this.props;
    let inputValue = this.state.inputValue ? this.state.inputValue.toString() : '';
    let value = inputValue ? formatStringToNumber(inputValue) : ''; // format the number to submit
    updated[column.key] = value;
    this.props.onCommit(updated);

    let newValue = getNumberDisplayString(value, column.data); // format the number to display
    this.setState({
      isEditorShow: false,
      textValue: newValue
    });
  }

  onChange = (event) => {
    const { data } = this.props.column; // data maybe 'null'
    let value = event.target.value.trim();
    let currency_symbol = null;
    if (data && data.format === 'custom_currency') {
      currency_symbol = data['currency_symbol'];
    }

    //Prevent the repetition of periods bug in the Chinese input method of the Windows system
    if (!isMac() && value.indexOf('.。') > -1) return;
    value = replaceNumberNotAllowInput(value, this.dataFormat, currency_symbol);
    if (value === this.state.inputValue) return;
    this.setState({ inputValue : value });
  }

  onBlur = () => {
    this.onCommit();
  }

  onKeyDown = (event) => {
    let { selectionStart, selectionEnd, value } = event.currentTarget;
    if (isHotkey('enter', event)) {
      event.preventDefault();
      this.onBlur();
    } else if ((event.keyCode === 37 && selectionStart === 0) ||
      (event.keyCode === 39 && selectionEnd === value.length)
    ) {
      event.stopPropagation();
    }
  }

  onPaste = (e) => {
    e.stopPropagation();
  }

  onCut = (e) => {
    e.stopPropagation();
  }

  getStyle = () => {
    return {
      width: '320px',
      textAlign: 'left',
    };
  }

  setInputRef = (input) => {
    this.input = input;
    return this.input;
  };

  render() {
    let style = this.getStyle();
    return (
      <div className="cell-editor number-editor">
        <div className="number-editor-container">
          {!this.state.isEditorShow &&
            <div className="form-control" style={style} onClick={this.onEditorHandle}>{this.state.textValue}</div>
          }
          {this.state.isEditorShow && (
            <input
              ref={this.setInputRef}
              type="text"
              className="form-control"
              style={style}
              value={this.state.inputValue}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onCut={this.onCut}
              onPaste={this.onPaste}
              onKeyDown={this.onKeyDown}
            />
          )}
        </div>
      </div>
    );
  }

}

NumberEditor.propTypes = propTypes;

export default NumberEditor;
