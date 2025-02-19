import React from 'react';
import ReactDOM from 'react-dom';
import EditorBase from '../common/editor-base';
import { KeyCodes } from '../constants';

class EmailEditor extends EditorBase {

  setInputRef = (input) => {
    this.input = input;
    return this.input;
  };

  getValue() {
    return this.getInputNode().value.trim();
  }

  getInputNode() {
    const domNode = ReactDOM.findDOMNode(this.input);
    if (domNode.tagName === 'INPUT') {
      return domNode;
    }
    return domNode.querySelector('input:not([type=hidden])');
  }

  onBlur = () => {
    this.props.isInModal ? this.props.onCommit(this.getValue()) : this.props.onBlur();
  };

  onCut = (e) => {
    e.stopPropagation();
  };

  onPaste = (e) => {
    e.stopPropagation();
  };

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter) {
      e.preventDefault();
      this.onBlur();
      if (this.props.selectDownCell) this.props.selectDownCell();
    }
  };

  render() {
    return (
      <input
        type="text"
        ref={this.setInputRef}
        onBlur={this.onBlur}
        onCut={this.onCut}
        onPaste={this.onPaste}
        className="form-control"
        defaultValue={this.props.value}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

export default EmailEditor;
