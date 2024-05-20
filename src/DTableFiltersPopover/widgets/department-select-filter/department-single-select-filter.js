import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectedDepartments from '../../../Department-editor/selected-departments';
import DepartmentSingleSelect from '../../../Department-editor/department-single-select';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from '../../../Department-editor/constants';
import { useClickOutside } from '../../../hooks/common-hooks';
import { getLocale } from '../../../lang';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  column: PropTypes.object,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  onCommit: PropTypes.func,
};

function DepartmentSingleSelectFilter(props) {
  const { value, column, departments, userDepartmentIdsMap } = props;
  const [isShowSelector, setIsShowSelector] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(value || '');
  const selectorRef = useRef(null);
  let selectedDepartmentIds = [];
  selectedDepartmentIds.push(value);

  useClickOutside({
    currDOM: selectorRef.current,
    onClickOutside: () => setIsShowSelector(false),
  }, [selectedDepartment]);

  function renderUserDepartmentOptions(onSelect) {
    if (!departments || departments.length === 0) return [];
    return DEPARTMENT_SELECT_RANGE_OPTIONS.slice(0, 2).map((option, index) => {
      const { type, name } = option;
      return (
        <div
          className="dropdown-item department-item d-flex align-items-center"
          key={index}
          onClick={(event) => onSelect(event, type)}
        >
          <div className="department-item-left-content d-flex align-items-center">
            <span className="text-truncate department-name">{getLocale(name)}</span>
            {selectedDepartment === type && (
              <span className="department-check-icon">
                <i className="dtable-font dtable-icon-check-mark"></i>
              </span>
            )}
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
            <SelectedDepartments value={selectedDepartmentIds} departments={departments} />
          </span>
          :
          <span className="select-placeholder">{getLocale('Select_department')}</span>
        }
        <span className="dtable-font dtable-icon-drop-down"></span>
      </div>
      {isShowSelector &&
        <DepartmentSingleSelect
          enableSelectRange={false}
          column={column}
          value={value}
          onCommit={onCommit}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
          renderUserDepartmentOptions={renderUserDepartmentOptions}
        />
      }
    </div>
  );
}

DepartmentSingleSelectFilter.propTypes = propTypes;

export default DepartmentSingleSelectFilter;
