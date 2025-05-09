import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { KeyCodes } from '../../../../../constants';

import './index.css';

class FileNameEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileName: props.name || '',
    };
    this.unSaved = true;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e) => {
    if (this.fileNameRef && !this.fileNameRef.contains(e.target)) {
      this.onSave();
    }
  };

  onChange = (e) => {
    this.setState({ fileName: e.target.value });
  };

  onKeyDown = (e) => {
    e.stopPropagation();
    if (e.keyCode === KeyCodes.Enter) {
      e.preventDefault();
      this.onSave();
    }
  };

  onSave = () => {
    const { renameFile, name, closeRenameFile, itemIndex } = this.props;
    let newName = this.state.fileName.trim();
    if (newName === name || newName === '') {
      closeRenameFile();
      return;
    }
    this.unSaved = false;
    renameFile(itemIndex, newName);
    closeRenameFile();
  };

  componentWillUnmount() {
    if (this.unSaved) {
      this.onSave();
    }
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  render() {
    return (
      <div className="pt-1" ref={ref => this.fileNameRef = ref}>
        <Input
          className="dtable-ui-file-name-input"
          type="text"
          value={this.state.fileName}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onBlur={this.onSave}
          autoFocus
        />
      </div>
    );
  }
}

FileNameEditor.propTypes = {
  itemIndex: PropTypes.number,
  name: PropTypes.string,
  renameFile: PropTypes.func,
  closeRenameFile: PropTypes.func,
};

export default FileNameEditor;
