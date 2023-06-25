import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class UrlFormatter extends React.Component {

  render() {
    const { containerClassName, value } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container url-formatter', containerClassName);
    return (
      <div className={classname}>{value}</div>
    );
  }
}

UrlFormatter.propTypes = propTypes;

export default UrlFormatter;
