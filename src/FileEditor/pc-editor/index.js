import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import FilesPreviewer from '../files-previewer';
import AdditionPreviewer from './addition-previewer';
import { FILE_EDITOR_STATUS } from '../../constants';
import DTableModalHeader from '../../DTableModalHeader';
import { getLocale } from '../../lang';
import { FILES_FOLDER } from '../constants';
import { getErrorMsg } from '../../utils/utils';
import toaster from '../../toaster';

import './index.css';

class PCFileEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      editorView: this.getEditorView(),
      isOpen: true,
      isShowFileChooser: false,
      uploadLocalFileValue: [],
      imageLinkValue: [],
      isUpdated: false,
    };
  }

  getValue = () => {
    return this.state.value;
  };

  getEditorView = () => {
    const { isInModal, value } = this.props;
    return !value || value.length === 0 || isInModal ? FILE_EDITOR_STATUS.ADDITION : FILE_EDITOR_STATUS.PREVIEWER;
  };

  deleteImage = (index, type = null) => {
    let uploadLocalFileValue = this.state.uploadLocalFileValue.slice(0);
    let value = this.state.value.slice(0);
    if (this.state.editorView === FILE_EDITOR_STATUS.PREVIEWER) {
      value.splice(index, 1);
    } else {
      if (type === 'localPicture') {
        uploadLocalFileValue.splice(index, 1);
      }
    }
    this.setState({
      uploadLocalFileValue: uploadLocalFileValue,
      isUpdated: true,
      value: value
    });
  };

  resetAdditionImage = () => {
    this.setState({
      uploadLocalFileValue: [],
      imageLinkValue: []
    });
  };

  toggle = (e) => {
    e.stopPropagation();
    if (this.state.isOpen && this.state.isUpdated) {
      if (this.state.editorView === FILE_EDITOR_STATUS.ADDITION) {
        let { value, uploadLocalFileValue } = this.state;
        let newValue = value.concat(uploadLocalFileValue);
        this.setState({
          value: newValue
        }, () => {
          this.props.isInModal ? this.props.onCommit(this.getValue()) : this.props.onCommit();
        });
        return;
      }
      this.props.isInModal ? this.props.onCommit(this.getValue()) : this.props.onCommit();
    }
    if (this.props.isInModal) {
      this.props.onToggle();
    }
    const nextIsOpen = !this.state.isOpen;
    this.setState({ isOpen: nextIsOpen }, () => {
      if (!nextIsOpen) {
        this.props.onCommitCancel && this.props.onCommitCancel();
      }
    });
  };

  closeEditor = () => {
    this.setState({ isOpen: false });
  };

  togglePreviewer = (type) => {
    this.setState({
      editorView: type,
    });
  };

  fileUploadCompleted = (fileMessage) => {
    let uploadLocalFileValue = this.state.uploadLocalFileValue.slice(0);
    let fileUploadMessage = {
      name: fileMessage.name,
      size: fileMessage.size,
      type: fileMessage.type,
      url: fileMessage.url,
      upload_time: fileMessage.upload_time,
    };
    uploadLocalFileValue.push(fileUploadMessage);
    this.setState({
      uploadLocalFileValue: uploadLocalFileValue,
      isUpdated: true
    });
  };

  addUploadedFile = (fileMessageList) => {
    const uploadLocalFileValue = [
      ...this.state.uploadLocalFileValue,
      ...fileMessageList.map(({ name, size, type, url, mtime }) => ({
        name,
        size,
        type: type || 'file',
        url,
        upload_time: mtime,
      })),
    ];
    this.setState({ uploadLocalFileValue, isUpdated: true });
  };

  renderHeader = () => {
    let { editorView } = this.state;
    // if (this.props.isInModal) {
    //   return (<span>{getLocale('Add_files')}</span>);
    // }
    if (editorView === FILE_EDITOR_STATUS.PREVIEWER) {
      return (<span>{getLocale('All_files')}</span>);
    }
    return (
      <div onClick={this.showImageListPreviewer}>
        <span aria-hidden="true" className="dtable-font dtable-icon-return mr-2"></span>
        <span>{getLocale('Add_files')}</span>
      </div>
    );
  };

  showImageListPreviewer = () => {
    let { value, uploadLocalFileValue, imageLinkValue } = this.state;
    let newValue = value.concat(uploadLocalFileValue, imageLinkValue);
    this.setState({ value: newValue });
    this.togglePreviewer(FILE_EDITOR_STATUS.PREVIEWER);
  };

  uploadFile = (file, callback) => {
    return this.props.uploadFile(file, FILES_FOLDER, callback);
  };

  resetFileValue = () => {
    this.setState({ uploadLocalFileValue: [] });
  };

  deleteFile = (index, type) => {
    let uploadLocalFileValue = this.state.uploadLocalFileValue.slice(0);
    let value = this.state.value.slice(0);
    if (this.state.editorView === FILE_EDITOR_STATUS.PREVIEWER) {
      value.splice(index, 1);
    } else {
      if (type === 'localFile') {
        uploadLocalFileValue.splice(index, 1);
      }
    }
    this.setState({
      uploadLocalFileValue: uploadLocalFileValue,
      isUpdated: true,
      value: value
    });
  };

  deleteFilesByPreviewer = (fileList) => {
    const result = this.state.value.filter(file => !fileList.includes(file.name));
    this.setState({
      isUpdated: true,
      value: result,
    });
  };

  onRenameFile = (index, newName) => {
    let newValue = this.state.value.slice(0);
    let fileItem = newValue[index];
    if (!this.props.renameFile) return;
    this.props.renameFile(fileItem, newName).then(res => {
      const { name, url } = res.data;
      fileItem = { ...fileItem, name, url };
      newValue[index] = fileItem;
      this.setState({ value: newValue });
    }).catch(error => {
      const errorMessage = getErrorMsg(error);
      if (!error.response || error.response.status !== 403) {
        toaster.danger(getLocale(errorMessage));
      }
    });
  };

  onRotateImage = (url, degree) => {
    this.props.rotateImage(url, degree).then(res => {
      // todo
    }).catch(error => {
      const errorMessage = getErrorMsg(error);
      if (!error.response || error.response.status !== 403) {
        toaster.danger(getLocale(errorMessage));
      }
    });
  };

  render() {

    return (
      <Modal
        className="dtable-ui-image-editor-dialog dtable-ui-file-editor-dialog"
        contentClassName="dtable-ui-image-editor-modal"
        isOpen={this.state.isOpen}
        toggle={this.toggle}
      >
        <DTableModalHeader toggle={this.toggle}>
          {this.renderHeader()}
        </DTableModalHeader>
        <ModalBody className="p-0">
          <div className="dtable-ui-image-editor-container dtable-ui-file-editor-container">
            {this.state.editorView === FILE_EDITOR_STATUS.PREVIEWER &&
              <FilesPreviewer
                value={this.state.value}
                config={this.props.config}
                togglePreviewer={this.togglePreviewer}
                deleteFile={this.deleteFile}
                deleteFiles={this.deleteFilesByPreviewer}
                renameFile={this.props.renameFile ? this.onRenameFile : null}
                resetFileValue={this.resetFileValue}
                rotateImage={this.props.rotateImage ? this.onRotateImage : null}
                getDownLoadFiles={this.props.getDownLoadFiles || (() => {})}
              />
            }
            {this.state.editorView === FILE_EDITOR_STATUS.ADDITION && (
              <AdditionPreviewer
                config={this.props.config}
                deleteImage={this.deleteImage}
                handleFilesChange={this.handleFilesChange}
                uploadLocalFileValue={this.state.uploadLocalFileValue}
                togglePreviewer={this.togglePreviewer}
                fileUploadCompleted={this.fileUploadCompleted}
                addUploadedFile={this.addUploadedFile}
                showImageListPreviewer={this.showImageListPreviewer}
                uploadFile={this.uploadFile}
              />
            )}
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

PCFileEditor.propTypes = {
  value: PropTypes.array,
  isInModal: PropTypes.bool,
  openEditorMode: PropTypes.string,
  column: PropTypes.object,
  config: PropTypes.object,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
  uploadFile: PropTypes.func,
};

export default PCFileEditor;
