import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const IconButton = ({ disabled, className, icon, children, ...otherProperties }) => {
  return (
    <div
      className={classnames('seatable-icon-btn icon-button', className, { 'disabled': disabled })}
      {...otherProperties}
    >
      {icon && (<i className={classnames('seatable-icon dtable-font', `dtable-icon-${icon}`)} aria-hidden="true"></i>)}
      {children}
    </div>
  );
};

IconButton.propTypes = {
  disabled: PropTypes.bool,
  classnames: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.any,
};

export default IconButton;
