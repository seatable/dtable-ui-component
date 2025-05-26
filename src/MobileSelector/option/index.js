import React from 'react';
import PropTypes from 'prop-types';
import List from '../../List';

import './index.css';

const Option = ({ isSelected, children, onChange }) => {

  return (
    <List.Item onClick={onChange}>
      <div className="dtable-ui-mobile-selector-option">
        <span className="dtable-ui-mobile-selector-option-name">
          {children}
        </span>
        <span className="dtable-ui-mobile-selector-option-check-btn">
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
