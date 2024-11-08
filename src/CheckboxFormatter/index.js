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
    let { value, containerClassName, checkbox_style } = this.props;
    if (!checkbox_style || !('type' in checkbox_style && 'color' in checkbox_style)) {
      checkbox_style = DAFAULT_CHECKBOX_MARK_STYLE;
    }
    const currentValue = !!value;
    let classname = classnames('dtable-ui cell-formatter-container checkbox-formatter d-flex align-items-center justify-content-center', containerClassName);
    if (!currentValue) return null;
    return (
      <div className={classname}>
        {checkbox_style.type.startsWith('dtable-icon') ?
          <span className={`dtable-font ${checkbox_style.type} checkbox-checked-mark`} style={{ color: checkbox_style.color }}></span> :
          <svg style={{ width: '16px', height: '16px', color: checkbox_style.color }}>
            <use xlinkHref={`#${checkbox_style.type}`} />
          </svg>}
      </div>
    );
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
