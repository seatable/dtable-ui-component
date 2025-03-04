import React from 'react';
import PropTypes from 'prop-types';
import ImagePreviewerLightbox from '../../ImagePreviewerLightbox';
import ImageThumbnailItem from '../../ImageThumbnail';
import DigitalSignUtils from '../../DigitalSignEditor/utils';
import { KeyCodes } from '../../constants';
import RowExpandAddBtn from '../RowExpandAddBtn';
import DigitalSignEditor from '../../DigitalSignEditor';
import { getLocale } from '../../lang';
import { generateCurrentBaseImageUrl } from '../../utils/url';

import './index.css';

class RowExpandDigitalSignEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowEditor: false,
      updated: null,
      largeImageIndex: -1,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideEditor);
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({
        updated: row[column[valueKey]] || [],
        isShowEditor: false,
        largeImageIndex: -1
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isShowEditor !== prevState.isShowEditor) {
      if (this.state.isShowEditor === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.isShowEditor === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideEditor);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.isShowEditor) {
      this.setState({ isShowEditor: true });
    } else if (e.keyCode === KeyCodes.Esc && this.state.isShowEditor) {
      e.stopPropagation();
      this.setState({ isShowEditor: false });
    }
  };

  onFocus = () => {
    if (this.props.updateTabIndex) {
      this.props.updateTabIndex(this.props.columnIndex);
    }
  };

  hideEditor = (event) => {
    if (
      !this.state.isShowEditor || !this.editorContainer || !event
      || this.editorContainer.contains(event.target)
    ) {
      return;
    }
    this.setState({ isShowEditor: false });
  };

  toggleEditor = () => {
    if (this.props.updateTabIndex) {
      this.props.updateTabIndex(this.props.columnIndex);
    }
    if (this.props.readOnly) return;
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.setState({
      updated: value,
      isShowEditor: !this.state.isShowEditor,
    });
    this.props.onCommit(value);
  };

  getValue = () => {
    const { column, row, valueKey } = this.props;
    const { updated } = this.state;
    return updated ? updated : row[column[valueKey]];
  };

  deleteImage = () => {
    const { column, onCommit } = this.props;
    const updated = { [ column.key ]: null };
    onCommit(updated, column);
    this.setState({ updated: null });
  };

  getSignImages = () => {
    const { config } = this.props;
    const value = this.getValue();
    const signImageUrl = generateCurrentBaseImageUrl({ ...config, partUrl: DigitalSignUtils.getSignImageUrl(value) });
    return [signImageUrl].filter(Boolean);
  };

  setLargeImageIndex = (index) => {
    this.setState({ largeImageIndex: index });
  };

  moveToNextImage = () => {};

  moveToPrevImage = () => {};

  hideLargeImage = () => {
    this.setLargeImageIndex(-1);
  };

  renderSignature = (signImages) => {
    const { column } = this.props;
    const { key } = column;
    return signImages.map((src, index) => {
      return (
        <ImageThumbnailItem
          key={`sing-image-${key}-${index}`}
          index={index}
          src={src}
          column={column}
          onClick={this.setLargeImageIndex}
          deleteImage={this.deleteImage}
          disableImageTooltip={true}
        />
      );
    });
  };

  render() {
    const { config, column, isEditorFocus } = this.props;
    const { isShowEditor, largeImageIndex } = this.state;
    const signImages = this.getSignImages();
    const signImageExisted = Array.isArray(signImages) && signImages.length > 0;
    return (
      <div className="position-relative mt-2" ref={ref => this.editorContainer = ref}>
        {!signImageExisted && (
          <RowExpandAddBtn onClick={this.toggleEditor} onFocus={this.onFocus} isFocus={isEditorFocus} text={getLocale('Edit_signature')} />
        )}
        <div className="dtable-ui-row-expand-image-container dtable-ui-row-expand-digital-sign-container">
          {this.renderSignature(signImages)}
        </div>
        {isShowEditor && (
          <DigitalSignEditor
            isInModal={true}
            config={config}
            value={this.getValue()}
            column={column}
            onCommitCancel={this.toggleEditor}
            onCommit={this.onCommit}
            uploadFile={this.props.uploadFile}
          />
        )}
        {largeImageIndex > -1 &&
          <ImagePreviewerLightbox
            imageItems={signImages}
            imageIndex={largeImageIndex}
            wrapperClassName={'digital-sign-image'}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.moveToPrevImage}
            moveToNextImage={this.moveToNextImage}
            deleteImage={(index) => {
              this.deleteImage(index); this.hideLargeImage();
            }}
          />
        }
      </div>
    );
  }
}

RowExpandDigitalSignEditor.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  readOnly: PropTypes.bool,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func,
  onEditorOpen: PropTypes.func,
  onEditorClose: PropTypes.func,
};

export default RowExpandDigitalSignEditor;
