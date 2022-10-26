import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
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
  }

  render() {
    const { containerClassName, value } = this.props;
    const classname = cn('dtable-ui cell-formatter-container text-formatter', containerClassName);
    const formattedValue = this.getFormattedValue(value);
    return (
      <div className={classname} title={formattedValue}>{formattedValue}</div>
    );
  }
}

TextFormatter.propTypes = propTypes;

export default TextFormatter;
