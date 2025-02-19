import React from 'react';
import ReactDOM from 'react-dom';
import EditorBase from '../common/editor-base';
import { KeyCodes } from '../constants';

class UrlEditor extends EditorBase {

  setInputRef = (input) => {
    this.input = input;
    return this.input;
  };

  getValue() {
    const updated = {};
    updated[this.props.column.key] = this.getInputNode().value.trim();

    return updated;
  }

  getInputNode() {
    const domNode = ReactDOM.findDOMNode(this.input);
    if (domNode.tagName === 'INPUT') {
      return domNode;
    }
    return domNode.querySelector('input:not([type=hidden])');
  }

  onBlur = () => {
    const update = this.getValue();
    this.props.onCommit(update);
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
        className="form-control"
        onBlur={this.onBlur}
        onCut={this.onCut}
        onPaste={this.onPaste}
        defaultValue={this.props.value}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

export default UrlEditor;
