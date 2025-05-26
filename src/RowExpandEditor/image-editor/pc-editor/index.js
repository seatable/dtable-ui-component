import React from 'react';
import { KeyCodes } from '../../../constants';
import RowExpandAddBtn from '../../add-btn';
import { getLocale } from '../../../lang';
import ImagePreviewerLightbox from '../../../ImagePreviewerLightbox';
import ImageThumbnail from '../../../ImageThumbnail';
import ImageEditor from '../../../ImageEditor';

import './index.css';

class RowExpandPCImageEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowImageEditor: false,
      imageContainer: null,
      largeImageIndex: -1,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({
        imageContainer: row[column[valueKey]] || [],
        isShowImageEditor: false,
        largeImageIndex: -1
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isShowImageEditor !== prevState.isShowImageEditor) {
      if (this.state.isShowImageEditor === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.isShowImageEditor === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.isShowImageEditor) {
      this.setState({ isShowImageEditor: true });
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
    this.setState({ isShowImageEditor: !this.state.isShowImageEditor });
  };

  onCommit = (value) => {
    this.setState({ imageContainer: value, isShowImageEditor: !this.state.isShowImageEditor });
    this.props.onCommit(value);
  };

  setLargeImageIndex = (index) => {
    this.setState({ largeImageIndex: index });
  };

  moveToNextImage = () => {
    let value = this.getValue();
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % value.length,
    }));
  };

  moveToPrevImage = () => {
    let value = this.getValue();
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + value.length - 1) % value.length,
    }));
  };

  hideLargeImage = () => {
    this.setLargeImageIndex(-1);
  };

  getValue = () => {
    let { column, row, valueKey } = this.props;
    let { imageContainer } = this.state;
    return imageContainer ? imageContainer : row[column[valueKey]];
  };

  deleteImage = (index) => {
    let value = this.getValue();
    let updatedValue = value.slice(0);
    updatedValue.splice(index, 1);
    this.setState({ imageContainer: updatedValue });
    this.props.onCommit(updatedValue);
  };

  getImageArray = (value) => {
    const { config } = this.props;
    return value.map((imageSrc, index) => {
      return (
        <ImageThumbnail
          key={`image-${index}`}
          index={index}
          src={imageSrc}
          onClick={this.setLargeImageIndex}
          deleteImage={this.deleteImage}
          config={config}
        />
      );
    });
  };

  render() {
    const { isEditorFocus } = this.props;
    let { isShowImageEditor, largeImageIndex } = this.state;
    let value = this.getValue();
    return (
      <>
        <div className="dtable-ui-row-expand-image-editor mt-2">
          <RowExpandAddBtn
            isFocus={isEditorFocus}
            text={getLocale('Add_images')}
            onFocus={this.onFocus}
            onClick={this.onToggle}
          />
          <div className="dtable-ui-row-expand-image-container">
            {(Array.isArray(value) && value.length > 0) && this.getImageArray(value)}
          </div>
        </div>
        {isShowImageEditor && (
          <ImageEditor
            value={value}
            isInModal={true}
            onToggle={this.onToggle}
            onCommit={this.onCommit}
            uploadFile={this.props.uploadFile}
          />
        )}
        {largeImageIndex > -1 &&
          <ImagePreviewerLightbox
            imageItems={value}
            imageIndex={largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.moveToPrevImage}
            moveToNextImage={this.moveToNextImage}
          />
        }
      </>
    );

  }
}

export default RowExpandPCImageEditor;
