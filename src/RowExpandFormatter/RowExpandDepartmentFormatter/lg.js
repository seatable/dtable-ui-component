import React from 'react';
import PropTypes from 'prop-types';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';

function Large({ value, departments }) {
  return (
    <div className="position-relative w-100">
      <div tabIndex={0} className="dtable-ui-row-expand-select-formatter custom-select">
        <div className="dtable-ui-row-expand-select-formatter-inner">
          <DepartmentSingleSelectFormatter value={value} departments={departments} />
        </div>
      </div>
    </div>
  );
}

Large.propTypes = {
  value: PropTypes.string,
  departments: PropTypes.array,
};

export default Large;
