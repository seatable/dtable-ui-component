import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SvgIcon from '../SvgIcon';
import { DEFAULT_CHECKBOX_MARK_STYLE } from '../constants';

import './index.css';

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
      checkboxStyle = DEFAULT_CHECKBOX_MARK_STYLE;
    }
    const currentValue = !!value;
    if (!currentValue) return null;

    const classname = classnames('dtable-ui cell-formatter-container checkbox-formatter d-flex align-items-center justify-content-center', containerClassName);
    return (
      <div className={classname}>
        {checkboxStyle.type.startsWith('dtable-icon') ?
          <span className={`dtable-font ${checkboxStyle.type} checkbox-checked-mark`} style={{ color: checkboxStyle.color }}></span> :
          <SvgIcon className="dtable-ui-checkbox-check-svg" symbol={checkboxStyle.type} color={checkboxStyle.color} />
        }
      </div>
    );
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
