import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'reactstrap';
import { getLocale } from '../lang';
import DTableModalHeader from '../DTableModalHeader/index';

const propTypes = {
  closeEditor: PropTypes.func,
};

class FileEditor extends React.Component {
  render() {
    let { closeEditor } = this.props;
    return (
      <Modal isOpen={true} toggle={closeEditor}>
        <DTableModalHeader toggle={closeEditor}>{getLocale('Add_Files')}</DTableModalHeader>
        <ModalBody className="file-editor-container">
        </ModalBody>
      </Modal>
    );
  }
}

FileEditor.propTypes = propTypes;

export default FileEditor;
