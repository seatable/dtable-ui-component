import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DTableIcon from '../DTableIcon';

import './index.css';

const LEGACY_ICON_SYMBOL_MAP = {
  x: 'modal-close',
  close: 'modal-close',
  'modal-close': 'modal-close',
  'full-screen': 'full-screen-dialog',
  'full-screen-dialog': 'full-screen-dialog',
  'open-com': 'unfold',
  unfold: 'unfold',
  'retract-com': 'fold',
  fold: 'fold',
  url: 'link',
  link: 'link',
  'more-level': 'more',
  more: 'more',
  'set-up': 'set-up',
};

const IconButton = ({ disabled, className, icon, useNewIcon = false, children, ...otherProperties }) => {
  const svgSymbol = (useNewIcon && icon) ? LEGACY_ICON_SYMBOL_MAP[icon] : null;
  let iconElement = null;
  if (svgSymbol) {
    iconElement = <DTableIcon symbol={svgSymbol} className="seatable-icon" ariaHidden focusable={false} />;
  } else if (icon) {
    iconElement = <i className={classnames('seatable-icon dtable-font', `dtable-icon-${icon}`)} aria-hidden="true" />;
  }

  return (
    <div
      className={classnames('seatable-icon-btn icon-button', className, { 'disabled': disabled })}
      {...otherProperties}
    >
      {iconElement}
      {children}
    </div>
  );
};

IconButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
  useNewIcon: PropTypes.bool,
  children: PropTypes.any,
};

export default IconButton;
