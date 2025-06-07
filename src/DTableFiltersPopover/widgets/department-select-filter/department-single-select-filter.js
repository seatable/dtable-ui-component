import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectedDepartments from '../../../SelectedDepartments';
import DepartmentSingleSelectEditor from '../../../DepartmentSingleSelectEditor';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from '../../../constants/departments';
import ModalPortal from '../../../ModalPortal';
import { useClickOutside } from '../../../hooks/common-hooks';
import { getLocale } from '../../../lang';

const propTypes = {
  isInModal: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  column: PropTypes.object,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  onCommit: PropTypes.func,
};

function DepartmentSingleSelectFilter(props) {
  const { value, column, isInModal, userDepartmentIdsMap, departments } = props;
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
          className="department-item"
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
        { 'focus': isShowSelector }
      )}
      onClick={onSelectToggle}
      id='filter-department-editor'
    >
      <div className="selected-option">
        {value ?
          <span className="selected-option-show">
            <SelectedDepartments departments={departments} departmentIds={selectedDepartmentIds} />
          </span>
          :
          <span className="select-placeholder">{getLocale('Select_department')}</span>
        }
        <span className="dtable-font dtable-icon-down3"></span>
      </div>
      {isShowSelector && !isInModal &&
        <DepartmentSingleSelectEditor
          target={selectorRef.current}
          enableSelectRange={false}
          isInModal={isInModal}
          column={column}
          value={value}
          onCommit={onCommit}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
          renderUserDepartmentOptions={renderUserDepartmentOptions}
        />
      }
      {isShowSelector && isInModal &&
        <ModalPortal>
          <DepartmentSingleSelectEditor
            target={selectorRef.current}
            enableSelectRange={false}
            isInModal={isInModal}
            column={column}
            value={value}
            position={selectorRef.current.getBoundingClientRect()}
            onCommit={onCommit}
            userDepartmentIdsMap={userDepartmentIdsMap}
            departments={departments}
            renderUserDepartmentOptions={renderUserDepartmentOptions}
          />
        </ModalPortal>
      }
    </div>
  );
}

DepartmentSingleSelectFilter.propTypes = propTypes;

export default DepartmentSingleSelectFilter;
