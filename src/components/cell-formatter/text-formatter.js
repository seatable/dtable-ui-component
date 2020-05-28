import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  value: PropTypes.string,
  containerClassName: PropTypes.string,
};

class TextFormatter extends React.Component {

  render() {
    const { containerClassName, value } = this.props;
    let classname = cn('cell-formatter-container text-formatter', containerClassName);
    return (
      <div className={classname}>{value}</div>
    );
  }
}

TextFormatter.propTypes = propTypes;

export default TextFormatter;