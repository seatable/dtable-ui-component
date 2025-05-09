import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import DropDownMenu from './dropdown-menu';
import FileNameEditor from './file-name-editor';
import { getFileUploadTime, bytesToSize } from '../../../utils';
import { getFileThumbnailInfo, imageCheck } from '../../../../utils/url';

import './index.css';

class FilePreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowRename: false,
      isShowOperation: false,
      highlight: false,
      errorMessage: ''
    };
  }

  fileItemMouseEnter = () => {
    if (!this.props.isItemFreezed) {
      this.setState({
        isShowOperation: true,
        highlight: true
      });
    }
  };

  fileItemMouseLeave = () => {
    if (!this.props.isItemFreezed) {
      this.setState({
        isShowOperation: false,
        highlight: false
      });
    }
  };

  handleFileClick = () => {
    let { fileItem } = this.props;
    let openFileUrl = fileItem.url;
    let assetFileIndex = openFileUrl.indexOf('/asset');
    if (assetFileIndex > -1 && imageCheck(fileItem.name)) {
      this.props.showLargeImage(fileItem.url);
      return;
    }
  };

  downloadFile = (e) => {
    e.stopPropagation();
    let downloadUrl = this.props.fileItem.url;
    this.props.downloadFile(downloadUrl);
  };

  onSelectFile = () => {
    const { fileItem } = this.props;
    this.props.onSelectFiles(fileItem.name);
  };

  closeRenameFile = () => {
    if (this.state.isShowRename) {
      this.setState({ isShowRename: false });
    }
  };

  openRenameFile = () => {
    this.setState({ isShowRename: true });
  };

  resetState = () => {
    this.setState({
      isShowOperation: false,
      highlight: false
    });
    this.props.unFreezeItem();
  };

  render() {
    const { fileItem, isItemFreezed, isSelectMultipleFiles, isSelected, config } = this.props;
    const { isShowRename, isShowOperation, highlight } = this.state;
    const { fileIconUrl } = getFileThumbnailInfo(fileItem, config);
    const errorMessage = '';
    const uploadTime = getFileUploadTime(fileItem);
    return (
      <div
        className={`dtable-ui-file-editor-previewer-box ${highlight ? 'dtable-ui-file-editor-previewer-box-highlight' : ''}`}
        onMouseEnter={this.fileItemMouseEnter}
        onMouseLeave={this.fileItemMouseLeave}
      >
        <div className="dtable-ui-file-editor-previewer-item">
          {isSelectMultipleFiles &&
            <input onChange={this.onSelectFile} checked={isSelected} className="mr-2" type="checkbox" />
          }
          <div className="dtable-ui-file-editor-previewer-icon">
            <img alt='' src={fileIconUrl} />
          </div>
          <div className="dtable-ui-file-editor-previewer-info">
            {isShowRename ? (
              <FileNameEditor itemIndex={this.props.itemIndex} name={fileItem.name} renameFile={this.props.renameFile} closeRenameFile={this.closeRenameFile}/>
            ) : (
              <div
                className={`dtable-ui-file-editor-previewer-item-name ${fileItem.type === 'dir' ? 'dtable-ui-file-editor-previewer-item-name-height' : ''}`}
                ref={ref => this.renameRef = ref}
              >
                <span onClick={this.props.renameFile ? this.handleFileClick : () => {}}>{fileItem.name}</span>
              </div>
            )}
            <div className="dtable-ui-file-editor-preview-item-detail d-flex">
              {uploadTime && (<span className="file-upload-time">{`${uploadTime}, `}</span>)}
              {fileItem.size > -1 && (<span>{bytesToSize(fileItem.size)}</span>)}
            </div>
          </div>
        </div>
        {!isShowRename && isItemFreezed && (
          <UncontrolledTooltip delay={{ show: 0, hide: 0 }} placement="bottom" target={this.renameRef}>
            {fileItem.name}
          </UncontrolledTooltip>
        )}
        {isShowOperation &&
          <div className="dtable-ui-file-editor-previewer-operation">
            {this.props.downloadFile && (
              <>
                {fileItem.type === 'file' && !errorMessage &&
                  <span aria-hidden="true" className="dtable-font dtable-icon-download file-download-icon" onClick={this.downloadFile}></span>
                }
                {fileItem.type === 'file' && errorMessage &&
                  <>
                    <span aria-hidden="true" className="dtable-font dtable-icon-download disable file-download-icon" ref={ref => this.disabledDownloadRef = ref}></span>
                    <UncontrolledTooltip delay={{ show: 0, hide: 0 }} placement="bottom" target={this.disabledDownloadRef}>
                      {errorMessage}
                    </UncontrolledTooltip>
                  </>
                }
              </>
            )}
            {(this.props.deleteFile || this.props.renameFile) &&
              <DropDownMenu
                fileItem={fileItem}
                freezeItem={this.props.freezeItem}
                unFreezeItem={this.props.unFreezeItem}
                resetState={this.resetState}
                itemIndex={this.props.itemIndex}
                onDeleteFile={this.props.deleteFile ? this.props.deleteFile : null}
                onRenameFile={this.props.renameFile ? this.openRenameFile : null}
              />
            }
          </div>
        }
      </div>
    );
  }
}

FilePreviewer.propTypes = {
  itemIndex: PropTypes.number,
  isItemFreezed: PropTypes.bool.isRequired,
  fileItem: PropTypes.object.isRequired,
  unFreezeItem: PropTypes.func,
  freezeItem: PropTypes.func,
  renameFile: PropTypes.func,
  deleteFile: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  showLargeImage: PropTypes.func,
  onSelectFiles: PropTypes.func,
  isSelectMultipleFiles: PropTypes.bool,
};

export default FilePreviewer;
