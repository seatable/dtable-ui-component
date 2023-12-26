import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import SelectedDepartments from '../../../common/editors/department-editor/selected-departments';
import DepartmentSingleSelect from '../../../common/editors/department-editor/department-single-select';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from '../../../constants';
import { useClickOutsideEffect } from '../../../common/common-hooks';
import context from '../../../context';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
};

function DepartmentSingleSelectFilter(props) {
  const { value, column } = props;
  const [isShowSelector, setIsShowSelector] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(value || '');
  const selectorRef = useRef(null);
  let selectedDepartmentIds = [];
  selectedDepartmentIds.push(value);

  useClickOutsideEffect(selectorRef, () => {
    setIsShowSelector(false);
  });

  function renderUserDepartmentOptions(onSelect) {
    const roleId = context.getSetting('roleId');
    if (!roleId) return [];
    return DEPARTMENT_SELECT_RANGE_OPTIONS.slice(0, 2).map((option, index) => {
      const { type, name } = option;
      return (
        <div
          className="dropdown-item department-item d-flex align-items-center"
          key={index}
          onClick={(event) => onSelect(event, type)}
        >
          <div className="department-item-left-content d-flex align-items-center">
            <span className="text-truncate department-name">{intl.get(name)}</span>
            {selectedDepartment === type && 
              <span className="department-check-icon">
                <i className="dtable-font dtable-icon-check-mark"></i>
              </span>
            }
          </div>
        </div>
      );
    });
  }

  function onSelectToggle(event) {
    event.preventDefault();
    setIsShowSelector(!isShowSelector);
  }

  function onCommit(value) {
    setSelectedDepartment(value);
    setIsShowSelector(false);
    const columnOption = { id: value };
    props.onCommit({ columnOption });
  }

  return (
    <div
      ref={selectorRef}
      className={classnames('dtable-select custom-select', 
        {'focus': isShowSelector}
      )}
      onClick={onSelectToggle}
      id='filter-department-editor' 
    >
      <div className="selected-option">
        {value ?
          <span className="selected-option-show">
            <SelectedDepartments value={selectedDepartmentIds} />
          </span>
          :
          <span className="select-placeholder">{intl.get('Select_department')}</span>
        }
        <span className="dtable-font dtable-icon-drop-down"></span>
      </div>
      {isShowSelector &&
        <DepartmentSingleSelect
          enableSelectRange={false}
          column={column}
          value={value}
          onCommit={onCommit}
          renderUserDepartmentOptions={renderUserDepartmentOptions}
        />
      } 
    </div>
  );
}

DepartmentSingleSelectFilter.propTypes = propTypes;

export default DepartmentSingleSelectFilter;
