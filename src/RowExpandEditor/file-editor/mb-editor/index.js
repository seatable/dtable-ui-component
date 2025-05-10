import React from 'react';
import PropTypes from 'prop-types';
import RowExpandAddBtn from '../../add-btn';
import { getLocale } from '../../../lang';
import ImageThumbnail from '../../../ImageThumbnail';
import { getFileThumbnailInfo } from '../../../utils/url';
import FileEditor from '../../../FileEditor';

class RowExpandMBFileEditor extends React.Component {

  constructor(props) {
    super(props);
    const { column, row, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]] || [],
    };
    this.openEditorMode = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({ value: row[column[valueKey]] || [], isShowEditor: false });
    }
  }

  toggleEditor = () => {
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  closeEditor = () => {
    this.setState({ isShowEditor: false });
  };

  onCommit = (value) => {
    this.setState({ value });
    this.props.onCommit(value);
  };

  deleteFile = (index) => {
    const { value } = this.state;
    const newValue = value.slice(0);
    newValue.splice(index, 1);
    this.onCommit(newValue);
  };

  renderFiles = () => {
    const { value } = this.state;
    const { config } = this.props;
    return value.map((file, index) => {
      const { fileIconUrl } = getFileThumbnailInfo(file);
      return (
        <ImageThumbnail
          key={'file-' + index}
          src={fileIconUrl}
          name={file.name}
          index={index}
          config={config}
          className="dtable-ui-mobile-row-expand-img-item"
          deleteTip={getLocale('Are_you_sure_you_want_to_delete_this_file')}
          deleteImage={this.deleteFile}
          onClick={this.toggleEditor}
        />
      );
    });
  };

  render() {
    const { column, config, uploadFile } = this.props;
    const { isShowEditor, value } = this.state;
    return (
      <>
        <div className="dtable-ui-mobile-row-expand-image position-relative">
          {value.length === 0 ? (
            <RowExpandAddBtn onClick={this.toggleEditor} text={getLocale('Add_files')} />
          ) : (
            <>{this.renderFiles()}</>
          )}
        </div>
        {isShowEditor && (
          <FileEditor
            value={value}
            column={column}
            config={config}
            onToggle={this.closeEditor}
            onCommit={this.onCommit}
            uploadFile={uploadFile}
          />
        )}
      </>
    );
  }
}

RowExpandMBFileEditor.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func,
  uploadFile: PropTypes.func.isRequired,
};

export default RowExpandMBFileEditor;
