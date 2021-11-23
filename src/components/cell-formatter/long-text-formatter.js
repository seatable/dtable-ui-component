import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import HtmlLongTextFormatter from './widgets/long-text-formatter/html-long-text-formatter';
import SimpleLongTextFormatter from './widgets/long-text-formatter/simple-long-text-formatter';

function LongTextFormatter(props) {
  const { isSample, value, containerClassName } = props;
  const className= cn('dtable-ui cell-formatter-container long-text-formatter', containerClassName);
  if (isSample) {
    return (
      <SimpleLongTextFormatter
        value={value}
        className={className}
      />
    );
  }
  return (
    <HtmlLongTextFormatter
      value={value}
      className={className}
    />
  );
}

LongTextFormatter.propTypes = {
  isSample: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  containerClassName: PropTypes.string,
};

LongTextFormatter.defaultProps = {
  isSample: true,
};

export default LongTextFormatter;
