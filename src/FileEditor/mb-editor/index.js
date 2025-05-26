import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ActivityIndicator from '../../ActivityIndicator';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import FilesPreviewer from '../files-previewer';
import MobileUpload from '../../MobileUpload';
import toaster from '../../toaster';
import { isIPhone, isQQBuiltInBrowser, getErrorMsg } from '../../utils/utils';
import { getLocale } from '../../lang';

import './index.css';

const { Header, Body } = MobileFullScreenPage;

const MBFileEditor = ({ value: oldValue, column, config, onToggle, onCommit, uploadFile }) => {
  const [value, setValue] = useState(oldValue || []);
  const [isShowEditor, setShowEditor] = useState(false);
  const [uploadLocalFiles, setUploadLocalFiles] = useState([]);
  const [isUploading, setUploading] = useState(false);

  const uploadingFilesCount = useRef(0);
  const uploadedFilesCount = useRef(0);

  const { mediaUrl } = config || {};

  const resetFileValue = useCallback(() => {
    setUploadLocalFiles([]);
  }, []);

  const openEditor = useCallback(() => {
    setShowEditor(true);
  }, []);

  const closeEditor = useCallback(() => {
    setShowEditor(false);
  }, []);

  const deleteFile = useCallback((file) => {
    const newValue = value.slice(0);
    const fileIndex = value.fileIndex(v => v.url === file.url);
    newValue.splice(fileIndex, 1);
    setValue(newValue);
    onCommit(newValue);
  }, [value, onCommit]);

  const onChange = useCallback(() => {
    const newValue = value.concat(uploadLocalFiles);
    setValue(newValue);
    onCommit(newValue);
    setShowEditor(false);
  }, [value, uploadLocalFiles, onCommit]);

  const uploadImage = useCallback((file) => {
    uploadFile(file).then(res => {
      const fileInfo = res;
      const newUploadLocalImages = uploadLocalFiles.slice(0);
      newUploadLocalImages.push(fileInfo);
      setUploadLocalFiles(newUploadLocalImages);
      uploadedFilesCount.current = uploadedFilesCount.current + 1;
    }).catch(error => {
      let errMsg = getErrorMsg(error, true);
      if (!error.response || error.response.status !== 403) {
        toaster.danger(getLocale(errMsg));
      }
      uploadedFilesCount.current = uploadedFilesCount.current + 1;
    });
  }, [uploadFile, uploadLocalFiles]);

  const onFilesChange = useCallback((files = []) => {
    setUploading(true);
    uploadingFilesCount.current = files.length;
    uploadedFilesCount.current = 0;
    for (let i = 0; i < uploadingFilesCount.current; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        uploadImage(file);
      }, false);
      reader.addEventListener('error', () => {
        const message = getLocale('Image_loading_failed');
        toaster.warning(message);
        uploadedFilesCount.current = uploadedFilesCount.current + 1;
      }, false);
    }
  }, [uploadImage]);

  useEffect(() => {
    if (uploadingFilesCount.current === uploadedFilesCount.current && uploadedFilesCount.current !== 0) {
      uploadedFilesCount.current = 0;
      uploadingFilesCount.current = 0;
      onChange();
      setUploading(false);
    }
  }, [uploadingFilesCount, uploadedFilesCount, onChange]);

  return (
    <MobileFullScreenPage className="dtable-ui-mobile-file-editor" >
      <Header onLeftClick={onToggle}>
        <i aria-hidden="true" className="dtable-font dtable-icon-return"></i>
        <>{column.name}</>
      </Header>
      <Body>
        {(isIPhone() && isQQBuiltInBrowser()) ? (
          <div className="dtable-ui-file-open-external-browser">
            <div className="seatable-tip-danger">{'不支持 QQ 内置浏览器上传图片或者文件'}</div>
            <div className="image-container">
              <img src={mediaUrl + 'img/qq-upload-tip.png'} alt='Open browser tip'/>
            </div>
          </div>
        ) : (
          <>
            <FilesPreviewer
              value={value}
              togglePreviewer={openEditor}
              closeEditor={closeEditor}
              deleteFile={deleteFile}
              resetFileValue={resetFileValue}
            />
            {isShowEditor && (
              <MobileUpload type="file" onClose={closeEditor} onChange={onFilesChange} />
            )}
            {isUploading && (<ActivityIndicator toast text={getLocale('Files_are_uploading')} animating={isUploading}/>)}
          </>
        )}
      </Body>
    </MobileFullScreenPage>
  );
};

MBFileEditor.propTypes = {
  value: PropTypes.array,
  column: PropTypes.object,
  config: PropTypes.object,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
  uploadFile: PropTypes.func,
};

export default MBFileEditor;
