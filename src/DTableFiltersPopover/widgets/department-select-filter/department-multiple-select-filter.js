import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectedDepartments from '../../../Department-editor/selected-departments';
import DepartmentMultipleSelect from '../../../Department-editor/department-multiple-select';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from '../../../Department-editor/constants';
import { useClickOutside } from '../../../hooks/common-hooks';
import { getLocale } from '../../../lang';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  departments: PropTypes.object,
  onCommit: PropTypes.func,
};

function DepartmentMultipleSelectFilter(props) {
  const { value, departments } = props;
  const [isShowSelector, setIsShowSelector] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(value || []);
  const selectorRef = useRef(null);

  useClickOutside({
    currDOM: selectorRef.current,
    onClickOutside: () => setIsShowSelector(false),
  }, [selectedDepartments]);

  function renderUserDepartmentOptions() {
    return DEPARTMENT_SELECT_RANGE_OPTIONS.slice(0, 2).map((option, index) => {
      const { type, name } = option;
      return (
        <div
          className="department-item"
          key={index}
          onClick={(event) => selectDepartment(event, type)}
        >
          <input
            type="checkbox"
            className="vam department-select-input"
            checked={selectedDepartments.includes(type)}
            onChange={(event) => selectDepartment(event, type)}
          />
          <span className="text-truncate department-name">{getLocale(name)}</span>
        </div>
      );
    });
  }

  function onSelectToggle(event) {
    event.preventDefault();
    setIsShowSelector(!isShowSelector);
  }

  function selectDepartment(event, value) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    let newSelectedDepartment = selectedDepartments.slice(0);
    const index = newSelectedDepartment.findIndex(item => item === value);
    if (index !== -1) {
      newSelectedDepartment.splice(index, 1);
    } else {
      newSelectedDepartment.push(value);
    }
    setSelectedDepartments(newSelectedDepartment);
    const columnOption = { id: value };
    props.onCommit({ columnOption });
  }

  return (
    <div
      ref={selectorRef}
      className={classnames('dtable-select custom-select',
        { 'focus': isShowSelector }
      )}
      onClick={onSelectToggle}
      id='filter-department-editor'
    >
      <div className="selected-option">
        {selectedDepartments.length > 0 ?
          <span className="selected-option-show">
            <SelectedDepartments value={selectedDepartments} departments={departments} />
          </span>
          :
          <span className="select-placeholder">{getLocale('Select_department')}</span>
        }
        <span className="dtable-font dtable-icon-drop-down"></span>
      </div>
      {isShowSelector &&
        <DepartmentMultipleSelect
          isShowSelectedDepartments={false}
          classNamePrefix="filter"
          value={selectedDepartments}
          onCommit={selectDepartment}
          renderUserDepartmentOptions={renderUserDepartmentOptions}
          departments={departments}
        />
      }
    </div>
  );
}

DepartmentMultipleSelectFilter.propTypes = propTypes;

export default DepartmentMultipleSelectFilter;
