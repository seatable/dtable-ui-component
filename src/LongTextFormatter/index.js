import React from 'react';
import PropTypes from 'prop-types';
import HtmlLongTextFormatter from '../HtmlLongTextFormatter';
import SimpleLongTextFormatter from '../SimpleLongTextFormatter';

function LongTextFormatter(props) {
  const { isSample, value, isShowAll, containerClassName } = props;
  if (isSample) {
    return (
      <SimpleLongTextFormatter
        value={value}
        isShowAll={isShowAll}
        containerClassName={containerClassName}
      />
    );
  }
  return (
    <HtmlLongTextFormatter
      value={value}
      containerClassName={containerClassName}
    />
  );
}

LongTextFormatter.propTypes = {
  isSample: PropTypes.bool,
  isShowAll: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  containerClassName: PropTypes.string,
};

LongTextFormatter.defaultProps = {
  isSample: true,
  isShowAll: false,
};

export default LongTextFormatter;
