import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
    let { value, containerClassName } = this.props;
    value = value === true ? true : false;
    let classname = classnames('dtable-ui cell-formatter-container checkbox-formatter d-flex align-items-center justify-content-center', containerClassName);
    if (value) {
      return (
        <div className={classname}>
          <span className="dtable-font dtable-icon-check-mark checkbox-checked-mark"></span>
        </div>
      );
    }
    return null;
  }
}

CheckboxFormatter.propTypes = propTypes;

export default CheckboxFormatter;
