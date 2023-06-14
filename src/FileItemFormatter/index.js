import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFileIconUrl } from './utils';

class FileItemFormatter extends Component {

  getFileIconData = (item) => {
    let fileIconUrl = getFileIconUrl(item.name, item.type);
    let fileIconData = require('./' + fileIconUrl);
    return fileIconData;
  }

  render() {
    const { file } = this.props;
    return (
      <img className="file-item-icon" src={this.getFileIconData(file)} alt={file.name} />
    );
  }
}

FileItemFormatter.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FileItemFormatter;
