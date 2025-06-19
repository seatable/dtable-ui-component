import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ModalPortal from '../../../ModalPortal';
import SelectedDepartments from '../../../SelectedDepartments';
import DepartmentMultipleSelectEditor from '../../../DepartmentMultipleSelectEditor';
import { useClickOutside } from '../../../hooks/common-hooks';
import { getLocale } from '../../../lang';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from '../../../constants/departments';

const propTypes = {
  isInModal: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onCommit: PropTypes.func,
  departments: PropTypes.object,
  readOnly: PropTypes.bool,
};

function DepartmentMultipleSelectFilter(props) {
  const { value, isInModal, readOnly, departments } = props;
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
            onChange={() => {}}
          />
          <span className="text-truncate department-name">{getLocale(name)}</span>
        </div>
      );
    });
  }

  function onSelectToggle(event) {
    if (readOnly) return;
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
        {!readOnly && <span className="dtable-font dtable-icon-down3"></span>}
      </div>
      {isShowSelector && !isInModal &&
        <DepartmentMultipleSelectEditor
          isShowSelectedDepartments={false}
          classNamePrefix="filter"
          value={selectedDepartments}
          departments={departments}
          onCommit={selectDepartment}
          renderUserDepartmentOptions={renderUserDepartmentOptions}
        />
      }
      {isShowSelector && isInModal &&
        <ModalPortal>
          <DepartmentMultipleSelectEditor
            isInModal={isInModal}
            isShowSelectedDepartments={false}
            classNamePrefix="filter"
            value={selectedDepartments}
            departments={departments}
            position={selectorRef.current.getBoundingClientRect()}
            onCommit={selectDepartment}
            renderUserDepartmentOptions={renderUserDepartmentOptions}
          />
        </ModalPortal>
      }
    </div>
  );
}

DepartmentMultipleSelectFilter.propTypes = propTypes;

export default DepartmentMultipleSelectFilter;
