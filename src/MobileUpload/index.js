import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { ActionSheet } from 'antd-mobile';
import { getLocale } from '../lang';

import './index.css';

const MobileUpload = ({ type = 'file', onChange, onClose }) => {
  const actionSheet = useRef(ActionSheet);

  const imageRef = useRef(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const camcorderRef = useRef(null);

  const btns = useMemo(() => {
    const iconStyle = { lineHeight: '56px' };
    if (type === 'image') return [
      <div className="my-am-action d-flex justify-content-between">
        <span>{getLocale('Take_a_photo')}</span><i aria-hidden="true" className="dtable-font dtable-icon-camera" style={iconStyle}></i>
      </div>,
      <div className="my-am-action d-flex justify-content-between">
        <span>{getLocale('Browse_documents')}</span><i aria-hidden="true" className="dtable-font dtable-icon-more-level" style={iconStyle}></i>
      </div>,
      <div className="my-am-action d-flex justify-content-center">{getLocale('Cancel')}</div>,
    ];
    return [
      <div className="my-am-action d-flex justify-content-between">
        <span>{getLocale('Take_a_photo')}</span><i aria-hidden="true" className="dtable-font dtable-icon-camera" style={iconStyle}></i>
      </div>,
      <div className="my-am-action d-flex justify-content-between">
        <span>{getLocale('Take_a_video')}</span><i aria-hidden="true" className="dtable-font dtable-icon-camera" style={iconStyle}></i>
      </div>,
      <div className="my-am-action d-flex justify-content-between">
        <span>{getLocale('Browse_documents')}</span><i aria-hidden="true" className="dtable-font dtable-icon-more-level" style={iconStyle}></i>
      </div>,
      <div className="my-am-action d-flex justify-content-center">{getLocale('Cancel')}</div>
    ];
  }, [type]);

  const showActionSheet = useCallback(() => {
    if (type === 'image') {
      actionSheet.current.showActionSheetWithOptions({
        options: btns,
        cancelButtonIndex: 3,
        maskClosable: true,
        className: 'dtable-ui-mobile-action-sheet'
      }, (index) => {
        if (index === 0) {
          imageRef.current.click();
        } else if (index === 1) {
          cameraRef.current.click();
        } else {
          onClose && onClose();
        }
      });
      return;
    }
    actionSheet.current.showActionSheetWithOptions({
      options: btns,
      cancelButtonIndex: 4,
      maskClosable: true,
      className: 'dtable-ui-mobile-action-sheet'
    }, (index) => {
      if (index === 0) {
        fileRef.current.click();
      } else if (index === 1) {
        cameraRef.current.click();
      } else if (index === 2) {
        camcorderRef.current.click();
      } else {
        onClose && onClose();
      }
    });
  }, [type, btns, onClose]);

  const onInputClick = useCallback((event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }, []);

  const handleChange = useCallback((event) => {
    event.persist();
    onChange && onChange(event.target.files);
  }, [onChange]);

  useEffect(() => {
    showActionSheet();
    return () => {
      actionSheet.current.close();
      actionSheet.current = null;
      onClose && onClose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (type === 'image') {
    return (
      <div className="h-0 o-hidden">
        <input type="file" accept="image/*" ref={imageRef} multiple onClick={onInputClick} onChange={handleChange} />
        <input type="file" capture="camera" accept="image/*" ref={cameraRef} onClick={onInputClick} onChange={handleChange} />
      </div>
    );
  }
  return (
    <div className="h-0 o-hidden">
      <input type="file" ref={fileRef} multiple onClick={onInputClick} onChange={handleChange} />
      <input type="file" capture="camera" accept="image/*" ref={cameraRef} onClick={onInputClick} onChange={handleChange} />
      <input type="file" capture="camcorder" accept="video/*" ref={camcorderRef} onClick={onInputClick} onChange={handleChange} />
    </div>
  );
};

MobileUpload.propTypes = {
  type: PropTypes.oneOf(['file', 'image']),
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default MobileUpload;
