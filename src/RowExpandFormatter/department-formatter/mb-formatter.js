import React from 'react';
import PropTypes from 'prop-types';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';

function RowExpandMBDepartmentFormatter({ value, departments }) {
  return (<DepartmentSingleSelectFormatter value={value} departments={departments} />);
}

RowExpandMBDepartmentFormatter.propTypes = {
  value: PropTypes.string,
  departments: PropTypes.array,
};

export default RowExpandMBDepartmentFormatter;
