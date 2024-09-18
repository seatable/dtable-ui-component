import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFileThumbnailInfo } from './utils';

export default class FileItemFormatter extends Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
  };

  render() {
    const { file } = this.props;
    const { fileIconUrl, isImage } = getFileThumbnailInfo(file);
    return (
      <img className={`file-item-icon ${isImage ? 'img' : ''}`} src={fileIconUrl} alt={file?.name || ''} />
    );
  }
}
