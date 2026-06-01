import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DTableToolTip from '../DTableToolTip';
import { generatorBase64Code } from 'dtable-utils';

import '../css/icon-button-styles.css';

const IconButton = ({ disabled, className, icon, color, children, title, tooltipPlacement, outline, noBackground, ...otherProperties }) => {
  const buttonIdRef = useRef(`dtable-icon-button-${generatorBase64Code(8)}`);

  return (
    <>
      <div
        id={buttonIdRef.current}
        className={classnames('dtable-icon-btn', className, {
          'disabled': disabled,
          'outline': outline,
          'no-background': noBackground
        })}
        aria-label={title}
        {...otherProperties}
      >
        {icon && <i className={classnames('seatable-icon dtable-font', `dtable-icon-${icon}`)} aria-hidden="true" style={color ? { color } : undefined}></i>}
        {children}
      </div>
      {title && (
        <DTableToolTip placement={tooltipPlacement || 'bottom'} target={buttonIdRef.current}>
          {title}
        </DTableToolTip>
      )}
    </>
  );
};

IconButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.any,
  title: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  outline: PropTypes.bool,
  noBackground: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

export default IconButton;
