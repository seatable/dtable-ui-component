import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const needScaleIcons = ['check', 'dot', 'cross'];

const SvgIcon = (props) => {
  const { className, symbol, color } = props;
  let iconClass = `dtable-ui-multicolor-icon multicolor-icon-${symbol} ${className || ''}`;
  if (needScaleIcons.includes(symbol) && window.isMobile) {
    iconClass += ' scale-icon';
  }
  return (
    <svg className={iconClass} aria-hidden="true">
      <use fill={color} xlinkHref={`#${symbol}`} />
    </svg>
  );
};

SvgIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default SvgIcon;
