import React from 'react';
import PropTypes from 'prop-types';
import List from '../../List';

import './index.css';

const Empty = ({ children }) => {

  return (
    <List.Item className="dtable-ui-mobile-selector-no-options">
      {children}
    </List.Item>
  );
};

Empty.propType = {
  children: PropTypes.any,
};

export default Empty;
