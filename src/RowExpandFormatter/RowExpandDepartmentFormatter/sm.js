import React from 'react';
import PropTypes from 'prop-types';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';

function Small({ value, departments }) {
  return (<DepartmentSingleSelectFormatter value={value} departments={departments} />);
}

Small.propTypes = {
  value: PropTypes.string,
  departments: PropTypes.array,
};

export default Small;
