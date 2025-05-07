import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const iconComponents = {};
const requireContext = require.context('../assets/icons', false, /\.svg$/);

requireContext.keys().forEach(path => {
  const iconName = path.replace(/^\.\/(.*?)\.svg$/, '$1').toLowerCase();
  iconComponents[iconName] = requireContext(path).default;
});

const SvgIcon = ({ className, symbol, color }) => {
  if (!symbol) return null;
  const iconClass = `dtable-ui-multicolor-icon multicolor-icon-${symbol} ${className || ''}`;
  const props = { className: iconClass, style: { fill: color }, ariaHidden: 'true' };

  const IconComponent = iconComponents[symbol];
  if (!IconComponent) return null;
  return (<IconComponent { ...props } />);
};

SvgIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default SvgIcon;
