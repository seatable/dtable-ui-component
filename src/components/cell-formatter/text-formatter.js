import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class TextFormatter extends React.Component {

  getFormattedValue = (val) => {
    if (typeof val === 'object') {
      return null;
    }
    if (Object.prototype.toString.call(val) === '[object Boolean]') {
      return val + ''
    }
    return val;
  }

  render() {
    const { containerClassName, value } = this.props;
    let classname = cn('dtable-ui cell-formatter-container text-formatter', containerClassName);
    return (
      <div className={classname}>{this.getFormattedValue(value)}</div>
    );
  }
}

TextFormatter.propTypes = propTypes;

export default TextFormatter;
