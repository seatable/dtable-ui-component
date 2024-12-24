import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onFileUploadProgress: PropTypes.func,
  onFileUploadSuccss: PropTypes.func,
  onFileUploadFailed: PropTypes.func,
};

class FileUploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.uploadFiles = [];
  }

  onFilesChanged = () => {
  };

  uploadFiles = (fileList, isMultiple = false) => {
  };

  checkRepeat = () => {
  };

  cancelUploadFile = () => {
  };

  onFileUploadProgress = () => {
  };

  onFileUploadSuccss = () => {
  };

  onFileUploadFailed = () => {
  };

  render() {
    return (
      <input type="file" onChange={this.onFilesChanged} />
    );
  }
}

FileUploader.propTypes = propTypes;

export default FileUploader;
