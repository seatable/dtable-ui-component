import React from 'react';
import PropTypes from 'prop-types';
import DTableSearchInput from '../../DTableSearchInput';

import './index.css';

const Search = ({ value, placeholder, onChange }) => {
  return (
    <div className="mobile-dtable-ui-selector-editor-search">
      <DTableSearchInput autoFocus={true} value={value} placeholder={placeholder} onChange={onChange} />
    </div>
  );
};

Search.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Search;
