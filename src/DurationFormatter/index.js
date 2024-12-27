import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getDurationDisplayString } from 'dtable-utils';

import './index.css';

const propTypes = {
  value: PropTypes.number,
  format: PropTypes.string,
  containerClassName: PropTypes.string,
};

class DurationFormatter extends React.Component {

  render() {
    let { value, containerClassName, format } = this.props;
    let classname = classnames('dtable-ui cell-formatter-container duration-formatter', containerClassName);
    const durationDisplayString = getDurationDisplayString(value, { duration_format: format });
    return (
      <div title={durationDisplayString} className={classname}>{durationDisplayString}</div>
    );
  }
}

DurationFormatter.propTypes = propTypes;

export default DurationFormatter;
