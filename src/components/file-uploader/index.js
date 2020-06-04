import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';
import { getFileIconUrl } from '../../utils/utils';

const propTypes = {
  isCheckRepeat: PropTypes.bool,
  onFileUploadProgress: PropTypes.func,
  onFileUploadSuccss: PropTypes.func,
  onFileUploadFailed: PropTypes.func,
  dtableWebAPI: PropTypes.object.isRequired,
  fileName: PropTypes.string,
  workspaceID: PropTypes.number,
};

class FileUploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    // this.uploadFiles = [];
  }

  onDragEnter = (e) => {
    const { isSupportDragDrop, updateParentTips } = this.props;
    if (isSupportDragDrop) {
      e.preventDefault();
      this.enteredCounter++;
      if (this.enteredCounter !== 0) {
        updateParentTips(true);
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
    const { isSupportDragDrop, updateParentTips, isCellContent } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter--;
      if (this.enteredCounter === 0 || isCellContent) {
        updateParentTips(false);
      }
    }
  }

  onDrop = (event) => {
    const { isSupportDragDrop, updateParentTips, onCellTipShow } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter = 0;
      updateParentTips(false);
      let files = event.dataTransfer.files;
      if (files.length === 0) {
        let message = getLocale('No_support_dragging_files_from_cell_to_cell');
        if (onCellTipShow) onCellTipShow(message);
        return;
      }
      this.handleFilesChange(files);
    }
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
    const { uploadType, updateUploadFileList, onCellTipShow } = this.props;
    let uplaodFileList = [];
    let dealFileCnt = 0; 
    let isMultipleFiles = true;
    let allFileLen = files.length;
    if (files.length === 1) {
      isMultipleFiles = false;
    }
    function checkLoadFinish () {
      if (dealFileCnt === allFileLen - 1) {
        if (uplaodFileList.length === 0) {
          if (uploadType === 'image') {
            let message = getLocale('The_file_is_not_an_image');
            if (onCellTipShow) onCellTipShow(message);
          }
          return;
        }
        if (updateUploadFileList) updateUploadFileList(uplaodFileList);
        _this.getFilesCallBack(uplaodFileList, isMultipleFiles);
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
            uplaodFileList.push(uploadFileItem);
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
    return setTimeout(() => this.checkUploadFileExist(file, isMultipleFiles), 0);
  }

  checkUploadFileExist = (uploadFile, isMultipleFiles = false) => {
    const { uploadType, dtableWebAPI, workspaceID, fileName } = this.props;
    return (
      dtableWebAPI.getTableAssetUploadLink(workspaceID, fileName).then((res) => {
        let assetUploadLinkMessage = res.data;
        let relativePath = assetUploadLinkMessage.file_relative_path;
        let path = `${relativePath}/` + encodeURIComponent(uploadFile.name);
        if (isMultipleFiles) {
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

  checkRepeat = () => {

  }

  cancelUploadFile = () => {

  }

  onUploadProgress = (event, uploadFileMessage) => {
    const { onFileUploadProgress } = this.props;
    let uploadPercent = Math.floor(event.loaded / event.total * 100);
    uploadFileMessage.percent = uploadPercent;
    if (onFileUploadProgress) onFileUploadProgress(uploadFileMessage);
  }

  onFileUploadSuccess = () => {
    this.props.onFileUploadSuccess();
  }

  onFileUploadFailed = (uploadFileMessage) => {
    const { onFileUploadFailed } = this.props;
    if (onFileUploadFailed) this.onFileUploadFailed(uploadFileMessage);
  }

  render() {
    const { accept, uploadType } = this.props;
    return (
      <div
        onDragEnter={this.onDragEnter} 
        onDragOver={this.onDragOver} 
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop} 
        onPaste={this.onPaste}
        onClick={this.uploadFileClick}
        className={this.props.className}
      >
        {this.props.children}
        {uploadType && 
          <input 
            type="file" 
            className='upload-image' 
            ref={ref => this.uploadFileRef = ref}  
            accept={accept} 
            onClick={this.onInputFile} 
            onChange={this.onFilesChanged} 
            value="" 
          /> 
        }
      </div>
    );
  }
}

FileUploader.propTypes = propTypes;

export default FileUploader;
