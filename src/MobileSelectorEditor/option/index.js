import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';

import './index.css';

const Option = ({ isSelected, children, onChange }) => {

  return (
    <List.Item onClick={onChange}>
      <div className="mobile-dtable-ui-selector-editor-option">
        <span className="mobile-dtable-ui-selector-editor-option-name">
          {children}
        </span>
        <span className="mobile-dtable-ui-selector-editor-option-check-btn">
          {isSelected && (<i aria-hidden="true" className="dtable-font dtable-icon-check-mark"></i>)}
        </span>
      </div>
    </List.Item>
  );
};

Option.propType = {
  isSelected: PropTypes.bool,
  children: PropTypes.any,
  onChange: PropTypes.func,
};

export default Option;
