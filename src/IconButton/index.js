import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const IconButton = ({ disabled, className, icon, children, ...otherProperties }) => {
  return (
    <div
      className={classnames('seatable-icon-btn', className, { 'disabled': disabled })}
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
