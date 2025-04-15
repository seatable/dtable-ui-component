import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import RightAngle from '../RightAngle';
import RowExpandAddBtn from '../RowExpandAddBtn';
import DepartmentSingleSelectFormatter from '../../DepartmentSingleSelectFormatter';
import DepartmentEditor from '../../DepartmentEditor';
import { getLocale } from '../../lang';

function Small({ row, column, valueKey, departments, userDepartmentIdsMap, onCommit }) {
  const [value, setValue] = useState(row[column[valueKey]] || '');
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setValue(row[column[valueKey]] || '');
    setShowEditor(false);
    // eslint-disable-next-line
  }, [row]);

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

  return (
    <>
      <div className="dtable-ui mobile-dtable-ui-row-expand-options-editor position-relative" onClick={openEditor}>
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
}

Small.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  valueKey: PropTypes.string,
  departments: PropTypes.array,
  userDepartmentIdsMap: PropTypes.object,
  onCommit: PropTypes.func,
};

export default Small;
