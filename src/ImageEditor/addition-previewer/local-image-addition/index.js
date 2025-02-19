import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import Progress from '../../../UploadProgress';
import { getImageThumbnailUrl } from '../../../utils/url';
import FileUploader from '../../../FileUploader';
import { getLocale } from '../../../lang';

import './index.css';

class LocalImageAddition extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isImageTipShow: false,
      isShowDeleteIcon: false,
      enterImageIndex: -1,
      thumbnailSrcList: [],
      uploadMessageList: [],
      isImagePasteTipShow: false
    };
  }

  setFileTipShow = (isImageTipShow, uploadType) => {
    if (uploadType && uploadType === 'image') {
      this.setState({ isImagePasteTipShow: isImageTipShow });
      return;
    }
    this.setState({ isImageTipShow: isImageTipShow });
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

  onFileUploadFailed = (uploadedFileInfo) => {
    let { thumbnailSrcList } = this.state;
    const findUploadFileIndex = this.findUploadFileIndex(uploadedFileInfo);
    thumbnailSrcList.splice(findUploadFileIndex, 1, uploadedFileInfo);
    this.setState({ thumbnailSrcList });
  };

  findUploadFileIndex = (fileMessage) => {
    let { thumbnailSrcList } = this.state;
    let uploadFileIndex = thumbnailSrcList.findIndex(item => item.name === fileMessage.file.name);
    return uploadFileIndex;
  };

  onFileUploadProgress = (uploadMessage) => {
    if (!uploadMessage) {
      this.setState({ uploadMessageList: [] });
      return;
    }
    let { uploadMessageList } = this.state;
    let newUploadMessageList = uploadMessageList.slice(0);
    let uploadFile = uploadMessageList.find(item => item.uploadName === uploadMessage.uploadName);
    if (uploadFile) {
      uploadFile.uploadPercent = uploadMessage.uploadPercent;
    } else {
      newUploadMessageList.push(uploadMessage);
    }
    this.setState({ uploadMessageList: newUploadMessageList });
  };

  deleteImage = (event, index) => {
    this.props.deleteImage(index, 'localPicture');
  };

  fileUploadAgain = (event, uploadFileInfo) => {
    this.uploaderFileRef.uploadFileAgain(uploadFileInfo);
  };

  onCellTipShow = (code) => {
    //
  };

  showDeleteIcon = (event, index) => {
    this.setState({
      isShowDeleteIcon: true,
      enterImageIndex: index,
    });
  };

  hideDeleteIcon = () => {
    this.setState({
      isShowDeleteIcon: false,
      enterImageIndex: -1,
    });
  };

  renderMultipleFilesArr = () => {
    let { thumbnailSrcList } = this.state;
    let imageArr = [];
    if (Array.isArray(this.props.uploadLocalImageValue)) {
      let uploadedFileList = this.renderUploadedFile();
      if (uploadedFileList) {
        imageArr.push(...uploadedFileList);
      }
      if (Array.isArray(thumbnailSrcList) && thumbnailSrcList.length > 0) {
        let thumbnailList = thumbnailSrcList.map((fileThumbnailItem, index) => {
          return (
            <Fragment key={`dtable-ui-image-wrapper-circle${index}`}>
              {fileThumbnailItem.isUploading && (
                <div className="dtable-ui-image-wrapper" >
                  <div className="dtable-ui-image-upload-percent">
                    <img src={fileThumbnailItem.fileIconUrl} style={{ position: 'absolute', zIndex: `${fileThumbnailItem.percent === 100 ? 3 : 1}`, maxHeight: '100%' }} alt="" />
                    {fileThumbnailItem.percent < 100 && (
                      <Progress uploadPercent={fileThumbnailItem.percent || 0} />
                    )}
                    {fileThumbnailItem.percent === 100 && (
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
        imageArr.push(...thumbnailList);
      }
    }
    return imageArr;
  };

  renderUploadedFile = () => {
    const { uploadLocalImageValue } = this.props;
    let uploadedFileList = [];
    uploadedFileList = uploadLocalImageValue.length > 0 && uploadLocalImageValue.map((imgSrc, index) => {
      let imageThumbnailUrl = getImageThumbnailUrl(imgSrc);
      return (
        <div key = {'dtable-ui-image-wrapper-' + index} className="dtable-ui-image-wrapper" onMouseEnter={(event) => this.showDeleteIcon(event, index)} onMouseLeave={this.hideDeleteIcon}>
          <div className="dtable-ui-image-content">
            <img src={imageThumbnailUrl} alt="" style={{ maxHeight: '100%' }}/>
          </div>
          {this.state.isShowDeleteIcon && this.state.enterImageIndex === index &&
            <div className="dtable-delete-image-icon" onClick={(event) => this.deleteImage(event, index)} >
              <span className="image-delete-span">x</span>
            </div>
          }
        </div>
      );
    });
    return uploadedFileList;
  };

  renderUploadFileWrapper = (imageArr) => {
    let { isImageTipShow } = this.state;
    let editorContent;
    let className = imageArr.length === 0 ? `dtable-ui-image-upload-container ${isImageTipShow ? 'dtable-ui-image-upload-container-active' : ''}` : 'dtable-ui-image-wrapper';
    if (imageArr.length === 0) {
      editorContent = (
        <Fragment>
          <div className={`dtable-ui-image-tip-addition ${isImageTipShow ? 'dtable-ui-image-drop-active' : ''}`}>
            <div className="dtable-ui-dtable-ui-image-add-icon">
              <i aria-hidden="true" className="dtable-font dtable-icon-add-files"></i>
            </div>
            {isImageTipShow ?
              <div className="dtable-ui-image-add-span">{getLocale('Drag_and_drop_to_add_an_image')}</div> :
              <div className="dtable-ui-image-add-span">{getLocale('Drag_and_drop_images_or_click_or_paste_here_to_add')}</div>
            }
          </div>
          {this.state.isImagePasteTipShow && <Input className="image-addition-paste" autoFocus={true} /> }
        </Fragment>
      );
    } else {
      editorContent = (
        <div className="dtable-ui-image-add-box">
          <div className={`dtable-ui-image-add-button ${isImageTipShow ? 'dtable-ui-image-wrapper-drop-active' : ''}`}>
            <i aria-hidden="true" className="dtable-font dtable-icon-add-table"></i>
            <span className="dtable-ui-image-add-span">{getLocale('Upload')}</span>
          </div>
        </div>
      );
    }

    return (
      <FileUploader
        uploadType='image'
        isSupportDragDrop={true}
        isSupportPaste={true}
        className={className}
        updateParentTips={this.setFileTipShow}
        onFileUploadSuccess={this.onFileUploadSuccess}
        onFileUploadProgress={this.onFileUploadProgress}
        updateUploadFileList={this.updateUploadFileList}
        onFileUploadFailed={this.onFileUploadFailed}
        ref={ref => this.uploaderFileRef = ref}
        onCellTipShow={this.onCellTipShow}
        uploadFile={this.props.uploadFile}
      >
        {editorContent}
      </FileUploader>
    );
  };

  render() {
    const imageArr = this.renderMultipleFilesArr();
    return (
      <>
        {imageArr}
        {this.renderUploadFileWrapper(imageArr)}
      </>
    );
  }
}

LocalImageAddition.propTypes = {
  uploadLocalImageValue: PropTypes.array,
  deleteImage: PropTypes.func,
  fileUploadCompleted: PropTypes.func,
};

export default LocalImageAddition;
