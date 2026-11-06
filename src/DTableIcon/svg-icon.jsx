import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const getSvgIcon = (symbol) => {
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(symbol)) return null;
  try {
    return require(`../assets/icons/${symbol}.svg`).default;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') return null;
    throw error;
  }
};

const SvgIcon = forwardRef(({ className, symbol, color, style, ariaHidden = false, getSvg, ...props }, ref) => {
  if (typeof symbol !== 'string' || !symbol) return null;
  // Preserve the library's artwork; consult the caller only for missing icons.
  let IconComponent = getSvgIcon(symbol);
  if (!IconComponent && getSvg) {
    IconComponent = getSvg(symbol);
  }
  if (!IconComponent) return null;

  return (
    <IconComponent
      ref={ref}
      className={classnames('multicolor-icon', className, `multicolor-icon-${symbol}`)}
      style={{ ...style, ...(color != null ? { color } : {}) }}
      aria-hidden={ariaHidden}
      focusable="false"
      {...props}
    />
  );
});

SvgIcon.displayName = 'SvgIcon';
SvgIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  getSvg: PropTypes.func,
};

export default SvgIcon;
