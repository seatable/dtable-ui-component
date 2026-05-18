import React from 'react';
import DTableIcon from '../../DTableIcon';

import './index.css';

const SelectDropdownIndicator = () => {
  return (
    <span className="select-dropdown-indicator d-flex align-items-center" aria-hidden="true">
      <DTableIcon symbol="down" color='var(--bs-icon-color)'/>
    </span>
  );
};

export default SelectDropdownIndicator;
