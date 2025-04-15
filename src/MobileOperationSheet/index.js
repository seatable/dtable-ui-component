import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { ActionSheet } from 'antd-mobile';
import { getLocale } from '../lang';

import './index.css';

const OPERATION_TYPE = {
  RENAME: 'rename',
  DOWNLOAD: 'download',
  DELETE: 'delete',
  CLOSE: 'close'
};

const OPERATION_TYPES = [
  OPERATION_TYPE.RENAME,
  OPERATION_TYPE.DOWNLOAD,
  OPERATION_TYPE.DELETE,
];

const MobileOperationSheet = ({ onChange, onClose, operations = OPERATION_TYPES }) => {
  const actionSheet = useRef(ActionSheet);

  const btns = useMemo(() => {
    let _btns = [];

    if (operations.includes(OPERATION_TYPE.RENAME)) {
      _btns.push({
        dom: (
          <div className="my-am-action">
            <i aria-hidden="true" className="dtable-font dtable-icon-rename"></i><span>{getLocale('Rename')}</span>
          </div>
        ),
        value: OPERATION_TYPE.RENAME
      });
    }
    if (operations.includes(OPERATION_TYPE.DOWNLOAD)) {
      _btns.push({
        dom: (
          <div className="my-am-action">
            <i aria-hidden="true" className="dtable-font dtable-icon-download"></i><span>{getLocale('Download')}</span>
          </div>
        ),
        value: OPERATION_TYPE.DOWNLOAD
      });
    }
    if (operations.includes(OPERATION_TYPE.DELETE)) {
      _btns.push({
        dom: (
          <div className="my-am-action">
            <i aria-hidden="true" className="dtable-font dtable-icon-delete"></i><span>{getLocale('Delete')}</span>
          </div>
        ),
        value: OPERATION_TYPE.DELETE
      });
    }
    return _btns;
  }, [operations]);

  const showActionSheet = useCallback(() => {
    const _btns = btns.map(btn => btn.dom);
    actionSheet.current.showActionSheetWithOptions({
      options: _btns,
      maskClosable: true,
      className: 'mobile-dtable-ui-action-sheet'
    }, (index) => {
      const { value = 'close' } = btns[index] || {};
      if (value === 'close') {
        onClose && onClose();
        return;
      }
      onChange && onChange(value);
    });
  }, [btns, onChange, onClose]);

  useEffect(() => {
    showActionSheet();
    return () => {
      actionSheet.current.close();
      actionSheet.current = null;
      onClose && onClose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

MobileOperationSheet.propTypes = {
  operations: PropTypes.array,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default MobileOperationSheet;

export {
  OPERATION_TYPE
};
