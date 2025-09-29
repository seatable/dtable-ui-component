import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DTableIcon from '../DTableIcon';
import { DEFAULT_CHECKBOX_MARK_STYLE, isMobile } from '../constants';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  containerClassName: PropTypes.string,
};

class CheckboxFormatter extends React.PureComponent {

  static defaultProps = {
    value: false
  };

  renderIcon = (symbol, color) => {
    const className = classnames('dtable-ui-checkbox-check-mark', { 'dtable-ui-checkbox-check-svg': !symbol?.startsWith('dtable-icon')});
    return (
      <DTableIcon
        className={className}
        symbol={symbol}
        color={color}
      />
    );
  };

  render() {
    let { value, containerClassName, checkboxStyle } = this.props;
    if (!checkboxStyle || !('type' in checkboxStyle && 'color' in checkboxStyle)) {
      checkboxStyle = DEFAULT_CHECKBOX_MARK_STYLE;
    }
    const currentValue = !!value;
    if (!currentValue) return null;

    const classname = classnames('dtable-ui cell-formatter-container checkbox-formatter d-flex align-items-center justify-content-center', containerClassName);
    return (
      <div className={classname}>
        {this.renderIcon(checkboxStyle.type, checkboxStyle.color)}
      </div>
    );
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
