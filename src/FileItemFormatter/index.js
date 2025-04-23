import React from 'react';
import PropTypes from 'prop-types';
import { getFileThumbnailInfo } from '../utils/url';

const FileItemFormatter = ({ file, config, openFile }) => {
  const { fileIconUrl, isImage } = getFileThumbnailInfo(file, config);
  return (
    <img onClick={() => openFile && openFile(file)} className={`file-item-icon ${isImage ? 'img' : ''}`} src={fileIconUrl} alt={file?.name || ''} />
  );
};

FileItemFormatter.propTypes = {
  file: PropTypes.object.isRequired,
  config: PropTypes.object,
  openFile: PropTypes.func,
};

export default FileItemFormatter;
