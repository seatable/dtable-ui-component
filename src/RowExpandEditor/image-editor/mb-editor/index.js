import React from 'react';
import RowExpandAddBtn from '../../add-btn';
import { getLocale } from '../../../lang';
import ImageThumbnail from '../../../ImageThumbnail';
import ImageEditor from '../../../ImageEditor';

import './index.css';

class RowExpandMBImageEditor extends React.Component {

  constructor(props) {
    super(props);
    const { column, row, valueKey } = props;
    this.state = {
      isShowEditor: false,
      value: row[column[valueKey]] || [],
    };
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
    this.setState({ value: value });
    this.props.onCommit(value);
  };

  deleteImage = (index) => {
    let value = this.state.value;
    let updatedValue = value.slice(0);
    updatedValue.splice(index, 1);
    this.setState({ value: updatedValue });
    this.props.onCommit(updatedValue);
  };

  renderImages = () => {
    const { value } = this.state;
    const { config } = this.props;
    return value.map((src, index) => {
      return (
        <ImageThumbnail
          key={`image-${index}`}
          index={index}
          src={src}
          className="dtable-ui-mobile-row-expand-img-item"
          config={config}
          onClick={this.toggleEditor}
          deleteImage={this.deleteImage}
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
            <RowExpandAddBtn onClick={this.toggleEditor} text={getLocale('Add_images')} />
          ) : (
            <>{this.renderImages()}</>
          )}
        </div>
        {isShowEditor && (
          <ImageEditor
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

export default RowExpandMBImageEditor;
