import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.any,
  containerClassName: PropTypes.string,
};

class TextFormatter extends React.Component {

  getFormattedValue = (val) => {
    if (typeof val === 'object') {
      return null;
    }
    if (Object.prototype.toString.call(val) === '[object Boolean]') {
      return val + '';
    }
    return val;
  };

  render() {
    const { containerClassName, value } = this.props;
    const classname = classnames('dtable-ui cell-formatter-container text-formatter', containerClassName);
    const formattedValue = this.getFormattedValue(value);
    return (
      <div className={classname} title={formattedValue}>{formattedValue}</div>
    );
  }
}

TextFormatter.propTypes = propTypes;

export default TextFormatter;
