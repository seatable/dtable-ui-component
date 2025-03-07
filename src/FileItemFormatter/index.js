import React from 'react';
import PropTypes from 'prop-types';
import { getFileThumbnailInfo } from '../utils/url';

const FileItemFormatter = ({ file, config }) => {
  const { fileIconUrl, isImage } = getFileThumbnailInfo(file, config);
  return (
    <img className={`file-item-icon ${isImage ? 'img' : ''}`} src={fileIconUrl} alt={file?.name || ''} />
  );
};

FileItemFormatter.propTypes = {
  file: PropTypes.object.isRequired,
  config: PropTypes.object,
};

export default FileItemFormatter;
