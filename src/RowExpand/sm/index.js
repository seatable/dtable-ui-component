import React, { forwardRef, useImperativeHandle, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CellType, NOT_SUPPORT_EDIT_COLUMN_TYPE_MAP } from 'dtable-utils';
import toaster from '../../toaster';
import Loading from '../../Loading';
import Body from './body';
import { getLocale } from '../../lang';
import { isCellValueChanged } from '../../utils/cell-comparer';
import MobileFullScreenPage from '../../MobileFullScreenPage';

import './index.css';

const Small = forwardRef(({
  saveImmediately = true,
  readonly = false,
  isInsertingRow = false,
  zIndex,
  title,
  className,
  valueKey = 'name', // name or key
  row: defaultRow,
  columns: defaultColumns,
  commit,
  onToggle,
  uploadFile,
  copyURL,
  children = [],
  historyCallback,
  ...otherProps
}, ref) => {
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [row, setRow] = useState({});
  const [columns, setColumns] = useState([]);

  const isChangedRef = useRef(false);
  const update = useRef({});

  const checkEditable = useCallback((column) => {
    if (isSaving) return false;
    if (readonly || !column || !column.editable || NOT_SUPPORT_EDIT_COLUMN_TYPE_MAP[column.type]) return false;
    if (column.type === CellType.IMAGE || column.type === CellType.FILE) return Boolean(uploadFile);
    return true;
  }, [readonly, isSaving, uploadFile]);

  const initRowData = useCallback(() => {
    setLoading(true);
    setRow(defaultRow);
    let validColumns = defaultColumns.map(c => ({ ...c, editable: checkEditable(c, defaultRow), width: 320 }));
    if (isInsertingRow) {
      validColumns = validColumns.filter(c => c.editable);
    }

    isChangedRef.current = isInsertingRow && Object.keys(defaultRow).length > 0;
    setColumns(validColumns);
    setLoading(false);
  }, [isInsertingRow, defaultColumns, defaultRow, checkEditable]);

  const toggle = useCallback(() => {
    if (isSaving) return;
    onToggle();
  }, [isSaving, onToggle]);

  const onSave = useCallback((updated, { successCallback, failCallback } = {}) => {
    commit(updated, columns, { successCallback, failCallback });
  }, [columns, commit]);

  const onChange = useCallback((column, value) => {
    const key = column[valueKey];
    const updated = { [key]: value };
    const oldValue = row[key];
    if (!isCellValueChanged(oldValue, value, column.type)) return;
    if (!saveImmediately || isInsertingRow) {
      isChangedRef.current = true;
      update.current = { ...update.current, ...updated };
      setRow({ ...row, ...updated });
      return;
    }
    onSave(updated, {
      successCallback: () => {
        isChangedRef.current = false;
        update.current = {};
        setRow({ ...row, ...updated });
      },
      failCallback: () => {
        toaster.danger(getLocale('Save_failed'));
      }
    });
  }, [saveImmediately, isInsertingRow, row, valueKey, onSave]);

  const onSubmit = useCallback(() => {
    setSaving(true);
    const successCallback = isInsertingRow ? onToggle : () => {
      isChangedRef.current = false;
      update.current = {};
      setSaving(false);
    };
    const failCallback = () => {
      setSaving(false);
      toaster.danger(getLocale('Save_failed'));
    };
    const newRow = isInsertingRow ? { ...row, ...update.current } : update.current;
    onSave(newRow, { successCallback, failCallback });
  }, [row, isInsertingRow, onSave, onToggle]);

  useEffect(() => {
    initRowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    getData: () => ({ row, columns }),
    setData: (data = {}) => {
      Object.keys(data).forEach(key => {
        if (key === 'row') {
          setRow(data[key]);
        }
        if (key === 'columns') {
          setColumns(data[key]);
        }
      });
    },
  }), [row, columns]);

  return (
    <MobileFullScreenPage
      className={classnames('seatable-row-expand-full-screen-page', className)}
      onLeftClick={toggle}
      onRightClick={(!saveImmediately || isInsertingRow) && !(isSaving || !isChangedRef.current) ? onSubmit : null}
      zIndex={zIndex || 100}
      historyCallback={historyCallback}
    >
      <i className="dtable-font dtable-icon-return"></i>
      {title}
      <>
        {(!saveImmediately || isInsertingRow) && (<>{getLocale('Submit')}</>)}
      </>
      <>
        {isLoading ? (
          <div className="w-100 -h-100 d-flex align-items-center justify-content-center"><Loading /></div>
        ) : (
          <Body
            {...otherProps}
            row={row}
            columns={columns}
            valueKey={valueKey}
            onChange={onChange}
            uploadFile={uploadFile}
          />
        )}
      </>
    </MobileFullScreenPage>
  );
});

Small.propTypes = {
  saveImmediately: PropTypes.bool,
  isInsertingRow: PropTypes.bool,
  zIndex: PropTypes.number,
  title: PropTypes.any,
  className: PropTypes.string,
  valueKey: PropTypes.oneOf(['key', 'name']),
  commit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  uploadFile: PropTypes.func,
  copyURL: PropTypes.func,
};

export default Small;
