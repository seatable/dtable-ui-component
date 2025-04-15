import React from 'react';
import PropTypes from 'prop-types';
import { getFileUploadTime, bytesToSize } from '../../../utils';
import { getFileThumbnailInfo } from '../../../../utils/url';
import MobileOperationSheet, { OPERATION_TYPE } from '../../../../MobileOperationSheet';

class FilePreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowRename: false,
      showOperationSheet: false,
    };
    this.operations = [];
    const { renameFile, downloadFile, deleteFile } = props;
    if (renameFile) {
      this.operations.push(OPERATION_TYPE.RENAME);
    }
    if (downloadFile) {
      this.operations.push(OPERATION_TYPE.DOWNLOAD);
    }
    if (deleteFile) {
      this.operations.push(OPERATION_TYPE.DELETE);
    }
  }

  downloadFile = () => {
    const downloadUrl = this.props.fileItem.url;
    this.props.downloadFile(downloadUrl);
  };

  deleteFile = () => {
    const { fileItem } = this.props;
    this.props.deleteFile(fileItem);
  };

  closeRenameFile = () => {
    this.setState({ isShowRename: false });
  };

  openRenameFile = () => {
    this.setState({ isShowRename: true });
  };

  openOperationSheet = () => {
    this.setState({ showOperationSheet: true });
  };

  closeOperationSheet = () => {
    this.setState({ showOperationSheet: false });
  };

  onOperationChange = (operation) => {
    if (operation === OPERATION_TYPE.RENAME) {
      this.openRenameFile();
      return;
    }

    if (operation === OPERATION_TYPE.DOWNLOAD) {
      this.downloadFile();
      return;
    }

    if (operation === OPERATION_TYPE.DELETE) {
      this.deleteFile();
      return;
    }
  };

  render() {
    const { fileItem, config } = this.props;
    const { showOperationSheet } = this.state;
    const { fileIconUrl } = getFileThumbnailInfo(fileItem, config);
    const uploadTime = getFileUploadTime(fileItem);
    return (
      <>
        <div className="dtable-ui-file-editor-previewer-box">
          <div className="dtable-ui-file-editor-previewer-item">
            <div className="dtable-ui-file-editor-previewer-icon">
              <img alt='' src={fileIconUrl} />
            </div>
            <div className="dtable-ui-file-editor-previewer-info">
              <div className={`dtable-ui-file-editor-previewer-item-name ${fileItem.type === 'dir' ? 'dtable-ui-file-editor-previewer-item-name-height' : ''}`}>
                <span>{fileItem.name}</span>
              </div>
              <div className="dtable-ui-file-editor-preview-item-detail d-flex">
                {uploadTime && (<span className="file-upload-time">{`${uploadTime}, `}</span>)}
                {fileItem.size > -1 && (<span>{bytesToSize(fileItem.size)}</span>)}
              </div>
            </div>
          </div>
          <div className="dtable-ui-file-editor-previewer-operation" onClick={this.openOperationSheet}>
            <i aria-hidden="true" className="dtable-font dtable-icon-more-level"></i>
          </div>
        </div>
        {showOperationSheet && (
          <MobileOperationSheet operations={this.operations} onChange={this.onOperationChange} onClose={this.closeOperationSheet} />
        )}
      </>
    );
  }
}

FilePreviewer.propTypes = {
  fileItem: PropTypes.object.isRequired,
  renameFile: PropTypes.func,
  deleteFile: PropTypes.func.isRequired,
};

export default FilePreviewer;
