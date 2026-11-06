import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SvgIcon from './svg-icon';

import './index.css';

const DTableIcon = forwardRef(({ className, symbol, color, style, ariaHidden = false, getSvg, ...props }, ref) => {
  if (typeof symbol !== 'string' || !symbol) return null;
  if (symbol.includes('dtable-icon')) {
    return (
      <i
        ref={ref}
        className={classnames(symbol, className, { 'dtable-font': !symbol.includes('dtable-font') })}
        style={{ ...style, ...(color != null ? { color } : {}) }}
        aria-hidden={ariaHidden}
        {...props}
      />
    );
  }

  return (
    <SvgIcon
      ref={ref}
      symbol={symbol}
      color={color}
      style={style}
      className={className}
      ariaHidden={ariaHidden}
      getSvg={getSvg}
      {...props}
    />
  );
});

DTableIcon.displayName = 'DTableIcon';
DTableIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  getSvg: PropTypes.func,
};

export default DTableIcon;
