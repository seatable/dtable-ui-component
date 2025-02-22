import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CellType, isNumber } from 'dtable-utils';

class EditorBase extends React.Component {

  getStyle() {
    return {
      width: '100%'
    };
  }

  getValue() {
    const updated = {};
    const { column } = this.props;
    const { type, key, data } = column;
    let value = this.getInputNode().value;
    if (type === CellType.TEXT) {
      value = value ? value.trim() : '';
    } else if (type === CellType.NUMBER) {
      let { precision, enable_precision } = data || {};
      if (enable_precision && isNumber(value)) {
        value = Number(value.toFixed(precision));
      }
    }
    updated[key] = value;
    return updated;
  }

  getInputNode() {
    const domNode = ReactDOM.findDOMNode(this.input);
    if (domNode.tagName === 'INPUT') {
      return domNode;
    }

    return domNode.querySelector('input:not([type=hidden])');
  }

  inheritContainerStyles() {
    return true;
  }

}

EditorBase.propTypes = {
  onKeyDown: PropTypes.func,
  value: PropTypes.any,
  onBlur: PropTypes.func,
  column: PropTypes.object,
  commit: PropTypes.func,
  onCommit: PropTypes.func,
};

export default EditorBase;

