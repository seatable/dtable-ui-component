import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DEPARTMENT_SELECT_RANGE_MAP } from 'dtable-utils';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from '../constants/departments';
import { getLocale } from '../lang';

import './index.css';

function SelectedDepartments({ value, removeDepartment, isShowRemoveIcon = false, departments = [] }) {

  const idDepartmentMap = useMemo(() => {
    let idDepartmentMap = {};
    departments.forEach(department => {
      idDepartmentMap[department.id] = department;
    });
    return idDepartmentMap;
  }, [departments]);

  const dom = Array.isArray(value) ? value.map((content, index) => {
    if ([DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT, DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT_AND_SUB].includes(content)) {
      const name = getLocale(DEPARTMENT_SELECT_RANGE_OPTIONS.find(option => option.type === content).name);
      return (
        <div key={`department-${index}`} className='department mr-1'>
          <span className="department-name text-truncate" title={name} aria-label={name}>{name}</span>
        </div>
      );
    }
    const department = idDepartmentMap[content];
    if (department) {
      const { name } = department;
      return (
        <div key={`department-${index}`} className='department mr-1'>
          <div className="department-avatar-container d-flex align-items-center justify-content-center">
            <span className="dtable-font dtable-icon-department-single-selection"></span>
          </div>
          <span className="department-name text-truncate" title={name} aria-label={name}>{name}</span>
          {isShowRemoveIcon &&
            <span className="remove-container">
              <span className="remove-icon" onClick={(event) => removeDepartment(event, content)}>
                <i className="dtable-font dtable-icon-fork-number department-remove-icon"></i>
              </span>
            </span>
          }
        </div>
      );
    }
    return (
      <div key={`department-${index}`} className="department empty-department mr-1">
        <div className="department-avatar-container d-flex align-items-center justify-content-center">
          <span className="dtable-font dtable-icon-department-single-selection"></span>
        </div>
        <span className="department-name">{getLocale('Deleted_department')}</span>
        {isShowRemoveIcon &&
          <span className="remove-container">
            <span className="remove-icon" onClick={(event) => removeDepartment(event, content)}>
              <i className="dtable-font dtable-icon-fork-number department-remove-icon"></i>
            </span>
          </span>
        }
      </div>
    );
  }) : null;

  return dom;
}

SelectedDepartments.propTypes = {
  isShowRemoveIcon: PropTypes.bool,
  value: PropTypes.array,
  departments: PropTypes.array,
  removeDepartment: PropTypes.func,
};

export default SelectedDepartments;
