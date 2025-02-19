import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'reactstrap';
import Progress from '../../../UploadProgress';
import { getFileThumbnailInfo } from '../../../utils/url';
import FileUploader from '../../../FileUploader';
import { getLocale } from '../../../lang';

import './index.css';

class LocalFileAddition extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFileTipShow: false,
      isShowDeleteIcon: false,
      enterFileIndex: -1,
      tooltipOpen: false,
      uploadMessageList: [],
      thumbnailSrcList: [],
      reUploadFile: null,
    };
  }

  setFileTipShow = (isFileTipShow) => {
    this.setState({
      isFileTipShow: isFileTipShow
    });
  };

  updateUploadFileList = (fileListInfo) => {
    if (!fileListInfo) {
      this.setState({ thumbnailSrcList: [] });
      return;
    }
    this.setState({ thumbnailSrcList: fileListInfo });
  };

  onFileUploadSuccess = (fileMessage) => {
    this.hideDeleteIcon();
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(fileMessage);
    thumbnailSrcList.splice(findUploadFileIndex, 1, fileMessage);
    if (thumbnailSrcList.every(fileItem => !fileItem.isUploading)) {
      this.setState({ thumbnailSrcList: [] });
    }
    this.props.fileUploadCompleted(fileMessage);
  };

  onFileUploadProgress = (fileMessage) => {
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(fileMessage);
    thumbnailSrcList.splice(findUploadFileIndex, 1, fileMessage);
    this.setState({ thumbnailSrcList });
  };

  onFileUploadFailed = (fileMessage) => {
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(fileMessage);
    thumbnailSrcList.splice(findUploadFileIndex, 1, fileMessage);
    this.setState({ thumbnailSrcList });
  };

  findUploadFileIndex = (uploadFileMessage) => {
    let { thumbnailSrcList } = this.state;
    let uploadFileIndex = thumbnailSrcList.findIndex(item => item.name === uploadFileMessage.file.name);
    return uploadFileIndex;
  };

  deleteFile = (event, index) => {
    this.props.deleteFile(index, 'localFile');
  };

  showDeleteIcon = (event, index) => {
    this.setState({
      isShowDeleteIcon: true,
      enterFileIndex: index,
    });
  };

  hideDeleteIcon = () => {
    this.setState({
      isShowDeleteIcon: false,
      enterFileIndex: -1,
    });
  };

  fileUploadAgain = (event, fileMessage) => {
    this.uploaderFileRef.reuploadFile(fileMessage);
  };

  tooltipToggle = () => {
    if (this.state.tooltipOpen) {
      this.setState({
        isShowDeleteIcon: false,
        enterFileIndex: -1,
      });
    }
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  };

  renderMultipleFilesArr = () => {
    let { thumbnailSrcList } = this.state;
    let fileArr = [];
    if (Array.isArray(this.props.uploadLocalFileValue)) {
      let uploadedFileList = this.renderUploadedFile();
      if (uploadedFileList) {
        fileArr.push(...uploadedFileList);
      }
      if (Array.isArray(thumbnailSrcList) && thumbnailSrcList.length > 0) {
        let thumbnailList = thumbnailSrcList.map((fileThumbnailItem, index) => {
          let uploadFile = fileThumbnailItem.percent === 100 && !fileThumbnailItem.isErrorTip;
          return (
            <Fragment key={`dtable-ui-image-wrapper-circle${index}`}>
              {fileThumbnailItem.isUploading && (
                <div className="dtable-ui-image-wrapper" >
                  <div className="dtable-ui-image-upload-percent">
                    <img src={fileThumbnailItem.fileIconUrl} style={{ position: 'absolute', zIndex: `${uploadFile ? 3 : 1}`, maxHeight: '100%' }} alt="" />
                    {fileThumbnailItem.percent < 100 && (<Progress uploadPercent={fileThumbnailItem.percent || 0}/>)}
                    {uploadFile && (
                      <div className="dtable-ui-image-upload-success">
                        <div className="dtable-ui-image-upload-success-scale">
                          <span className="dtable-ui-image-upload-success-tip">{getLocale('Indexing')}</span>
                        </div>
                      </div>
                    )}
                    <div className="dtable-ui-image-upload-mask"></div>
                    {fileThumbnailItem.isErrorTip && (
                      <div className="dtable-ui-image-upload-error-tip">
                        <span>{getLocale('Network_Error')}</span>
                        <span className="dtable-ui-image-upload-again" onClick={(event => this.fileUploadAgain(event, fileThumbnailItem))}>{getLocale('Re_upload')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Fragment>
          );
        });
        fileArr.push(...thumbnailList);
      }
    }
    return fileArr;
  };

  renderUploadedFile = () => {
    const { config, uploadLocalFileValue } = this.props;
    let uploadedFileList = [];
    uploadedFileList = uploadLocalFileValue.length > 0 && uploadLocalFileValue.map((fileItem, index) => {
      let { fileIconUrl } = getFileThumbnailInfo(fileItem, config);
      return (
        <div
          key={'dtable-ui-image-wrapper-' + index}
          className="dtable-ui-image-wrapper"
          id={`file-content-tip-${index}`}
          onMouseEnter={(event) => this.showDeleteIcon(event, index)}
          onMouseLeave={this.hideDeleteIcon}
        >
          <div className="dtable-ui-image-content">
            <img src={fileIconUrl} alt="" style={{ maxHeight: '100%' }}/>
          </div>
          {this.state.isShowDeleteIcon && this.state.enterFileIndex === index &&
            <div className="dtable-delete-image-icon" onClick={(event) => this.deleteFile(event, index)} >
              <span className="image-delete-span">x</span>
            </div>
          }
          {this.state.isShowDeleteIcon && this.state.enterFileIndex === index && (
            <Tooltip
              toggle={this.tooltipToggle}
              delay={{ show: 0, hide: 0 }}
              target={`file-content-tip-${index}`}
              placement="bottom"
              isOpen={this.state.tooltipOpen}
            >
              {fileItem.name}
            </Tooltip>
          )}
        </div>
      );
    });
    return uploadedFileList;
  };

  renderUploadFileWrapper = (fileArr) => {
    let { isFileTipShow } = this.state;
    let editorContent = fileArr.length === 0 ? (
      <Fragment>
        <div className={`dtable-ui-image-tip-addition ${isFileTipShow ? 'dtable-ui-image-drop-active' : ''}`}>
          <div className="dtable-ui-dtable-ui-image-add-icon">
            <i aria-hidden="true" className="dtable-font dtable-icon-add-files"></i>
          </div>
          {isFileTipShow ?
            <div className="dtable-ui-image-add-span">{getLocale('Drag_and_drop_to_add_a_file')}</div> :
            <div className="dtable-ui-image-add-span">{getLocale('Drag_and_drop_files_or_click_here_to_add')}</div>
          }
        </div>
      </Fragment>
    ) : (
      <div className="dtable-ui-image-add-box">
        <div className={`dtable-ui-image-add-button ${isFileTipShow ? 'dtable-ui-image-wrapper-drop-active' : ''}`}>
          <i aria-hidden="true" className="dtable-font dtable-icon-add-table"></i>
          <span className="dtable-ui-image-add-span">{getLocale('Upload')}</span>
        </div>
      </div>
    );
    return (
      <FileUploader
        uploadType='file'
        isSupportDragDrop={true}
        className={fileArr.length === 0 ? classNames('dtable-ui-image-upload-container', { 'dtable-ui-image-upload-container-active': isFileTipShow }) : 'dtable-ui-image-wrapper'}
        updateParentTips={this.setFileTipShow}
        onFileUploadSuccess={this.onFileUploadSuccess}
        onFileUploadProgress={this.onFileUploadProgress}
        updateUploadFileList={this.updateUploadFileList}
        onFileUploadFailed={this.onFileUploadFailed}
        ref={ref => this.uploaderFileRef = ref}
        uploadFile={this.props.uploadFile}
      >
        {editorContent}
      </FileUploader>
    );
  };

  render() {
    let fileArr = this.renderMultipleFilesArr();
    return (
      <Fragment>
        {fileArr}
        {this.renderUploadFileWrapper(fileArr)}
      </Fragment>
    );
  }
}

LocalFileAddition.propTypes = {
  uploadLocalFileValue: PropTypes.array,
  deleteFile: PropTypes.func,
  fileUploadCompleted: PropTypes.func,
};

export default LocalFileAddition;
