import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getLocale } from '../lang';

const propTypes = {
  isCheckRepeat: PropTypes.bool,
  columnType: PropTypes.string,
  newValue: PropTypes.array,
  fileName: PropTypes.string,
  workspaceID: PropTypes.number,
  dtableWebAPI: PropTypes.object,
  onAddFile: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  closeEditor: PropTypes.func,
};

class FileEditor extends React.Component {

  static defaultProps = {
    isCheckRepeat: false,
    columnType: 'file',
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {

    let { closeEditor } = this.props;
    return (
      <Modal isOpen={true} toggle={closeEditor}>
        <ModalHeader toggle={closeEditor}>{getLocale('Add_Files')}</ModalHeader>
        <ModalBody className="file-editor-container">
        </ModalBody>
      </Modal>
    );
  }
}

FileEditor.propTypes = propTypes;

export default FileEditor;
