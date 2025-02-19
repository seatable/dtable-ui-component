import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { getTrimmedString } from '../utils/utils';
import { keyCodes } from '../constants';
import { isCellValueChanged } from '../utils/cell-comparer';

class TextEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value: oldValue, column } = this.props;
    const { value: newValue } = nextProps;
    if (isCellValueChanged(oldValue, newValue, column.type)) {
      this.setState({ value: newValue || '' });
    }
  }

  getValue = () => {
    const { value } = this.state;
    const text = getTrimmedString(value) || null;
    return text;
  };

  updateValue = (value, callback) => {
    if (value === this.state.value) {
      return;
    }
    this.setState({ value }, () => {
      callback && callback();
    });
  };

  focusInput = () => {
    this.input && this.input.focus();
  };

  blurInput = () => {
    this.input && this.input.blur();
  };

  onBlur = () => {
    this.props.onCommit();
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  onChange = (event) => {
    event.persist();
    const value = event.target.value;
    this.setState({ value }, () => {
      if (this.props.onChange) {
        this.props.onChange(event);
      }
    });
  };

  onInputKeyDown = (e) => {
    const { selectionStart, selectionEnd, value } = e.currentTarget;
    if (e.keyCode === keyCodes.Enter) {
      e.preventDefault();
      this.onBlur();
      if (this.props.selectDownCell) this.props.selectDownCell();
    } else if (
      (e.keyCode === keyCodes.ChineseInputMethod) ||
      (e.keyCode === keyCodes.LeftArrow && selectionStart === 0) ||
      (e.keyCode === keyCodes.RightArrow && selectionEnd === value.length)
    ) {
      e.stopPropagation();
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  onClick = (event) => {
    if (this.props.onInputClick) {
      this.props.onInputClick(event);
    }
  };

  onCompositionStart = (event) => {
    if (this.props.onCompositionStart) {
      this.props.onCompositionStart(event);
    }
  };

  onCompositionEnd = (event) => {
    if (this.props.onCompositionEnd) {
      this.props.onCompositionEnd(event);
    }
    this.onChange(event);
  };

  getInputNode = () => {
    const domNode = ReactDOM.findDOMNode(this.input);
    if (domNode.tagName === 'INPUT') {
      return domNode;
    }

    return domNode.querySelector('input:not([type=hidden])');
  };

  setInputRef = (input) => {
    this.input = input;
    return this.input;
  };

  render() {
    const { column, className, placeholder } = this.props;
    const { value } = this.state;
    return (
      <>
        <input
          type="text"
          className={classnames('form-control', className)}
          ref={this.setInputRef}
          placeholder={placeholder || ''}
          onBlur={this.onBlur}
          onCut={this.onCut}
          onPaste={this.onPaste}
          value={value}
          name={column.name}
          title={column.name}
          aria-label={column.name}
          onChange={this.onChange}
          onKeyDown={this.onInputKeyDown}
          onClick={this.onClick}
          onCompositionStart={this.onCompositionStart}
          onCompositionEnd={this.onCompositionEnd}
        />
      </>
    );
  }
}

TextEditor.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  column: PropTypes.object,
  value: PropTypes.string,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  onInputClick: PropTypes.func,
  onCompositionStart: PropTypes.func,
  onCompositionEnd: PropTypes.func,
  onCommit: PropTypes.func,
  selectDownCell: PropTypes.func,
};

export default TextEditor;
