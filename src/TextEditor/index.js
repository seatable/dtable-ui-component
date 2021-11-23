import React from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.string,
  column: PropTypes.object,
  onCommit: PropTypes.func,
};

class TextEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      newValue: props.value,
      isEditorShow: false,
    };
  }

  onCommit = () => {
    let updated = {};
    let { column } = this.props;
    let { newValue } = this.state;
    updated[column.key] = newValue ? newValue.trim() : '';
    this.props.onCommit(updated);

    this.setState({isEditorShow: false});
  }
  
  onBlur = () => {
    this.onCommit();
  }
  
  onChange = (event) => {
    let value = event.target.value;
    this.setState({newValue: value});
  }
  
  onEditorHandle = () => {
    if (this.props.isReadOnly) {
      return;
    }
    this.setState({isEditorShow: true}, () => {
      this.input.focus();
    });
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

  setInputRef = (input) => {
    this.input = input;
  }

  render() {

    return (
      <div className="cell-editor text-editor">
        <div className="text-editor-container">
          {!this.state.isEditorShow && (
            <div className="form-control" onClick={this.onEditorHandle}>{this.state.newValue}</div>
          )}
          {this.state.isEditorShow && (
            <input
              ref={this.setInputRef} 
              type="text"
              className="form-control"
              value={this.state.newValue} 
              onChange={this.onChange} 
              onKeyDown={this.onKeyDown}
              onBlur={this.onBlur}
              onCut={this.onCut}
              onPaste={this.onPaste}
            />
          )}
        </div>
      </div>
    );
  }

}

TextEditor.propTypes = propTypes;

export default TextEditor;
