import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SvgIcon from '../SvgIcon';
import { isMobile } from '../utils/utils';
import { KeyCodes, DEFAULT_CHECKBOX_MARK_STYLE } from '../constants';

import './index.css';

class CheckboxEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({ value });
    }
  }

  onKeyDown = (event) => {
    const { isEditorShow, readOnly } = this.props;
    if (event.keyCode === KeyCodes.Enter && isEditorShow && !readOnly) {
      this.setState({ value: !this.state.value });
    }
  };

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
    if (event) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      event.persist();
    }
    const { value } = this.state;
    const newValue = !value;
    this.setState({ value: newValue }, () => {
      if (this.props.onCommit) {
        this.props.onCommit(event);
      }
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
    const checkboxProps = {
      ...(!isMobile && { onClick: this.onChangeCheckboxValue }),
      ...(isMobile && { onTouchStart: this.onChangeCheckboxValue }),
    };
    let checkboxStyle = column?.data?.checkbox_style;
    if (!checkboxStyle || Object.keys(checkboxStyle).length < 2) {
      checkboxStyle = DEFAULT_CHECKBOX_MARK_STYLE;
    }
    return (
      <div
        className={classnames('dtable-ui-checkbox-editor', className)}
        style={style || {}}
        {...checkboxProps}
      >
        {value && this.renderIcon(checkboxStyle.type, checkboxStyle.color)}
      </div>
    );
  }
}

CheckboxEditor.propTypes = {
  isEditorShow: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
};

export default CheckboxEditor;
