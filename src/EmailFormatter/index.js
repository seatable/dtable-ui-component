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
    const { containerClassName, value, onClick } = this.props;
    let classname = classnames(
      'dtable-ui cell-formatter-container email-formatter',
      { 'is-formatter-clickable': onClick },
      containerClassName,
    );
    const props = {
      className: classname,
    };
    if (onClick) {
      props.onClick = onClick;
    }
    return (
      <div {...props} >{value}</div>
    );
  }
}

EmailFormatter.propTypes = propTypes;

export default EmailFormatter;
