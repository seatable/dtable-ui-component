import React from 'react';
import PropTypes from 'prop-types';

import './dtable-select-label.css';

function DTableSelectLabel({ classname, name, isSelect }) {
  return (
    <div className={`${classname} w-100 d-flex justify-content-between`}>
      <span>{name}</span>
      {isSelect &&
        <div className='dtable-select-check-icon'>
          <i className="dtable-font dtable-icon-check-mark"></i>
        </div>
      }
    </div>
  );
}

DTableSelectLabel.propTypes = {
  classname: PropTypes.string,
  name: PropTypes.string,
  isSelect: PropTypes.bool,
};

DTableSelectLabel.defaultProps = {
  classname: '',
  name: '',
  isSelect: false,
};

export default DTableSelectLabel;
