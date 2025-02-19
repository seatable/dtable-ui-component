import React from 'react';
import PropTypes from 'prop-types';
import { KeyCodes } from '../../constants';
import RowExpandAddBtn from '../RowExpandAddBtn';
import { getLocale } from '../../lang';
import ImageThumbnail from '../../ImageThumbnail';
import { getFileThumbnailInfo } from '../../utils/url';
import FileEditor from '../../FileEditor';

import './index.css';

class RowExpandFileEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowFileEditor: false,
      fileContainer: null,
    };
    this.openEditorMode = null;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ fileContainer: row[column[valueKey]] || [], isShowFileEditor: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isShowFileEditor !== prevState.isShowFileEditor) {
      if (this.state.isShowFileEditor === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.isShowFileEditor === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.isShowFileEditor) {
      this.setState({ isShowFileEditor: true });
    }
  };

  onFocus = () => {
    if (this.props.updateTabIndex) {
      this.props.updateTabIndex(this.props.columnIndex);
    }
  };

  onToggle = () => {
    if (this.props.updateTabIndex) {
      this.props.updateTabIndex(this.props.columnIndex);
    }
    this.setState({ isShowFileEditor: !this.state.isShowFileEditor });
  };

  onCommit = (value) => {
    this.setState({ fileContainer: value, isShowFileEditor: !this.state.isShowFileEditor });
    this.props.onCommit(value);
  };

  deleteFile = (index) => {
    const { column, expandedRow, onCommit } = this.props;
    let { fileContainer } = this.state;
    let value = fileContainer || expandedRow[column.key];
    let updatedValue = value.slice(0);
    updatedValue.splice(index, 1);
    this.setState({ fileContainer: updatedValue });
    onCommit(updatedValue);
  };

  onClickFile = () => {
    this.openEditorMode = null;
    this.onToggle();
  };

  render() {
    let fileArr = [];
    const { column, row, config, valueKey, isEditorFocus } = this.props;
    let value = this.state.fileContainer !== null ? this.state.fileContainer : row[column[valueKey]];
    if (value && value.length > 0) {
      fileArr = value.map((file, index) => {
        const { fileIconUrl } = getFileThumbnailInfo(file, config);
        return (
          <ImageThumbnail
            key={'file-' + index}
            src={fileIconUrl}
            index={index}
            config={config}
            deleteImage={this.deleteFile}
            onClick={this.onClickFile}
          />
        );
      });
    }
    return (
      <div className="dtable-ui-row-expand-image-editor mt-2">
        <RowExpandAddBtn isFocus={isEditorFocus} text={getLocale('Add_files')} onFocus={this.onFocus} onClick={this.onToggle} />
        <div className="dtable-ui-row-expand-image-container">
          {fileArr}
        </div>
        {this.state.isShowFileEditor && (
          <FileEditor
            value={value}
            isInModal={true}
            onToggle={this.onToggle}
            onCommit={this.onCommit}
            config={this.props.config}
            uploadFile={this.props.uploadFile}
          />
        )}
      </div>
    );
  }
}

RowExpandFileEditor.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func,
  onEditorOpen: PropTypes.func,
  onEditorClose: PropTypes.func,
};

export default RowExpandFileEditor;
