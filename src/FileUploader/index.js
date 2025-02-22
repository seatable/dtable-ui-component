import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import getEventTransfer from '../utils/get-event-transfer';
import { getFileIconUrl } from '../utils/url';

import './index.css';

dayjs.extend(utc);

const MAX_UPLOAD_FILES = 10;

class FileUploader extends React.Component {

  constructor(props) {
    super(props);
    this.enteredCounter = 0; // Determine whether to enter the child element to avoid dragging bubbling bugs。
    this.start = 0;
  }

  componentWillUnmount() {
    // prevent async operation
    this.setState = (state, callback) => {
      return;
    };
  }

  onInputFile = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  };

  uploadFileClick = () => {
    this.uploadFileRef.click();
  };

  onDragEnter = (e) => {
    const { isSupportDragDrop, updateParentTips } = this.props;
    if (isSupportDragDrop) {
      e.preventDefault();
      this.enteredCounter++;
      if (this.enteredCounter !== 0) {
        updateParentTips(true);
      }
    }
  };

  onDragOver = (e) => {
    const { isSupportDragDrop } = this.props;
    if (isSupportDragDrop) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  onDragLeave = (e) => {
    const { isSupportDragDrop, updateParentTips } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter--;
      if (this.enteredCounter === 0) {
        updateParentTips(false);
      }
    }
  };

  onDrop = (event) => {
    const { isSupportDragDrop, updateParentTips, onCellTipShow } = this.props;
    if (isSupportDragDrop) {
      this.enteredCounter = 0;
      updateParentTips(false);
      let files = event.dataTransfer.files;
      if (files.length === 0) {
        if (onCellTipShow) onCellTipShow(-1);
        return;
      }
      this.handleFilesChange(files);
      event.preventDefault();
    }
  };

  onPaste = (event) => {
    const { isSupportPaste } = this.props;
    if (isSupportPaste) {
      event.stopPropagation();
      let cliperData = getEventTransfer(event);
      if (cliperData.files) {
        let files = cliperData.files;
        this.handleFilesChange(files, true);
      }
    }
  };

  onMouseEnter = () => {
    const { updateParentTips, uploadType } = this.props;
    if (uploadType === 'image') {
      if (updateParentTips) updateParentTips(true, uploadType);
    }
  };

  onMouseLeave = () => {
    const { updateParentTips, uploadType } = this.props;
    if (uploadType === 'image') {
      if (updateParentTips) updateParentTips(false, uploadType);
    }
  };

  uploadFilesChange = (event) => {
    this.handleFilesChange(event.target.files);
  };

  handleFilesChange = (files, isPasteUpload = false) => {
    const _this = this;
    const { uploadType, updateUploadFileList, onCellTipShow } = this.props;
    let uploadFileList = [];
    let dealFileCnt = 0;
    let allFileLen = files.length;
    function checkLoadFinish() {
      if (dealFileCnt === allFileLen - 1) {
        if (uploadFileList.length === 0) {
          if (onCellTipShow) onCellTipShow(uploadFileList.length);
          return;
        }
        if (updateUploadFileList) updateUploadFileList(uploadFileList);
        _this.uploadFilesInBatch(uploadFileList);
      }
      dealFileCnt++;
    }
    for (let i = 0; i < allFileLen; i++) {
      let file = files[i];
      if (isPasteUpload && file.name === 'image.png') {
        let newName = `image-${dayjs().format('YYYY-MM-DD-HH-mm')}.png`;
        file = new File([file], newName, { type: file.type });
      }
      try {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.addEventListener('load', function (event) {
          let isImage = /image/i.test(file.type);
          if (uploadType === 'file' || isImage) {
            let uploadFileItem = {
              name: file.name,
              fileIconUrl: isImage ? event.target.result : getFileIconUrl(file.name, file.type),
              isUploading: true,
              isErrorTip: false,
              file: file,
              size: file.size,
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
  };

  uploadFilesInBatch = (files) => {
    const fileUploadPromises = [];
    const length = MAX_UPLOAD_FILES + this.start > files.length ? files.length : MAX_UPLOAD_FILES + this.start;
    for (let i = this.start; i < length; i++) {
      let file = files[i];
      fileUploadPromises.push(this.createPromise(file));
    }
    this.uploadFilesPromise(fileUploadPromises, files);
  };

  uploadFilesPromise = (fileUploadPromises, files) => {
    Promise.all(fileUploadPromises).then((res) => {
      this.start += MAX_UPLOAD_FILES;
      if (this.start + MAX_UPLOAD_FILES - files.length >= 10) {
        this.start = 0;
        return;
      }
      this.uploadFilesInBatch(files);
    });
  };

  handleFileChange = (fileMessage, callback) => {
    const { onFileUploadFailed } = this.props;
    this.uploadFile(fileMessage).then(res => {
      const data = res;
      this.uploadFileMessage({ data, fileMessage });
      callback && callback();
    }).catch((error) => {
      fileMessage.isErrorTip = true;
      fileMessage.error = error;
      if (onFileUploadFailed) onFileUploadFailed(fileMessage);
    });
  };

  createPromise = (fileMessage) => {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.handleFileChange(fileMessage, resolve);
    });
  };

  uploadFileMessage = ({ data = {}, fileMessage }) => {
    fileMessage.name = data.name;
    fileMessage.isUploading = false;
    fileMessage.size = data.size;
    fileMessage.url = data.url;
    fileMessage.upload_time = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    this.props.onFileUploadSuccess(fileMessage);
  };

  uploadFile = (fileMessage) => {
    return this.props.uploadFile(fileMessage.file, (event) => this.onUploadProgress(event, fileMessage));
  };

  reuploadFile = (fileMessage) => {
    fileMessage.isErrorTip = false;
    this.handleFileChange(fileMessage);
  };

  onUploadProgress = (event, fileMessage) => {
    const { onFileUploadProgress } = this.props;
    let uploadPercent = Math.floor(event.loaded / event.total * 100);
    fileMessage.percent = uploadPercent;
    if (onFileUploadProgress) onFileUploadProgress(fileMessage);
  };

  render() {
    const { uploadType } = this.props;

    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onPaste={this.onPaste}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.uploadFileClick}
        className={this.props.className}
      >
        {this.props.children}
        {uploadType === 'file' &&
          <input type="file" className='dtable-ui-upload-image' ref={ref => this.uploadFileRef = ref} onClick={this.onInputFile} onChange={this.uploadFilesChange} value="" multiple />
        }
        {uploadType === 'image' &&
          <input type="file" className='dtable-ui-upload-image' accept="image/*" ref={ref => this.uploadFileRef = ref} onClick={this.onInputFile} onChange={this.uploadFilesChange} value="" multiple />
        }
      </div>
    );
  }
}

FileUploader.propTypes = {
  uploadType: PropTypes.string,
  className: PropTypes.string,
  isSupportDragDrop: PropTypes.bool,
  isSupportPaste: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  updateParentTips: PropTypes.func,
  updateUploadFileList: PropTypes.func,
  onFileUploadProgress: PropTypes.func,
  onFileUploadSuccess: PropTypes.func.isRequired,
  onFileUploadFailed: PropTypes.func,
};

export default FileUploader;
