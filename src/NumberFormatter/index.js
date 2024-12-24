import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getNumberDisplayString } from 'dtable-utils';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object,
  containerClassName: PropTypes.string,
};

class NumberFormatter extends React.Component {

  static defaultProps = {
    value: '',
    containerClassName: '',
  };

  render() {
    let { value: number, data, containerClassName } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container number-formatter', containerClassName);
    if (number || number === 0) {
      number = getNumberDisplayString(number, data);
    }

    return (
      <div title={number} className={classname}>{number}</div>
    );
  }
}

NumberFormatter.propTypes = propTypes;

export default NumberFormatter;
