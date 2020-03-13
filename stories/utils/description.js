import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';

const propTypes = {
  isDisplayInline: PropTypes.bool,
};

class Description extends React.Component {

  dispalyName = 'Description'

  render() {
    let { isDisplayInline, children } = this.props;
    let classname = cn('description-demo', {'description-inline': isDisplayInline})
    return (
      <div className={classname}>{children}</div>
    );
  }
}

Description.propTypes = propTypes;

export default Description;
