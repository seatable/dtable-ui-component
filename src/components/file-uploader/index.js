import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { getFileIconUrl } from '../../utils/utils';
import UploadRemindDialog from '../dialog/upload-remind-dialog';

const propTypes = {
  uploadType: PropTypes.string,
  isSupportDragDrop: PropTypes.bool,
  isCheckRepeat: PropTypes.bool,
  server: PropTypes.string.isRequired,
  dtableWebAPI: PropTypes.object.isRequired,
  fileName: PropTypes.string.isRequired,
  workspaceID: PropTypes.number.isRequired,
  onFileUploadProgress: PropTypes.func,
  onFileUploadSuccess: PropTypes.func.isRequired,
  onFileUploadFailed: PropTypes.func,
  updateParentTips: PropTypes.func,
};

class FileUploader extends React.Component {

  static defaultProps = {
    isSupportDragDrop: false,
    // value: false
  }

  constructor(props) {
    super(props);
    this.state = {
      uploadFileMessage: {},
      assetUploadLinkMessage: {},
      isShowUploadRemindDialog: false,
    };

    this.enteredCounter = 0;
  }

  updateParentTips = (state) => {
    const { updateParentTips } = this.props;
    if (updateParentTips) updateParentTips(state)
  }

  onDragEnter = (e) => {
    const { isSupportDragDrop } = this.props;
    if (isSupportDragDrop) {
      e.preventDefault();
      this.enteredCounter++;
      if (this.enteredCounter !== 0) {
        this.updateParentTips(true);
      }
    }
  }

  onDragOver = (e) => {
    const { isSupportDragDrop } = this.props;
    if (isSupportDragDrop) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onDragLeave = (e) => {
    const { isSupportDragDrop } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter--;
      if (this.enteredCounter === 0) {
        this.updateParentTips(false);
      }
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    const { isSupportDragDrop } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter = 0;
      this.updateParentTips(false);
      let files = event.dataTransfer.files;
      if (files.length === 0) {
        return;
      }
      this.uploadFiles(files);
    }
  }

  onCancelUploadRemindDialog = () => {
    this.setState({isShowUploadRemindDialog: false});
    const { updateUploadFileList } = this.props;
    if (updateUploadFileList) updateUploadFileList();
  }

  replaceRepetitionFile = () => {
    this.uploadFile(null, true);
    this.onUploadRemindDialogToggle();
  }

  uploadRepetitionFile = () => {
    this.uploadFile(null, false);
    this.onUploadRemindDialogToggle();
  }

  onUploadRemindDialogToggle = () => {
    this.setState({
      isShowUploadRemindDialog: !this.state.isShowUploadRemindDialog
    });
  }

  uploadFileClick = () => {
    this.uploadFileRef.click();
  }

  onInputFile = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  }

  onFilesChanged = (e) => {
    const files = e.target.files;
    this.uploadFiles(files);
  }

  uploadFiles = (files) => {
    const _this = this;
    const { uploadType, updateUploadFileList } = this.props;
    let uploadFileList = [];
    let dealFileCnt = 0; 
    let isMultipleFiles = true;
    let allFileLen = files.length;
    if (files.length === 1) {
      isMultipleFiles = false;
    }
    function checkLoadFinish () {
      if (dealFileCnt === allFileLen - 1) {
        if (uploadFileList.length === 0) {
          return;
        }
        if (updateUploadFileList) updateUploadFileList(uploadFileList);
        _this.getFilesCallBack(uploadFileList, isMultipleFiles);
      }
      dealFileCnt++;
    }
    for (let i = 0; i < allFileLen; i++) {
      let uploadFile = files[i];
      try {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(uploadFile);

        fileReader.addEventListener('load', function (event) {
          let isImage = /image/i.test(uploadFile.type);
          if (uploadType === 'file' || isImage) {
            let uploadFileItem = {
              name: uploadFile.name,
              fileIconUrl: isImage ? event.target.result : getFileIconUrl(uploadFile.name),
              isUploading: true,
              isErrorTip: false,
              uploadFile: uploadFile,
              size: uploadFile.size,
              url: '',
              type: uploadType === 'file' ? 'file' : '',
              percent: 0,
            };
            uploadFileList.push(uploadFileItem);
          }
          checkLoadFinish();
        }, false);
        fileReader.addEventListener('error', function (e) {
          checkLoadFinish();
        }, false);
      } catch (event) {
        checkLoadFinish();
      }
    }
  }

  getFilesCallBack = (files, isMultipleFiles) => {
    files.forEach(file => {
      this.handleFileChange(file, isMultipleFiles);
    });
  }

  handleFileChange = (file, isMultipleFiles) => {
    return this.checkUploadFileExist(file, isMultipleFiles);
  }

  checkUploadFileExist = (uploadFile, isMultipleFiles = false) => {
    const { uploadType, dtableWebAPI, workspaceID, fileName } = this.props;
    return (
      dtableWebAPI.getTableAssetUploadLink(workspaceID, fileName).then((res) => {
        let assetUploadLinkMessage = res.data;
        let relativePath = assetUploadLinkMessage.file_relative_path;
        let path = `${relativePath}/` + encodeURIComponent(uploadFile.name);
        if (isMultipleFiles || uploadType === 'image') {
          this.uploadFile({assetUploadLinkMessage, uploadFileMessage: uploadFile}, false);
          return;
        }
        dtableWebAPI.isDTableAssetExist(workspaceID, fileName, path).then(res => {
          let isExist = res.data.is_exist;
          if (isExist && uploadType === 'file') {
            uploadFile.assetUploadLinkMessage = assetUploadLinkMessage;
            this.setState({
              isShowUploadRemindDialog: true,
              assetUploadLinkMessage: assetUploadLinkMessage,
              uploadFileMessage: uploadFile
            });
            return;
          }
          this.uploadFile({ assetUploadLinkMessage, uploadFileMessage: uploadFile }, false);
        });
      })
    );
  }

  uploadFile = (options, isReplace) => {
    let { uploadType, dtableWebAPI, workspaceID, server } = this.props;
    let { assetUploadLinkMessage, uploadFileMessage } = this.state;
    if (options) {
      ({ assetUploadLinkMessage, uploadFileMessage } = options);
    }
    let parentPath = '', relativePath = '';
    const uploadLink = assetUploadLinkMessage.upload_link + '?ret-json=1';
    const formData = new FormData();
    parentPath = assetUploadLinkMessage.parent_path;
    relativePath = assetUploadLinkMessage.img_relative_path;
    if (uploadType === 'file') {
      relativePath = assetUploadLinkMessage.file_relative_path;
    }

    formData.append('parent_dir', parentPath);
    formData.append('relative_path', relativePath);
    formData.append('file', uploadFileMessage.uploadFile);
    if (isReplace) {
      formData.append('replace', 1);
    }
    dtableWebAPI.uploadImage(uploadLink, formData, (event) => this.onUploadProgress(event, uploadFileMessage)).then(res => {
      let url = server + '/workspace/' + workspaceID + parentPath + `/${relativePath}/` + encodeURIComponent(res.data[0].name);
      uploadFileMessage.name = res.data[0].name;
      uploadFileMessage.isUploading = false;
      uploadFileMessage.size = res.data[0].size;
      uploadFileMessage.url = url;
      this.onFileUploadSuccess(uploadFileMessage);
    }).catch(error => {
      this.onFileUploadFailed(uploadFileMessage);
    });
  }

  onUploadProgress = (event, uploadFileMessage) => {
    const { onFileUploadProgress } = this.props;
    let uploadPercent = Math.floor(event.loaded / event.total * 100);
    uploadFileMessage.percent = uploadPercent;
    if (onFileUploadProgress) onFileUploadProgress(uploadFileMessage);
  }

  onFileUploadSuccess = (uploadFileMessage) => {
    this.props.onFileUploadSuccess(uploadFileMessage);
  }

  onFileUploadFailed = (uploadFileMessage) => {
    const { onFileUploadFailed } = this.props;
    if (onFileUploadFailed) this.onFileUploadFailed(uploadFileMessage);
  }

  render() {
    const { uploadType, className, children } = this.props;
    return (
      <Fragment>
        <div
          onDragEnter={this.onDragEnter} 
          onDragOver={this.onDragOver} 
          onDragLeave={this.onDragLeave} 
          onDrop={this.onDrop}
          onPaste={this.onPaste}
          onClick={this.uploadFileClick}
          className={className}
        >
          {children}
          {uploadType && 
            <input 
              type="file" 
              className='file-uploader' 
              ref={ref => this.uploadFileRef = ref}  
              accept={uploadType === 'image' ? 'image/*' : ''} 
              onClick={this.onInputFile} 
              onChange={this.onFilesChanged} 
              value="" 
            /> 
          }
        </div>
        {this.state.isShowUploadRemindDialog && 
          <UploadRemindDialog
            cancelFileUpload={this.onCancelUploadRemindDialog}
            uploadRepetitionFile={this.uploadRepetitionFile}
            replaceRepetitionFile={this.replaceRepetitionFile}
            uploadFileMessage={this.state.uploadFileMessage}
          />
        }
      </Fragment>
    );
  }
}

FileUploader.propTypes = propTypes;

export default FileUploader;
