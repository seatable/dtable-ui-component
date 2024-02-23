import React from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { Input } from 'reactstrap';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.string,
  column: PropTypes.object,
  onCommit: PropTypes.func,
};

class TextEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      newValue: props.value
    };
  }

  onCommit = () => {
    let updated = {};
    let { column } = this.props;
    let { newValue } = this.state;
    updated[column.name] = newValue ? newValue.trim() : '';
    this.props.onCommit(updated);
  };

  onBlur = () => {
    this.onCommit();
  };

  onChange = (event) => {
    let value = event.target.value;
    this.setState({newValue: value});
  };

  onKeyDown = (event) => {
    let { selectionStart, selectionEnd, value } = event.currentTarget;
    if (isHotkey('enter', event)) {
      event.preventDefault();
      event.target.blur();
    } else if ((event.keyCode === 37 && selectionStart === 0) ||
      (event.keyCode === 39 && selectionEnd === value.length)
    ) {
      event.stopPropagation();
    }
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  setInputRef = (input) => {
    this.input = input;
  };

  render() {
    const { isReadOnly } = this.props;

    return (
      <Input
        ref={this.setInputRef}
        type="text"
        value={this.state.newValue}
        readOnly={isReadOnly}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
        onCut={this.onCut}
        onPaste={this.onPaste}
      />
    );
  }

}

TextEditor.propTypes = propTypes;

export default TextEditor;
