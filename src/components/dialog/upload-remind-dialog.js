import React from 'react';
import PropTypes from 'prop-types';
import { getLocale, substitute } from '../../lang';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const propTypes = {
  uploadFileMessage: PropTypes.object.isRequired,
  replaceRepetitionFile: PropTypes.func.isRequired,
  uploadRepetitionFile: PropTypes.func.isRequired,
  cancelFileUpload: PropTypes.func.isRequired,
};

class UploadRemindDialog extends React.Component {

  toggle = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.props.cancelFileUpload();
  }

  replaceRepetitionFile = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.props.replaceRepetitionFile();
  }

  uploadRepetitionFile = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    this.props.uploadRepetitionFile();
  }

  render() {
    let { uploadFileMessage } = this.props;
    return (
      <Modal isOpen={true} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle} >
          {substitute('Replace file {file_name}', {file_name: uploadFileMessage.name})}
        </ModalHeader>
        <ModalBody>
          <p>{getLocale('replace_file_message')}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.replaceRepetitionFile}>{getLocale('Replace')}</Button>
          <Button color="primary" onClick={this.uploadRepetitionFile}>{getLocale('Do_not_replace')}</Button>
          <Button color="secondary" onClick={this.toggle}>{getLocale('Cancel')}</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

UploadRemindDialog.propTypes = propTypes;

export default UploadRemindDialog;
