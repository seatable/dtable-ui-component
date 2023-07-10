import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getDateDisplayString } from 'dtable-utils';

import './index.css';

const propTypes = {
  value: PropTypes.string,
  format: PropTypes.string,
  containerClassName: PropTypes.string
};

class DateFormatter extends React.Component {

  static defaultProps = {
    value: '',
    format: 'YYYY-MM-DD',
    containerClassName: '',
  }

  render() {
    let { value: date, format, containerClassName } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container date-formatter', containerClassName);
    if (date !== '') {
      date = getDateDisplayString(date, format);
    }

    return (
      <div className={classname}>{date}</div>
    );
  }
}

DateFormatter.propTypes = propTypes;

export default DateFormatter;
