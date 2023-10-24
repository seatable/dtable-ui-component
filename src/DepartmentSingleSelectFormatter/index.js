import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { getLocale } from '../lang';

import './index.css';

const propTypes = {
  containerClassName: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  departments: PropTypes.array,
};

function DepartmentSingleSelectFormatter(props) {
  const { value, departments, containerClassName } = props;
  if (!value) return null;
  const department = departments.find(department => department.id === value);
  const name = department ? department.name : getLocale('Deleted_department');
  let classname = classnames('dtable-ui cell-formatter-container department-single-select-formatter text-truncate',
    containerClassName);

  return (
    <div className={classname}>
      <div className="department-avatar-container d-flex align-items-center justify-content-center">
        <span className="dtable-font dtable-icon-department-single-selection"></span>
      </div>
      <span className="department-name text-truncate">{name}</span>
    </div>
  );
}

DepartmentSingleSelectFormatter.propTypes = propTypes;

export default DepartmentSingleSelectFormatter;
