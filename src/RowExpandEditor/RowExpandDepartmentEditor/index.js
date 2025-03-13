import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useClickOutside } from '../../hooks';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';
import { KeyCodes } from '../../constants';
import DepartmentSingleSelect from '../../Department-editor/department-single-select';

function RowExpandDepartmentEditor(props) {
  const { row, column, valueKey, departments, userDepartmentIdsMap, isEditorFocus, columnIndex } = props;
  const [value, setValue] = useState(row[column[valueKey]] || '');
  const [showEditor, setShowEditor] = useState(false);
  const departmentSelectContainer = useRef(null);
  const departmentSelectContent = useRef(null);

  useClickOutside({
    currDOM: departmentSelectContainer.current,
    onClickOutside: hideDropDownMenu,
  }, [isEditorFocus, value]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line
  }, [isEditorFocus]);

  useEffect(() => {
    setValue(row[column[valueKey]] || '');
    setShowEditor(false);
    // eslint-disable-next-line
  }, [row]);

  function hideDropDownMenu(event) {
    if (!event.target) return;
    toggleDepartmentSelect(false);
  }

  function onKeyDown(e) {
    if (e.keyCode === KeyCodes.Enter && props.isEditorFocus && !showEditor) {
      setShowEditor(true);
    } else if (e.keyCode === KeyCodes.Escape) {
      e.stopPropagation();
      setShowEditor(false);
      departmentSelectContent.current.focus();
    }
  }

  function toggleDepartmentSelect(value) {
    setShowEditor(value);
  }

  function onToggleSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    props.updateTabIndex(columnIndex);
    toggleDepartmentSelect(true);
  }

  function onFocus() {
    props.updateTabIndex(columnIndex);
  }

  function onCommit(newValue) {
    toggleDepartmentSelect(false);
    if (newValue === value) return;
    setValue(newValue);
    props.onCommit(newValue);
  }

  return (
    <div className="position-relative w-100" ref={departmentSelectContainer}>
      <div
        tabIndex={0}
        onFocus={onFocus}
        onClick={onToggleSelect}
        ref={departmentSelectContent}
        className={classnames('dtable-ui dtable-ui-row-expand-select-editor', 'custom-select', { 'focus': isEditorFocus })}
      >
        <div className="dtable-ui-row-expand-select-editor-inner">
          <div><DepartmentSingleSelectFormatter value={value} departments={departments} /></div>
          <i aria-hidden="true" className="dtable-font dtable-icon-down3"></i>
        </div>
      </div>
      {showEditor && (
        <DepartmentSingleSelect
          enableSelectRange={false}
          column={column}
          value={value}
          onCommit={onCommit}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
        />
      )}
    </div>
  );
}

RowExpandDepartmentEditor.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  valueKey: PropTypes.string,
  departments: PropTypes.array,
  userDepartmentIdsMap: PropTypes.object,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func,
  onCommit: PropTypes.func,
};

export default RowExpandDepartmentEditor;
