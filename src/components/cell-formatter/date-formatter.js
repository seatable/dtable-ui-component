import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import { formatDateToString } from '../../utils/value-format-utils';

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

  formatDate = (date, format) => {
    return formatDateToString(date, format);
  }

  render() {
    let { value: date, format, containerClassName } = this.props;
    let classname = cn('cell-formatter-container date-formatter', containerClassName);
    if (date !== '') {
      date = this.formatDate(date, format);
    }

    return (
      <div className={classname}>{date}</div>
    );
  }
}

DateFormatter.propTypes = propTypes;

export default DateFormatter;
