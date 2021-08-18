import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { formatNumberToString } from '../../utils/value-format-utils';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object,
  containerClassName: PropTypes.string,
};

class NumberFormatter extends React.Component {

  static defaultProps = {
    value: '',
    containerClassName: '',
  }

  render() {
    let { value: number, data, containerClassName } = this.props;
    let classname = cn('dtable-ui cell-formatter-container number-formatter', containerClassName);
    if (number || number === 0) {
      number = formatNumberToString(number, data);
    }

    return (
      <div className={classname}>{number}</div>
    );
  }
}

NumberFormatter.propTypes = propTypes;

export default NumberFormatter;
