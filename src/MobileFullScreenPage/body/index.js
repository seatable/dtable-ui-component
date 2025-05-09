import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const Body = ({ classNamePrefix, className, children }) => {
  return (
    <div className={classnames('dtable-ui-mobile-full-screen-page-body', className, { [`${classNamePrefix}-mobile-full-screen-page-body`]: classNamePrefix })}>
      {children}
    </div>
  );
};

Body.propTypes = {
  classNamePrefix: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
};

export default Body;
