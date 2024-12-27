import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.string.isRequired,
  containerClassName: PropTypes.string,
};

class AutoNumberFormatter extends React.Component {

  static defaultProps = {
    value: '',
  };

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container auto-number-formatter', containerClassName);
    return (
      <div title={value} className={classname}>{value}</div>
    );
  }
}

AutoNumberFormatter.propTypes = propTypes;

export default AutoNumberFormatter;
