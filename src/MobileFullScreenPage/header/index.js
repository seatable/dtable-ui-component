import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const Header = ({ classNamePrefix, children, onLeftClick, onRightClick }) => {
  return (
    <div className={classnames('dtable-ui-mobile-full-screen-page-header p-0', { [`${classNamePrefix}-mobile-full-screen-page-header`]: classNamePrefix })}>
      <div
        className={classnames('dtable-ui-mobile-full-screen-page-header-btn', { [`${classNamePrefix}-mobile-full-screen-page-header-btn`]: classNamePrefix })}
        onClick={onLeftClick}
      >
        {children[0]}
      </div>
      <h4 className={classnames('dtable-ui-mobile-full-screen-page-header-title', { [`${classNamePrefix}-mobile-full-screen-page-header-title`]: classNamePrefix })}>
        {children[1]}
      </h4>
      <div
        className={classnames('dtable-ui-mobile-full-screen-page-header-btn', { [`${classNamePrefix}-mobile-full-screen-page-header-btn`]: classNamePrefix })}
        onClick={onRightClick}
      >
        {children[2]}
      </div>
    </div>
  );
};

Header.propTypes = {
  classNamePrefix: PropTypes.string,
  children: PropTypes.any,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
};

export default Header;
