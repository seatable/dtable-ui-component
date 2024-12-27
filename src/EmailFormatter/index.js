import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class EmailFormatter extends React.Component {

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container email-formatter', containerClassName);
    return (
      <div title={value} className={classname}>{value}</div>
    );
  }
}

EmailFormatter.propTypes = propTypes;

export default EmailFormatter;
