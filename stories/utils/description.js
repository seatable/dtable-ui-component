import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  isDisplayInline: PropTypes.bool,
  children: PropTypes.any,
};

class Description extends React.Component {

  dispalyName = 'Description';

  render() {
    let { isDisplayInline, children } = this.props;
    let classname = classnames('description-demo', {'description-inline': isDisplayInline});
    return (
      <div className={classname}>{children}</div>
    );
  }
}

Description.propTypes = propTypes;

export default Description;
