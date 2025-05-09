import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import RightAngle from '../right-angle';
import RowExpandAddBtn from '../add-btn';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';
import DepartmentEditor from '../../DepartmentSingleSelectEditor';
import { getLocale } from '../../lang';

const RowExpandMBDepartmentEditor = ({ row, column, valueKey, departments, userDepartmentIdsMap, onCommit }) => {
  const [value, setValue] = useState(row[column[valueKey]] || '');
  const [showEditor, setShowEditor] = useState(false);

  const openEditor = useCallback(() => {
    setShowEditor(true);
  }, []);

  const closeEditor = useCallback(() => {
    setShowEditor(false);
  }, []);

  const onChange = useCallback((newValue) => {
    if (newValue === value) return;
    setValue(newValue);
    onCommit && onCommit(newValue);
  }, [value, onCommit]);

  useEffect(() => {
    setValue(row[column[valueKey]] || '');
    setShowEditor(false);
    // eslint-disable-next-line
  }, [row, column]);

  return (
    <>
      <div className="dtable-ui dtable-ui-mobile-row-expand-options-editor position-relative" onClick={openEditor}>
        {value ? (
          <div style={{ height: 50, padding: '14px 0' }}>
            <DepartmentSingleSelectFormatter value={value} departments={departments} />
          </div>
        ) : (
          <RowExpandAddBtn text={getLocale('Choose_a_department')} />
        )}
        <RightAngle />
      </div>
      {showEditor && (
        <DepartmentEditor
          enableSelectRange={false}
          column={column}
          value={value}
          onCommit={onChange}
          userDepartmentIdsMap={userDepartmentIdsMap}
          departments={departments}
          onClose={closeEditor}
        />
      )}
    </>
  );
};

RowExpandMBDepartmentEditor.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  valueKey: PropTypes.string,
  departments: PropTypes.array,
  userDepartmentIdsMap: PropTypes.object,
  onCommit: PropTypes.func,
};

export default RowExpandMBDepartmentEditor;
