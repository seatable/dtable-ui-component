import PropTypes from 'prop-types';
import classnames from 'classnames';

let svgIconComponents = null;

const loadSvgIconComponents = () => {
  // load svg icons from ui-components
  const requireContext = require.context('../assets/icons', false, /\.svg$/);
  let iconComponents = {};
  requireContext.keys().forEach(path => {
    const iconName = path.replace(/^\.\/(.*?)\.svg$/, '$1').toLowerCase();
    iconComponents[iconName] = requireContext(path).default;
  });
  return iconComponents;
};

const getSvgIconComponents = () => {
  if (!svgIconComponents) {
    svgIconComponents = loadSvgIconComponents();
  }
  return svgIconComponents;
};

const SvgIcon = ({ className, symbol, color, ariaHidden, getSvg }) => {
  if (!symbol) return null;

  let props = { style: { fill: color } };
  if (ariaHidden) {
    props['aria-hidden'] = ariaHidden;
  }

  const iconComponents = getSvgIconComponents();
  let IconComponent = iconComponents[symbol];
  if (!IconComponent && getSvg) {
    // try to get svg icon from other modules
    IconComponent = getSvg(symbol);
  }
  if (!IconComponent) return null;
  return (<IconComponent className={classnames('multicolor-icon', className, `multicolor-icon-${symbol}`)} {...props} />);
};

SvgIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  getSvg: PropTypes.func,
};

export default SvgIcon;
