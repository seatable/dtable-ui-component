import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import ImagesPreviewer from './images-previewer';
import AdditionPreviewer from './addition-previewer';
import { FILE_EDITOR_STATUS } from '../constants';
import DTableModalHeader from '../DTableModalHeader';
import { getLocale } from '../lang';
import { IMAGES_FOLDER } from './constants';

import './index.css';

class ImageEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      editorView: this.getEditorView(),
      isOpen: true,
      isShowFileChooser: false,
      uploadLocalImageValue: [],
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
    let uploadLocalImageValue = this.state.uploadLocalImageValue.slice(0);
    let value = this.state.value.slice(0);
    if (this.state.editorView === FILE_EDITOR_STATUS.PREVIEWER) {
      value.splice(index, 1);
    } else {
      if (type === 'localPicture') {
        uploadLocalImageValue.splice(index, 1);
      }
    }
    this.setState({
      uploadLocalImageValue: uploadLocalImageValue,
      isUpdated: true,
      value: value
    });
  };

  resetAdditionImage = () => {
    this.setState({
      uploadLocalImageValue: [],
      imageLinkValue: []
    });
  };

  toggle = (e) => {
    e.stopPropagation();
    if (this.state.isOpen && this.state.isUpdated) {
      if (this.state.editorView === FILE_EDITOR_STATUS.ADDITION) {
        let { value, uploadLocalImageValue } = this.state;
        let newValue = value.concat(uploadLocalImageValue);
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
    let uploadLocalImageValue = this.state.uploadLocalImageValue.slice(0);
    const imageUrl = fileMessage.url;
    uploadLocalImageValue.push(imageUrl);
    this.setState({
      uploadLocalImageValue: uploadLocalImageValue,
      isUpdated: true
    });
  };

  addUploadedFile = (fileMessageList) => {
    let uploadLocalImageValue = this.state.uploadLocalImageValue.slice(0);
    // eslint-disable-next-line no-unused-vars
    for (let fileMessage of fileMessageList) {
      uploadLocalImageValue.push(fileMessage.url);
    }
    this.setState({
      uploadLocalImageValue: uploadLocalImageValue,
      isUpdated: true
    });
  };

  renderHeader = () => {
    let { editorView } = this.state;
    if (this.props.isInModal) {
      return (<span>{getLocale('Add_images')}</span>);
    }
    if (editorView === FILE_EDITOR_STATUS.PREVIEWER) {
      return (<span>{getLocale('All_images')}</span>);
    }
    return (
      <div onClick={this.showImageListPreviewer}>
        <span aria-hidden="true" className="dtable-font dtable-icon-return mr-2"></span>
        <span>{getLocale('Add_images')}</span>
      </div>
    );
  };

  showImageListPreviewer = () => {
    let { value, uploadLocalImageValue, imageLinkValue } = this.state;
    let newValue = value.concat(uploadLocalImageValue, imageLinkValue);
    this.setState({
      value: newValue
    });
    this.togglePreviewer(FILE_EDITOR_STATUS.PREVIEWER);
  };

  saveImageLink = (imageUrl) => {
    this.setState({
      imageLinkValue: imageUrl,
      isUpdated: true,
    });
    this.showImageListPreviewer();
  };

  uploadFile = (file, callback) => {
    return this.props.uploadFile(file, IMAGES_FOLDER, callback);
  };

  render() {
    return (
      <Modal className="dtable-ui-image-editor-dialog" contentClassName="dtable-ui-image-editor-modal" isOpen={this.state.isOpen} toggle={this.toggle}>
        <DTableModalHeader toggle={this.toggle}>
          {this.renderHeader()}
        </DTableModalHeader>
        <ModalBody className="p-0">
          <div className="dtable-ui-image-editor-container">
            {this.state.editorView === FILE_EDITOR_STATUS.PREVIEWER &&
              <ImagesPreviewer
                value={this.state.value}
                togglePreviewer={this.togglePreviewer}
                deleteImage={this.deleteImage}
                resetAdditionImage={this.resetAdditionImage}
              />
            }
            {this.state.editorView === FILE_EDITOR_STATUS.ADDITION &&
              <AdditionPreviewer
                deleteImage={this.deleteImage}
                handleFilesChange={this.handleFilesChange}
                uploadLocalImageValue={this.state.uploadLocalImageValue}
                togglePreviewer={this.togglePreviewer}
                saveImageLink={this.saveImageLink}
                fileUploadCompleted={this.fileUploadCompleted}
                addUploadedFile={this.addUploadedFile}
                showImageListPreviewer={this.showImageListPreviewer}
                uploadFile={this.uploadFile}
              />
            }
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

ImageEditor.propTypes = {
  value: PropTypes.array,
  isInModal: PropTypes.bool,
  openEditorMode: PropTypes.string,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default ImageEditor;
