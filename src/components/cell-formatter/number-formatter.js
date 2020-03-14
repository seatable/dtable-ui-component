import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { formatNumberToString } from '../../utils/value-format-utils';


const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  format: PropTypes.oneOf(['number', 'number-with-commas', 'percent', 'yuan', 'dollar', 'euro']),
  containerClassName: PropTypes.string,
};

class NumberFormatter extends React.Component {

  static defaultProps = {
    value: '', 
    format: 'number',
    containerClassName: '',
  }

  formatNumber = (number, format) => {
    return formatNumberToString(number, format);
  }

  render() {
    let { value: number, format, containerClassName } = this.props;
    let classname = cn('cell-formatter-container number-formatter', containerClassName);
    if (number !== '') {
      number = this.formatNumber(number, format);
    }

    return (
      <div className={classname}>{number}</div>
    );
  }
}

NumberFormatter.propTypes = propTypes;

export default NumberFormatter;