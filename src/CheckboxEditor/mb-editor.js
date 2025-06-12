import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SvgIcon from '../SvgIcon';
import { DEFAULT_CHECKBOX_MARK_STYLE } from '../constants';

class MBCheckboxEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || false,
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({ value });
    }
  }

  getValue = () => {
    const { value } = this.state;
    return value;
  };

  updateValue = (value) => {
    if (value === this.state.value) {
      return;
    }
    this.setState({ value });
  };

  onChangeCheckboxValue = (event) => {
    const { readOnly } = this.props;
    if (readOnly) return;
    if (event) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      event.persist();
    }
    const { value } = this.state;
    const newValue = !value;
    this.setState({ value: newValue }, () => {
      this.props.onCommit && this.props.onCommit(newValue);
    });
  };

  renderIcon = (symbol, color) => {
    const className = classnames('dtable-ui-checkbox-check-mark', { 'dtable-ui-checkbox-check-svg': !symbol?.startsWith('dtable-icon') });
    if (symbol.startsWith('dtable-icon')) {
      return (<span className={`dtable-font ${symbol} ${className || ''}`} style={{ color }} />);
    }
    return (<SvgIcon className={className} symbol={symbol} color={color} />);
  };

  render() {
    const { className, style, column } = this.props;
    const { value } = this.state;
    let checkboxStyle = column?.data?.checkbox_style;
    if (!checkboxStyle || Object.keys(checkboxStyle).length < 2) {
      checkboxStyle = DEFAULT_CHECKBOX_MARK_STYLE;
    }
    return (
      <div
        className={classnames('dtable-ui-checkbox-editor', className)}
        style={style || {}}
        onClick={this.onChangeCheckboxValue}
      >
        {value && this.renderIcon(checkboxStyle.type, checkboxStyle.color)}
      </div>
    );
  }
}

MBCheckboxEditor.propTypes = {
  isEditorShow: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default MBCheckboxEditor;
