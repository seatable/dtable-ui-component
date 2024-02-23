import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';

import './index.css';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerClassName: PropTypes.string
};

class CTimeFormatter extends React.Component {

  static defaultProps = {
    value: '',
    containerClassName: '',
  };

  formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  };

  render() {
    let { value: date, containerClassName } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container ctime-formatter', containerClassName);
    if (date) {
      date = this.formatDate(date);
    }

    return (
      <div className={classname}>{date}</div>
    );
  }
}

CTimeFormatter.propTypes = propTypes;

export default CTimeFormatter;
