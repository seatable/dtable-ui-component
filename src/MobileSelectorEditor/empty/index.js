import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';

import './index.css';

const Empty = ({ children }) => {

  return (
    <List.Item className="mobile-dtable-ui-selector-editor-no-options">
      {children}
    </List.Item>
  );
};

Empty.propType = {
  children: PropTypes.any,
};

export default Empty;
