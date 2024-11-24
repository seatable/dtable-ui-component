import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const DAFAULT_CHECKBOX_MARK_STYLE = { type: 'check', color: '#1DDD1D' };

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  containerClassName: PropTypes.string,
};

class CheckboxFormatter extends React.PureComponent {

  static defaultProps = {
    value: false
  };

  render() {
    let { value, containerClassName, checkboxStyle } = this.props;
    if (!checkboxStyle || !('type' in checkboxStyle && 'color' in checkboxStyle)) {
      checkboxStyle = DAFAULT_CHECKBOX_MARK_STYLE;
    }
    const currentValue = !!value;
    let classname = classnames('dtable-ui cell-formatter-container checkbox-formatter d-flex align-items-center justify-content-center', containerClassName);
    if (!currentValue) return null;
    return (
      <div className={classname}>
        {checkboxStyle.type.startsWith('dtable-icon') ?
          <span className={`dtable-font ${checkboxStyle.type} checkbox-checked-mark`} style={{ color: checkboxStyle.color }}></span> :
          <svg style={{ width: '16px', height: '16px', fill: checkboxStyle.color }}>
            <use xlinkHref={`#${checkboxStyle.type}`} />
          </svg>}
      </div>
    );
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
