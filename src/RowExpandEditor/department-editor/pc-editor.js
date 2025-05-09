import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';
import { KeyCodes } from '../../constants';
import DepartmentEditor from '../../DepartmentSingleSelectEditor';


const RowExpandPCDepartmentEditor = ({
  row, column, valueKey, departments, userDepartmentIdsMap, isEditorFocus, columnIndex,
  onCommit, updateTabIndex,
}) => {
  const [value, setValue] = useState(row[column[valueKey]] || '');
  const [showEditor, setShowEditor] = useState(false);

  const departmentSelectContainer = useRef(null);
  const departmentSelectContent = useRef(null);

  const onKeyDown = useCallback((event) => {
    if (event.keyCode === KeyCodes.Enter && isEditorFocus && !showEditor) {
      setShowEditor(true);
    } else if (event.keyCode === KeyCodes.Escape && showEditor) {
      event.stopPropagation();
      setShowEditor(false);
      departmentSelectContent.current.focus();
    }
  }, [isEditorFocus, showEditor]);

  const onToggleSelect = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    updateTabIndex(columnIndex);
    setShowEditor(true);
  }, [columnIndex, updateTabIndex]);

  const onFocus = useCallback(() => {
    updateTabIndex(columnIndex);
  }, [columnIndex, updateTabIndex]);

  const handleCommit = useCallback((newValue) => {
    setShowEditor(false);
    if (newValue === value) return;
    setValue(newValue);
    onCommit(newValue);
  }, [value, onCommit]);

  const closeEditor = useCallback(() => {
    setShowEditor(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    setValue(row[column[valueKey]] || '');
    setShowEditor(false);
    // eslint-disable-next-line
  }, [row, column]);

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
        <DepartmentEditor
          isInModal={true}
          enableSelectRange={false}
          target={departmentSelectContent.current}
          column={column}
          value={value}
          onCommit={handleCommit}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
          toggleDepartmentSelect={closeEditor}
        />
      )}
    </div>
  );
};

RowExpandPCDepartmentEditor.propTypes = {
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

export default RowExpandPCDepartmentEditor;
