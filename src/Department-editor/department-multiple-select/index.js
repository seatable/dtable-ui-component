import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { searchDepartments, getNormalizedDepartments } from '../utils';
import SelectedDepartments from '../selected-departments';
import { getLocale } from '../../lang';

import './index.css';

function DepartmentMultipleSelect(props) {
  const { value, onCommit, classNamePrefix, isShowSelectedDepartments, renderUserDepartmentOptions,
    departments: initialDepartments } = props;
  const [searchVal, setSearchVal] = useState('');
  const [departments, setDepartments] = useState(getNormalizedDepartments(initialDepartments));
  const departmentContainerRef = useRef(null);
  const validDepartmentsRef = useRef([]);

  useEffect(() => {
    if (departmentContainerRef.current) {
      resetContainerPosition();
    }
    // eslint-disable-next-line
  }, []);

  function resetContainerPosition() {
    const { top, height } = departmentContainerRef.current.getBoundingClientRect();
    if (height + top > window.innerHeight) {
      const borderWidth = 1;
      departmentContainerRef.current.style.top = -1 * (height + borderWidth - 38) + 'px';
    }
  }

  function onExpand(event, id, isExpanded) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    let newDepartments = departments.slice(0);
    const index = newDepartments.findIndex(item => item.id === id);
    newDepartments[index].isExpanded = !isExpanded;
    setDepartments(newDepartments);
  }

  function onChangeSearch(event) {
    const newSearchValue = event.target.value;
    if (searchVal === newSearchValue) return;
    validDepartmentsRef.current = searchDepartments(departments, newSearchValue);
    setSearchVal(newSearchValue);
  }

  function onClick(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  function renderSubDepartments(parentId, subDepartments, level) {
    const topDepartments = subDepartments.filter(department => department.parent_id === parentId);
    const newSubDepartments = subDepartments.filter(department => department.parent_id !== parentId);
    if (topDepartments.length === 0) return null;
    return (
      topDepartments.map((department) => {
        return renderDepartment(department, newSubDepartments, level);
      })
    );
  }

  function onSelectDepartment(event, value) {
    event.stopPropagation();
    onCommit(event, value);
  }

  function onStopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  function renderDepartment(department, subDepartments, level) {
    const { hasChild, isExpanded, name, id } = department;
    const newLevel = level + 1;
    const inputStyle = { marginRight: `${(newLevel) * 15 + 5}px` };
    const nameStyle = { paddingLeft: hasChild ? '' : '16px' };
    const inputChecked = value.includes(id);

    return (
      <Fragment key={id}>
        <div className="department-item" onClick={(event) => onSelectDepartment(event, id)}>
          <input
            type="checkbox"
            className="vam department-select-input"
            checked={inputChecked}
            style={inputStyle}
            onChange={() => {}}
          />
          {hasChild && !searchVal &&
            <span
              className={`dtable-font expand dtable-icon-${isExpanded ? 'drop-down' : 'right-slide'} pr-1`}
              onClick={(event) => onExpand(event, id, isExpanded)}
            >
            </span>
          }
          <span style={searchVal ? {} : nameStyle} title={name} className="text-truncate">{name}</span>
        </div>
        {(isExpanded && hasChild) && renderSubDepartments(id, subDepartments, newLevel)}
      </Fragment>
    );
  }

  function renderSearchedDepartments() {
    return validDepartmentsRef.current.map(department => {
      return renderDepartment(department, [], -1);
    });
  }

  function renderDepartments() {
    const level = -1;
    const subDepartments = departments.filter(department => department.parent_id !== -1);
    const topDepartment = departments.find(department => department.parent_id === -1);
    if (!topDepartment) return null;

    return (
      <div
        ref={departmentContainerRef}
        onClick={onStopPropagation}
        onMouseDown={onStopPropagation}
        className={`departments-container dtable-ui ${classNamePrefix}`}
      >
        {isShowSelectedDepartments &&
          <div className="selected-departments dtable-ui" onClick={onClick}>
            <SelectedDepartments
              value={value}
              removeDepartment={onCommit}
              isShowRemoveIcon={true}
              departments={departments}
            />
          </div>
        }
        <div className="search-departments">
          <input
            className="form-control"
            type="text"
            autoFocus
            placeholder={getLocale('Search_department')}
            value={searchVal}
            onChange={onChangeSearch}
            onClick={onClick}
          />
        </div>
        <div className="department-item-container">
          {!searchVal && renderUserDepartmentOptions && renderUserDepartmentOptions()}
          {validDepartmentsRef.current.length > 0 && searchVal && renderSearchedDepartments()}
          {!searchVal && renderDepartment(topDepartment, subDepartments, level)}
        </div>
      </div>
    );
  }

  return renderDepartments();
}

DepartmentMultipleSelect.propTypes = {
  isLocked: PropTypes.bool,
  isShowSelectedDepartments: PropTypes.bool,
  classNamePrefix: PropTypes.string,
  value: PropTypes.array,
  departments: PropTypes.array,
  renderUserDepartmentOptions: PropTypes.func,
  onCommit: PropTypes.func,
};

export default DepartmentMultipleSelect;
