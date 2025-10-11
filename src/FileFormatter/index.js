import React, { useState, useCallback, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FileItemFormatter from '../FileItemFormatter';
import ImagePreviewerLightbox from '../ImagePreviewerLightbox';
import { imageCheck } from '../utils/url';

import './index.css';

const FileFormatter = ({
  isSample = false,
  value = [],
  containerClassName = '',
  renderItem,
  isSupportOpenFile = false,
  onOpenFile,
  server,
  workspaceID,
  dtableUuid,
}) => {
  const [largeImageIndex, setLargeImageIndex] = useState(-1);
  const [fileImageUrlList, setFileImageUrlList] = useState([]);

  const getFileItemImageUrlList = useCallback((value) => {
    let newFileImageUrlList = [];
    value.forEach(fileItem => {
      const { url, name } = fileItem;
      let assetFileIndex = typeof url === 'string' ? url.indexOf('/asset') : -1;
      if (assetFileIndex > -1) {
        const isImage = imageCheck(name);
        if (isImage) {
          newFileImageUrlList.push(url);
        }
      }
    });
    setFileImageUrlList(newFileImageUrlList);
  }, []);

  useEffect(() => {
    if (!isSupportOpenFile) return;
    getFileItemImageUrlList(value);
  }, [value, getFileItemImageUrlList, isSupportOpenFile]);

  const showLargeImage = useCallback((imageIndex) => {
    setLargeImageIndex(imageIndex);
  }, []);

  const openFile = useCallback((fileItem) => {
    if (!isSupportOpenFile) return;
    let openFileUrl = fileItem.url;
    const imageIndex = fileImageUrlList.indexOf(openFileUrl);
    if (imageIndex > -1) {
      showLargeImage(imageIndex);
      return;
    }
    let previewerUrl;
    let assetFileIndex = openFileUrl.indexOf('/asset');
    if (assetFileIndex > -1) {
      previewerUrl = openFileUrl.replace('/asset', '/asset-preview');
      if (!onOpenFile) window.open(previewerUrl, '_blank');
      onOpenFile(previewerUrl);      
    }
  }, [fileImageUrlList, isSupportOpenFile, showLargeImage]);

  const moveNext = useCallback(() => {
    setLargeImageIndex((prevIndex) => (prevIndex + 1) % fileImageUrlList.length);
  }, [fileImageUrlList]);

  const movePrev = useCallback(() => {
    setLargeImageIndex((prevIndex) => (prevIndex + fileImageUrlList.length - 1) % fileImageUrlList.length);
  }, [fileImageUrlList]);

  const hideLargeImage = useCallback(() => {
    setLargeImageIndex(-1);
  }, []);

  const className = classnames('dtable-ui cell-formatter-container file-formatter', containerClassName);

  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  if (isSample) {
    const item = value[0];
    return (
      <div className={className}>
        <FileItemFormatter file={item}/>
        {value.length !== 1 && <span className="file-item-count">{`+${value.length}`}</span>}
      </div>
    );
  }

  return (
    <div className={className}>
      {value.map((item, index) => {
        const dom = (<FileItemFormatter openFile={openFile} file={item} config={{ server, dtableUuid, workspaceID }} />);
        if (renderItem) return (<Fragment key={index}>{renderItem(dom)}</Fragment>);
        return (<Fragment key={index}>{dom}</Fragment>);
      })}
      {largeImageIndex > -1 && (
        <ImagePreviewerLightbox
          server={server}
          workspaceID={workspaceID}
          dtableUuid={dtableUuid}
          readOnly={true}
          imageItems={fileImageUrlList}
          imageIndex={largeImageIndex}
          closeImagePopup={hideLargeImage}
          moveToPrevImage={movePrev}
          moveToNextImage={moveNext}
        />
      )}
    </div>
  );
};

FileFormatter.propTypes = {
  isSample: PropTypes.bool,
  value: PropTypes.array,
  containerClassName: PropTypes.string,
  renderItem: PropTypes.func,
  onOpenFile: PropTypes.func,
  isSupportOpenFile: PropTypes.bool,
  server: PropTypes.string,
  workspaceID: PropTypes.string,
  dtableUuid: PropTypes.string,
};

export default FileFormatter;
