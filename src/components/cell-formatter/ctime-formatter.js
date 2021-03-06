import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import moment from 'moment';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerClassName: PropTypes.string
};

class CTimeFormatter extends React.Component {

  static defaultProps = {
    value: '', 
    containerClassName: '',
  }

  formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  render() {
    let { value: date, containerClassName } = this.props;
    let classname = cn('dtable-ui cell-formatter-container ctime-formatter', containerClassName);
    if (date !== '') {
      date = this.formatDate(date);
    }

    return (
      <div className={classname}>{date}</div>
    );
  }
}

CTimeFormatter.propTypes = propTypes;

export default CTimeFormatter;
