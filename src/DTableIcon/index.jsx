import PropTypes from 'prop-types';
import classnames from 'classnames';
import SvgIcon from './svg-icon';

import './index.css';

const DTableIcon = ({ className, symbol, color, style, ariaHidden = false, focusable, getSvg }) => {
  if (!symbol) return null;
  const iconStyle = { ...style, ...(color ? { color } : {}) };
  if (symbol.includes('dtable-icon')) {
    let customProps = {};
    if (ariaHidden) {
      customProps['aria-hidden'] = ariaHidden;
    }
    return <i className={classnames(symbol, className, { 'dtable-font': !symbol.includes('dtable-font') })} style={iconStyle} {...customProps}></i>;
  }

  return (
    <SvgIcon
      symbol={symbol}
      color={color}
      style={style}
      className={className}
      ariaHidden={ariaHidden}
      focusable={focusable}
      getSvg={getSvg}
    />
  );
};

DTableIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  focusable: PropTypes.bool,
  getSvg: PropTypes.func,
};

export default DTableIcon;
