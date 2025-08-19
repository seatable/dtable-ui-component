import PropTypes from 'prop-types';
import classnames from 'classnames';
import SvgIcon from './svg-icon';

import './index.css';

const DTableIcon = ({ className, symbol, color, ariaHidden = false, getSvg }) => {
  if (!symbol) return null;
  if (symbol.includes('dtable-icon')) {
    let customProps = {};
    if (ariaHidden) {
      customProps['aria-hidden'] = ariaHidden;
    }
    return <i className={classnames(symbol, className, { 'dtable-font': !symbol.includes('dtable-font') })} style={{ color }} {...customProps}></i>;
  }

  return (
    <SvgIcon
      symbol={symbol}
      color={color}
      className={className}
      ariaHidden={ariaHidden}
      getSvg={getSvg}
    />
  );
};

DTableIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  getSvg: PropTypes.func,
};

export default DTableIcon;
