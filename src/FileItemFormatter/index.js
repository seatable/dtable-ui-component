import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFileIconUrl } from './utils';

export default class FileItemFormatter extends Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
  };

  getFileIconData = (item) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    if (imageExtensions.some(imageExt => item.name.toLowerCase().endsWith(imageExt))){
      return item.url;
    }
    let fileIconUrl = getFileIconUrl(item.name, item.type);
    let fileIconData = require('./' + fileIconUrl);
    return fileIconData;
  };

  render() {
    const { file } = this.props;
    return (
      <img className="file-item-icon" src={this.getFileIconData(file)} alt={file.name} />
    );
  }
}
