import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

import './index.css';

const propTypes = {
  value: PropTypes.string.isRequired,
  containerClassName: PropTypes.string,
};

class AutoNumberFormatter extends React.Component {

  render() {
    const { containerClassName, value } = this.props;
    let classname = cn('dtable-ui cell-formatter-container auto-number-formatter', containerClassName);
    return (
      <div className={classname}>{value}</div>
    );
  }
}

AutoNumberFormatter.propTypes = propTypes;

export default AutoNumberFormatter;
