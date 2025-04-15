import React, { forwardRef, useMemo, useImperativeHandle, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Modal, ModalFooter, Button } from 'reactstrap';
import { CellType, NOT_SUPPORT_EDIT_COLUMN_TYPE_MAP } from 'dtable-utils';
import toaster from '../../toaster';
import Loading from '../../Loading';
import Header from './header';
import Body from './body';
import { getLocale } from '../../lang';
import { isCellValueChanged } from '../../utils/cell-comparer';

import './index.css';

const Large = forwardRef(({
  saveImmediately = true,
  readonly = false,
  isInsertingRow = false,
  zIndex,
  title,
  className,
  valueKey = 'name', // name or key
  layout = 'horizontal', // horizontal or vertical
  row: defaultRow,
  columns: defaultColumns,
  commit,
  onToggle,
  uploadFile,
  copyURL,
  children = [],
  ...otherProps
}, ref) => {
  const [isAnimationEnd, setAnimationEnd] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [row, setRow] = useState({});
  const [columns, setColumns] = useState([]);

  const modalRef = useRef(null);
  const isChangedRef = useRef(false);
  const update = useRef({});

  const initStyle = useMemo(() => {
    const defaultMargin = 80; // sequence cell width
    const defaultHeight = 100;
    return {
      width: window.innerWidth - defaultMargin,
      maxWidth: window.innerWidth - defaultMargin,
      marginLeft: defaultMargin,
      height: defaultHeight,
      marginRight: defaultMargin,
      marginTop: '30%',
      transition: 'all .3s',
    };
  }, []);

  const style = useMemo(() => {
    const width = children[1] ? 1100 : 800;
    return {
      width,
      maxWidth: width,
      marginLeft: (window.innerWidth - width) / 2,
      height: 'calc(100% - 56px)', // Dialog margin is 3.5rem (56px)
    };
  }, [children]);

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
    // use setTimeout to make sure real dom rendered
    setTimeout(() => {
      let dom = modalRef.current.firstChild;
      const { width, maxWidth, marginLeft, height } = style;
      dom.style.width = `${width}px`;
      dom.style.maxWidth = `${maxWidth}px`;
      dom.style.marginLeft = `${marginLeft}px`;
      dom.style.height = height;
      dom.style.marginRight = 'unset';
      dom.style.marginTop = '28px';
      // after animation, change style and run callback
      setTimeout(() => {
        setAnimationEnd(true);
        dom.style.transition = 'none';
        initRowData();
      }, 280);
    }, 1);
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
    <Modal
      isOpen={true}
      toggle={onToggle}
      className={classnames('dtable-ui-row-expand-dialog', className)}
      style={isAnimationEnd ? style : initStyle}
      zIndex={zIndex || 1048}
      contentClassName="dtable-ui-row-expand-content"
      modalClassName="dtable-ui-row-expand-modal"
      fade={false}
      innerRef={modalRef}
      keyboard={false}
    >
      {isAnimationEnd && (
        <>
          {isLoading ? (
            <div className="w-100 -h-100 d-flex align-items-center justify-content-center"><Loading /></div>
          ) : (
            <div className="dtable-ui-row-expand-details">
              <Header title={title} row={row} columns={columns} copyURL={copyURL} onToggle={toggle}>
                {children[0]}
              </Header>
              <Body
                {...otherProps}
                row={row}
                columns={columns}
                valueKey={valueKey}
                onChange={onChange}
                uploadFile={uploadFile}
                onToggle={onToggle}
              >
                {children[1]}
              </Body>
              {(!saveImmediately || isInsertingRow) && (
                <ModalFooter>
                  <Button onClick={toggle} color="secondary">{getLocale('Cancel')}</Button>
                  <Button onClick={onSubmit} disabled={isSaving || !isChangedRef.current} color='primary'>{getLocale('Submit')}</Button>
                </ModalFooter>
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
});

Large.propTypes = {
  saveImmediately: PropTypes.bool,
  isInsertingRow: PropTypes.bool,
  zIndex: PropTypes.number,
  title: PropTypes.any,
  className: PropTypes.string,
  valueKey: PropTypes.oneOf(['key', 'name']),
  layout: PropTypes.oneOf(['horizontal', 'vertical']), // horizontal or vertical
  commit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  uploadFile: PropTypes.func,
  copyURL: PropTypes.func,
};

export default Large;
